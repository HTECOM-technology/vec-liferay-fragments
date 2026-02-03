import React from "react";
import { StyledTabs } from "./style";

const CTabs = React.memo(({ id, onBlur, ...rest }) => {
  return <StyledTabs {...rest} />;
});

export default CTabs;
