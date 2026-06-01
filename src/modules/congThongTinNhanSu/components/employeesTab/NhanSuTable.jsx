import React from "react";
import PropTypes from "prop-types";
import { Table, Select, Input } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import {
    TableContainer,
    PaginationContainer,
    PaginationInfo,
    PaginationNav,
    GoToPage,
} from "./styleNhanSu";

function NhanSuTable({
    data,
    loading,
    pagination,
    onPaginationChange,
    onPageSizeChange,
    onEmployeeClick,
}) {
    const columns = [
        {
            title: "Mã NV",
            dataIndex: "maNV",
            key: "maNV",
            width: 100,
        },
        {
            title: "Họ và tên",
            dataIndex: "hoTen",
            key: "hoTen",
            width: 180,
            render: (text, record) => (
                <span
                    className="employee-name"
                    onClick={() => onEmployeeClick && onEmployeeClick(record)}
                >
                    {text}
                </span>
            ),
        },
        {
            title: "Giới tính",
            dataIndex: "gioiTinh",
            key: "gioiTinh",
            width: 80,
            align: "center",
        },
        {
            title: "Chức vụ",
            dataIndex: "chucVu",
            key: "chucVu",
            width: 250,
            align: "center",
        },
        {
            title: "Phòng ban",
            dataIndex: "phongBan",
            key: "phongBan",
            width: 250,
            align: "center",
        },
        {
            title: "Đơn vị",
            dataIndex: "donVi",
            key: "donVi",
            width: 80,
            align: "center",
        },
        {
            title: "Ngày sinh",
            dataIndex: "ngaySinh",
            key: "ngaySinh",
            width: 120,
            align: "center",
        },
        {
            title: "Điện thoại",
            dataIndex: "dienThoai",
            key: "dienThoai",
            width: 130,
            align: "center",
            render: (text) => text || "-",
        },
        {
            title: "Tình trạng",
            dataIndex: "tinhTrang",
            key: "tinhTrang",
            width: 120,
            align: "center",
            render: (text) => <span className="status-tag">{text}</span>,
        },
    ];

    const { current, pageSize, total } = pagination;
    const totalPages = Math.ceil(total / pageSize);

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 6;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (current <= 4) {
                for (let i = 1; i <= 6; i++) {
                    pages.push(i);
                }
                pages.push("...");
                pages.push(totalPages);
            } else if (current >= totalPages - 3) {
                pages.push(1);
                pages.push("...");
                for (let i = totalPages - 5; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push("...");
                for (let i = current - 1; i <= current + 1; i++) {
                    pages.push(i);
                }
                pages.push("...");
                pages.push(totalPages);
            }
        }

        return pages;
    };

    return (
        <>
            <TableContainer>
                <Table
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                    pagination={false}
                    rowKey="maNV"
                    scroll={{ x: 1200 }}
                />
            </TableContainer>

            <PaginationContainer>
                <PaginationInfo>
                    <span>Hiển thị</span>
                    <Select
                        value={pageSize}
                        onChange={onPageSizeChange}
                        options={[
                            { value: 10, label: "10 / " + total },
                            { value: 16, label: "16 / " + total },
                            { value: 20, label: "20 / " + total },
                            { value: 50, label: "50 / " + total },
                        ]}
                        style={{ width: 100 }}
                    />
                </PaginationInfo>

                <PaginationNav>
                    <button
                        className="page-btn"
                        onClick={() => onPaginationChange(current - 1)}
                        disabled={current === 1}
                    >
                        <LeftOutlined />
                    </button>

                    {renderPageNumbers().map((page, index) =>
                        page === "..." ? (
                            <span key={`ellipsis-${index}`} className="page-ellipsis">
                                ...
                            </span>
                        ) : (
                            <button
                                key={page}
                                className={`page-btn ${current === page ? "active" : ""}`}
                                onClick={() => onPaginationChange(page)}
                            >
                                {page}
                            </button>
                        )
                    )}

                    <button
                        className="page-btn"
                        onClick={() => onPaginationChange(current + 1)}
                        disabled={current === totalPages}
                    >
                        <RightOutlined />
                    </button>
                </PaginationNav>

                <GoToPage>
                    <span>Tới trang</span>
                    <Input
                        type="number"
                        min={1}
                        max={totalPages}
                        onPressEnter={(e) => {
                            const page = parseInt(e.target.value, 10);
                            if (page >= 1 && page <= totalPages) {
                                onPaginationChange(page);
                            }
                        }}
                    />
                </GoToPage>
            </PaginationContainer>
        </>
    );
}

NhanSuTable.propTypes = {
    data: PropTypes.array,
    loading: PropTypes.bool,
    pagination: PropTypes.shape({
        current: PropTypes.number,
        pageSize: PropTypes.number,
        total: PropTypes.number,
    }),
    onPaginationChange: PropTypes.func,
    onPageSizeChange: PropTypes.func,
    onEmployeeClick: PropTypes.func,
};

NhanSuTable.defaultProps = {
    data: [],
    loading: false,
    pagination: { current: 1, pageSize: 16, total: 0 },
    onPaginationChange: () => { },
    onPageSizeChange: () => { },
    onEmployeeClick: () => { },
};

export default NhanSuTable;
