import styled from "styled-components";
import { Modal } from "antd";

export const StyledModal = styled(Modal)`
  .ant-modal-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 24px;
    background: rgba(229, 247, 255, 1);
    color: rgba(30, 30, 30, 1);
    margin: -20px -24px 0;
    border-radius: 8px 8px 0 0;
    border-bottom: 1px solid rgba(0, 144, 207, 0.2);

    font-size: 16px;
    font-weight: 600;
    flex: 1;
    .header-title {
    }
  }
  .ant-modal-close-icon {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.45);
  }
`;
