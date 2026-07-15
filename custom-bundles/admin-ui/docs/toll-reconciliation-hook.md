# Hook Đối soát thu phí

Module nhận webhook của đối tác tại endpoint nội bộ:

```text
POST /o/toll-reconciliation/hook
```

Endpoint công bố bên ngoài là:

```text
POST /api/v1/toll-reconciliation/hook
```

Nginx rewrite endpoint ngoài sang endpoint JAX-RS nội bộ. Application cho phép
guest vì request được bảo vệ bằng API key, timestamp, nonce và HMAC riêng.

## API đọc cho màn hình intranet

Màn hình `src/modules/doiSoatThuPhi` đọc dữ liệu thật qua:

```text
GET /o/toll-reconciliation/dashboard?fromDate=2026-01-01&toDate=2026-12-31&limit=10
```

- API yêu cầu phiên Liferay đã đăng nhập, dù application webhook cho phép
  guest. Request chưa đăng nhập nhận `401 UNAUTHORIZED`.
- `traffic` và `revenue` được `SUM` theo ngày trong khoảng `fromDate` đến
  `toDate`. Nếu không truyền ngày, API lấy 365 ngày gần nhất; khoảng tối đa là
  731 ngày.
- `incidents`, `events`, `errors` là các bản ghi mới nhất, sắp xếp theo
  `occurred_at DESC`; `limit` mặc định 10 và tối đa 100.
- Datetime trả về theo múi giờ `Asia/Ho_Chi_Minh` và có UTC offset.

Ví dụ kiểm tra trong một trình duyệt đã đăng nhập Liferay:

```bash
curl -sS 'https://portal.tctvec.vn/o/toll-reconciliation/dashboard?limit=10' \
  -H 'X-Requested-With: XMLHttpRequest' \
  -H 'Cookie: JSESSIONID=...; COOKIE_SUPPORT=true'
```

Không commit hoặc chia sẻ cookie phiên đăng nhập.

## Trước khi deploy

1. Xác nhận với đối tác `SIGNATURE_SCHEME` là `BODY_ONLY` hay
   `TS_NONCE_BODY`, cùng chính xác tên các header.
2. Thay credential thật và danh sách `record_type` được phép tại duy nhất
   `HookConstants.java`. Không log hoặc đưa credential lên repo công khai.
3. Chạy `sql/toll_reconciliation_hook.sql` trên MySQL master.
4. Build/deploy bằng `bash custom-bundles/deploy-admin-ui.sh 1` từ local hoặc
   `bash /root/vec/custom-bundles/deploy-admin-ui.sh --server 1` trên server.
5. Kiểm tra bundle `vn.vec.custom.admin.ui` ở trạng thái ACTIVE.

## Quy ước dữ liệu

- HMAC-SHA256 được tính trên raw body bytes. Với `BODY_ONLY`, không parse rồi
  serialize JSON trước khi ký.
- Mọi datetime nguồn phải là ISO 8601 có offset. JDBC đổi về UTC trước khi lưu
  vào DATETIME; tầng hiển thị đổi từ UTC sang `+07:00`.
- `create`, `update`, `upsert` đều dùng `INSERT ... ON DUPLICATE KEY UPDATE`
  theo `(source_system, external_id)`. `delete` xóa cứng vì schema không có cột
  xóa mềm.
- `raw_body` chỉ được ghi khi `HookConstants.LOG_RAW_BODY=true`; mặc định tắt.

## Tạo request test BODY_ONLY

Giữ body trong file để `openssl` và `curl --data-binary` dùng đúng cùng chuỗi
byte. Timestamp phải nằm trong cửa sổ ±5 phút và nonce phải mới.

```bash
signature="$(openssl dgst -sha256 -hmac "$SECRET_KEY" -hex body.json | awk '{print $2}')"

curl -sS -X POST 'https://portal.tctvec.vn/api/v1/toll-reconciliation/hook' \
  -H 'Content-Type: application/json' \
  -H "X-Client-Id: $CLIENT_ID" \
  -H "X-Api-Key: $API_KEY" \
  -H "X-Timestamp: $TIMESTAMP" \
  -H "X-Nonce: $NONCE" \
  -H "X-Signature: $signature" \
  --data-binary @body.json
```

Không in biến `SECRET_KEY`, `API_KEY` hoặc signature vào log CI/server.

## Kiểm tra sau deploy

- Request hợp lệ lần đầu trả `result=created`; payload cùng khóa với nonce mới
  trả `result=updated` và không sinh dòng trùng.
- Sửa một byte body nhưng giữ chữ ký cũ trả `401 SIGNATURE_INVALID`.
- Gửi lại cùng nonce trả `401 NONCE_REPLAY`.
- Timestamp lệch quá 300 giây trả `401 TIMESTAMP_EXPIRED`.
- Thiếu `vehicle_count` trả `400 PAYLOAD_INVALID`, kèm mảng `errors`.
- Kiểm tra `vec_hook_request_log` không chứa API key, secret key hoặc signature.
