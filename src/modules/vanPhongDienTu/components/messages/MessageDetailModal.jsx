import React from "react";
import PropTypes from "prop-types";
import { MailOutlined, SendOutlined } from "@ant-design/icons";
import { Descriptions, Divider, Space } from "antd";
import { CButton, CModal } from "../../../../components/common";
import styled from "styled-components";

// Minimal custom styling - chỉ giữ những gì thực sự cần thiết
const ContentBody = styled.div`
    background: #fafafa;
    border: 1px solid #f0f0f0;
    border-radius: 4px;
    padding: 16px;
    margin: 16px 0;
    min-height: 200px;
    line-height: 1.8;

    p { margin: 0 0 12px 0; }
    img { max-width: 100%; height: auto; margin: 12px 0; }
    strong { color: #d4380d; font-weight: 600; }
    
    .image-gallery {
        display: flex;
        gap: 16px;
        margin: 16px 0;
        justify-content: center;
        flex-wrap: wrap;
        img { max-width: 45%; border-radius: 4px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); }
    }
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
                        <strong>CHÚC MỪNG SINH NHẬT</strong>
                    </p>
                    <p>
                        Đồng chí <strong>Phan Thị Thúy Linh</strong> - Chuyên viên Ban
                        TCNS
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
                            src="https://via.placeholder.com/250x200/ff6b6b/ffffff?text=Flowers"
                            alt="Birthday flowers"
                        />
                        <img
                            src="https://via.placeholder.com/250x200/4ecdc4/ffffff?text=Birthday+Cake"
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
        <CModal
            title={
                <Space>
                    <MailOutlined style={{ color: "#0090cf" }} />
                    {message.tieuDe}
                </Space>
            }
            open={visible}
            onCancel={onClose}
            footer={
                <div style={{ textAlign: "center" }}>
                    <CButton type="primary" icon={<SendOutlined />} onClick={handleReply}>
                        Trả lời
                    </CButton>
                </div>
            }
            width={800}
        >
            <Descriptions
                title="Thông tin chung"
                bordered
                column={1}
                size="middle"
                style={{ marginBottom: 16 }}
            >
                <Descriptions.Item label="Người gửi">{message.nguoiGui}</Descriptions.Item>
                <Descriptions.Item label="Người nhận">
                    {message.nguoiNhan || "ThanhvienCT"}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày gửi">
                    {message.ngayGuiFull || `Thứ sáu, ${message.ngay} - 09:02 AM`}
                </Descriptions.Item>
            </Descriptions>

            <Divider orientation="left">Nội dung</Divider>
            <ContentBody>{renderContent()}</ContentBody>
        </CModal>
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
