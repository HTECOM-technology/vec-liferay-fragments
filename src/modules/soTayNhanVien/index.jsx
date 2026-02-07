import React, { useState } from "react";
import { Grid } from "antd";
import Sidebar from "../../components/common/Sidebar";
import { DocumentTable } from "./components";
import { ContentArea, Header, LayoutContainer, PageWrap, MobileTabContainer, MobileTabItem } from "./style";
import { ReactComponent as NotebookIcon } from "../../assets/icon/notebook-icon.svg";

const { useBreakpoint } = Grid;

const SoTayNhanVienPage = () => {
    const [activeTab, setActiveTab] = useState("taiLieu");
    const screens = useBreakpoint();

    const sidebarItems = [
        { key: "taiLieu", label: "TÀI LIỆU HƯỚNG DẪN", icon: <NotebookIcon /> },
        { key: "noiQuy", label: "NỘI QUY", icon: <NotebookIcon /> },
        { key: "quyChe", label: "QUY CHẾ", icon: <NotebookIcon /> },
        { key: "chinhSach", label: "CHÍNH SÁCH PHÚC LỢI", icon: <NotebookIcon /> },
    ];

    return (
        <PageWrap>
            <LayoutContainer>
                {screens.md ? (
                    <Sidebar
                        items={sidebarItems}
                        activeKey={activeTab}
                        onChange={setActiveTab}
                    />
                ) : (
                    <MobileTabContainer>
                        {sidebarItems.map(item => (
                            <MobileTabItem
                                key={item.key}
                                $active={activeTab === item.key}
                                onClick={() => setActiveTab(item.key)}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </MobileTabItem>
                        ))}
                    </MobileTabContainer>
                )}

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
