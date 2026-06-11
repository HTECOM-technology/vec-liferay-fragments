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
        font-size: 13px;
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
            font-size: 13px;
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
    font-size: 13px;
    color: #999;
`;

// ── My Requests page ──────────────────────────────────────────────────────────

export const MyRequestsWrap = styled.div`
    flex: 1;
    background: #fff;
    border: 1px solid rgba(229, 231, 235, 1);
    border-radius: 6px;
    overflow: hidden;
`;

export const MyRequestsHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    background: rgba(229, 247, 255, 1);
    border-bottom: 1px solid rgba(0, 144, 207, 0.2);

    .mr-title {
        font-size: 15px;
        font-weight: 600;
        color: #333;
    }
`;

export const MyRequestsFilter = styled.div`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    padding: 12px 16px;
    border-bottom: 1px solid rgba(229, 231, 235, 1);
    background: #fafafa;

    .filter-label {
        font-size: 13px;
        font-weight: 500;
        color: #666;
        white-space: nowrap;
    }

    .ant-select-selector {
        height: 32px !important;
        border-radius: 4px !important;

        .ant-select-selection-item {
            line-height: 30px !important;
            font-size: 13px;
        }
    }

    .ant-picker {
        height: 32px;
        border-radius: 4px;
    }
`;

export const FilterGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    flex: ${(props) => props.$flex || "unset"};

    .filter-label {
        min-width: fit-content;
    }
`;

export const ResetFilterBtn = styled.button`
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 12px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    background: #fff;
    color: #666;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
    height: 32px;

    &:hover {
        border-color: rgba(0, 144, 207, 1);
        color: rgba(0, 144, 207, 1);
    }
`;

export const MyRequestsTable = styled.div`
    padding: 0 16px 16px;
`;

export const TableSummary = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;

    .summary-text {
        font-size: 13px;
        color: #666;

        span {
            font-weight: 600;
            color: rgba(0, 144, 207, 1);
        }
    }
`;

export const StatusBadge = styled.span`
    display: inline-flex;
    align-items: center;
    padding: 2px 10px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 500;
    background: ${(props) => props.$bg || "#F5F5F5"};
    color: ${(props) => props.$color || "#666"};
    white-space: nowrap;
`;

export const PriorityBadge = styled.span`
    display: inline-flex;
    align-items: center;
    padding: 2px 10px;
    border-radius: 4px;
    font-size: 13px;
    font-weight: 500;
    background: ${(props) => props.$bg || "#F5F5F5"};
    color: ${(props) => props.$color || "#666"};
    white-space: nowrap;
`;

export const RequestIdText = styled.span`
    font-size: 13px;
    color: rgba(0, 144, 207, 1);
    font-weight: 500;
    cursor: pointer;

    &:hover {
        text-decoration: underline;
    }
`;

export const RequestTitleText = styled.span`
    font-size: 13px;
    color: #333;
    cursor: pointer;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;

    &:hover {
        color: rgba(0, 144, 207, 1);
    }
`;

export const TablePaginationWrap = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 12px;

    .ant-pagination-item-active {
        border-color: rgba(0, 144, 207, 1);

        a {
            color: rgba(0, 144, 207, 1);
        }
    }
`;

// ── Detail Modal ──────────────────────────────────────────────────────────────

export const DetailRow = styled.div`
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
    font-size: 13px;

    .detail-label {
        min-width: 140px;
        color: #666;
        font-weight: 500;
        flex-shrink: 0;
    }

    .detail-value {
        color: #333;
        flex: 1;
    }
`;

// ── Support Request Detail Page ───────────────────────────────────────────────

export const DetailPageWrap = styled.div`
    flex: 1;
    background: #fff;
    border: 1px solid rgba(229, 231, 235, 1);
    border-radius: 6px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
`;

export const DetailPageHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: rgba(229, 247, 255, 1);
    border-bottom: 1px solid rgba(0, 144, 207, 0.2);

    .detail-page-title {
        font-size: 14px;
        font-weight: 600;
        color: #333;
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;

export const BackBtn = styled.button`
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border: 1px solid rgba(0, 144, 207, 0.4);
    border-radius: 4px;
    background: #fff;
    color: rgba(0, 144, 207, 1);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    flex-shrink: 0;
    white-space: nowrap;
    transition: all 0.2s;

    &:hover {
        background: rgba(0, 144, 207, 0.08);
    }
`;

export const DetailPageBody = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;

    &::-webkit-scrollbar { width: 4px; }
    &::-webkit-scrollbar-thumb { background: #d9d9d9; border-radius: 2px; }
`;

export const DetailInfoCard = styled.div`
    border: 1px solid rgba(229, 231, 235, 1);
    border-radius: 6px;
    overflow: hidden;
`;

export const DetailInfoCardTitle = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
    color: rgba(0, 144, 207, 1);
    padding: 10px 16px;
    background: rgba(229, 247, 255, 0.6);
    border-bottom: 1px solid rgba(229, 231, 235, 1);
`;

export const DetailInfoCardBody = styled.div`
    padding: 16px 16px 4px;
`;

export const CommentSectionWrap = styled.div`
    border: 1px solid rgba(229, 231, 235, 1);
    border-radius: 6px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
`;

export const CommentListWrap = styled.div`
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 16px;
    max-height: 380px;
    overflow-y: auto;

    &::-webkit-scrollbar { width: 4px; }
    &::-webkit-scrollbar-thumb { background: #d9d9d9; border-radius: 2px; }
`;

export const CommentItemWrap = styled.div`
    display: flex;
    gap: 10px;
    align-items: flex-start;
`;

export const CommentAvatar = styled.div`
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: rgba(0, 144, 207, 1);
    color: #fff;
    font-size: 13px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    user-select: none;
`;

export const CommentBubble = styled.div`
    flex: 1;
    background: #f5f5f5;
    border-radius: 0 10px 10px 10px;
    padding: 8px 12px;

    .comment-meta {
        display: flex;
        align-items: baseline;
        gap: 8px;
        margin-bottom: 4px;
    }

    .comment-author {
        font-size: 13px;
        font-weight: 600;
        color: #222;
    }

    .comment-time {
        font-size: 11px;
        color: #aaa;
    }

    .comment-content {
        font-size: 13px;
        color: #333;
        white-space: pre-wrap;
        word-break: break-word;
        margin: 0;
        line-height: 1.5;
    }
`;

export const CommentInputArea = styled.div`
    display: flex;
    gap: 10px;
    align-items: flex-end;
    padding: 12px 16px;
    border-top: 1px solid rgba(229, 231, 235, 1);
    background: #fafafa;
`;

export const CommentTextarea = styled.textarea`
    flex: 1;
    resize: none;
    border: 1px solid #d9d9d9;
    border-radius: 20px;
    padding: 8px 14px;
    font-size: 13px;
    font-family: inherit;
    color: #333;
    outline: none;
    line-height: 1.5;
    background: #fff;
    transition: border-color 0.2s;

    &::placeholder { color: #bbb; }
    &:focus { border-color: rgba(0, 144, 207, 0.6); }
`;

export const CommentSendBtn = styled.button`
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    background: rgba(0, 144, 207, 1);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: background 0.2s;

    &:hover:not(:disabled) { background: #007bb5; }

    &:disabled {
        background: #e0e0e0;
        color: #aaa;
        cursor: not-allowed;
    }
`;

// ── Submit button ─────────────────────────────────────────────────────────────

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
