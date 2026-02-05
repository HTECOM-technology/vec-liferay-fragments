import React, { useMemo } from "react";
import { CTable, CTag } from "../../../components/common";
import { TableWrap } from "../style";
import { TRAINING_STATUS_MAP, mockTrainingCourses } from "./constants";

function TrainingCoursesTable({ dataSource = mockTrainingCourses }) {
  const columns = useMemo(
    () => [
      { title: "Đơn vị", dataIndex: "donVi", key: "donVi", width: 80 },
      { title: "Ngày", dataIndex: "ngay", key: "ngay", width: 110 },
      { title: "Mã khóa học", dataIndex: "maKhoaHoc", key: "maKhoaHoc", width: 130 },
      { title: "Tên khóa học", dataIndex: "tenKhoaHoc", key: "tenKhoaHoc" },
      {
        title: "Thời gian dự kiến",
        dataIndex: "thoiGianDuKien",
        key: "thoiGianDuKien",
        width: 200,
      },
      {
        title: "Trạng thái",
        dataIndex: "trangThai",
        key: "trangThai",
        width: 140,
        render: (key) => {
          const s = TRAINING_STATUS_MAP[key];
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
      <CTable columns={columns} dataSource={dataWithIndex} pagination={false} size="small" scroll={{ x: 900, y: 470 }} />
    </TableWrap>
  );
}

export default TrainingCoursesTable;
