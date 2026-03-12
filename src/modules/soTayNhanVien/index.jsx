import React, { useState, useEffect, useCallback } from "react";
import { Grid, message, Modal } from "antd";
import Sidebar from "../../components/common/Sidebar";
import { DocumentTable } from "./components";
import { ContentArea, Header, LayoutContainer, PageWrap, MobileTabContainer, MobileTabItem } from "./style";
import { ReactComponent as NotebookIcon } from "../../assets/icon/notebook-icon.svg";
import { getFolders, getDocuments, uploadDocument, deleteDocument } from "../../services/documentService";
import { EMPLOYEE_HANDBOOK_GROUP_ID } from "../../utils/constants";

const { useBreakpoint } = Grid;

const SoTayNhanVienPage = () => {
    const [folders, setFolders] = useState([]);
    const [activeTab, setActiveTab] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const screens = useBreakpoint();

    // Fetch folders on mount
    useEffect(() => {
        const fetchFolders = async () => {
            try {
                const fetchedFolders = await getFolders(EMPLOYEE_HANDBOOK_GROUP_ID);
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
    }, []);

    // Fetch documents when activeTab changes
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

    // Handle File Upload
    const handleUpload = async (file) => {
        if (!activeTab) return;
        try {
            await uploadDocument(activeTab, file);
            message.success("Tải lên tài liệu thành công");
            fetchDocs(activeTab); // Refresh list
        } catch (error) {
            console.error("Error uploading document:", error);
            message.error("Tải lên tài liệu thất bại");
        }
    };

    // Handle File Delete
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

    // Mapping folders to sidebar items
    const sidebarItems = folders.map(folder => ({
        key: folder.id.toString(),
        label: folder.name.toUpperCase(),
        icon: <NotebookIcon />
    }));

    // Helper to get current label for header
    const currentLabel = folders.find(f => f.id.toString() === activeTab)?.name || "";

    const formatHeaderTitle = (label) => {
        if (!label) return "";
        // Convert to Sentence Case for Header
        return label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
    };

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
        </PageWrap>
    );
};

export default SoTayNhanVienPage;
