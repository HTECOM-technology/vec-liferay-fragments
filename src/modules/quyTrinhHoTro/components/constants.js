// Menu sections for sidebar
export const MENU_SECTIONS = [
    {
        key: "dich-vu-cntt",
        title: "DỊCH VỤ CNTT",
        items: [
            { key: "gop-y-cai-tien", label: "Góp ý cải tiến", icon: "edit" },
            { key: "ho-tro-dao-tao-hdsd", label: "Hỗ trợ đào tạo - HDSD", icon: "file" },
            { key: "ho-tro-hoi-nghi-truyen-hinh", label: "Hỗ trợ hội nghị truyền hình", icon: "file" },
            { key: "yc-cap-tai-khoan-quyen-truy-cap", label: "YC cấp tài khoản & quyền truy cập", icon: "file" },
            { key: "yc-ho-tro-phan-mem", label: "YC hỗ trợ phần mềm", icon: "file" },
            { key: "yc-kiem-tra-may-nang-cap-ssd", label: "YC kiểm tra máy, nâng cấp SSD", icon: "file" },
            { key: "yc-su-co-ket-noi-mang", label: "YC sự cố kết nối mạng", icon: "file" },
            { key: "yc-sua-chua-khac-phuc-thiet-bi-cntt", label: "YC sửa chữa, khắc phục thiết bị CNTT", icon: "file" },
        ],
    },
    {
        key: "du-an",
        title: "DỰ ÁN",
        items: [],
    },
    {
        key: "tai-chinh-ke-toan",
        title: "TÀI CHÍNH - KẾ TOÁN",
        items: [],
    },
    {
        key: "nhan-su",
        title: "NHÂN SỰ",
        items: [],
    },
    {
        key: "van-phong",
        title: "VĂN PHÒNG",
        items: [],
    },
];

// Process options
export const PROCESS_OPTIONS = [
    { value: "dich-vu-cntt", label: "Dịch vụ CNTT" },
    { value: "du-an", label: "Dự án" },
    { value: "tai-chinh-ke-toan", label: "Tài chính - Kế toán" },
    { value: "nhan-su", label: "Nhân sự" },
    { value: "van-phong", label: "Văn phòng" },
];

// Sub-process options based on process
export const SUB_PROCESS_OPTIONS = {
    "dich-vu-cntt": [
        { value: "gop-y-cai-tien", label: "Góp ý cải tiến" },
        { value: "ho-tro-dao-tao-hdsd", label: "Hỗ trợ đào tạo - HDSD" },
        { value: "ho-tro-hoi-nghi-truyen-hinh", label: "Hỗ trợ hội nghị truyền hình" },
        { value: "yc-cap-tai-khoan-quyen-truy-cap", label: "YC cấp tài khoản & quyền truy cập" },
        { value: "yc-ho-tro-phan-mem", label: "YC hỗ trợ phần mềm" },
        { value: "yc-kiem-tra-may-nang-cap-ssd", label: "YC kiểm tra máy, nâng cấp SSD" },
        { value: "yc-su-co-ket-noi-mang", label: "YC sự cố kết nối mạng" },
        { value: "yc-sua-chua-khac-phuc-thiet-bi-cntt", label: "YC sửa chữa, khắc phục thiết bị CNTT" },
    ],
    "du-an": [],
    "tai-chinh-ke-toan": [],
    "nhan-su": [],
    "van-phong": [],
};

// Priority options
export const PRIORITY_OPTIONS = [
    { value: "thuong", label: "Thường" },
    { value: "khan", label: "Khẩn" },
    { value: "rat-khan", label: "Rất khẩn" },
];

// Period type options
export const PERIOD_TYPE_OPTIONS = [
    { value: "loai-trinh-ky", label: "Loại trình ký" },
    { value: "ngay", label: "Ngày" },
    { value: "tuan", label: "Tuần" },
    { value: "thang", label: "Tháng" },
];

// Notification options
export const NOTIFICATION_OPTIONS = [
    { value: "thong-bao", label: "Thông báo" },
    { value: "tin-nhan", label: "Tin nhắn" },
    { value: "email", label: "Email" },
    { value: "sms", label: "SMS" },
];

// Font family options
export const FONT_FAMILY_OPTIONS = [
    { value: "times-new-roman", label: "Times New Roman" },
    { value: "arial", label: "Arial" },
    { value: "roboto", label: "Roboto" },
];

// Font size options
export const FONT_SIZE_OPTIONS = [
    { value: "10", label: "10pt" },
    { value: "11", label: "11pt" },
    { value: "12", label: "12pt" },
    { value: "13", label: "13pt" },
    { value: "14", label: "14pt" },
    { value: "16", label: "16pt" },
    { value: "18", label: "18pt" },
];

// Paragraph style options
export const PARAGRAPH_STYLE_OPTIONS = [
    { value: "doan-van", label: "Đoạn văn" },
    { value: "tieu-de-1", label: "Tiêu đề 1" },
    { value: "tieu-de-2", label: "Tiêu đề 2" },
    { value: "tieu-de-3", label: "Tiêu đề 3" },
];
