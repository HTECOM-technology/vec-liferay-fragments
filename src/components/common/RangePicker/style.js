import { DatePicker } from "antd";
import styled from "styled-components";

export const StyledRangePicker = styled(DatePicker.RangePicker)`
  height: 36px;
  font-weight: 400;
  font-size: 13px;
  line-height: 20px;

  .ant-picker-input {
    width: 45%; 
    input {
      font-size: 13px;
      padding-left: 24px !important;
      background: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z' stroke='%238E8E93' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M16 2V6' stroke='%238E8E93' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M8 2V6' stroke='%238E8E93' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M3 10H21' stroke='%238E8E93' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat left center;
      background-size: 16px;
    }

    &:nth-of-type(3) {
      input {
        text-align: right;
        padding-left: 12px !important;
        background-position: right 90px center;
      }
    }
  }

  .ant-picker-range-separator {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    .ant-picker-separator {
        padding: 0;
    }
  }

  .ant-picker-suffix {
    display: none;
  }

  &:disabled {
    color: #2d394b;
  }
`;
