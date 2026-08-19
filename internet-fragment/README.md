# Internet fragment backup

Thư mục `internet-fragment` lưu bản mã nguồn HTML, CSS và JavaScript của một số fragment đang được chỉnh sửa trực tiếp trên giao diện Liferay Internet.

Đây là bản backup thủ công, không thuộc luồng build React intranet và không được đóng gói tự động vào `liferay-fragments.zip`.

## Cấu trúc hiện tại

| Đường dẫn | Nội dung |
| --- | --- |
| `Article View Counter/` | Fragment độc lập hiển thị lượt xem bài viết (text căn phải, in nghiêng), lấy từ API `/o/vec-counter`. |
| `cac-doi-tac-cua-vec/` | Fragment khu vực các đối tác của VEC. |
| `footer/` | Fragment footer: thông tin liên hệ, nút nổi, modal camera và counter lượt truy cập/đang online (gọi API `/o/vec-counter` của module `custom-bundles/counter`). |
| `gioi-thieu-chung/` | Fragment giới thiệu chung. |
| `home-page-information/` | Fragment thông tin trang chủ. |
| `live-camera/` | Fragment hiển thị camera trực tiếp. |
| `news_article_banner/` | Fragment banner đầu bài viết: tiêu đề, meta (tác giả, chuyên mục, ngày) và lượt xem lấy từ API `/o/vec-counter`. |
| `workflow-default.xml` | Bản lưu workflow mặc định liên quan đến nội dung Internet. |

Tùy fragment, thư mục có thể chứa:

```text
fragment-name/
├── index.html
├── index.css
└── index.js
```

## Quy trình chỉnh sửa

1. Xác định đúng fragment trên Liferay và thư mục backup tương ứng trong repo.
2. Lấy phiên bản mới nhất từ giao diện Liferay về repo trước khi sửa để tránh ghi đè thay đổi của người khác.
3. Chỉnh sửa `index.html`, `index.css` và `index.js` theo cấu trúc fragment.
4. Kiểm tra HTML, responsive layout, JavaScript console và các trạng thái dữ liệu trên môi trường thử nghiệm.
5. Copy nội dung đã kiểm tra trở lại trình chỉnh sửa fragment của Liferay.
6. Commit bản đã triển khai vào repo để repo tiếp tục là bản backup đối chiếu.

## Lưu ý

- Không chạy `./build.sh` với kỳ vọng các file trong thư mục này được deploy; script đó chỉ phục vụ React intranet và Liferay fragment package chính.
- Không đưa token, cookie, tài khoản hoặc URL nội bộ nhạy cảm vào JavaScript fragment.
- Khi thay đổi selector CSS, kiểm tra phạm vi để tránh ảnh hưởng theme hoặc fragment khác trên cùng trang.
- Khi sửa `workflow-default.xml`, backup workflow hiện tại trên portal và kiểm tra kỹ các trạng thái/chuyển tiếp trước khi import lại.
