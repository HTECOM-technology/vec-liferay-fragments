-- Migration: người xử lý có thể thuộc nhiều đơn vị / phòng ban khác nhau.
-- Lưu cặp (đơn vị, phòng ban) theo TỪNG người xử lý thay vì theo cấu hình.
-- Hai cột organizationId/departmentId cũ trong VEC_SupportHandlerConfig được
-- GIỮ LẠI (không dùng nữa) để có thể rollback về bản code cũ nếu cần.
-- Chạy thủ công trên database Liferay TRƯỚC khi deploy module admin-ui mới.
-- (Cài mới từ đầu: chạy support-handler-settings.sql trước, rồi chạy file này.)

-- Hai cột cũ không còn được code ghi giá trị thật, thêm DEFAULT 0
-- để insert cấu hình mới không bị lỗi NOT NULL.
ALTER TABLE VEC_SupportHandlerConfig
  MODIFY COLUMN organizationId BIGINT NOT NULL DEFAULT 0,
  MODIFY COLUMN departmentId BIGINT NOT NULL DEFAULT 0;

ALTER TABLE VEC_SupportHandlerConfigUser
  ADD COLUMN organizationId BIGINT NOT NULL DEFAULT 0,
  ADD COLUMN departmentId BIGINT NOT NULL DEFAULT 0;

ALTER TABLE VEC_SupportRequestHandler
  ADD COLUMN organizationId BIGINT NOT NULL DEFAULT 0,
  ADD COLUMN departmentId BIGINT NOT NULL DEFAULT 0;

-- Backfill: người xử lý trong cấu hình hiện có kế thừa đơn vị/phòng ban
-- đã cấu hình ở cấp config (mô hình cũ chỉ có 1 cặp cho mỗi loại yêu cầu).
UPDATE VEC_SupportHandlerConfigUser cu
INNER JOIN VEC_SupportHandlerConfig c ON cu.configId = c.configId
SET cu.organizationId = c.organizationId,
    cu.departmentId = c.departmentId
WHERE cu.organizationId = 0;

-- Backfill: người xử lý đã gán vào các yêu cầu hiện có lấy theo cấu hình
-- cùng loại yêu cầu (nếu vẫn còn trong cấu hình).
UPDATE VEC_SupportRequestHandler h
INNER JOIN VEC_SupportRequest r ON h.requestId = r.requestId
INNER JOIN VEC_SupportHandlerConfig c
  ON c.companyId = r.companyId
 AND c.processKey = r.processKey
 AND c.requestTypeKey = r.requestTypeKey
INNER JOIN VEC_SupportHandlerConfigUser cu
  ON cu.configId = c.configId
 AND cu.userId = h.userId
SET h.organizationId = cu.organizationId,
    h.departmentId = cu.departmentId
WHERE h.organizationId = 0;
