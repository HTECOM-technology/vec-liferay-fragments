# Script đồng bộ LDAP thủ công

Thư mục `sync-ldap` chứa các script Groovy dùng để chẩn đoán và đồng bộ thông tin LDAP/Active Directory với Liferay theo cách thủ công.

Các script được chạy tại:

```text
Control Panel → Server Administration → Script → Groovy
```

## Các script

| File | Chức năng |
| --- | --- |
| `diagnose-ad-ldap-user-mappings.groovy` | Chỉ đọc cấu hình, AD và Liferay; hiển thị mapping, DN, OU path và trạng thái custom field để chẩn đoán. |
| `run-ad-ou-organization-sync.groovy` | Chạy full LDAP import bằng cấu hình Liferay hiện tại, sau đó gọi service đồng bộ AD OU sang Liferay Organization. |
| `backfill-existing-ad-distinguished-name-and-sync-ou.groovy` | Ghi bổ sung `adDistinguishedName` cho user Liferay đã tồn tại, chạy OU sync và reindex các user LDAP đã khớp. |
| `script.groovy` | Script đồng bộ thủ công mở rộng/legacy; cần kiểm tra kỹ cấu hình và phạm vi cập nhật trước khi dùng. |

## Cấu hình bắt buộc

Trước khi chạy, kiểm tra:

- LDAP Import của company đã bật.
- Import Method là `user` nếu cần quét toàn bộ tài khoản theo user search filter.
- LDAP server có custom user mapping theo đúng chiều:

```text
adDistinguishedName=distinguishedName
```

- User custom field `adDistinguishedName` và `adSyncedOrganizationPath` đã tồn tại.
- Bundle `vn.vec.custom.admin.ui` đang `ACTIVE` và chứa `ADOUOrganizationSyncService` đúng phiên bản.
- Tài khoản chạy script có quyền Server Administration phù hợp.

Không map `adSyncedOrganizationPath` từ LDAP. Field này là marker nội bộ do service OU sync quản lý.

## Quy trình khuyến nghị

1. Chạy `diagnose-ad-ldap-user-mappings.groovy` để xác nhận AD trả về đúng DN và user khớp với Liferay.
2. Với script có tùy chọn `DRY_RUN`, chạy thử trước khi bật ghi dữ liệu.
3. Nếu user cũ chưa có `adDistinguishedName`, chạy `backfill-existing-ad-distinguished-name-and-sync-ou.groovy`.
4. Dùng `run-ad-ou-organization-sync.groovy` khi cần chủ động full LDAP import rồi mới đồng bộ OU.
5. Kiểm tra output của script và `catalina.out`, đặc biệt các chỉ số `Synced`, `Skipped`, `Errors` và lý do skip.

## Ý nghĩa kết quả OU sync

- `Missing DN`: user Liferay không có `adDistinguishedName`.
- `DN no OU`: DN không chứa thành phần OU hợp lệ.
- `Up to date`: organization path đã khớp với `adSyncedOrganizationPath` và membership hiện tại.
- `Synced`: đã tạo/tìm organization path, gán user vào organization lá và cập nhật marker.

Service gán user trực tiếp vào **organization lá** trong DN. Ví dụ DN tạo đường dẫn `VP VEC/TT CNTT/Phòng Kỹ thuật` thì membership trực tiếp nằm ở `Phòng Kỹ thuật`.

Tên Organization phải duy nhất trong một Liferay company. Nếu tên OU đã được dùng ở nhánh khác, service sẽ thêm tên OU cha để tránh trùng. Ví dụ `VP VEC/TT CNTT/NS` được tạo trên Liferay thành `VP VEC/TT CNTT/NS - TT CNTT` khi đã có một Organization khác tên `NS`. Field `adSyncedOrganizationPath` vẫn lưu đường dẫn AD gốc để phát hiện thay đổi DN chính xác.

## Cảnh báo

- Script Groovy chạy trực tiếp trong portal và có thể cập nhật hàng loạt dữ liệu. Luôn đọc lại các hằng số cấu hình ở đầu file trước khi chạy.
- Không ghi tài khoản bind LDAP hoặc mật khẩu thật vào file commit lên Git. Nếu dùng `script.groovy` legacy, phải rà soát và thay thế mọi thông tin nhạy cảm trước khi chia sẻ.
- Không chạy đồng thời nhiều phiên full LDAP import/backfill.
- Sau khi thay đổi Java service, phải build/deploy lại JAR và kiểm tra bundle `ACTIVE` trước khi chạy script mới.
