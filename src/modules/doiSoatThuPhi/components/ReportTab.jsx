import React from "react";
import PropTypes from "prop-types";
import { CTablePagination } from "../../../components/common";
import ReportFilter from "./ReportFilter";
import ReportTable from "./ReportTable";

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
      <CTablePagination
        current={current}
        pageSize={pageSize}
        total={total}
        onChange={onChange}
      />
    </>
  );
}


ReportTab.propTypes = {
  initialValues: PropTypes.object,
  onSearch: PropTypes.func,
  dataSource: PropTypes.array,
  pagination: PropTypes.object,
};

export default ReportTab;
