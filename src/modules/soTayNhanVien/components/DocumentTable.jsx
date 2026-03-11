import React, { useRef, useState } from "react";
import { Table, Grid, Button, Empty, Modal, message, Spin } from "antd";
import { TableContainer, ActionButton, ActionsCell } from "../style";
import { ReactComponent as EyeIcon } from "../../../assets/icon/eye-icon.svg";
import { ReactComponent as DownloadIcon } from "../../../assets/icon/download-icon.svg";
import { LuTrash2, LuUpload, LuEye } from "react-icons/lu";
import { getDocumentBlob } from "../../../services/documentService";

const { useBreakpoint } = Grid;

const DocumentTable = ({ data, loading, onUpload, onDelete }) => {
    const screens = useBreakpoint();
    const fileInputRef = useRef(null);
    
    // Preview State
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewUrl, setPreviewUrl] = useState("");
    const [previewType, setPreviewType] = useState("");
    const [previewTitle, setPreviewTitle] = useState("");
    const [previewLoading, setPreviewLoading] = useState(false);

    const handlePreview = async (record) => {
        setPreviewLoading(true);
        setPreviewTitle(record.title);
        
        try {
            const blob = await getDocumentBlob(record.contentUrl);
            const url = URL.createObjectURL(blob);
            const contentType = blob.type.toLowerCase();
            
            setPreviewUrl(url);
            setPreviewType(contentType);
            setPreviewVisible(true);
        } catch (error) {
            console.error("Error fetching document for preview:", error);
            message.error("Không thể mở bản xem trước cho tài liệu này");
        } finally {
            setPreviewLoading(false);
        }
    };

    const handleClosePreview = () => {
        setPreviewVisible(false);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl("");
        }
    };

    const handleDownload = (record) => {
        const downloadUrl = `${window.location.origin}${record.contentUrl}`;
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = record.title || "document";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const onFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onUpload(file);
            e.target.value = null; // Reset input
        }
    };

    const columns = [
        {
            title: "STT",
            key: "stt",
            width: screens.md ? 60 : 50,
            align: "center",
            render: (_, __, index) => index + 1,
        },
        {
            title: "Tên tài liệu",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "Hành động",
            key: "action",
            width: screens.md ? 180 : 120,
            align: "center",
            render: (_, record) => (
                <ActionsCell>
                    <ActionButton 
                        className="preview-btn" 
                        title="Xem trước"
                        onClick={() => handlePreview(record)}
                    >
                        <LuEye />
                    </ActionButton>
                    <ActionButton 
                        className="download-btn" 
                        title="Tải xuống"
                        onClick={() => handleDownload(record)}
                    >
                        <DownloadIcon />
                    </ActionButton>
                    <ActionButton 
                        className="delete-btn" 
                        title="Xóa"
                        onClick={() => onDelete(record.id)}
                    >
                        <LuTrash2 />
                    </ActionButton>
                </ActionsCell>
            ),
        },
    ];

    const renderPreviewContent = () => {
        if (previewType.startsWith("image/")) {
            return <img src={previewUrl} alt={previewTitle} style={{ width: "100%", height: "auto" }} />;
        }
        if (previewType === "application/pdf") {
            return (
                <iframe 
                    src={`${previewUrl}#toolbar=0`} 
                    title={previewTitle} 
                    style={{ width: "100%", height: "70vh", border: "none" }} 
                />
            );
        }
        return (
            <div style={{ padding: "40px 0", textAlign: "center" }}>
                <p>Định dạng file này (<b>{previewType}</b>) chưa hỗ trợ xem trực tiếp.</p>
                <Button type="primary" onClick={() => {
                    handleDownload({ contentUrl: previewUrl.replace(window.location.origin, ""), title: previewTitle });
                }}>
                    Tải về để xem
                </Button>
            </div>
        );
    };

    return (
        <TableContainer>
            <div className="table-actions">
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={onFileChange}
                />
                <Button 
                    type="primary" 
                    icon={<LuUpload />} 
                    onClick={() => fileInputRef.current.click()}
                    style={{ backgroundColor: "#0090cf" }}
                >
                    Tải lên tài liệu
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
                loading={loading}
                pagination={false}
                bordered
                size="middle"
                scroll={{ x: 'max-content' }}
                locale={{
                    emptyText: <Empty description="Không có tài liệu nào trong thư mục này" />
                }}
            />

            <Modal
                title={previewTitle}
                open={previewVisible}
                onCancel={handleClosePreview}
                footer={null}
                width={previewType === "application/pdf" ? "80%" : 800}
                centered
                destroyOnClose
            >
                <Spin spinning={previewLoading}>
                    {renderPreviewContent()}
                </Spin>
            </Modal>
        </TableContainer>
    );
};

export default DocumentTable;
