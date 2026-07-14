import React, { useRef, useState } from "react";
import { Table, Grid, Button, Empty, Modal, message, Spin } from "antd";
import { TableContainer, ActionButton, ActionsCell } from "../style";
import { ReactComponent as DownloadIcon } from "../../../assets/icon/download-icon.svg";
import { LuTrash2, LuUpload, LuEye } from "react-icons/lu";
import { getDocumentBlob } from "../../../services/documentService";
import mammoth from "mammoth";

const { useBreakpoint } = Grid;

const DOCX_MIME_TYPE = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const DocumentTable = ({ data, loading, onUpload, onDelete }) => {
    const screens = useBreakpoint();
    const fileInputRef = useRef(null);

    const currentUserId = Number(window.Liferay?.ThemeDisplay?.getUserId());

    // Preview State
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewUrl, setPreviewUrl] = useState("");
    const [previewType, setPreviewType] = useState("");
    const [previewTitle, setPreviewTitle] = useState("");
    const [previewLoading, setPreviewLoading] = useState(false);
    const [previewHtml, setPreviewHtml] = useState("");
    const [currentRecord, setCurrentRecord] = useState(null);

    const handlePreview = async (record) => {
        setPreviewLoading(true);
        setPreviewTitle(record.title);
        setPreviewHtml("");
        setCurrentRecord(record);

        if (!record.contentUrl) {
            console.warn("Tài liệu thiếu contentUrl, không thể xem trước:", record);
            message.error("Tài liệu này thiếu đường dẫn nội dung, không thể xem trước");
            setPreviewLoading(false);
            return;
        }

        try {
            const blob = await getDocumentBlob(record.contentUrl);
            const blobType = blob.type.toLowerCase();

            const actualType = record.encodingFormat?.toLowerCase() || blobType;

            const isMismatch =
                (actualType.startsWith("image/") ||
                    actualType === "application/pdf" ||
                    actualType === DOCX_MIME_TYPE) &&
                blobType.includes("text/html");

            if (isMismatch) {
                const text = await blob.text();
                console.warn("Server trả về HTML thay vì file thật:", text.slice(0, 500));
                message.error("Không thể tải file này, vui lòng thử lại hoặc liên hệ quản trị viên");
                setPreviewLoading(false);
                return;
            }

            if (actualType === DOCX_MIME_TYPE) {
                const arrayBuffer = await blob.arrayBuffer();
                const result = await mammoth.convertToHtml({ arrayBuffer });
                setPreviewHtml(result.value);
                setPreviewType(actualType);
                setPreviewVisible(true);
                setPreviewLoading(false);
                return;
            }

            const url = URL.createObjectURL(blob);
            setPreviewUrl(url);
            setPreviewType(actualType);
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
        setPreviewHtml("");
        setCurrentRecord(null);
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
            e.target.value = null;
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
            render: (_, record) => {
                const isOwner = record.creator?.id === currentUserId;

                return (
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
                                title={isOwner ? "Xóa" : ""}
                                onClick={() => isOwner && onDelete(record.id)}
                                style={{
                                    visibility: isOwner ? "visible" : "hidden",
                                    pointerEvents: isOwner ? "auto" : "none",
                                }}
                            >
                                <LuTrash2 />
                            </ActionButton>
                    </ActionsCell>
                );
            },
        },
    ];

    const renderPreviewContent = () => {
        if (previewType === DOCX_MIME_TYPE) {
            return (
                <div
                    style={{
                        maxHeight: "70vh",
                        overflowY: "auto",
                        padding: "16px 24px",
                        border: "1px solid #f0f0f0",
                        borderRadius: 6,
                    }}
                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                />
            );
        }
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
                <Button
                    type="primary"
                    onClick={() => {
                        if (currentRecord) {
                            handleDownload(currentRecord);
                        }
                    }}
                >
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
                width={previewType === "application/pdf" || previewType === DOCX_MIME_TYPE ? "80%" : 800}
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