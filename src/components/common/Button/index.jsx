import React from "react";
import { StyledButton } from "./style";

const CButton = React.memo(({ id, children, onBlur, ...rest }) => {
  return <StyledButton {...rest}>{children}</StyledButton>;
});

export default CButton;
