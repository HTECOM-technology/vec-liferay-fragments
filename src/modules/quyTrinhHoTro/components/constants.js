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
    // {
    //     key: "du-an",
    //     title: "DỰ ÁN",
    //     items: [],
    // },
    // {
    //     key: "tai-chinh-ke-toan",
    //     title: "TÀI CHÍNH - KẾ TOÁN",
    //     items: [],
    // },
    // {
    //     key: "nhan-su",
    //     title: "NHÂN SỰ",
    //     items: [],
    // },
    // {
    //     key: "van-phong",
    //     title: "VĂN PHÒNG",
    //     items: [],
    // },
];

// Process options
export const PROCESS_OPTIONS = [
    { value: "dich-vu-cntt", label: "Dịch vụ CNTT" },
    // { value: "du-an", label: "Dự án" },
    // { value: "tai-chinh-ke-toan", label: "Tài chính - Kế toán" },
    // { value: "nhan-su", label: "Nhân sự" },
    // { value: "van-phong", label: "Văn phòng" },
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
    // { value: "tin-nhan", label: "Tin nhắn" },
    { value: "email", label: "Email" },
    // { value: "sms", label: "SMS" },
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

// Request status options
export const REQUEST_STATUS_OPTIONS = [
    { value: "all", label: "Tất cả trạng thái" },
    { value: "cho-xu-ly", label: "Chờ xử lý" },
    { value: "dang-xu-ly", label: "Đang xử lý" },
    { value: "hoan-thanh", label: "Hoàn thành" },
    { value: "huy", label: "Huỷ" },
];

// Request status config (color + label)
export const REQUEST_STATUS_CONFIG = {
    "cho-xu-ly":  { color: "#FA8C16", bg: "#FFF7E6", label: "Chờ xử lý" },
    "dang-xu-ly": { color: "#0090CF", bg: "#E6F7FF", label: "Đang xử lý" },
    "hoan-thanh": { color: "#52C41A", bg: "#F6FFED", label: "Hoàn thành" },
    "huy":        { color: "#FF4D4F", bg: "#FFF1F0", label: "Huỷ" },
};

// Priority config
export const PRIORITY_CONFIG = {
    "thuong":   { color: "#666",     bg: "#F5F5F5",  label: "Thường" },
    "khan":     { color: "#FA8C16",  bg: "#FFF7E6",  label: "Khẩn" },
    "rat-khan": { color: "#FF4D4F",  bg: "#FFF1F0",  label: "Rất khẩn" },
};

// Mock data for "Yêu cầu của tôi"
export const MOCK_MY_REQUESTS = [
    {
        id: "YC-2026-001",
        title: "Góp ý cải tiến hệ thống quản lý tài liệu",
        process: "Dịch vụ CNTT",
        subProcess: "Góp ý cải tiến",
        status: "hoan-thanh",
        priority: "thuong",
        handler: "Nguyễn Văn A",
        createdAt: "2026-04-10",
        dueDate: "2026-04-20",
        updatedAt: "2026-04-18",
    },
    {
        id: "YC-2026-002",
        title: "YC hỗ trợ phần mềm kế toán MISA",
        process: "Dịch vụ CNTT",
        subProcess: "YC hỗ trợ phần mềm",
        status: "dang-xu-ly",
        priority: "khan",
        handler: "Trần Thị B",
        createdAt: "2026-04-15",
        dueDate: "2026-04-25",
        updatedAt: "2026-04-22",
    },
    {
        id: "YC-2026-003",
        title: "YC cấp tài khoản VPN cho nhân viên mới",
        process: "Dịch vụ CNTT",
        subProcess: "YC cấp tài khoản & quyền truy cập",
        status: "cho-xu-ly",
        priority: "thuong",
        handler: "Lê Văn C",
        createdAt: "2026-04-20",
        dueDate: "2026-04-30",
        updatedAt: "2026-04-20",
    },
    {
        id: "YC-2026-004",
        title: "YC sửa chữa máy tính phòng kế hoạch",
        process: "Dịch vụ CNTT",
        subProcess: "YC sửa chữa, khắc phục thiết bị CNTT",
        status: "dang-xu-ly",
        priority: "rat-khan",
        handler: "Phạm Thị D",
        createdAt: "2026-04-21",
        dueDate: "2026-04-23",
        updatedAt: "2026-04-22",
    },
    {
        id: "YC-2026-005",
        title: "Hỗ trợ hội nghị truyền hình ngày 28/04",
        process: "Dịch vụ CNTT",
        subProcess: "Hỗ trợ hội nghị truyền hình",
        status: "huy",
        priority: "khan",
        handler: "Hoàng Văn E",
        createdAt: "2026-04-18",
        dueDate: "2026-04-28",
        updatedAt: "2026-04-25",
    },
    {
        id: "YC-2026-006",
        title: "YC kiểm tra máy, nâng cấp SSD phòng IT",
        process: "Dịch vụ CNTT",
        subProcess: "YC kiểm tra máy, nâng cấp SSD",
        status: "cho-xu-ly",
        priority: "thuong",
        handler: "Ngô Thị F",
        createdAt: "2026-04-25",
        dueDate: "2026-05-05",
        updatedAt: "2026-04-25",
    },
    {
        id: "YC-2026-007",
        title: "YC sự cố kết nối mạng tầng 3",
        process: "Dịch vụ CNTT",
        subProcess: "YC sự cố kết nối mạng",
        status: "hoan-thanh",
        priority: "rat-khan",
        handler: "Trần Văn G",
        createdAt: "2026-04-12",
        dueDate: "2026-04-13",
        updatedAt: "2026-04-13",
    },
];
