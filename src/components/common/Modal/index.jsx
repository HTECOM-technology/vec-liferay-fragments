import React from "react";
import { CloseOutlined } from "@ant-design/icons";
import { StyledModal } from "./style";

export const CModal = React.memo(({ id, children, onBlur, closable = true, closeIcon, ...rest }) => {
  return (
    <StyledModal 
      {...rest} 
      closable={closable} 
      closeIcon={closable ? (closeIcon || <CloseOutlined style={{ color: "#1E1E1E !important" }} />) : null}
    >
      {children}
    </StyledModal>
  );
});
