import React from "react";
import {
    WidgetCard,
    WidgetHeader,
    WidgetBody,
    StatItem,
    QuickLinkCard,
    TextWrapper,
} from "../style";
import {
    DocumentIcon,
    TaskIcon,
    MissionIcon,
    NewInComingDocumentIcon,
    NewOutgoingDocumentIcon,
    PendingDocumentsIcon,
    DangerIcon,
    TotalTaskIcon,
    InProgressIcon,
    CompletedIcon,
    FeedbackIcon,
    VotingIcon,
    SupportIcon,
    HandbookIcon,
} from "./Icons";

// Công văn - Văn bản Widget
export function DocumentWidget({ data }) {
    return (
        <WidgetCard>
            <WidgetHeader $bgColor="rgba(229, 247, 255, 1)" $iconBg="rgba(0, 144, 207, 1)">
                <div className="header-icon">
                    <DocumentIcon />
                </div>
                <span className="header-title">Công văn - Văn bản</span>
            </WidgetHeader>
            <WidgetBody>
                <StatItem>
                    <TextWrapper>
                        <div className="stat-label">Số văn bản<br />đến mới</div>
                        <div className="stat-value">{data?.vanBanDenMoi || "05"}</div>
                    </TextWrapper>
                    <div className="stat-icon">
                        <NewInComingDocumentIcon />
                    </div>
                </StatItem>
                <StatItem $noBorderRight>
                    <TextWrapper>
                        <div className="stat-label">Số văn bản<br />đi mới</div>
                        <div className="stat-value">{data?.vanBanDiMoi || "12"}</div>
                    </TextWrapper>
                    <div className="stat-icon">
                        <NewOutgoingDocumentIcon />
                    </div>
                </StatItem>
                <StatItem $noBorderBottom>
                    <TextWrapper>
                        <div className="stat-label">Số văn bản<br />chờ xử lý</div>
                        <div className="stat-value">{data?.vanBanChoXuLy || "02"}</div>
                    </TextWrapper>
                    <div className="stat-icon">
                        <PendingDocumentsIcon />
                    </div>
                </StatItem>
                <StatItem $noBorderRight $noBorderBottom>
                    <TextWrapper>
                        <div className="stat-label">Số văn bản<br />chờ duyệt</div>
                        <div className="stat-value">{data?.vanBanChoDuyet || "0"}</div>
                    </TextWrapper>
                    <div className="stat-icon">
                        <DangerIcon />
                    </div>
                </StatItem>
            </WidgetBody>
        </WidgetCard>
    );
}

// Công việc Widget
export function TaskWidget({ data }) {
    return (
        <WidgetCard>
            <WidgetHeader $bgColor="rgba(229, 247, 255, 1)" $iconBg="rgba(0, 144, 207, 1)">
                <div className="header-icon">
                    <TaskIcon />
                </div>
                <span className="header-title">Công việc</span>
            </WidgetHeader>
            <WidgetBody>
                <StatItem>
                    <TextWrapper>
                        <div className="stat-label">Tổng số <br /> công việc</div>
                        <div className="stat-value">{data?.vanBanDenMoi || "05"}</div>
                    </TextWrapper>
                    <div className="stat-icon">
                        <TotalTaskIcon />
                    </div>
                </StatItem>
                <StatItem $noBorderRight>
                    <TextWrapper>
                        <div className="stat-label">Đang xử lý</div>
                        <div className="stat-value">{data?.vanBanDiMoi || "12"}</div>
                    </TextWrapper>
                    <div className="stat-icon">
                        <InProgressIcon />
                    </div>
                </StatItem>
                <StatItem $noBorderBottom>
                    <TextWrapper>
                        <div className="stat-label">Đã hoàn <br /> thành</div>
                        <div className="stat-value">{data?.vanBanChoXuLy || "02"}</div>
                    </TextWrapper>
                    <div className="stat-icon">
                        <CompletedIcon />
                    </div>
                </StatItem>
                <StatItem $noBorderRight $noBorderBottom>
                    <TextWrapper>
                        <div className="stat-label">Quá hạn</div>
                        <div className="stat-value">{data?.vanBanChoXuLy || "00"}</div>
                    </TextWrapper>
                    <div className="stat-icon">
                        <DangerIcon />
                    </div>
                </StatItem>
            </WidgetBody>
        </WidgetCard>
    );
}

// Nhiệm vụ Widget
export function MissionWidget({ data }) {
    return (
        <WidgetCard>
            <WidgetHeader $bgColor="rgba(229, 247, 255, 1)" $iconBg="rgba(0, 144, 207, 1)">
                <div className="header-icon">
                    <MissionIcon />
                </div>
                <span className="header-title">Nhiệm vụ</span>
            </WidgetHeader>
            <WidgetBody>
                <StatItem>
                    <TextWrapper>
                        <div className="stat-label">Số văn bản<br />đến mới</div>
                        <div className="stat-value">{data?.vanBanDenMoi || "05"}</div>
                    </TextWrapper>
                    <div className="stat-icon">
                        <TotalTaskIcon />
                    </div>
                </StatItem>
                <StatItem $noBorderRight>
                    <TextWrapper>
                        <div className="stat-label">Số văn bản<br />đi mới</div>
                        <div className="stat-value">{data?.vanBanDiMoi || "12"}</div>
                    </TextWrapper>
                    <div className="stat-icon">
                        <InProgressIcon />
                    </div>
                </StatItem>
                <StatItem $noBorderBottom>
                    <TextWrapper>
                        <div className="stat-label">Số văn bản<br />chờ xử lý</div>
                        <div className="stat-value">{data?.vanBanChoXuLy || "02"}</div>
                    </TextWrapper>
                    <div className="stat-icon">
                        <CompletedIcon />
                    </div>
                </StatItem>
                <StatItem $noBorderRight $noBorderBottom>
                    <TextWrapper>
                        <div className="stat-label">Quá hạn</div>
                        <div className="stat-value">{data?.vanBanChoXuLy || "00"}</div>
                    </TextWrapper>
                    <div className="stat-icon">
                        <DangerIcon />
                    </div>
                </StatItem>
            </WidgetBody>
        </WidgetCard>
    );
}

// Tình trạng giao thông Widget
// export function TrafficWidget({ data }) {
//     return (
//         <WidgetCard>
//             <WidgetHeader $bgColor="rgba(229, 247, 255, 1)" $iconBg="rgba(0, 144, 207, 1)">
//                 <div className="header-icon">
//                     <TrafficIcon />
//                 </div>
//                 <span className="header-title">Tình trạng giao thông</span>
//             </WidgetHeader>
//             <WidgetBody>
//                 <StatItem>
//                     <TextWrapper>
//                         <div className="stat-label">Số văn bản<br />đến mới</div>
//                         <div className="stat-value">{data?.vanBanDenMoi || "05"}</div>
//                     </TextWrapper>
//                     <div className="stat-icon">
//                         <NumberOfViolatingVehiclesIcon />
//                     </div>
//                 </StatItem>
//                 <StatItem $noBorderRight>
//                     <TextWrapper>
//                         <div className="stat-label">Tốc độ lưu<br />thông TB</div>
//                         <div className="stat-value">
//                             {data?.tocDoLuuThong || "02"}
//                             <span className="stat-unit">km/h</span>
//                         </div>
//                     </TextWrapper>
//                     <div className="stat-icon">
//                         <AverageTrafficSpeedIcon />
//                     </div>
//                 </StatItem>
//                 <StatItem $noBorderBottom>
//                     <TextWrapper>
//                         <div className="stat-label">SL gia súc đi<br />vào cao tốc</div>
//                         <div className="stat-value">{data?.vanBanDenMoi || "05"}</div>
//                     </TextWrapper>
//                     <div className="stat-icon">
//                         <NumberOfLivestockEnteringTheExpresswayIcon />
//                     </div>
//                 </StatItem>
//                 <StatItem $noBorderRight $noBorderBottom>
//                     <TextWrapper>
//                         <div className="stat-label">Số lượng<br />camera bị lỗi</div>
//                         <div className="stat-value">{data?.vanBanDenMoi || "00"}</div>
//                     </TextWrapper>
//                     <div className="stat-icon">
//                         <NumberOfFaultyCamerasIcon />
//                     </div>
//                 </StatItem>
//             </WidgetBody>
//         </WidgetCard>
//     );
// }

// Quick Links
export function GopYSangKienLink({ onClick }) {
    return (
        <QuickLinkCard onClick={onClick}>
            <div className="link-icon">
                <FeedbackIcon />
            </div>
            <span className="link-title">Góp ý - Sáng kiến cải tiến</span>
        </QuickLinkCard>
    );
}

export function KhaoSatBieuQuyetLink({ onClick }) {
    return (
        <QuickLinkCard onClick={onClick}>
            <div className="link-icon">
                <VotingIcon />
            </div>
            <span className="link-title">Khảo sát & biểu quyết nội bộ</span>
        </QuickLinkCard>
    );
}

export function QuyTrinhHoTroLink({ onClick }) {
    return (
        <QuickLinkCard onClick={onClick}>
            <div className="link-icon">
                <SupportIcon />
            </div>
            <span className="link-title">Quy trình - Yêu cầu hỗ trợ</span>
        </QuickLinkCard>
    );
}

export function SoTayNhanVienLink({ onClick }) {
    return (
        <QuickLinkCard onClick={onClick}>
            <div className="link-icon">
                <HandbookIcon />
            </div>
            <span className="link-title">Sổ tay nhân viên</span>
        </QuickLinkCard>
    );
}
