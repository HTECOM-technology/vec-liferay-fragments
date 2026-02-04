import styled from "styled-components";

export const SalaryContainer = styled.div`
    padding: 0;
`;

export const SalaryHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
`;

export const SalaryTitle = styled.h2`
    font-size: 16px;
    font-weight: 600;
    color: rgba(30, 30, 30, 1);
    margin: 0;
`;

export const FilterSection = styled.div`
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

export const SalaryCard = styled.div`
    border: 1px solid rgba(0, 144, 207, 0.2);
    border-radius: 6px;
    overflow: hidden;
    background: #fff;
    cursor: pointer;
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
    color: rgba(30, 30, 30, 1);

    .header-icon {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .header-title {
        font-size: 16px;
        font-weight: 600;
        color: rgba(30, 30, 30, 1);
    }
`;

export const CardBody = styled.div`
    padding: 12px 16px;
`;

export const CardRow = styled.div`
    display: flex;
    align-items: flex-start;
    padding: 6px 0;

    .row-label {
        min-width: 100px;
        font-size: 14px;
        font-weight: 600;
        color: rgba(30, 30, 30, 1);
    }

    .row-value {
        font-size: 14px;
        font-weight: 400;
        color: rgba(30, 30, 30, 1);
        flex: 1;
    }
`;

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
        width: 80px;
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
