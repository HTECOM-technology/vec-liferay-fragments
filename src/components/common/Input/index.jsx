import React from "react";
import { StyledInput } from "./style";

const CInput = React.memo(({ id, children, onBlur, ...rest }) => {
  return <StyledInput {...rest}>{children}</StyledInput>;
});

export default CInput;
