import { Button } from "antd";
import styled from "styled-components";

export const StyledButton = styled(Button)`
  height: 36px;
  font-weight: 400;
  font-size: 13px;
  line-height: 20px;
  border-radius: 4px;

  &:disabled {
    color: #2d394b;
  }
`;
