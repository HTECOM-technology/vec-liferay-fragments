import React from "react";
import { CTablePagination } from "../../../../components/common";

function MessagesPagination({
  current = 1,
  pageSize = 16,
  total = 5709,
  onChange,
}) {
  return (
    <CTablePagination
      current={current}
      pageSize={pageSize}
      total={total}
      onChange={onChange}
      pageSizeOptions={["10", "16", "20", "50"]}
    />
  );
}

export default MessagesPagination;
