import React from "react";
import { StyledRangePicker } from "./style";

const CRangePicker = React.memo(({ id, onBlur, ...rest }) => {
  return <StyledRangePicker {...rest} separator={<>Đến</>} />;
});

export default CRangePicker;
