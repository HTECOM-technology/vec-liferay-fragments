import React, {useState} from "react";
import Sidebar from "../../components/common/Sidebar";
import {DocumentTable} from "./components";
import {ContentArea, Header, LayoutContainer, PageWrap} from "./style";
import {ReactComponent as NotebookIcon} from "../../assets/icon/notebook-icon.svg";


const SoTayNhanVienPage = () => {
    const [activeTab, setActiveTab] = useState("taiLieu");

    const sidebarItems = [
        { key: "taiLieu", label: "TÀI LIỆU HƯỚNG DẪN", icon: <NotebookIcon /> },
        { key: "noiQuy", label: "NỘI QUY", icon: <NotebookIcon /> },
        { key: "quyChe", label: "QUY CHẾ", icon: <NotebookIcon /> },
        { key: "chinhSach", label: "CHÍNH SÁCH PHÚC LỢI", icon: <NotebookIcon /> },
    ];

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
                        <h3>Tài liệu hướng dẫn</h3>
                    </Header>
                    {activeTab === "taiLieu" ? (
                        <DocumentTable />
                    ) : (
                        <div style={{ padding: 20 }}>Đang cập nhật nội dung...</div>
                    )}
                </ContentArea>
            </LayoutContainer>
        </PageWrap>
    );
};

export default SoTayNhanVienPage;
