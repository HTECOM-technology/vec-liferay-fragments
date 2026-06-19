import React, { useState, useEffect, useCallback } from "react";
import { Grid, message, Modal, Tabs } from "antd";
import Sidebar from "../../components/common/Sidebar";
import { DocumentTable } from "./components";
import { ContentArea, Header, LayoutContainer, PageWrap, MobileTabContainer, MobileTabItem } from "./style";
import { ReactComponent as NotebookIcon } from "../../assets/icon/notebook-icon.svg";
import { getFolders, getDocuments, uploadDocument, deleteDocument } from "../../services/documentService";
import { DOCUMENT_FORM_GROUP_ID, EMPLOYEE_HANDBOOK_GROUP_ID } from "../../utils/constants";

const { useBreakpoint } = Grid;

// Component dùng chung cho cả 2 tab, chỉ khác groupId
function DocumentSection({ groupId }) {
    const [folders, setFolders] = useState([]);
    const [activeTab, setActiveTab] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const screens = useBreakpoint();

    useEffect(() => {
        const fetchFolders = async () => {
            try {
                const fetchedFolders = await getFolders(groupId);
                setFolders(fetchedFolders);
                if (fetchedFolders.length > 0) {
                    setActiveTab(fetchedFolders[0].id.toString());
                }
            } catch (error) {
                console.error("Error fetching folders:", error);
                message.error("Không thể tải danh sách thư mục");
            }
        };
        fetchFolders();
    }, [groupId]);

    const fetchDocs = useCallback(async (folderId) => {
        if (!folderId) return;
        setLoading(true);
        try {
            const fetchedDocs = await getDocuments(folderId);
            setDocuments(fetchedDocs);
        } catch (error) {
            console.error("Error fetching documents:", error);
            message.error("Không thể tải danh sách tài liệu");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (activeTab) {
            fetchDocs(activeTab);
        }
    }, [activeTab, fetchDocs]);

    const handleUpload = async (file) => {
        if (!activeTab) return;
        try {
            await uploadDocument(activeTab, file);
            message.success("Tải lên tài liệu thành công");
            fetchDocs(activeTab);
        } catch (error) {
            console.error("Error uploading document:", error);
            message.error("Tải lên tài liệu thất bại");
        }
    };

    const handleDelete = (docId) => {
        Modal.confirm({
            title: "Xác nhận xóa",
            content: "Bạn có chắc chắn muốn xóa tài liệu này không?",
            okText: "Xóa",
            okType: "danger",
            cancelText: "Hủy",
            onOk: async () => {
                try {
                    await deleteDocument(docId);
                    message.success("Xóa tài liệu thành công");
                    fetchDocs(activeTab);
                } catch (error) {
                    console.error("Error deleting document:", error);
                    message.error("Xóa tài liệu thất bại");
                }
            },
        });
    };

    const sidebarItems = folders.map(folder => ({
        key: folder.id.toString(),
        label: folder.name.toUpperCase(),
        icon: <NotebookIcon />
    }));

    const currentLabel = folders.find(f => f.id.toString() === activeTab)?.name || "";

    const formatHeaderTitle = (label) => {
        if (!label) return "";
        return label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
    };

    return (
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
                    <h3>{formatHeaderTitle(currentLabel)}</h3>
                </Header>
                <DocumentTable
                    data={documents}
                    loading={loading}
                    onUpload={handleUpload}
                    onDelete={handleDelete}
                />
            </ContentArea>
        </LayoutContainer>
    );
}

const TAB_ITEMS = [
    {
        key: "bieu-mau",
        label: "Biểu mẫu",
        children: <DocumentSection groupId={DOCUMENT_FORM_GROUP_ID} />,
    },
    {
        key: "so-tay-nhan-vien",
        label: "Sổ tay nhân viên",
        children: <DocumentSection groupId={EMPLOYEE_HANDBOOK_GROUP_ID} />,
    },
];

const BieuMauTaiLieuPage = () => {
    const screens = useBreakpoint();

    return (
        <PageWrap>
            <Tabs
                items={TAB_ITEMS}
                style={{ padding: screens.md ? "0 12px" : "0 8px" }}
            />
        </PageWrap>
    );
};

export default BieuMauTaiLieuPage;
