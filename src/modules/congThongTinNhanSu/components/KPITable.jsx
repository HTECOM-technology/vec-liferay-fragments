import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { CTable, CTag } from "../../../components/common";
import { TableWrap } from "../style";
import { mockKPIData, KPI_STATUS_OPTIONS } from "./constants";

function KPITable({ dataSource = mockKPIData, onView }) {

    const columns = useMemo(
        () => [
            { title: "Kỳ", dataIndex: "ky", key: "ky", width: 100 },
            { title: "Mã NV", dataIndex: "maNV", key: "maNV", width: 100 },
            { title: "Họ và tên", dataIndex: "hoTen", key: "hoTen", width: 150, fontWeight: 500 },
            { title: "Chức vụ", dataIndex: "chucVu", key: "chucVu", width: 120 },
            { title: "Phòng ban", dataIndex: "phongBan", key: "phongBan", width: 120 },
            { title: "Tự đánh giá", dataIndex: "tuDanhGia", key: "tuDanhGia", width: 100, align: "center" },
            { title: "Ban đánh giá", dataIndex: "banDanhGia", key: "banDanhGia", width: 120, align: "center" },
            { title: "Xếp loại", dataIndex: "xepLoai", key: "xepLoai", width: 100, align: "center" },
            { title: "Ngày đánh giá", dataIndex: "ngayDanhGia", key: "ngayDanhGia", width: 120 },
            { title: "Diễn giải", dataIndex: "dienGiai", key: "dienGiai", width: 150 },
            {
                title: "Trạng thái",
                dataIndex: "trangThai",
                key: "trangThai",
                width: 140,
                render: (key) => {
                    // Mapping from status value to label and color
                    const status = KPI_STATUS_OPTIONS.find(opt => opt.value === key);
                    return status ? <CTag color={status.color}>{status.label}</CTag> : key;
                },
            },
        ],
        []
    );

    return (
        <TableWrap>
            <CTable
                columns={columns}
                dataSource={dataSource}
                rowKey="id"
                scroll={{ x: 1300 }}
                pagination={false}
                size="small"
            />
        </TableWrap>
    );
}


KPITable.propTypes = {
    dataSource: PropTypes.array,
    onView: PropTypes.func,
};

export default KPITable;