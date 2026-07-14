import PropTypes from "prop-types";
import { Modal, Spin } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import styled from "styled-components";

const ModalHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 24px;
    background: rgba(229, 247, 255, 1);
    color: rgba(30, 30, 30, 1);
    margin: -20px -24px 0;
    border-radius: 8px 8px 0 0;
    border-bottom: 1px solid rgba(0, 144, 207, 0.2);

    .header-icon {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 144, 207, 1);
        border-radius: 4px;
        color: #fff;
    }

    .header-title {
        font-size: 16px;
        font-weight: 600;
        flex: 1;
    }

    .header-close {
        cursor: pointer;
        font-size: 16px;
        opacity: 0.8;
        transition: opacity 0.2s;

        &:hover {
            opacity: 1;
        }
    }
`;

const ModalBody = styled.div`
    padding: 20px 0 4px;
    max-height: 60vh;
    overflow-y: auto;
`;

const OptionBlock = styled.div`
    margin-bottom: 16px;
    border: 1px solid rgba(229, 231, 235, 1);
    border-radius: 8px;
    overflow: hidden;

    &:last-child {
        margin-bottom: 0;
    }
`;

const OptionHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 10px 16px;
    background: rgba(249, 250, 251, 1);
    font-size: 14px;
    font-weight: 600;
    color: rgba(30, 30, 30, 1);

    .option-count {
        font-weight: 500;
        color: rgba(0, 144, 207, 1);
        white-space: nowrap;
    }
`;

const VoterRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 8px 16px;
    border-top: 1px solid rgba(243, 244, 246, 1);
    font-size: 14px;
    color: rgba(30, 30, 30, 0.88);

    .voter-unit {
        color: rgba(107, 114, 128, 1);
        font-size: 13px;
        text-align: right;
    }
`;

const EmptyText = styled.div`
    padding: 12px 16px;
    border-top: 1px solid rgba(243, 244, 246, 1);
    color: rgba(107, 114, 128, 1);
    font-size: 13px;
`;

const ResultsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 20V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M10 20V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M16 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M2 20H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

function SurveyResultsModal({ visible, loading, title, options, onClose }) {
    return (
        <Modal open={visible} onCancel={onClose} footer={null} width={640} closable={false} centered>
            <ModalHeader>
                <div className="header-icon">
                    <ResultsIcon />
                </div>
                <span className="header-title">Kết quả bình chọn{title ? `: ${title}` : ""}</span>
                <CloseOutlined className="header-close" onClick={onClose} />
            </ModalHeader>

            <ModalBody>
                {loading ? (
                    <div style={{ textAlign: "center", padding: "32px 0" }}>
                        <Spin />
                    </div>
                ) : (
                    options.map((option) => (
                        <OptionBlock key={option.id}>
                            <OptionHeader>
                                <span>{option.name}</span>
                                <span className="option-count">{option.votes} lượt bình chọn</span>
                            </OptionHeader>
                            {option.voters.length === 0 ? (
                                <EmptyText>Chưa có ai bình chọn phương án này</EmptyText>
                            ) : (
                                option.voters.map((voter) => (
                                    <VoterRow key={`${option.id}-${voter.userId}`}>
                                        <span>{voter.userName}</span>
                                        <span className="voter-unit">
                                            {voter.departmentName || voter.organizationName}
                                        </span>
                                    </VoterRow>
                                ))
                            )}
                        </OptionBlock>
                    ))
                )}
            </ModalBody>
        </Modal>
    );
}

SurveyResultsModal.propTypes = {
    visible: PropTypes.bool,
    loading: PropTypes.bool,
    title: PropTypes.string,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            name: PropTypes.string.isRequired,
            votes: PropTypes.number,
            voters: PropTypes.arrayOf(
                PropTypes.shape({
                    userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                    userName: PropTypes.string,
                    departmentName: PropTypes.string,
                    organizationName: PropTypes.string,
                })
            ),
        })
    ),
    onClose: PropTypes.func,
};

SurveyResultsModal.defaultProps = {
    visible: false,
    loading: false,
    title: "",
    options: [],
    onClose: () => { },
};

export default SurveyResultsModal;
