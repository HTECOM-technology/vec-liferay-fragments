import { useState, useCallback, useEffect } from "react";
import { Modal } from "antd";
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
    padding: 20px 0;
`;

const OptionsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const OptionItem = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: ${(props) => (props.$selected ? "rgba(229, 247, 255, 1)" : "rgba(248, 249, 250, 1)")};
    border: 1px solid ${(props) => (props.$selected ? "rgba(0, 144, 207, 0.3)" : "transparent")};
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background: rgba(229, 247, 255, 0.5);
    }
`;

const OptionContent = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const OptionName = styled.span`
    font-size: 14px;
    font-weight: 500;
    color: rgba(30, 30, 30, 1);
`;

const VoteCount = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: rgba(107, 114, 128, 1);
`;

const RadioButton = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid ${(props) => (props.$selected ? "rgba(0, 144, 207, 1)" : "rgba(209, 213, 220, 1)")};
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;

    &::after {
        content: "";
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: ${(props) => (props.$selected ? "rgba(0, 144, 207, 1)" : "transparent")};
        transition: all 0.2s;
    }
`;

const SubmitButton = styled.button`
    display: block;
    width: 200px;
    height: 44px;
    margin: 24px auto 0;
    background: rgba(0, 144, 207, 1);
    color: #fff;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
        background: rgba(0, 123, 181, 1);
    }

    &:disabled {
        background: rgba(156, 163, 175, 1);
        cursor: not-allowed;
    }
`;

const VoteIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M6.63686 13.3564C6.47836 13.3351 6.2499 13.3333 5.8335 13.3333H5.41684C4.80402 13.3333 4.42824 13.3351 4.15629 13.3717C3.91725 13.4038 3.87733 13.4495 3.8726 13.4549C3.87242 13.4551 3.8723 13.4553 3.87221 13.4554C3.87212 13.4555 3.87197 13.4556 3.87177 13.4558C3.86635 13.4605 3.82064 13.5004 3.7885 13.7395C3.75194 14.0114 3.75017 14.3872 3.75017 15V17.5H6.66684V14.1667C6.66684 13.7503 6.66507 13.5218 6.64376 13.3633C6.64348 13.3612 6.6432 13.3592 6.64292 13.3572C6.64094 13.357 6.63892 13.3567 6.63686 13.3564ZM6.85894 11.7046C7.17827 11.7475 7.54267 11.8521 7.84535 12.1548C8.14803 12.4575 8.25263 12.8219 8.29556 13.1412C8.33365 13.4245 8.33358 13.7679 8.33351 14.1213C8.33351 14.1364 8.3335 14.1515 8.3335 14.1667V18.3333C8.3335 18.7936 7.96041 19.1667 7.50017 19.1667H2.91684C2.4566 19.1667 2.0835 18.7936 2.0835 18.3333V15C2.0835 14.9828 2.0835 14.9657 2.0835 14.9487C2.08345 14.4036 2.0834 13.9138 2.1367 13.5174C2.19489 13.0846 2.33 12.6406 2.6937 12.2769C3.0574 11.9132 3.50141 11.7781 3.93421 11.7199C4.33063 11.6666 4.82039 11.6666 5.3655 11.6667C5.38256 11.6667 5.39967 11.6667 5.41684 11.6667H5.8335C5.84863 11.6667 5.86375 11.6667 5.87884 11.6667C6.23223 11.6666 6.57567 11.6665 6.85894 11.7046Z" fill="white" />
    <path fillRule="evenodd" clipRule="evenodd" d="M14.1212 13.3333C14.1363 13.3333 14.1514 13.3333 14.1665 13.3333H14.5832C14.6003 13.3333 14.6175 13.3333 14.6345 13.3333C15.1796 13.3333 15.6694 13.3332 16.0658 13.3865C16.4986 13.4447 16.9426 13.5798 17.3063 13.9435C17.67 14.3072 17.8051 14.7512 17.8633 15.184C17.9166 15.5805 17.9166 16.0702 17.9165 16.6153C17.9165 16.6324 17.9165 16.6495 17.9165 16.6667V18.3333C17.9165 18.7936 17.5434 19.1667 17.0832 19.1667H12.4998C12.0396 19.1667 11.6665 18.7936 11.6665 18.3333V15.8333C11.6665 15.8182 11.6665 15.8031 11.6665 15.788C11.6664 15.4346 11.6664 15.0912 11.7045 14.8079C11.7474 14.4886 11.852 14.1242 12.1547 13.8215C12.4574 13.5188 12.8217 13.4142 13.1411 13.3713C13.4243 13.3332 13.7678 13.3333 14.1212 13.3333ZM13.3571 15.0239C13.3568 15.0259 13.3565 15.0279 13.3563 15.03C13.335 15.1885 13.3332 15.4169 13.3332 15.8333V17.5H16.2498V16.6667C16.2498 16.0539 16.2481 15.6781 16.2115 15.4061C16.1794 15.1671 16.1337 15.1272 16.1282 15.1224C16.128 15.1223 16.1279 15.1221 16.1278 15.122C16.1277 15.122 16.1276 15.1218 16.1274 15.1216C16.1227 15.1162 16.0828 15.0705 15.8437 15.0383C15.5718 15.0018 15.196 15 14.5832 15H14.1665C13.7501 15 13.5217 15.0018 13.3632 15.0231C13.3611 15.0234 13.3591 15.0236 13.3571 15.0239Z" fill="white" />
    <path fillRule="evenodd" clipRule="evenodd" d="M0.833496 18.3333C0.833496 17.8731 1.20659 17.5 1.66683 17.5H18.3335C18.7937 17.5 19.1668 17.8731 19.1668 18.3333C19.1668 18.7936 18.7937 19.1667 18.3335 19.1667H1.66683C1.20659 19.1667 0.833496 18.7936 0.833496 18.3333Z" fill="white" />
    <path d="M10.0518 10C10.5966 9.99995 11.0861 9.99949 11.4824 10.0527C11.9152 10.1109 12.3599 10.2467 12.7236 10.6104C13.0871 10.974 13.2221 11.4179 13.2803 11.8506C13.3336 12.247 13.3331 12.7371 13.333 13.2822V18.333C13.333 18.7932 12.9602 19.167 12.5 19.167H7.5C7.03977 19.167 6.66699 18.7932 6.66699 18.333V13.2822C6.66694 12.7371 6.66643 12.247 6.71973 11.8506C6.77792 11.4178 6.91367 10.974 7.27734 10.6104C7.64101 10.2468 8.08484 10.1109 8.51758 10.0527C8.91385 9.99949 9.40343 9.99995 9.94824 10H10.0518Z" fill="white" />
    <path d="M9.99846 1.04167C10.5584 1.04167 10.9334 1.46122 11.1357 1.87099L11.7156 3.04036L11.7204 3.04497C11.7244 3.0486 11.7291 3.05249 11.7343 3.05635C11.7395 3.06021 11.7446 3.06362 11.7493 3.06647L11.7562 3.07036L12.8022 3.24557C13.2523 3.32121 13.7421 3.56249 13.9077 4.08207C14.0731 4.60079 13.8146 5.08112 13.4916 5.40496L13.4908 5.4058L12.6776 6.22567C12.6748 6.23155 12.6711 6.24065 12.6678 6.25224C12.6641 6.26513 12.6624 6.27616 12.6618 6.28345L12.8946 7.29824C12.9996 7.75776 13.0097 8.39605 12.5142 8.76022C12.0162 9.1263 11.4094 8.92071 11.0051 8.67989L10.0245 8.09461L10.0183 8.09374C10.0129 8.09313 10.0067 8.09275 10.0001 8.09275C9.99353 8.09275 9.98724 8.09313 9.98157 8.09377C9.97787 8.09419 9.97478 8.09469 9.97234 8.09516L8.99308 8.67964C8.58733 8.92238 7.98197 9.12474 7.48457 8.7588C6.99029 8.39516 6.99747 7.75887 7.1033 7.2977L7.33594 6.28345C7.33534 6.27616 7.33361 6.26513 7.32995 6.25224C7.32666 6.24065 7.32294 6.23155 7.3201 6.22567L6.50546 5.40429C6.18441 5.08059 5.92695 4.6009 6.09091 4.0832C6.25563 3.56312 6.74511 3.32127 7.19591 3.24551L8.23825 3.0709L8.24418 3.0675C8.24895 3.06461 8.25412 3.06115 8.25938 3.05722C8.26464 3.05329 8.2694 3.04932 8.27348 3.0456L8.27871 3.04057L8.85901 1.87039L8.85959 1.86923C9.06348 1.46021 9.43941 1.04167 9.99846 1.04167Z" fill="white" />
  </svg>
);

const PeopleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.0832 7.08333C17.0832 8.23393 16.1504 9.16667 14.9998 9.16667C13.8492 9.16667 12.9165 8.23393 12.9165 7.08333C12.9165 5.93274 13.8492 5 14.9998 5C16.1504 5 17.0832 5.93274 17.0832 7.08333Z" fill="#6B7280" fillOpacity="0.2" />
    <path d="M7.08317 7.08333C7.08317 8.23393 6.15043 9.16667 4.99984 9.16667C3.84924 9.16667 2.9165 8.23393 2.9165 7.08333C2.9165 5.93274 3.84924 5 4.99984 5C6.15043 5 7.08317 5.93274 7.08317 7.08333Z" fill="#6B7280" fillOpacity="0.2" />
    <path d="M2.98667 11.605C2.13518 12.0438 -0.0973493 12.9397 1.26241 14.0608C1.92665 14.6084 2.66643 15 3.59652 15H8.90381C9.83389 15 10.5737 14.6084 11.2379 14.0608C12.5977 12.9397 10.3651 12.0438 9.51366 11.605C7.51695 10.5762 4.98338 10.5762 2.98667 11.605Z" fill="white" />
    <path d="M10.4867 11.605C9.63518 12.0438 7.40265 12.9397 8.76241 14.0608C9.42665 14.6084 10.1664 15 11.0965 15H16.4038C17.3339 15 18.0737 14.6084 18.7379 14.0608C20.0977 12.9397 17.8651 12.0438 17.0137 11.605C15.0169 10.5762 12.4834 10.5762 10.4867 11.605Z" fill="white" />
    <path d="M17.3117 15C17.9361 15 18.4328 14.6071 18.8787 14.0576C19.7916 12.9329 18.2928 12.034 17.7211 11.5938C17.14 11.1463 16.4912 10.8928 15.8333 10.8333M15 9.16667C16.1506 9.16667 17.0833 8.23393 17.0833 7.08333C17.0833 5.93274 16.1506 5 15 5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M2.68846 15C2.06404 15 1.56739 14.6071 1.12145 14.0576C0.20857 12.9329 1.70739 12.034 2.27903 11.5938C2.86014 11.1463 3.50898 10.8928 4.16683 10.8333M4.5835 9.16667C3.4329 9.16667 2.50016 8.23393 2.50016 7.08333C2.50016 5.93274 3.4329 5 4.5835 5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M6.73667 12.5926C5.88518 13.1191 3.65265 14.1942 5.01241 15.5395C5.67665 16.1966 6.41643 16.6666 7.34652 16.6666H12.6538C13.5839 16.6666 14.3237 16.1966 14.9879 15.5395C16.3477 14.1942 14.1151 13.1191 13.2637 12.5926C11.2669 11.358 8.73338 11.358 6.73667 12.5926Z" fill="#6B7280" fillOpacity="0.2" />
    <path d="M6.73667 12.5926C5.88518 13.1191 3.65265 14.1942 5.01241 15.5395C5.67665 16.1966 6.41643 16.6666 7.34652 16.6666H12.6538C13.5839 16.6666 14.3237 16.1966 14.9879 15.5395C16.3477 14.1942 14.1151 13.1191 13.2637 12.5926C11.2669 11.358 8.73338 11.358 6.73667 12.5926Z" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12.9168 6.25004C12.9168 7.86087 11.611 9.16671 10.0002 9.16671C8.38933 9.16671 7.0835 7.86087 7.0835 6.25004C7.0835 4.63921 8.38933 3.33337 10.0002 3.33337C11.611 3.33337 12.9168 4.63921 12.9168 6.25004Z" fill="white" />
    <path d="M12.9168 6.25004C12.9168 7.86087 11.611 9.16671 10.0002 9.16671C8.38933 9.16671 7.0835 7.86087 7.0835 6.25004C7.0835 4.63921 8.38933 3.33337 10.0002 3.33337C11.611 3.33337 12.9168 4.63921 12.9168 6.25004Z" stroke="#6B7280" strokeWidth="1.5" />
  </svg>
);

function VoteSurveyModal({
  visible = false,
  survey = null,
  onClose = () => { },
  onSubmit = () => { },
  allowMultiple = false,
  submitting = false,
}) {
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    if (visible) {
      setSelectedOptions(survey?.votedOptions ?? []);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, survey?.id]);

  const handleOptionClick = useCallback((optionId) => {
    if (allowMultiple) {
      setSelectedOptions((prev) =>
        prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId]
      );
    } else {
      setSelectedOptions([optionId]);
    }
  }, [allowMultiple]);

  const handleSubmit = useCallback(() => {
    if (selectedOptions.length > 0) {
      onSubmit({ surveyId: survey?.id, selectedOptions });
    }
  }, [selectedOptions, survey?.id, onSubmit]);

  const handleClose = useCallback(() => {
    setSelectedOptions([]);
    onClose();
  }, [onClose]);

  if (!survey) return null;

  const hasSelection = selectedOptions.length > 0;

  return (
    <Modal open={visible} onCancel={handleClose} footer={null} width={740} closable={false} centered>
      <ModalHeader>
        <div className="header-icon">
          <VoteIcon />
        </div>
        <span className="header-title">{survey.title}</span>
        <CloseOutlined className="header-close" onClick={handleClose} />
      </ModalHeader>

      <ModalBody>
        <OptionsContainer>
          {survey.options?.map((option) => (
            <OptionItem
              key={option.id}
              $selected={selectedOptions.includes(option.id)}
              onClick={() => handleOptionClick(option.id)}
            >
              <OptionContent>
                <OptionName>{option.name}</OptionName>
                <VoteCount>
                  <PeopleIcon />
                  {option.votes || 0}
                </VoteCount>
              </OptionContent>
              <RadioButton $selected={selectedOptions.includes(option.id)} />
            </OptionItem>
          ))}
        </OptionsContainer>

        <SubmitButton onClick={handleSubmit} disabled={!hasSelection || submitting}>
          {submitting ? "Đang gửi..." : "Bình chọn"}
        </SubmitButton>
      </ModalBody>
    </Modal>
  );
}

export default VoteSurveyModal;
