import styled from "styled-components";

export const PageWrap = styled.div`
    padding: 0;
    background: #fff;
`;

export const PageHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: #fff;
    border-bottom: 1px solid rgba(0, 144, 207, 0.2);

    .header-title {
        font-size: 16px;
        font-weight: 600;
        color: rgba(30, 30, 30, 1);
    }
`;

export const MyRequestButton = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: rgba(0, 144, 207, 1);
    color: #fff;
    border: none;
    border-radius: 4px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
        background: #007bb5;
    }

    .anticon {
        font-size: 14px;
    }
`;

export const ContentWrap = styled.div`
    display: flex;
    min-height: calc(100vh - 200px);
    margin-top: 10px;
    gap: 10px;
`;

// Sidebar styles
export const SidebarWrap = styled.div`
    width: 240px;
    flex-shrink: 0;
    background: #fff;
`;

export const SidebarSection = styled.div`
    border-bottom: 1px solid rgba(0, 144, 207, 0.1);
`;

export const SectionHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    cursor: pointer;
    transition: background 0.2s;
    background-color: ${(props) => (props.$active ? "rgba(229, 247, 255, 1)" : "#FFF")};
    border: 1px solid rgba(0, 144, 207, 0.2);
    border-radius: 6px;

    &:hover {
        background: rgba(0, 144, 207, 0.05);
    }

    .section-title {
        font-size: 14px;
        font-weight: 600;
        color: ${(props) => (props.$active ? "rgba(0, 144, 207, 1)" : "#333")};
        text-transform: uppercase;
        margin-bottom: 0px;
        text-shadow: none;
    }

    .section-icon {
        font-size: 12px;
        color: #666;
        transition: transform 0.2s;
        transform: ${(props) => (props.$expanded ? "rotate(180deg)" : "rotate(0)")};
    }
`;

export const SectionContent = styled.div`
    display: ${(props) => (props.$expanded ? "block" : "none")};
    padding-bottom: 8px;
    border: 1px solid rgba(229, 231, 235, 1);
    border-radius: 6px;
`;

export const MenuItem = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px 8px 24px;
    cursor: pointer;
    transition: all 0.2s;
    background: ${(props) => (props.$active ? "rgba(0, 144, 207, 0.1)" : "transparent")};
    border-left: 3px solid ${(props) => (props.$active ? "rgba(0, 144, 207, 1)" : "transparent")};

    &:hover {
        background: rgba(0, 144, 207, 0.05);
    }

    .menu-icon {
        font-size: 14px;
        color: ${(props) => (props.$active ? "rgba(0, 144, 207, 1)" : "#666")};
    }

    .menu-label {
        font-size: 13px;
        color: ${(props) => (props.$active ? "rgba(0, 144, 207, 1)" : "#333")};
    }
`;

// Form styles
export const FormWrap = styled.div`
    flex: 1;
    padding: 0px;
    background: #fff;
    border: 1px solid rgba(229, 231, 235, 1);
    border-radius: 6px;
`;

export const FormHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;
    padding: 12px;
    border-bottom: 1px solid rgba(0, 144, 207, 0.2);
    background-color: rgba(229, 247, 255, 1);

    .form-icon {
        font-size: 18px;
        color: rgba(0, 144, 207, 1);
    }

    .form-title {
        font-size: 15px;
        font-weight: 600;
        color: #333;
    }
`;

export const FormContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 0 12px 12px 12px;
`;

export const FormRow = styled.div`
    display: flex;
    align-items: ${(props) => props.$alignStart ? "flex-start" : "center"};
    gap: 16px;

    &.two-columns {
        > * {
            flex: 1;
        }
    }
`;

export const FormGroup = styled.div`
    display: flex;
    align-items: ${(props) => props.$alignStart ? "flex-start" : "center"};
    flex: ${(props) => props.$flex || 1};

    .form-label {
        min-width: 120px;
        font-size: 13px;
        color: #333;
        font-weight: 500;

        .required {
            color: #f44336;
        }
    }

    .form-control {
        flex: 1;
    }

    .ant-input,
    .ant-select {
        width: 100%;
    }

    .ant-input {
        height: 36px;
        border-radius: 4px;
        border: 1px solid #d9d9d9;

        &:hover,
        &:focus {
            border-color: rgba(0, 144, 207, 1);
        }
    }

    .ant-select-selector {
        height: 36px !important;
        border-radius: 4px !important;

        .ant-select-selection-item {
            line-height: 34px !important;
        }
    }

    .ant-input-disabled,
    .ant-select-disabled .ant-select-selector {
        background: #f5f5f5;
        color: #666;
    }
`;

export const CheckboxGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;

    .ant-checkbox-wrapper {
        font-size: 13px;
        color: #333;
    }
`;

export const DateRangeGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;

    .ant-picker {
        flex: 1;
        height: 36px;
        border-radius: 4px;
    }

    .ant-select {
        width: 150px;
    }
`;

// Rich Text Editor styles
export const EditorWrap = styled.div`
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    overflow: hidden;
`;

export const EditorToolbar = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 8px 12px;
    background: #fafafa;
    border-bottom: 1px solid #d9d9d9;
    flex-wrap: wrap;

    .toolbar-divider {
        width: 1px;
        height: 20px;
        background: #d9d9d9;
        margin: 0 8px;
    }
`;

export const ToolbarButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    padding: 0;
    border: none;
    border-radius: 4px;
    background: ${(props) => (props.$active ? "rgba(0, 144, 207, 0.1)" : "transparent")};
    color: ${(props) => (props.$active ? "rgba(0, 144, 207, 1)" : "#666")};
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background: rgba(0, 144, 207, 0.1);
        color: rgba(0, 144, 207, 1);
    }

    .anticon {
        font-size: 14px;
    }
`;

export const ToolbarSelect = styled.div`
    .ant-select {
        min-width: 100px;
    }

    .ant-select-selector {
        height: 28px !important;
        border-radius: 4px !important;

        .ant-select-selection-item {
            line-height: 26px !important;
            font-size: 12px;
        }
    }
`;

export const EditorContent = styled.div`
    min-height: 200px;

    .ant-input {
        border: none !important;
        box-shadow: none !important;
        resize: none;

        &:focus,
        &:hover {
            border: none !important;
            box-shadow: none !important;
        }
    }

    .editor-title {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        text-align: center;
        margin-bottom: 16px;
    }

    .editor-field {
        margin-bottom: 8px;
        font-size: 13px;
        color: #333;
    }
`;

// Attachment styles
export const AttachmentSection = styled.div`
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    overflow: hidden;
`;

export const AttachmentHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    background: #fafafa;
    border-bottom: 1px solid #d9d9d9;

    .anticon {
        color: #666;
    }

    span {
        font-size: 13px;
        color: #333;
    }
`;

export const AttachmentContent = styled.div`
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;

    .ant-upload-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .ant-upload-list {
        margin-top: 12px;
    }

    .ant-upload-list-item {
        margin-top: 8px;
    }
`;

export const UploadButton = styled.button`
    padding: 8px 24px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    background: #fff;
    color: #333;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        border-color: rgba(0, 144, 207, 1);
        color: rgba(0, 144, 207, 1);
    }
`;

export const UploadHint = styled.div`
    font-size: 12px;
    color: #999;
`;

// Submit button
export const FormActions = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid rgba(0, 144, 207, 0.1);
`;

export const SubmitButton = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 32px;
    background: rgba(0, 144, 207, 1);
    color: #fff;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
        background: #007bb5;
    }

    &:disabled {
        background: #ccc;
        cursor: not-allowed;
    }
`;
