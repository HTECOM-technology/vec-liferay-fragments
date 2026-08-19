# Module counter (`vn.vec.custom.counter`)

Module OSGi cung cấp 3 counter cho website, dùng cho fragment ở frontend. **Toàn bộ
API không yêu cầu xác thực** (`auth.verifier.guest.allowed=true`,
`liferay.access.control.disable=true`) nên khách chưa đăng nhập vẫn gọi được.

| Counter | Ý nghĩa | Bảng dữ liệu |
| --- | --- | --- |
| 1 | Lượt truy cập website | `VEC_CounterSiteVisit`, `VEC_CounterSiteVisitor` |
| 2 | Số người đang online | `VEC_CounterOnlineSession` |
| 3 | Số lượt đọc một bài viết | `VEC_CounterArticleRead`, `VEC_CounterArticleReader` |

Base URL: `/o/vec-counter`

## Build và deploy

Module mang số **4** trong cả hai script:

```bash
bash build-custom-bundles.sh 4              # build local bằng Docker -> custom-bundles/dist/
bash custom-bundles/deploy-admin-ui.sh 4    # upload + build + deploy trên server
```

## Tạo bảng

Bảng được tạo tự động khi bundle activate (`CounterTableManager`), nên bình thường
không cần làm gì. SQL dùng cú pháp MySQL (`insert ignore`, `on duplicate key
update`) đúng như DB của dự án. Muốn tạo hoặc kiểm tra thủ công thì chạy
[`sql/counter.sql`](sql/counter.sql) trên DB MySQL của Liferay. Hai nơi khai báo
schema (`sql/counter.sql` và `CounterTableManager`) phải luôn giống nhau.

## Định danh visitor

API không có xác thực nên visitor được nhận dạng theo thứ tự ưu tiên:

1. `userId` nếu người dùng đã đăng nhập.
2. Tham số `visitorKey` do frontend gửi lên — **cách chính xác nhất cho khách**;
   nên sinh một UUID rồi lưu ở `localStorage` và gửi kèm mọi request.
3. Session id của servlet container.
4. IP + User-Agent (kém chính xác nhất, nhiều người sau cùng một NAT bị gộp).

Giá trị cuối cùng luôn được băm SHA-256 trước khi lưu, nên bảng counter **không**
chứa IP hay session id dạng thô.

## Quy ước `groupId`

- Khi **ghi**: `groupId` lấy từ tham số, nếu không có thì lấy scope group của
  request (thường bằng 0 với request tới `/o/...`).
- Khi **đọc**: `groupId <= 0` nghĩa là gộp toàn bộ site của company. Nhờ vậy số
  liệu vẫn đúng dù lúc ghi có truyền `groupId` hay không.

Truyền `groupId` khi cần tách số liệu theo từng site.

## Chống tăng ảo

| Hành vi | Ngưỡng | Hằng số |
| --- | --- | --- |
| Cùng visitor truy cập lại website | 60 giây | `SITE_VISIT_THROTTLE_SECONDS` |
| Cùng visitor đọc lại một bài viết | 30 phút | `ARTICLE_READ_THROTTLE_SECONDS` |
| Coi là đang online | 5 phút kể từ heartbeat cuối | `ONLINE_WINDOW_SECONDS` |

Response của các API ghi nhận có field `counted` cho biết lượt vừa gửi có được
tính hay bị chặn. Đặt `SITE_VISIT_THROTTLE_SECONDS = 0` nếu muốn `totalVisits`
đếm đúng mọi pageview thay vì mỗi visitor tối đa một lượt/phút. Sửa ngưỡng trong
[`CounterConstants`](src/main/java/vn/vec/custom/counter/constants/CounterConstants.java)
rồi build lại.

## API

Mọi response là JSON, kèm header CORS (`Access-Control-Allow-Origin: *`) và
`Cache-Control: no-store`. Các endpoint `POST` nhận tham số qua **query string
hoặc JSON body** đều được.

### Counter 1 — lượt truy cập website

#### `POST /o/vec-counter/site-visits/hit`

Ghi nhận một lượt truy cập **và** cập nhật heartbeat online trong cùng một lần
gọi, nên fragment chỉ cần gọi API này khi trang được mở.

Tham số: `groupId` (tuỳ chọn), `visitorKey` (tuỳ chọn), `path` (tuỳ chọn, mặc
định lấy từ header `Referer`).

```json
{
  "companyId": 20097,
  "groupId": 0,
  "totalVisits": 15234,
  "totalVisitsToday": 312,
  "totalVisitsYesterday": 289,
  "totalVisitsThisWeek": 1502,
  "totalVisitsThisMonth": 6120,
  "totalVisitsThisYear": 15234,
  "uniqueVisitors": 9021,
  "uniqueVisitorsToday": 198,
  "firstVisitDate": "2026-01-04T00:00:00Z",
  "online": {"total": 24, "guests": 19, "members": 5},
  "onlineWindowSeconds": 300,
  "counted": true
}
```

`firstVisitDate` là ngày đầu tiên có dữ liệu truy cập (chỉ phần ngày có ý nghĩa).
`uniqueVisitors` là **tổng unique visitor của từng ngày**: một khách quay lại ở
ngày khác được tính lại, nên số này luôn lớn hơn hoặc bằng số người thật.
`uniqueVisitorsToday` thì chính xác trong ngày.

#### `GET /o/vec-counter/site-visits/summary?groupId=`

Trả về đúng cấu trúc trên nhưng không ghi nhận gì và không có field `counted`.

#### `GET /o/vec-counter/site-visits/daily?days=30&groupId=`

Số liệu theo từng ngày để vẽ biểu đồ. Có thể dùng `startDate`/`endDate` dạng
`yyyy-MM-dd` thay cho `days` (mặc định 30 ngày, tối đa 366 ngày).

```json
{
  "companyId": 20097,
  "groupId": 0,
  "startDate": "2026-07-21",
  "endDate": "2026-08-19",
  "items": [
    {"date": "2026-07-21", "totalVisits": 245, "uniqueVisitors": 180}
  ]
}
```

### Counter 2 — số người đang online

#### `POST /o/vec-counter/online/heartbeat`

Gọi lại mỗi ~60 giây. Tham số: `groupId`, `visitorKey`, `path` (đều tuỳ chọn).

```json
{
  "companyId": 20097,
  "groupId": 0,
  "online": 24,
  "guests": 19,
  "members": 5,
  "onlineWindowSeconds": 300
}
```

#### `GET /o/vec-counter/online/count?groupId=`

Chỉ đọc, không cập nhật heartbeat. Cùng cấu trúc response như trên.

#### `POST /o/vec-counter/online/leave`

Bỏ visitor khỏi danh sách online, dùng khi đóng tab hoặc logout. Không gọi cũng
không sao: session tự hết hạn sau `onlineWindowSeconds` và bị job dọn xoá sau đó.

### Counter 3 — lượt đọc bài viết

`articleId` là `JournalArticle.articleId` của Liferay.

#### `POST /o/vec-counter/articles/{articleId}/reads`

Tham số tuỳ chọn: `groupId`, `visitorKey`, `resourcePrimKey` (lưu lại để tra cứu
bài viết, không bắt buộc).

```json
{
  "articleId": "38201",
  "groupId": 0,
  "resourcePrimKey": 38199,
  "totalReads": 1042,
  "uniqueReaders": 876,
  "lastReadDate": "2026-08-19T02:41:08Z",
  "counted": true
}
```

#### `GET /o/vec-counter/articles/{articleId}/reads?groupId=`

Chỉ đọc số liệu, không có field `counted`.

#### `GET /o/vec-counter/articles/reads?articleIds=38201,38202&groupId=`

Lấy số liệu nhiều bài viết trong một lần gọi (tối đa 100 `articleId`), dùng cho
trang danh sách. Bài viết chưa có lượt đọc vẫn xuất hiện với số 0.

```json
{
  "companyId": 20097,
  "groupId": 0,
  "total": 2,
  "items": [
    {"articleId": "38201", "totalReads": 1042, "uniqueReaders": 876, "lastReadDate": "2026-08-19T02:41:08Z", "groupId": 0, "resourcePrimKey": 38199},
    {"articleId": "38202", "totalReads": 0, "uniqueReaders": 0, "lastReadDate": null, "groupId": 0, "resourcePrimKey": 0}
  ]
}
```

#### `GET /o/vec-counter/articles/top?limit=10&groupId=`

Danh sách bài viết được đọc nhiều nhất (tối đa 100), sắp xếp giảm dần theo
`totalReads`. Response chỉ có số liệu, không có tiêu đề bài viết — frontend tự
lấy tiêu đề từ API web content của Liferay.

## Ví dụ gọi từ fragment

```js
const COUNTER_BASE = '/o/vec-counter';

// visitorKey giúp đếm khách chính xác hơn IP + User-Agent.
function getVisitorKey() {
	let visitorKey = localStorage.getItem('vecCounterVisitorKey');

	if (!visitorKey) {
		visitorKey = crypto.randomUUID();
		localStorage.setItem('vecCounterVisitorKey', visitorKey);
	}

	return visitorKey;
}

const visitorKey = getVisitorKey();

// 1 + 2: ghi nhận lượt truy cập, đồng thời báo online.
const summary = await fetch(`${COUNTER_BASE}/site-visits/hit`, {
	body: JSON.stringify({visitorKey}),
	headers: {'Content-Type': 'application/json'},
	method: 'POST',
}).then((response) => response.json());

// 2: duy trì trạng thái online.
setInterval(() => {
	fetch(`${COUNTER_BASE}/online/heartbeat`, {
		body: JSON.stringify({visitorKey}),
		headers: {'Content-Type': 'application/json'},
		method: 'POST',
	});
}, 60000);

// 3: ghi nhận lượt đọc bài viết trên trang chi tiết.
const stats = await fetch(
	`${COUNTER_BASE}/articles/${articleId}/reads?visitorKey=${visitorKey}`,
	{method: 'POST'}
).then((response) => response.json());
```

## Dọn dữ liệu

`CounterCleanupScheduler` chạy mỗi 5 phút (`CounterConstants.CLEANUP_CRON`):

- xoá session online cũ hơn 15 phút;
- xoá dòng chi tiết trong `VEC_CounterSiteVisitor` cũ hơn 180 ngày. Số liệu tổng
  hợp theo ngày nằm ở `VEC_CounterSiteVisit` nên không bị ảnh hưởng.

`VEC_CounterArticleReader` **không** bị dọn: xoá dòng ở đây sẽ làm
`uniqueReaders` bị đếm lại và tăng sai.

## Cấu trúc source

```
counter/
├── bnd.bnd                     # Bundle-SymbolicName vn.vec.custom.counter 1.0.0
├── build.gradle                # portal-kernel + javax.ws.rs, fallback Maven khi không có LIFERAY_HOME
├── sql/counter.sql             # schema MySQL
└── src/main/java/vn/vec/custom/counter/
    ├── application/            # JAX-RS application, base /vec-counter
    ├── constants/              # ngưỡng, cron, giới hạn
    ├── model/                  # POJO trả ra API
    ├── persistence/            # JDBC repository + tạo bảng
    ├── resource/               # 3 REST resource, mỗi counter một file
    ├── scheduler/              # job dọn dữ liệu
    ├── service/                # định danh visitor từ request
    └── util/                   # helper response JSON/CORS và đọc tham số
```
