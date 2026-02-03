import { Select } from "antd";
import styled from "styled-components";

export const StyledSelect = styled(Select)`
  height: 36px;
  font-weight: 400;
  font-size: 13px;
  line-height: 20px;

  .ant-select-selector {
    height: 36px !important;
    padding: 4px 11px !important;
    border-radius: 4px;
  }

  .ant-select-selection-item,
  .ant-select-selection-placeholder {
    line-height: 26px !important;
  }

  &:disabled {
    color: #2d394b;
  }
`;
