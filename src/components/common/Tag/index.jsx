import React from "react";
import { StyledTag } from "./style";

const CTag = React.memo(({ id, children, onBlur, ...rest }) => {
  return <StyledTag {...rest}>{children}</StyledTag>;
});

export default CTag;
