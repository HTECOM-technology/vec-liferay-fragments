import React from "react";
import { CPagination, CSelect } from "../../../../components/common";

const defaultPageSizeOptions = ["10", "12", "20", "50"];
const defaultLocale = { jump_to: "Tới trang", page: "Trang" };

function DocumentsPagination({
  current = 1,
  pageSize = 12,
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
    onChange: (p, size) => onChange?.(p, size || 12),
    showTotal: (t) => `Hiển thị ${pageSize} / ${t}`,
    locale,
    size: "small",
  };

  const sortOptions = [{ label: "Ngày tạo", value: "createdDate" }];

  const sortControl = (
    <div
      style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 16 }}
    >
      <span style={{ whiteSpace: "nowrap", color: "rgba(0,0,0,0.45)" }}>
        Sắp xếp theo
      </span>
      <CSelect
        defaultValue="createdDate"
        options={sortOptions}
        style={{ width: 120 }}
      />
    </div>
  );

  return (
    <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
      <CPagination {...config} renderBeforeQuickJumper={sortControl} />
    </div>
  );
}

export default DocumentsPagination;
