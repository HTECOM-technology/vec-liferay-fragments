import React from "react";
import { CloseOutlined } from "@ant-design/icons";
import { StyledModal } from "./style";

export const CModal = React.memo(({ id, children, onBlur, ...rest }) => {
  return (
    <StyledModal {...rest} closable closeIcon={rest.closeIcon || <CloseOutlined style={{ color: "#1E1E1E !important" }} />}>
      {children}
    </StyledModal>
  );
});
