import React from "react";
import { Badge } from "antd";
import styled from "styled-components";

const TabLabelWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const StyledBadge = styled(Badge)`
  .ant-badge-count {
    background-color: #ff4d4f;
  }
`;

function TabLabel({ label, count, showBadge = true }) {
  if (!showBadge || count === null || count === undefined || count === 0) {
    return <span>{label}</span>;
  }

  return (
    <TabLabelWrapper>
      {label}
      <StyledBadge 
        count={count > 99 ? '99+' : count} 
        overflowCount={99}
      />
    </TabLabelWrapper>
  );
}

export default TabLabel;
