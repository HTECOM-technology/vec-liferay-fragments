import React from "react";
import PropTypes from "prop-types";
import { CTablePagination } from "../../../components/common";
import DataReconciliationFilter from "./DataReconciliationFilter";
import DataReconciliationTable from "./DataReconciliationTable";

function DataReconciliationTab({
  initialValues,
  onSearch,
  dataSource,
  onView,
  pagination = {},
}) {
  const { current = 1, pageSize = 10, total = 0, onChange } = pagination;

  return (
    <>
      <DataReconciliationFilter initialValues={initialValues} onSearch={onSearch} />
      <DataReconciliationTable dataSource={dataSource} onView={onView} />
      <CTablePagination
        current={current}
        pageSize={pageSize}
        total={total}
        onChange={onChange}
      />
    </>
  );
}


DataReconciliationTab.propTypes = {
  initialValues: PropTypes.object,
  onSearch: PropTypes.func,
  dataSource: PropTypes.array,
  onView: PropTypes.func,
  pagination: PropTypes.object,
};

export default DataReconciliationTab;
