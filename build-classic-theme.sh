#!/usr/bin/env bash
# Đóng gói lại thư mục classic-theme/ thành classic-theme.war bằng Docker.
#
# Không cần JDK trên máy: lệnh `jar` chạy trong image eclipse-temurin.
# File gốc classic-theme/classic-theme.war, thư mục dist/ và các file rác
# (.DS_Store, *.swp) không được đưa vào WAR.
#
# Cách dùng (chạy từ thư mục gốc repo):
#   bash build-classic-theme.sh            # build bằng Docker
#   bash build-classic-theme.sh --local    # dùng `jar` trên máy, không cần Docker
#
# Output: classic-theme/dist/classic-theme.war
#
# Sửa CSS: chỉnh classic-theme/css/custom.css (CSS thuần, nạp qua
# templates/init_custom.ftl). Các file *.scss KHÔNG được compile khi deploy,
# sửa chúng không có tác dụng - main.css/clay.css là bản đã compile sẵn.
#
# Deploy trên server (copy WAR lên rồi chạy, LIFERAY_HOME là thư mục bundles):
#   cp classic-theme.war $LIFERAY_HOME/deploy/classic-theme.war \
#     && tail -f $LIFERAY_HOME/tomcat/logs/catalina.out | grep -i "classic"

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
SRC_DIR="$ROOT_DIR/classic-theme"
DIST_DIR="$SRC_DIR/dist"
WAR_NAME="classic-theme.war"
IMAGE="eclipse-temurin:17-jdk"

USE_DOCKER=1
for arg in "$@"; do
    case "$arg" in
        --local) USE_DOCKER=0 ;;
        -h|--help) sed -n '2,21p' "$0"; exit 0 ;;
        *) echo "Tham số không hợp lệ: $arg" >&2; exit 1 ;;
    esac
done

if [ ! -f "$SRC_DIR/WEB-INF/liferay-look-and-feel.xml" ]; then
    echo "Không thấy $SRC_DIR/WEB-INF/liferay-look-and-feel.xml - thư mục theme chưa được bung?" >&2
    exit 1
fi

mkdir -p "$DIST_DIR"
rm -f "$DIST_DIR/$WAR_NAME"

# Copy nội dung theme sang thư mục tạm (bỏ WAR gốc, dist/, file rác) rồi jar
# từ đó, vì `jar` không có tuỳ chọn exclude.
PACK_SCRIPT='
set -e
STAGE=$(mktemp -d)
cd /src
tar --exclude="./'"$WAR_NAME"'" --exclude="./dist" \
    --exclude=".DS_Store" --exclude="*.swp" -cf - . | tar -xf - -C "$STAGE"
jar cf "/dist/'"$WAR_NAME"'" -C "$STAGE" .
rm -rf "$STAGE"
'

if [ "$USE_DOCKER" = "1" ]; then
    if ! command -v docker >/dev/null 2>&1; then
        echo "Không tìm thấy docker. Chạy lại với --local nếu máy có JDK." >&2
        exit 1
    fi
    echo ">>> Đóng gói $WAR_NAME bằng Docker ($IMAGE)"
    docker run --rm \
        --user "$(id -u):$(id -g)" \
        -e HOME=/tmp \
        -v "$SRC_DIR:/src:ro" \
        -v "$DIST_DIR:/dist" \
        "$IMAGE" bash -c "$PACK_SCRIPT"
else
    command -v jar >/dev/null 2>&1 || { echo "Không tìm thấy lệnh jar (cần JDK)." >&2; exit 1; }
    echo ">>> Đóng gói $WAR_NAME bằng jar trên máy"
    STAGE="$(mktemp -d)"
    trap 'rm -rf "$STAGE"' EXIT
    (cd "$SRC_DIR" && tar --exclude="./$WAR_NAME" --exclude="./dist" \
        --exclude=".DS_Store" --exclude="*.swp" -cf - . | tar -xf - -C "$STAGE")
    jar cf "$DIST_DIR/$WAR_NAME" -C "$STAGE" .
fi

ENTRIES="$(unzip -l "$DIST_DIR/$WAR_NAME" | tail -1 | awk '{print $2}')"
echo ">>> Xong: $DIST_DIR/$WAR_NAME ($ENTRIES entries, $(du -h "$DIST_DIR/$WAR_NAME" | cut -f1))"
