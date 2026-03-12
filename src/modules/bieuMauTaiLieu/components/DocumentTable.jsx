import React from "react";
import { Table, Grid } from "antd";
import { TableContainer, ActionButton, ActionsCell } from "../style";
import { ReactComponent as EyeIcon } from "../../../assets/icon/eye-icon.svg";
import { ReactComponent as DownloadIcon } from "../../../assets/icon/download-icon.svg";
import { ReactComponent as EditIcon } from "../../../assets/icon/pen-icon.svg";
import { ReactComponent as DeleteIcon } from "../../../assets/icon/trash-icon.svg";
import {
    handleViewDocument,
    handleDownloadDocument,
    handleEditDocument,
    handleDeleteDocument,
} from "./documentActions";

const { useBreakpoint } = Grid;

const DocumentTable = () => {
    const screens = useBreakpoint();

    const columns = [
        {
            title: "STT",
            dataIndex: "stt",
            key: "stt",
            width: screens.md ? 60 : 50,
            align: "center",
        },
        {
            title: "Tên tài liệu",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Hành động",
            key: "action",
            width: screens.md ? 150 : 80,
            align: "center",
            render: (_, record) => (
                <ActionsCell>
                    {screens.md && (
                        <ActionButton
                            className="view-btn"
                            title="Xem"
                            onClick={() => handleViewDocument(record)}
                        >
                            <EyeIcon />
                        </ActionButton>
                    )}
                    <ActionButton
                        className="download-btn"
                        title="Tải xuống"
                        onClick={() => handleDownloadDocument(record)}
                    >
                        <DownloadIcon />
                    </ActionButton>
                    {screens.md && (
                        <ActionButton
                            className="edit-btn"
                            title="Chỉnh sửa"
                            onClick={() => handleEditDocument(record)}
                        >
                            <EditIcon />
                        </ActionButton>
                    )}
                    <ActionButton
                        className="delete-btn"
                        title="Xóa"
                        onClick={() => handleDeleteDocument(record)}
                    >
                        <DeleteIcon />
                    </ActionButton>
                </ActionsCell>
            ),
        },
    ];

    const data = [
        { key: "1", stt: 1, name: "Lorem ipsum dolor sit amet, consectetur adipiscing elit" },
        { key: "2", stt: 2, name: "Lorem ipsum dolor sit amet, consectetur adipiscing elit" },
        { key: "3", stt: 3, name: "Lorem ipsum dolor sit amet, consectetur adipiscing elit" },
        { key: "4", stt: 4, name: "Lorem ipsum dolor sit amet, consectetur adipiscing elit" },
        { key: "5", stt: 5, name: "Lorem ipsum dolor sit amet, consectetur adipiscing elit" },
        { key: "6", stt: 6, name: "Lorem ipsum dolor sit amet, consectetur adipiscing elit" },
        { key: "7", stt: 7, name: "Lorem ipsum dolor sit amet, consectetur adipiscing elit" },
        { key: "8", stt: 8, name: "Lorem ipsum dolor sit amet, consectetur adipiscing elit" },
        { key: "9", stt: 9, name: "Lorem ipsum dolor sit amet, consectetur adipiscing elit" },
        { key: "10", stt: 10, name: "Lorem ipsum dolor sit amet, consectetur adipiscing elit" },
    ];

    return (
        <TableContainer>
            <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                bordered
                size="middle"
            />
        </TableContainer>
    );
};

export default DocumentTable;
