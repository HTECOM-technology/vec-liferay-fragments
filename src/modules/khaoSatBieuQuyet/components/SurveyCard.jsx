import React from "react";
import PropTypes from "prop-types";
import {
    SurveyCard as StyledSurveyCard,
    CardHeader,
    CardBody,
    CardFooter,
    OptionRow,
    ProgressBarWrapper,
    ProgressBarFill,
    OptionName,
    VoteCount,
    VoteButton,
    EditButton,
    DeleteButton,
    EndButton,
    ResultsButton,
} from "../style";
import { SURVEY_STATUS } from "./constants";
import IconTrash1 from "@/assets/icon/Trash1";
import IconPencil1 from "@/assets/icon/Pencil1";

// User/People Icon for vote count
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

// Survey/Vote Icon
const SurveyIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.6911 2.57767L13.395 3.99715C13.491 4.19475 13.7469 4.38428 13.9629 4.42057L15.2388 4.6343C16.0547 4.77141 16.2467 5.36824 15.6587 5.957L14.6668 6.95709C14.4989 7.12646 14.4069 7.4531 14.4589 7.68699L14.7428 8.925C14.9668 9.90492 14.4509 10.284 13.591 9.77185L12.3951 9.05808C12.1791 8.92903 11.8232 8.92903 11.6032 9.05808L10.4073 9.77185C9.5514 10.284 9.03146 9.90089 9.25543 8.925L9.5394 7.68699C9.5914 7.4531 9.49941 7.12646 9.33143 6.95709L8.33954 5.957C7.7556 5.36824 7.94358 4.77141 8.75949 4.6343L10.0353 4.42057C10.2473 4.38428 10.5033 4.19475 10.5993 3.99715L11.3032 2.57767C11.6872 1.80744 12.3111 1.80744 12.6911 2.57767Z" fill="white" />
        <path d="M3.5 18C3.5 16.5858 3.5 15.8787 3.93934 15.4393C4.37868 15 5.08579 15 6.5 15H7C7.94281 15 8.41421 15 8.70711 15.2929C9 15.5858 9 16.0572 9 17V22H3.5V18Z" fill="white" />
        <path d="M15 19C15 18.0572 15 17.5858 15.2929 17.2929C15.5858 17 16.0572 17 17 17H17.5C18.9142 17 19.6213 17 20.0607 17.4393C20.5 17.8787 20.5 18.5858 20.5 20V22H15V19Z" fill="white" />
        <path d="M9 16C9 14.5858 9 13.8787 9.43934 13.4393C9.87868 13 10.5858 13 12 13C13.4142 13 14.1213 13 14.5607 13.4393C15 13.8787 15 14.5858 15 16V22H9V16Z" fill="#0090CF" fillOpacity="0.2" />
        <path d="M3.5 18C3.5 16.5858 3.5 15.8787 3.93934 15.4393C4.37868 15 5.08579 15 6.5 15H7C7.94281 15 8.41421 15 8.70711 15.2929C9 15.5858 9 16.0572 9 17V22H3.5V18Z" stroke="#0090CF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 19C15 18.0572 15 17.5858 15.2929 17.2929C15.5858 17 16.0572 17 17 17H17.5C18.9142 17 19.6213 17 20.0607 17.4393C20.5 17.8787 20.5 18.5858 20.5 20V22H15V19Z" stroke="#0090CF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 22H22" stroke="#0090CF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 16C9 14.5858 9 13.8787 9.43934 13.4393C9.87868 13 10.5858 13 12 13C13.4142 13 14.1213 13 14.5607 13.4393C15 13.8787 15 14.5858 15 16V22H9V16Z" stroke="#0090CF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12.6911 2.57767L13.395 3.99715C13.491 4.19475 13.7469 4.38428 13.9629 4.42057L15.2388 4.6343C16.0547 4.77141 16.2467 5.36824 15.6587 5.957L14.6668 6.95709C14.4989 7.12646 14.4069 7.4531 14.4589 7.68699L14.7428 8.925C14.9668 9.90492 14.4509 10.284 13.591 9.77185L12.3951 9.05808C12.1791 8.92903 11.8232 8.92903 11.6032 9.05808L10.4073 9.77185C9.5514 10.284 9.03146 9.90089 9.25543 8.925L9.5394 7.68699C9.5914 7.4531 9.49941 7.12646 9.33143 6.95709L8.33954 5.957C7.7556 5.36824 7.94358 4.77141 8.75949 4.6343L10.0353 4.42057C10.2473 4.38428 10.5033 4.19475 10.5993 3.99715L11.3032 2.57767C11.6872 1.80744 12.3111 1.80744 12.6911 2.57767Z" stroke="#0090CF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

function SurveyCard({ data, onVote, onEdit, onDelete, onEnd, onViewResults }) {
    const isOpen = data.status === SURVEY_STATUS.OPEN;
    const totalVotes = data.totalVotes || 0;
    const canManage = Boolean(data.canManage || data.isOwner);
    const canEdit = canManage && totalVotes === 0;
    const canDelete = canManage;

    const getPercentage = (votes) => {
        if (totalVotes === 0) return 0;
        return Math.round((votes / totalVotes) * 100);
    };

    return (
        <StyledSurveyCard>
            <div>
                <CardHeader>
                    <div className="header-icon">
                        <SurveyIcon />
                    </div>
                    <span className="header-title">{data.title}</span>
                </CardHeader>
                <CardBody>
                    {data.options.map((option) => (
                        <OptionRow key={option.id}>
                            <ProgressBarWrapper>
                                <ProgressBarFill $percentage={getPercentage(option.votes)} />
                                <OptionName>{option.name}</OptionName>
                            </ProgressBarWrapper>
                            <VoteCount>
                                <PeopleIcon />
                                {option.votes}
                            </VoteCount>
                        </OptionRow>
                    ))}
                </CardBody>
            </div>
            <CardFooter>
                {canEdit && (
                    <EditButton onClick={() => onEdit && onEdit(data)}>
                        <IconPencil1 />
                    </EditButton>
                )}
                {canDelete && (
                    <DeleteButton onClick={() => onDelete && onDelete(data)}>
                        <IconTrash1 />
                    </DeleteButton>
                )}
                {canManage && isOpen && (
                    <EndButton onClick={() => onEnd && onEnd(data)}>
                        Kết thúc
                    </EndButton>
                )}
                {canManage && (
                    <ResultsButton onClick={() => onViewResults && onViewResults(data)}>
                        Kết quả
                    </ResultsButton>
                )}
                {isOpen ? (
                    <VoteButton onClick={() => onVote && onVote(data)}>
                        Bình chọn
                    </VoteButton>
                ) : (
                    <VoteButton $disabled disabled>
                        {data.voteDisabledText || "Đã kết thúc"}
                    </VoteButton>
                )}
            </CardFooter>
        </StyledSurveyCard>
    );
}

SurveyCard.propTypes = {
    data: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        title: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        options: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
                name: PropTypes.string.isRequired,
                votes: PropTypes.number.isRequired,
            })
        ).isRequired,
        totalVotes: PropTypes.number,
        isOwner: PropTypes.bool,
        canManage: PropTypes.bool,
        voteDisabledText: PropTypes.string,
    }).isRequired,
    onVote: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    onEnd: PropTypes.func,
    onViewResults: PropTypes.func,
};

SurveyCard.defaultProps = {
    onVote: () => { },
    onEdit: () => { },
    onDelete: () => { },
    onEnd: () => { },
    onViewResults: () => { },
};

export default SurveyCard;
