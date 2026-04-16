import styled from "styled-components";

export const TitleNotiWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 200px;
    padding: 8px 10px;

    &:hover{
        cursor: pointer;
        color: rgb(0, 144, 207);
        background: rgba(0, 144, 207, 0.1);
        border-radius: 4px;

        & .count-number>div {
            background: rgb(0, 144, 207); 
            color: #e5f4fa;
        }
    }


`;

export const TitleNoti = styled.div`

`;

export const QuantityNoti = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    color: #333;
    background: #f1f1f1;
    font-size: 12px;
    font-weight: 500;
`;

export const TitlePopover = styled.div`
    font-size: 16px;
    font-weight: 700;
    padding: 8px 10px;
    color: #333;
    padding-top: 0px;
`;