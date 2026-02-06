import React from "react";
import PropTypes from "prop-types";
import { MailOutlined, SendOutlined } from "@ant-design/icons";
import { CButton, CModal } from "../../../../components/common";
import styled from "styled-components";

// Custom styling for modal content
const ContentBody = styled.div`
  text-align: center;
  padding: 16px 0;

  .title-highlight {
    color: #d32f2f;
    font-weight: 600;
  }

  .image-gallery {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin: 16px 0;
    flex-wrap: wrap;

    img {
      max-width: 200px;
      height: auto;
      border-radius: 4px;
    }
  }

  p {
    margin-bottom: 8px;
  }
`;

// Custom styled CModal for this component
const StyledCModal = styled(CModal)`
  &.ant-modal {
    max-width: 800px;
  }

  .ant-modal-title {
    width: 95%;
    overflow: hidden;
  }

  .ant-modal-body {
    margin: 16px 0;
    padding: 16px 0;
    border: 1px solid #0090cf33;
    border-radius: 8px;
  }

  .ant-modal-footer {
    padding: 16px 24px;
    border-top: 1px solid #f0f0f0;
  }
`;

const InfoSection = styled.div`
  border-bottom: 1px solid #0090cf33;

  .info-title {
    font-weight: 600;
    font-size: 15px;
    color: #1e1e1e;
    padding: 0 16px 12px;
    border-bottom: 1px solid #0090cf33;
    margin-bottom: 8px;
  }

  .info-row {
    display: flex;
    padding: 6px 16px;
  }

  .info-label {
    font-weight: 600;
    color: #1e1e1e;
    min-width: 140px;
    flex-shrink: 0;
  }

  .info-value {
    color: #333;
  }
`;

const ModalTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 100%;
  min-width: 0;

  .anticon-mail {
    color: #0090cf;
    flex-shrink: 0;
  }

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
  }
`;

const ModalFooter = styled.div`
  text-align: center;
`;

function MessageDetailModal({ visible, message, onClose, onReply }) {
  if (!message) return null;

  // Hàm render nội dung HTML (có thể chứa HTML từ backend)
  const renderContent = () => {
    // Nếu message có content HTML, render nó
    if (message.contentHtml) {
      return (
        <div
          className="content-body"
          dangerouslySetInnerHTML={{ __html: message.contentHtml }}
        />
      );
    }

    // Nếu không có, render default content (demo)
    return (
      <>
        <div className="content-body">
          <p>Tổng công ty Đầu tư phát triển đường cao tốc Việt Nam</p>
          <p>-----------***********----------</p>
          <p>
            <span className="title-highlight">CHÚC MỪNG SINH NHẬT</span>
          </p>
          <p>
            Đồng chí <strong>Phan Thị Thúy Linh</strong> - Chuyên viên Ban TCNS
          </p>
          <p>Sinh ngày 9/1</p>
          <p>
            Đồng chí <strong>Bùi Minh Phương</strong> - Chuyên viên Ban TCNS
          </p>
          <p>
            Đồng chí <strong>Nguyễn Hồng Sơn</strong> - Chuyên viên Ban TCKT
          </p>
          <p>Sinh ngày 10/1</p>
          <div className="image-gallery">
            <img
              src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=300&fit=crop"
              alt="Birthday flowers"
            />
            <img
              src="https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=400&h=300&fit=crop"
              alt="Birthday cake"
            />
          </div>
          <p>
            Chúc đồng chí luôn vui vẻ mạnh khỏe, hạnh phúc và thành công !!!
          </p>
        </div>
      </>
    );
  };

  const handleReply = () => {
    if (onReply) {
      onReply(message);
    }
    onClose();
  };

  return (
    <StyledCModal
      title={
        <ModalTitle>
          <MailOutlined />
          <span>{message.tieuDe}</span>
        </ModalTitle>
      }
      open={visible}
      onCancel={onClose}
      footer={
        <ModalFooter>
          <CButton type="primary" icon={<SendOutlined />} onClick={handleReply}>
            Trả lời
          </CButton>
        </ModalFooter>
      }
      width="90%"
    >
      <InfoSection>
        <div className="info-title">Thông tin chung</div>
        <div className="info-row">
          <span className="info-label">Người gửi</span>
          <span className="info-value">{message.nguoiGui}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Người nhận</span>
          <span className="info-value">
            {message.nguoiNhan || "ThanhvienCT"}
          </span>
        </div>
        <div className="info-row">
          <span className="info-label">Ngày gửi</span>
          <span className="info-value">
            {message.ngayGuiFull || `Thứ sáu, ${message.ngay} - 09:02 AM`}
          </span>
        </div>
      </InfoSection>

      <ContentBody>{renderContent()}</ContentBody>
    </StyledCModal>
  );
}

MessageDetailModal.propTypes = {
  visible: PropTypes.bool,
  message: PropTypes.shape({
    tieuDe: PropTypes.string,
    nguoiGui: PropTypes.string,
    nguoiNhan: PropTypes.string,
    ngay: PropTypes.string,
    ngayGuiFull: PropTypes.string,
    contentHtml: PropTypes.string,
  }),
  onClose: PropTypes.func,
  onReply: PropTypes.func,
};

MessageDetailModal.defaultProps = {
  visible: false,
  message: null,
  onClose: () => {},
  onReply: null,
};

export default MessageDetailModal;
