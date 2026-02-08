import React, { useMemo } from "react";
import { CTable, CTag } from "../../../components/common";
import { TableWrap } from "../style";
import { ATTENDANCE_STATUS_MAP, mockAttendanceRecords } from "./constants";

function AttendanceTable({ dataSource = mockAttendanceRecords }) {
  const columns = useMemo(
    () => [
      { title: "Ngày", dataIndex: "ngay", key: "ngay", width: 110 },
      { title: "Mã NV", dataIndex: "maNV", key: "maNV", width: 100 },
      { title: "Họ và tên", dataIndex: "hoVaTen", key: "hoVaTen", width: 150 },
      { title: "Chức vụ", dataIndex: "chucVu", key: "chucVu", width: 120 },
      { title: "Phòng ban", dataIndex: "phongBan", key: "phongBan", width: 120 },
      { title: "Đơn vị", dataIndex: "donVi", key: "donVi", width: 80 },
      { title: "Số thẻ", dataIndex: "soThe", key: "soThe", width: 100 },
      { title: "Thời gian", dataIndex: "thoiGian", key: "thoiGian", width: 180 },
      {
        title: "Trạng thái",
        dataIndex: "trangThai",
        key: "trangThai",
        width: 140,
        render: (key) => {
          const s = ATTENDANCE_STATUS_MAP[key];
          return s ? <CTag color={s.color}>{s.label}</CTag> : key;
        },
      },
    ],
    []
  );

  const dataWithIndex = dataSource.map((item, index) => ({
    ...item,
    stt: index + 1,
  }));

  return (
    <TableWrap>
      <CTable columns={columns} dataSource={dataWithIndex} pagination={{ pageSize: 16 }} size="small" scroll={{ x: 1100, y: 470 }} />
    </TableWrap>
  );
}

export default AttendanceTable;
