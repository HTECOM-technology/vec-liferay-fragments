import { DatePicker } from "antd";
import styled from "styled-components";

export const StyledRangePicker = styled(DatePicker.RangePicker)`
  height: 36px;
  font-weight: 400;
  font-size: 13px;
  line-height: 20px;

  .ant-picker-input > input {
    font-size: 13px;
  }

  .ant-picker-suffix {
    color: rgba(0, 0, 0, 0.45);
  }

  &:disabled {
    color: #2d394b;
  }

  .ant-picker-suffix{
    display: none;
  }

`;
