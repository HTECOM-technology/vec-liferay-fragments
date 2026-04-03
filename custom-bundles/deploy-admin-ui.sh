#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODULE_DIR="$SCRIPT_DIR/admin-ui"

# ─── Chạy trên server: build JAR và copy vào osgi/modules ───────────────────
if [ "$1" = "--server" ]; then
    DEPLOY_DIR="/root/vec/bundles/osgi/modules"

    echo ">>> Building VEC Custom Admin UI..."
    cd "$MODULE_DIR"

    # Sync resources nếu có thay đổi ở thư mục cũ
    if [ -d "$MODULE_DIR/resources" ] && compgen -G "$MODULE_DIR/resources/*" > /dev/null 2>&1; then
        cp -f "$MODULE_DIR/resources/"* "$MODULE_DIR/src/main/resources/META-INF/resources/"
    fi

    # Build (tìm blade theo các vị trí phổ biến)
    BLADE_CMD=""
    for p in blade "$HOME/.blade/bin/blade" /usr/local/bin/blade /usr/bin/blade; do
        if command -v "$p" &> /dev/null || [ -x "$p" ]; then
            BLADE_CMD="$p"
            break
        fi
    done

    if [ -n "$BLADE_CMD" ]; then
        "$BLADE_CMD" gw jar
    elif [ -f "$MODULE_DIR/gradlew" ]; then
        ./gradlew jar
    else
        echo "ERROR: Không tìm thấy blade hoặc gradlew."
        exit 1
    fi

    JAR_FILE=$(find "$MODULE_DIR/build/libs" -name "*.jar" ! -name "*-sources.jar" ! -name "*-javadoc.jar" | head -1)
    if [ -z "$JAR_FILE" ]; then
        echo "ERROR: Không tìm thấy file JAR sau khi build."
        exit 1
    fi

    echo ">>> Deploying $(basename "$JAR_FILE") -> $DEPLOY_DIR/"
    mkdir -p "$DEPLOY_DIR"
    cp "$JAR_FILE" "$DEPLOY_DIR/"
    echo "Done!"
    exit 0
fi

# ─── Chạy trên máy local: upload lên server rồi build ───────────────────────

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
    --exclude='.git/' \
    --exclude='node_modules/' \
    --exclude='*/build/' \
    --exclude='*.class' \
    -e "ssh $SSH_OPTS" \
    "$SCRIPT_DIR/" "$SERVER:/root/vec/custom-bundles/"

echo ">>> Running build on server..."
ssh $SSH_OPTS \
    "$SERVER" \
    "bash -l -c 'chmod +x /root/vec/custom-bundles/deploy-admin-ui.sh && /root/vec/custom-bundles/deploy-admin-ui.sh --server'"

echo ""
echo "All done! Check Liferay logs for bundle activation."
