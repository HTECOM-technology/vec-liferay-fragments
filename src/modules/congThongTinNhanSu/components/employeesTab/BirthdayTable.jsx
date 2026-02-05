import React from "react";
import PropTypes from "prop-types";
import { Table, Select } from "antd";
import {
    BirthdayTableContainer,
    BirthdayHeaderRow,
    BirthdayTitle,
    BirthdayFilterSelect,
} from "./styleNhanSu";

const MONTH_OPTIONS = [
    { value: 1, label: "Tháng 1" },
    { value: 2, label: "Tháng 2" },
    { value: 3, label: "Tháng 3" },
    { value: 4, label: "Tháng 4" },
    { value: 5, label: "Tháng 5" },
    { value: 6, label: "Tháng 6" },
    { value: 7, label: "Tháng 7" },
    { value: 8, label: "Tháng 8" },
    { value: 9, label: "Tháng 9" },
    { value: 10, label: "Tháng 10" },
    { value: 11, label: "Tháng 11" },
    { value: 12, label: "Tháng 12" },
];

function BirthdayTable({
    data,
    loading,
    selectedMonth,
    onMonthChange,
    onEmployeeClick,
}) {
    const columns = [
        {
            title: "STT",
            dataIndex: "stt",
            key: "stt",
            width: 60,
            align: "center",
            render: (_, __, index) => index + 1,
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
            title: "Ngày sinh",
            dataIndex: "ngaySinh",
            key: "ngaySinh",
            width: 120,
            align: "center",
        },
        {
            title: "Chức vụ",
            dataIndex: "chucVu",
            key: "chucVu",
            width: 200,
            align: "center",
        },
        {
            title: "Phòng ban",
            dataIndex: "phongBan",
            key: "phongBan",
            width: 250,
            align: "center",
        },
    ];

    return (
        <>
            <BirthdayHeaderRow>
                <BirthdayTitle>Danh sách sinh nhật ({data.length})</BirthdayTitle>
                <BirthdayFilterSelect>
                    <Select
                        value={selectedMonth}
                        onChange={onMonthChange}
                        options={MONTH_OPTIONS}
                        style={{ width: 120 }}
                    />
                </BirthdayFilterSelect>
            </BirthdayHeaderRow>

            <BirthdayTableContainer>
                <Table
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                    pagination={false}
                    rowKey="maNV"
                    scroll={{ x: 900 }}
                />
            </BirthdayTableContainer>
        </>
    );
}

BirthdayTable.propTypes = {
    data: PropTypes.array,
    loading: PropTypes.bool,
    selectedMonth: PropTypes.number,
    onMonthChange: PropTypes.func,
    onEmployeeClick: PropTypes.func,
};

BirthdayTable.defaultProps = {
    data: [],
    loading: false,
    selectedMonth: 1,
    onMonthChange: () => { },
    onEmployeeClick: () => { },
};

export default BirthdayTable;
