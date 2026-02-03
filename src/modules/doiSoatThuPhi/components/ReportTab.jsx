import React from "react";
import ReportFilter from "./ReportFilter";
import ReportTable from "./ReportTable";
import TablePagination from "./TablePagination";

function ReportTab({
  initialValues,
  onSearch,
  dataSource,
  pagination = {},
}) {
  const { current = 1, pageSize = 10, total = 0, onChange } = pagination;

  return (
    <>
      <ReportFilter initialValues={initialValues} onSearch={onSearch} />
      <ReportTable dataSource={dataSource} />
      <TablePagination
        current={current}
        pageSize={pageSize}
        total={total}
        onChange={onChange}
      />
    </>
  );
}

export default ReportTab;
