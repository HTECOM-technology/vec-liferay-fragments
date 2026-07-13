# Kiểm thử tải bằng k6

Thư mục `test-performance` chứa kịch bản kiểm thử tải cho hệ thống bằng [k6](https://k6.io/).

## Thành phần

| File | Mục đích |
| --- | --- |
| `load-test.js` | Kịch bản ramping VUs, kiểm tra HTTP status, thời gian phản hồi và tỷ lệ lỗi. |
| `summary.html` | Báo cáo HTML được tạo sau lần chạy gần nhất. |
| `report.html`, `report_only_result.html` | Các báo cáo kết quả đã lưu để đối chiếu. |

## Chuẩn bị

Cài đặt k6 theo hệ điều hành và kiểm tra:

```bash
k6 version
```

Trước khi chạy, xem lại trong `load-test.js`:

- `BASE_URL` và endpoint được gọi.
- Các stage, số virtual users và tổng thời gian chạy.
- Threshold về `http_req_duration`, `http_req_failed` và `error_rate`.
- Header, timeout và dữ liệu xác thực nếu endpoint yêu cầu đăng nhập.

## Chạy kiểm thử

Chạy từ thư mục gốc dự án để báo cáo được ghi đúng vào `test-performance/summary.html`:

```bash
k6 run test-performance/load-test.js
```

Kịch bản hiện tại tăng tải theo từng giai đoạn đến tối đa 500 VUs, sau đó giảm tải dần. Threshold mặc định yêu cầu:

- 95% request hoàn thành dưới 2 giây.
- Tỷ lệ HTTP request lỗi dưới 5%.
- Custom error rate dưới 5%.

`handleSummary` dùng k6 reporter từ nguồn bên ngoài, vì vậy môi trường chạy cần truy cập mạng trong lần tải dependency.

## Nguyên tắc an toàn

- Chỉ chạy tải lớn trên môi trường được cho phép, ưu tiên staging.
- Không chạy vào production trong giờ làm việc nếu chưa có phê duyệt và kế hoạch giám sát.
- Theo dõi CPU, RAM, database connection, JVM heap, GC, thread pool và log lỗi trong suốt bài test.
- Bắt đầu với VUs thấp khi kiểm tra endpoint mới; chỉ tăng tải sau khi xác nhận dữ liệu và hành vi không gây tác động phá hủy.
- Ghi lại thời điểm, commit, cấu hình server và tham số test để có thể so sánh các lần chạy.
