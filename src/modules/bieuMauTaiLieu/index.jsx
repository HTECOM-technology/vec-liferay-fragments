import React, { useState } from "react";
import Sidebar from "../../components/common/Sidebar";
import { DocumentTable } from "./components";
import { ContentArea, Header, LayoutContainer, PageWrap } from "./style";
import { ReactComponent as NotebookIcon } from "../../assets/icon/notebook-icon.svg";

const BieuMauTaiLieuPage = () => {
    // Default active tab
    const [activeTab, setActiveTab] = useState("toTrinh");

    // Sidebar items based on the user's request
    const sidebarItems = [
        { key: "toTrinh", label: "BIỂU MẪU TỜ TRÌNH", icon: <NotebookIcon /> },
        { key: "quyetDinh", label: "BIỂU MẪU QUYẾT ĐỊNH", icon: <NotebookIcon /> },
        { key: "vanPhong", label: "BIỂU MẪU VĂN PHÒNG", icon: <NotebookIcon /> },
        { key: "thanhToan", label: "BIỂU MẪU THANH TOÁN", icon: <NotebookIcon /> },
        { key: "hopDong", label: "BIỂU MẪU HỢP ĐỒNG", icon: <NotebookIcon /> },
        { key: "quyetToan", label: "BIỂU MẪU QUYẾT TOÁN", icon: <NotebookIcon /> },
        { key: "nghiPhep", label: "BIỂU MẪU ĐƠN NGHỈ PHÉP", icon: <NotebookIcon /> },
        { key: "chiPhi", label: "BIỂU MẪU ĐỀ XUẤT CHI PHÍ", icon: <NotebookIcon /> },
        { key: "muaSam", label: "BIỂU MẪU ĐỀ XUẤT MUA SẮM", icon: <NotebookIcon /> },
    ];

    // Helper to get current label for header
    const currentLabel = sidebarItems.find(item => item.key === activeTab)?.label || "Biểu mẫu tờ trình";

    // Convert to Sentence Case for Header if needed, or keep uppercase as in design. 
    // Design image shows "Biểu mẫu tờ trình" (Sentence case) in Header, but "BIỂU MẪU TỜ TRÌNH" in Sidebar.
    // Let's create a helper function to format it nicely.
    const formatHeaderTitle = (label) => {
        return label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
    };

    return (
        <PageWrap>
            <LayoutContainer>
                <Sidebar
                    items={sidebarItems}
                    activeKey={activeTab}
                    onChange={setActiveTab}
                />
                <ContentArea>
                    <Header>
                        <NotebookIcon />
                        <h3>{formatHeaderTitle(currentLabel)}</h3>
                    </Header>
                    {/* Render table for all tabs for now, as they share same structure */}
                    <DocumentTable />
                </ContentArea>
            </LayoutContainer>
        </PageWrap>
    );
};

export default BieuMauTaiLieuPage;
