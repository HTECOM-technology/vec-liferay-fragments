#!/usr/bin/env bash
# Chạy trong shell của Docker builder, sau bash build-custom-bundles.sh 1.
set -euo pipefail

module_dir="$(cd "$(dirname "$0")" && pwd)"
gradle_cache="${GRADLE_USER_HOME:-$module_dir/../../.gradle-docker}"
api_dir="$gradle_cache/caches/modules-2/files-2.1/com.liferay.portal/release.portal.api/7.4.3.132"

if [ ! -d "$module_dir/build/classes/java/main" ] || [ ! -d "$api_dir" ]; then
    echo "Cần chạy bash build-custom-bundles.sh 1 trước khi kiểm tra."
    exit 1
fi

api_jar="$(find "$api_dir" -name '*.jar' -print -quit)"
if [ -z "$api_jar" ]; then
    echo "Không tìm thấy release.portal.api-7.4.3.132.jar trong cache Gradle."
    exit 1
fi

test_dir="$(mktemp -d)"
trap 'rm -rf "$test_dir"' EXIT
classpath="$module_dir/build/classes/java/main:$api_jar:$test_dir"
main_class=vn.vec.custom.admin.domainpolicy.filter.DomainAccessPolicySelfTest

javac -cp "$classpath" -d "$test_dir" \
    "$module_dir/src/test/java/vn/vec/custom/admin/domainpolicy/filter/DomainAccessPolicySelfTest.java"

# Thư viện Liferay dùng reflection vào java.lang.invoke trên Java 17.
java_args=(--add-opens java.base/java.lang.invoke=ALL-UNNAMED -cp "$classpath" "$main_class")
env -u VEC_DUONGCAOTOC_ADMIN_ENABLED java "${java_args[@]}" false
VEC_DUONGCAOTOC_ADMIN_ENABLED=false java "${java_args[@]}" false
VEC_DUONGCAOTOC_ADMIN_ENABLED=true java "${java_args[@]}" true
VEC_DUONGCAOTOC_ADMIN_ENABLED=' TRUE ' java "${java_args[@]}" true
VEC_DUONGCAOTOC_ADMIN_ENABLED=invalid java "${java_args[@]}" false
