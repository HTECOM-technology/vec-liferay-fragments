#!/usr/bin/env bash
# Build các module trong custom-bundles thành JAR OSGi bằng Docker, không cần
# cài JDK/Gradle hay Liferay bundle trên máy. JAR kết quả nằm ở custom-bundles/dist/.
#
# Script này chạy ở hai chế độ, giống cách deploy-admin-ui.sh dùng --server:
#   - Trên host  : build image (nếu cần) rồi chạy container.
#   - Trong container (--in-container): chạy Gradle và copy JAR sang dist/.
#
# Script chỉ BUILD, không deploy. Deploy lên server vẫn dùng deploy-admin-ui.sh.

if [ -z "${BASH_VERSION:-}" ] || [ "${BASH##*/}" != "bash" ]; then
    echo "ERROR: Script này bắt buộc phải chạy bằng bash."
    echo "Ví dụ: bash build-custom-bundles.sh all"
    exit 1
fi

set -euo pipefail

IMAGE_NAME="vec-custom-bundles-builder"
DIST_SUBDIR="custom-bundles/dist"
GRADLE_CACHE_SUBDIR=".gradle-docker"

show_help() {
    cat <<'EOF'
Usage:
  bash build-custom-bundles.sh <module>...
  bash build-custom-bundles.sh all
  bash build-custom-bundles.sh --rebuild-image all

Modules:
  1    admin-ui
  2    expired-password (vec-expired-password-force-change)
  3    comment-management
  all  build cả 3 module

Options:
  --rebuild-image   Build lại Docker image (dùng khi sửa Dockerfile.custom-bundles)
  --clean           Xoá build/ của module trước khi build
  --shell           Mở bash trong container để debug

Examples:
  bash build-custom-bundles.sh 3
  bash build-custom-bundles.sh 1 3
  bash build-custom-bundles.sh all
  bash build-custom-bundles.sh --clean all

JAR kết quả: custom-bundles/dist/
Cache Gradle: .gradle-docker/  (giữ lại để lần build sau nhanh hơn)
EOF
}

resolve_module_name() {
    case "$1" in
        1) echo "admin-ui" ;;
        2) echo "vec-expired-password-force-change" ;;
        3) echo "comment-management" ;;
        *) echo "" ;;
    esac
}

# ─── Chế độ trong container: chạy Gradle, copy JAR sang dist/ ────────────────
if [ "${1:-}" = "--in-container" ]; then
    shift

    DO_CLEAN="${DO_CLEAN:-0}"
    ROOT_DIR="/workspace"
    DIST_DIR="$ROOT_DIR/$DIST_SUBDIR"

    mkdir -p "$DIST_DIR"

    echo ">>> Java: $(java -version 2>&1 | head -1)"
    echo ">>> Gradle: $(gradle --version 2>/dev/null | awk '/^Gradle/{print $2}')"
    echo ">>> GRADLE_USER_HOME=$GRADLE_USER_HOME"
    echo ""

    built_any=0

    for module_name in "$@"; do
        module_dir="$ROOT_DIR/custom-bundles/$module_name"

        if [ ! -d "$module_dir" ]; then
            echo "ERROR: Không tìm thấy module directory $module_dir"
            exit 1
        fi

        echo "=============================================================="
        echo ">>> Building: $module_name"
        echo "=============================================================="

        # admin-ui: đồng bộ resources/ vào META-INF/resources giống deploy-admin-ui.sh
        if [ "$module_name" = "admin-ui" ] &&
            [ -d "$module_dir/resources" ] &&
            compgen -G "$module_dir/resources/*" > /dev/null 2>&1; then

            echo ">>> Copy resources/* -> src/main/resources/META-INF/resources/"
            cp -f "$module_dir/resources/"* \
                "$module_dir/src/main/resources/META-INF/resources/"
        fi

        if [ "$DO_CLEAN" = "1" ]; then
            echo ">>> Xoá $module_dir/build"
            rm -rf "$module_dir/build"
        fi

        gradle --project-dir "$module_dir" --no-daemon jar

        jar_file="$(find "$module_dir/build/libs" -name '*.jar' \
            ! -name '*-sources.jar' ! -name '*-javadoc.jar' 2>/dev/null | head -1)"

        if [ -z "$jar_file" ]; then
            echo "ERROR: Không tìm thấy JAR sau khi build $module_name."
            exit 1
        fi

        cp -f "$jar_file" "$DIST_DIR/"
        echo ">>> OK: $(basename "$jar_file") -> $DIST_SUBDIR/"
        echo ""

        built_any=1
    done

    if [ "$built_any" = "1" ]; then
        echo "=============================================================="
        echo "JAR trong $DIST_SUBDIR/:"
        ls -la "$DIST_DIR" | tail -n +2
        echo "=============================================================="
    fi

    exit 0
fi

# ─── Chế độ host: dựng image rồi chạy container ──────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

REBUILD_IMAGE=0
DO_CLEAN=0
OPEN_SHELL=0
MODULES=()

while [ $# -gt 0 ]; do
    case "$1" in
        --rebuild-image) REBUILD_IMAGE=1 ;;
        --clean)         DO_CLEAN=1 ;;
        --shell)         OPEN_SHELL=1 ;;
        -h|--help)       show_help; exit 0 ;;
        all)             MODULES+=(1 2 3) ;;
        1|2|3)           MODULES+=("$1") ;;
        *)
            echo "ERROR: Tham số không hợp lệ: $1"
            echo ""
            show_help
            exit 1
            ;;
    esac
    shift
done

if [ "$OPEN_SHELL" = "0" ] && [ ${#MODULES[@]} -eq 0 ]; then
    show_help
    exit 0
fi

if ! command -v docker >/dev/null 2>&1; then
    echo "ERROR: Không tìm thấy docker."
    exit 1
fi

if ! docker info >/dev/null 2>&1; then
    echo "ERROR: Docker daemon chưa chạy. Mở Docker Desktop rồi thử lại."
    exit 1
fi

if [ "$REBUILD_IMAGE" = "1" ] || ! docker image inspect "$IMAGE_NAME" >/dev/null 2>&1; then
    echo ">>> Building Docker image $IMAGE_NAME (lần đầu sẽ mất vài phút)"
    docker build -f Dockerfile.custom-bundles -t "$IMAGE_NAME" .
    echo ""
fi

# Cache Gradle nằm trong repo để file sinh ra thuộc đúng user hiện tại,
# không bị root-owned như khi dùng named volume.
mkdir -p "$SCRIPT_DIR/$GRADLE_CACHE_SUBDIR" "$SCRIPT_DIR/$DIST_SUBDIR"

DOCKER_ARGS=(
    --rm
    -v "$SCRIPT_DIR:/workspace"
    -w /workspace
    -e "GRADLE_USER_HOME=/workspace/$GRADLE_CACHE_SUBDIR"
    -e "HOME=/workspace/$GRADLE_CACHE_SUBDIR"
    -e "DO_CLEAN=$DO_CLEAN"
)

# Chạy bằng uid/gid của user hiện tại để JAR không bị root-owned trên Linux.
if [ "$(uname -s)" != "Darwin" ]; then
    DOCKER_ARGS+=(--user "$(id -u):$(id -g)")
fi

if [ "$OPEN_SHELL" = "1" ]; then
    echo ">>> Mở shell trong container (gradle, java đã có sẵn)"
    exec docker run -it "${DOCKER_ARGS[@]}" "$IMAGE_NAME"
fi

MODULE_NAMES=()
for choice in "${MODULES[@]}"; do
    name="$(resolve_module_name "$choice")"
    if [ -z "$name" ]; then
        echo "ERROR: Module không hợp lệ: $choice"
        exit 1
    fi
    MODULE_NAMES+=("$name")
done

echo ">>> Modules: ${MODULE_NAMES[*]}"
echo ""

docker run "${DOCKER_ARGS[@]}" "$IMAGE_NAME" \
    /workspace/build-custom-bundles.sh --in-container "${MODULE_NAMES[@]}"

echo ""
echo "Done! JAR nằm ở $DIST_SUBDIR/"
echo "Deploy lên server: bash custom-bundles/deploy-admin-ui.sh <module>"
