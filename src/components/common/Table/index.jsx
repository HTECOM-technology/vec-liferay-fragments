import React from "react";
import { StyledTable } from "./style";

const CTable = React.memo(({ id, onBlur, ...rest }) => {
  return <StyledTable {...rest} />;
});

export default CTable;
