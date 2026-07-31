#!/usr/bin/env bash
if [ -z "${BASH_VERSION:-}" ] || [ "${BASH##*/}" != "bash" ]; then
    echo "ERROR: Script này bắt buộc phải chạy bằng bash."
    echo "Ví dụ: bash deploy-admin-ui.sh 1"
    exit 1
fi

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
LIFERAY_HOME="${LIFERAY_HOME:-/root/vec/bundles}"
DEPLOY_DIR="$LIFERAY_HOME/osgi/modules"
CONFIGS_DIR="$LIFERAY_HOME/osgi/configs"

show_help() {
    cat <<EOF
Usage:
  bash deploy-admin-ui.sh <module>
  bash deploy-admin-ui.sh --server <module>

Modules:
  1  admin-ui
  2  expired-password (vec-expired-password-force-change)
  3  comment-management

Examples:
  bash deploy-admin-ui.sh 1
  bash deploy-admin-ui.sh 2
  bash deploy-admin-ui.sh 3
EOF
}

resolve_module_name() {
    case "$1" in
        1)
            echo "admin-ui"
            ;;
        2)
            echo "vec-expired-password-force-change"
            ;;
        3)
            echo "comment-management"
            ;;
        *)
            echo ""
            ;;
    esac
}

# Cảnh báo khi trong osgi/modules còn JAR cũ của cùng một bundle nhưng khác tên
# file (ví dụ khác version). Liferay sẽ install cả hai bundle cùng
# Bundle-SymbolicName và portal có thể vẫn dùng code cũ.
warn_stale_jars() {
    local new_jar_name="$1"
    local prefix="${new_jar_name%%-[0-9]*}"

    [ -n "$prefix" ] || return 0

    local stale_found=0

    while IFS= read -r stale_jar; do
        [ -n "$stale_jar" ] || continue
        [ "$(basename "$stale_jar")" != "$new_jar_name" ] || continue

        if [ "$stale_found" -eq 0 ]; then
            echo ""
            echo "!!! CẢNH BÁO: còn JAR cũ của bundle '$prefix' trong $DEPLOY_DIR:"
            stale_found=1
        fi

        echo "      $stale_jar"
    done < <(find "$DEPLOY_DIR" -maxdepth 1 -name "${prefix}*.jar" 2>/dev/null)

    if [ "$stale_found" -eq 1 ]; then
        echo "    Hãy xoá các file trên rồi restart Liferay để tránh chạy code cũ:"
        echo "      rm <đường dẫn JAR cũ>"
        echo ""
    fi
}

build_and_deploy_module() {
    local module_name="$1"
    local module_dir="$SCRIPT_DIR/$module_name"

    if [ ! -d "$module_dir" ]; then
        echo "ERROR: Không tìm thấy module directory $module_dir"
        exit 1
    fi

    echo ">>> Building module: $module_name"
    cd "$module_dir"

    if [ "$module_name" = "admin-ui" ] &&
        [ -d "$module_dir/resources" ] &&
        compgen -G "$module_dir/resources/*" > /dev/null 2>&1; then

        cp -f "$module_dir/resources/"* \
            "$module_dir/src/main/resources/META-INF/resources/"
    fi

    if [ -n "$BLADE_CMD" ]; then
        "$BLADE_CMD" gw jar
    elif [ -f "$module_dir/gradlew" ]; then
        ./gradlew jar
    else
        gradle \
            -p "$module_dir" \
            -b "$module_dir/build.gradle" \
            -c "$module_dir/settings.gradle" \
            jar
    fi

    local jar_file
    jar_file=$(find "$module_dir/build/libs" -name "*.jar" \
        ! -name "*-sources.jar" ! -name "*-javadoc.jar" | head -1)

    if [ -z "$jar_file" ]; then
        echo "ERROR: Không tìm thấy file JAR sau khi build module $module_name."
        exit 1
    fi

    echo ">>> Deploying $(basename "$jar_file") -> $DEPLOY_DIR/"
    mkdir -p "$DEPLOY_DIR"
    warn_stale_jars "$(basename "$jar_file")"
    cp "$jar_file" "$DEPLOY_DIR/"

    if [ -d "$module_dir/osgi/configs" ]; then
        mkdir -p "$CONFIGS_DIR"

        find "$module_dir/osgi/configs" -type f -name "*.config" -print0 |
        while IFS= read -r -d '' config_file; do
            echo ">>> Deploying config $(basename "$config_file") -> $CONFIGS_DIR/"
            cp "$config_file" "$CONFIGS_DIR/"
        done
    fi
}

# ─── Chạy trên server: build JAR và copy vào osgi/modules ───────────────────
if [ "$1" = "--server" ]; then
    MODULE_NAME="$(resolve_module_name "$2")"

    if [ -z "$MODULE_NAME" ]; then
        echo "ERROR: Vui lòng chọn module cần build/deploy trên server."
        show_help
        exit 1
    fi

    BLADE_CMD=""
    for p in blade "$HOME/.blade/bin/blade" /usr/local/bin/blade /usr/bin/blade $HOME/jpm/bin/blade; do
        if command -v "$p" &> /dev/null || [ -x "$p" ]; then
            BLADE_CMD="$p"
            break
        fi
    done

    if [ -z "$BLADE_CMD" ] && ! command -v gradle >/dev/null 2>&1; then
        echo "ERROR: Không tìm thấy blade, gradlew hoặc gradle."
        exit 1
    fi

    build_and_deploy_module "$MODULE_NAME"

    echo "Done! Deployed module: $MODULE_NAME"
    exit 0
fi

# ─── Chạy trên máy local: upload lên server rồi build ───────────────────────

MODULE_NAME="$(resolve_module_name "$1")"
MODULE_CHOICE="$1"

if [ -z "$MODULE_NAME" ]; then
    show_help
    exit 0
fi

# Load .env
ENV_FILE="$SCRIPT_DIR/.env"
if [ ! -f "$ENV_FILE" ]; then
    echo "ERROR: Không tìm thấy $ENV_FILE"
    exit 1
fi
set -a
# shellcheck source=/dev/null
source "$ENV_FILE"
set +a

SERVER="${SERVER_USER}@${SERVER_IP}"
SSH_KEY="${SSH_KEY_PATH:-$HOME/.ssh/id_rsa}"
SSH_OPTS="-i $SSH_KEY -o StrictHostKeyChecking=no"

# Kiểm tra SSH key
if [ ! -f "$SSH_KEY" ]; then
    echo "ERROR: SSH key không tìm thấy tại $SSH_KEY"
    echo "  Tạo key: ssh-keygen -t ed25519 -f $SSH_KEY"
    echo "  Copy lên server: ssh-copy-id -i $SSH_KEY $SERVER"
    echo "  Hoặc đặt SSH_KEY_PATH=... trong .env"
    exit 1
fi

echo ">>> Uploading custom-bundles -> $SERVER:/root/vec/custom-bundles/"
rsync -avz \
    --delete \
    --exclude='.git/' \
    --exclude='node_modules/' \
    --exclude='.gradle/' \
    --exclude='*/build/' \
    --exclude='*.class' \
    -e "ssh $SSH_OPTS" \
    "$SCRIPT_DIR/" "$SERVER:/root/vec/custom-bundles/"

echo ">>> Running build on server..."
ssh $SSH_OPTS \
    "$SERVER" \
    "bash -l -c 'chmod +x /root/vec/custom-bundles/deploy-admin-ui.sh && bash /root/vec/custom-bundles/deploy-admin-ui.sh --server $MODULE_CHOICE'"

echo ""
echo "All done! Deployed module: $MODULE_NAME"
echo "Check Liferay logs for bundle activation and config loading."
