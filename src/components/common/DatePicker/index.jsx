import React from "react";
import { StyledDatePicker } from "./style";

const CDatePicker = React.memo(({ id, onBlur, ...rest }) => {
  return <StyledDatePicker {...rest} />;
});

export default CDatePicker;
