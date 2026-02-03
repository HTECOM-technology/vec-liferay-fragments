import React from "react";
import { StyledSelect } from "./style";

const CSelect = React.memo(({ id, children, onBlur, ...rest }) => {
  return <StyledSelect {...rest}>{children}</StyledSelect>;
});

export default CSelect;
