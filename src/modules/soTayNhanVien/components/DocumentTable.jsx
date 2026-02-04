import React from "react";
import { Table } from "antd";
import { TableContainer, ActionButton, ActionsCell } from "../style";
import { ReactComponent as EyeIcon } from "../../../assets/icon/eye-icon.svg";
import { ReactComponent as DownloadIcon } from "../../../assets/icon/download-icon.svg";

const DocumentTable = () => {
    const columns = [
        {
            title: "STT",
            dataIndex: "stt",
            key: "stt",
            width: 60,
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
            width: 340,
            align: "center",
            render: (_, record) => (
                <ActionsCell>
                    <ActionButton className="view-btn" title="Xem">
                        <EyeIcon />
                    </ActionButton>
                    <ActionButton className="download-btn" title="Tải xuống">
                        <DownloadIcon />
                    </ActionButton>
                </ActionsCell>
            ),
        },
    ];

    const data = [
        { key: "1", stt: 1, name: "Hướng dẫn đổi Mật khẩu tài khoản tập trung" },
        { key: "2", stt: 2, name: "Hướng dẫn truy cập - Video" },
        { key: "3", stt: 3, name: "Hướng dẫn đăng ký nghỉ, vắng mặt - Video" },
        { key: "4", stt: 4, name: "Hướng dẫn đăng ký xác nhận công trong ngày - Video" },
        { key: "5", stt: 5, name: "Hướng dẫn đánh giá KPI - Video" },
        { key: "6", stt: 6, name: "Hướng dẫn xem thông tin nhân viên - Video" },
        { key: "7", stt: 7, name: "Hướng dẫn xem báo cáo nhân sự - Video" },
        { key: "8", stt: 8, name: "Hướng dẫn xem báo cáo chấm công - Video" },
        { key: "9", stt: 9, name: "Hướng dẫn đăng ký đào tạo - Video" },
        { key: "10", stt: 10, name: "Hướng dẫn làm bài thi đào tạo - Video" },
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
