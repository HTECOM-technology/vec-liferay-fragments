import React from "react";
import { CPagination } from "../../../../components/common";

const defaultPageSizeOptions = ["10", "16", "20", "50"];
const defaultLocale = { jump_to: "Tới trang", page: "Trang" };

function EventsPagination({
  current = 1,
  pageSize = 16,
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
    onChange: (p, size) => onChange?.(p, size || 16),
    showTotal: (t) => `Hiển thị ${pageSize} / ${t}`,
    locale,
    size: 'small',
  };

  return (
    <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <CPagination {...config} />
    </div>
  );
}

export default EventsPagination;
