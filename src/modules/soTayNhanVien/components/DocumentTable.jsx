import React, { useRef } from "react";
import { Table, Grid, Button, Empty } from "antd";
import { TableContainer, ActionButton, ActionsCell } from "../style";
import { ReactComponent as EyeIcon } from "../../../assets/icon/eye-icon.svg";
import { ReactComponent as DownloadIcon } from "../../../assets/icon/download-icon.svg";
import { LuTrash2, LuUpload, LuEye } from "react-icons/lu";

const { useBreakpoint } = Grid;

const DocumentTable = ({ data, loading, onUpload, onDelete }) => {
    const screens = useBreakpoint();
    const fileInputRef = useRef(null);

    const handleDownload = (record) => {
        const downloadUrl = `${window.location.origin}${record.contentUrl}`;
        window.open(downloadUrl, "_blank");
    };

    const handleView = (record) => {
        const viewUrl = `${window.location.origin}${record.contentUrl}`;
        window.open(viewUrl, "_blank");
    };

    const handlePreview = (record) => {
        const previewUrl = `${window.location.origin}${record.contentUrl}`;
        window.open(previewUrl, "_blank");
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
            width: screens.md ? 220 : 150,
            align: "center",
            render: (_, record) => (
                <ActionsCell>
                    {screens.md && (
                        <ActionButton 
                            className="view-btn" 
                            title="Xem"
                            onClick={() => handleView(record)}
                        >
                            <EyeIcon />
                        </ActionButton>
                    )}
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
        </TableContainer>
    );
};

export default DocumentTable;
