import React from "react";
import { CPagination } from "../../../components/common";
import { PaginationWrap } from "../style";

const defaultPageSizeOptions = ["10", "20", "50", "100"];
const defaultLocale = { jump_to: "Tới trang", page: "Trang" };

function TablePagination({
  current = 1,
  pageSize = 10,
  total = 0,
  onChange,
  pageSizeOptions = defaultPageSizeOptions,
  locale = defaultLocale,
}) {
  const config = {
    current,
    pageSize,
    total,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions,
    onChange: (p, size) => onChange?.(p, size || 10),
    showTotal: (t) => `Hiển thị ${pageSize} / ${t}`,
    locale,
    size: 'small',
  };

  return (
    <PaginationWrap>
      <CPagination {...config} />
    </PaginationWrap>
  );
}

export default TablePagination;
