import React, { useState } from "react";
import { Sidebar, RequestForm, MyRequests } from "./components";
import {
    PageWrap,
    PageHeader,
    MyRequestButton,
    ContentWrap,
} from "./style";

function QuyTrinhHoTroPage() {
    const [activeSection, setActiveSection] = useState("dich-vu-cntt");
    const [activeItem, setActiveItem] = useState("gop-y-cai-tien");
    const [showMyRequests, setShowMyRequests] = useState(false);

    const handleItemSelect = (sectionKey, itemKey) => {
        setActiveSection(sectionKey);
        setActiveItem(itemKey);
        setShowMyRequests(false);
    };

    const MySupportIcon = () => (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.6663 8.00004C14.6663 4.31814 11.6816 1.33337 7.99967 1.33337C4.31778 1.33337 1.33301 4.31814 1.33301 8.00004C1.33301 11.6819 4.31778 14.6667 7.99967 14.6667C11.6816 14.6667 14.6663 11.6819 14.6663 8.00004Z" fill="white" fillOpacity="0.2" />
            <path d="M10.133 7.73337C10.133 6.40789 9.05849 5.33337 7.73301 5.33337C6.40752 5.33337 5.33301 6.40789 5.33301 7.73337C5.33301 9.05886 6.40752 10.1334 7.73301 10.1334C9.05849 10.1334 10.133 9.05886 10.133 7.73337Z" fill="#0090CF" />
            <path d="M14.6663 8.00004C14.6663 4.31814 11.6816 1.33337 7.99967 1.33337C4.31778 1.33337 1.33301 4.31814 1.33301 8.00004C1.33301 11.6819 4.31778 14.6667 7.99967 14.6667C11.6816 14.6667 14.6663 11.6819 14.6663 8.00004Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M10.136 11.197C10.4289 11.4899 10.9038 11.4899 11.1967 11.197C11.4896 10.9041 11.4896 10.4293 11.1967 10.1364L10.6663 10.6667L10.136 11.197ZM9.59967 9.60004L9.06934 10.1304L10.136 11.197L10.6663 10.6667L11.1967 10.1364L10.13 9.06971L9.59967 9.60004ZM10.133 7.73337H10.883C10.883 5.99368 9.4727 4.58337 7.73301 4.58337V5.33337V6.08337C8.64428 6.08337 9.38301 6.8221 9.38301 7.73337H10.133ZM7.73301 5.33337V4.58337C5.99331 4.58337 4.58301 5.99368 4.58301 7.73337H5.33301H6.08301C6.08301 6.8221 6.82174 6.08337 7.73301 6.08337V5.33337ZM5.33301 7.73337H4.58301C4.58301 9.47307 5.99331 10.8834 7.73301 10.8834V10.1334V9.38337C6.82174 9.38337 6.08301 8.64464 6.08301 7.73337H5.33301ZM7.73301 10.1334V10.8834C9.4727 10.8834 10.883 9.47307 10.883 7.73337H10.133H9.38301C9.38301 8.64464 8.64428 9.38337 7.73301 9.38337V10.1334Z" fill="white" />
        </svg>
    );

    return (
        <PageWrap>
            <PageHeader>
                <span className="header-title">
                    {showMyRequests ? "Yêu cầu của tôi" : "Chọn yêu cầu hỗ trợ"}
                </span>
                <MyRequestButton
                    onClick={() => setShowMyRequests((prev) => !prev)}
                    style={showMyRequests ? { background: "#007bb5" } : {}}
                >
                    <MySupportIcon />
                    {showMyRequests ? "Tạo yêu cầu mới" : "Yêu cầu của tôi"}
                </MyRequestButton>
            </PageHeader>

            <ContentWrap>
                <Sidebar
                    activeSection={activeSection}
                    activeItem={activeItem}
                    onItemSelect={handleItemSelect}
                />
                {showMyRequests ? (
                    <MyRequests />
                ) : (
                    <RequestForm activeItem={activeItem} activeSection={activeSection} />
                )}
            </ContentWrap>
        </PageWrap>
    );
}

export default QuyTrinhHoTroPage;
