// Mock data for survey/voting
export const SURVEY_STATUS = {
    OPEN: "open",
    CLOSED: "closed",
};

export const FILTER_TYPES = {
    INVITED: "invited",
    MY_SURVEYS: "my_surveys",
};

// Danh sách các chủ đề mẫu
const SURVEY_TITLES = [
    "Khảo sát địa điểm du lịch công ty 2025",
    "Bình chọn logo mới cho phòng Marketing",
    "Chọn thời gian họp team hàng tuần",
    "Khảo sát mức độ hài lòng nhân viên Q1",
    "Bình chọn menu canteen tháng 2",
    "Chọn nhà cung cấp văn phòng phẩm",
    "Khảo sát nhu cầu đào tạo kỹ năng mềm",
    "Bình chọn hoạt động team building",
    "Chọn màu đồng phục mới",
    "Khảo sát chất lượng dịch vụ IT Support",
    "Bình chọn ngày tổ chức Year End Party",
    "Chọn chủ đề workshop tháng 3",
    "Khảo sát môi trường làm việc",
    "Bình chọn giờ làm việc linh hoạt",
    "Chọn phần mềm quản lý dự án",
    "Khảo sát chế độ phúc lợi",
    "Bình chọn nhân viên xuất sắc tháng",
    "Chọn địa điểm họp mặt cuối năm",
    "Khảo sát nhu cầu parking",
    "Bình chọn thiết kế phòng họp mới",
    "Chọn nhà cung cấp bảo hiểm sức khỏe",
    "Khảo sát chính sách WFH",
    "Bình chọn hoạt động CSR",
    "Chọn thực đơn tiệc sinh nhật tháng",
    "Khảo sát hiệu quả quy trình onboarding",
];

// Generate mock survey data
const generateSurveyData = () => {
    const data = [];

    for (let i = 1; i <= 61; i++) {
        const isOpen = i <= 2; // First 2 are open
        const titleIndex = (i - 1) % SURVEY_TITLES.length;
        const options = [
            { id: `opt-${i}-1`, name: "Phương án 1", votes: isOpen ? 0 : 21 },
            { id: `opt-${i}-2`, name: "Phương án 2", votes: isOpen ? (i === 2 ? 34 : 0) : 13 },
            { id: `opt-${i}-3`, name: "Phương án 3", votes: isOpen ? (i === 2 ? 3 : 0) : 46 },
        ];

        // For open surveys with votes, give votes to first option
        if (isOpen && i === 2) {
            options[0].votes = 12;
        }

        data.push({
            id: `survey-${i}`,
            title: SURVEY_TITLES[titleIndex],
            status: isOpen ? SURVEY_STATUS.OPEN : SURVEY_STATUS.CLOSED,
            options: options,
            totalVotes: options.reduce((sum, opt) => sum + opt.votes, 0),
            createdAt: new Date(2025, 0, 61 - i),
            hasVoted: !isOpen,
        });
    }

    return data;
};

export const mockSurveyData = generateSurveyData();

// Sort options
export const SORT_OPTIONS = [
    { value: "newest", label: "Mới nhất" },
    { value: "oldest", label: "Cũ nhất" },
];
