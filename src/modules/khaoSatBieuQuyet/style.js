import styled from "styled-components";

export const PageContainer = styled.div`
    padding: 0;
    background: #fff;
    border: 1px solid rgba(0, 144, 207, 0.2);
    border-radius: 2px;
`;

export const ContentContainer = styled.div`
    padding: 16px 24px;
`;

export const PageHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    border-bottom: 1px solid rgba(0, 144, 207, 0.2);
    padding-bottom: 10px;
`;

export const PageTitle = styled.h1`
    font-size: 16px;
    font-weight: 600;
    color: rgba(30, 30, 30, 1);
    margin: 0;
`;

export const HeaderActions = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

export const FilterSelect = styled.div`
    .ant-select {
        min-width: 120px;
    }

    .ant-select-selector {
        height: 32px !important;
        border-radius: 4px !important;
        border: 1px solid rgba(209, 213, 220, 1) !important;
    }

    .ant-select-selection-item {
        line-height: 30px !important;
        color: rgba(107, 114, 128, 1);
    }
`;

export const CreateButton = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: rgba(0, 144, 207, 1);
    color: #fff;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
        background: rgba(0, 123, 181, 1);
    }

    svg {
        width: 16px;
        height: 16px;
    }
`;

export const FilterTagsContainer = styled.div`
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
`;

export const FilterTag = styled.button`
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 4px;
    border: 1px solid ${(props) => (props.$active ? "rgba(0, 144, 207, 1)" : "rgba(229, 231, 235, 1)")};
    background: ${(props) => (props.$active ? "rgba(0, 144, 207, 1)" : "rgba(248, 249, 250, 1)")};
    color: ${(props) => (props.$active ? "rgba(255, 255, 255, 1)" : "rgba(0, 144, 207, 1)")};
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        border-color: rgba(0, 144, 207, 1);
        color: ${(props) => (props.$active ? "#fff" : "rgba(0, 144, 207, 1)")};
    }

    svg {
        width: 14px;
        height: 14px;
    }
`;

export const CardsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 16px;

    @media (max-width: 1200px) {
        grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 900px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 600px) {
        grid-template-columns: 1fr;
    }
`;

// Survey Card Styles
export const SurveyCard = styled.div`
    border: 1px solid rgba(0, 144, 207, 0.2);
    border-radius: 6px;
    overflow: hidden;
    background: #fff;
    transition: box-shadow 0.2s;

    &:hover {
        box-shadow: 0 2px 8px rgba(0, 144, 207, 0.15);
    }
`;

export const CardHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    background: rgba(229, 247, 255, 1);
    border-bottom: 1px solid rgba(0, 144, 207, 0.2);

    .header-icon {
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgba(0, 144, 207, 1);
    }

    .header-title {
        font-size: 14px;
        font-weight: 600;
        color: rgba(30, 30, 30, 1);
        flex: 1;
    }
`;

export const CardBody = styled.div`
    padding: 12px 16px;
`;

export const OptionRow = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
    position: relative;

    &:last-child {
        margin-bottom: 0;
    }
`;

export const ProgressBarWrapper = styled.div`
    flex: 1;
    position: relative;
    height: 40px;
    background: rgba(248, 249, 250, 1);
    border-radius: 4px;
    overflow: hidden;
`;

export const ProgressBarFill = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: rgba(202, 239, 255, 1);
    border-radius: 4px;
    width: ${(props) => props.$percentage || 0}%;
    transition: width 0.3s ease;
`;

export const OptionName = styled.span`
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 12px;
    font-size: 13px;
    font-weight: 500;
    color: rgba(30, 30, 30, 1);
`;

export const VoteCount = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    min-width: 50px;
    font-size: 13px;
    color: rgba(107, 114, 128, 1);
    justify-content: flex-end;
    position: absolute;
    right: 10px;

    svg {
        width: 16px;
        height: 16px;
    }
`;

export const CardFooter = styled.div`
    padding: 12px 16px;
    border-top: 1px solid rgba(229, 231, 235, 1);
    display: flex;
    justify-content: center;
`;

export const VoteButton = styled.button`
    padding: 12px 25px;
    background: ${(props) => (props.$disabled ? "rgba(239, 239, 239, 1)" : "rgba(229, 247, 255, 1)")};
    color: ${(props) => (props.$disabled ? "rgba(107, 114, 128, 1)" : "rgba(0, 144, 207, 1)")};
    border: 1px solid ${(props) => (props.$disabled ? "rgba(239, 239, 239, 1)" : "rgba(0, 144, 207, 0.2)")};
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
    transition: all 0.2s;

    &:hover:not(:disabled) {
        background: ${(props) => (props.$disabled ? "rgba(239, 239, 239, 1)" : "rgba(0, 144, 207, 0.2)")};
    }
`;

export const StatusBadge = styled.span`
    padding: 12px 25px;
    background: rgba(239, 239, 239, 1);
    border: 1px solid rgba(239, 239, 239, 1);
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    color: rgba(107, 114, 128, 1);
`;

// Pagination Styles
export const PaginationContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 0;
    border-top: 1px solid #f0f0f0;
    margin-top: 16px;
`;

export const PaginationInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #666;

    .ant-select {
        width: 100px;
    }

    .ant-select-selector {
        height: 28px !important;
        border-radius: 4px !important;
    }
`;

export const PaginationNav = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;

    .page-btn {
        min-width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 16px;
        color: #333;
        transition: all 0.2s;
        border: none;
        outline: none;
        background: #fff;

        &:hover {
            color: rgba(0, 144, 207, 1);
        }

        &.active {
            color: rgba(0, 144, 207, 1);
        }

        &:disabled {
            cursor: not-allowed;
            opacity: 0.5;
        }
    }

    .page-ellipsis {
        padding: 0 8px;
        color: #999;
    }
`;

export const GoToPage = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #666;

    .ant-input {
        width: 50px;
        height: 28px;
        text-align: center;
        border-radius: 4px;
    }
`;
