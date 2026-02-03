import React, { useState } from "react";
import {
  PaginationWrap,
  LeftSection,
  CenterSection,
  RightSection,
  StyledPagination,
  StyledSelect,
  StyledInput,
} from "./style";

const defaultPageSizeOptions = [
  { value: 10, label: "10" },
  { value: 20, label: "20" },
  { value: 50, label: "50" },
  { value: 100, label: "100" },
];

const CPagination = React.memo(
  ({
    current = 1,
    pageSize = 10,
    total = 0,
    onChange,
    pageSizeOptions = defaultPageSizeOptions,
    showSizeChanger = true,
    showQuickJumper = true,
    size = "small",
    ...rest
  }) => {
    const [jumpPage, setJumpPage] = useState("");

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    const handlePageChange = (page, newSize) => {
      onChange?.(page, newSize ?? pageSize);
    };

    const handleSizeChange = (value) => {
      onChange?.(1, value);
    };

    const handleJump = () => {
      const page = parseInt(jumpPage, 10);
      if (!Number.isNaN(page) && page >= 1 && page <= totalPages) {
        onChange?.(page, pageSize);
        setJumpPage("");
      }
    };

    const handleJumpKeyDown = (e) => {
      if (e.key === "Enter") {
        handleJump();
      }
    };

    const options =
      typeof pageSizeOptions[0] === "object"
        ? pageSizeOptions
        : pageSizeOptions.map((opt) => ({ value: Number(opt), label: String(opt) + `/ ${total}` }));

    return (
      <PaginationWrap {...rest}>
        {showSizeChanger && (
          <LeftSection>
            <span className="pagination-label">Hiển thị</span>
            <StyledSelect
              value={pageSize}
              onChange={handleSizeChange}
              options={options}

              style={{ width: 134, marginLeft: 8, marginRight: 4 }}

            />
          </LeftSection>
        )}
        <CenterSection>
          <StyledPagination
            size={size}
            current={current}
            total={total}
            pageSize={pageSize}
            onChange={(page) => handlePageChange(page, pageSize)}
            showTotal={false}
            showSizeChanger={false}
            showQuickJumper={false}
            showLessItems
          />
        </CenterSection>
        {showQuickJumper && (
          <RightSection>
            <span className="pagination-label">Tới trang</span>
            <StyledInput
              min={1}
              max={totalPages}
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value)}
              onBlur={handleJump}
              placeholder={current}
              onKeyDown={handleJumpKeyDown}
              style={{ width: 56, marginLeft: 8 }}

            />
          </RightSection>
        )}
      </PaginationWrap>
    );
  }
);

CPagination.displayName = "CPagination";

export default CPagination;
