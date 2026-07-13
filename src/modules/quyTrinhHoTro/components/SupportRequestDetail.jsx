import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Empty, message, Select, Spin } from "antd";
import {
    FiArrowLeft,
    FiDownload,
    FiInfo,
    FiMessageSquare,
    FiSend,
} from "react-icons/fi";
import {
    addSupportRequestComment,
    fetchSupportRequest,
    getSupportAttachmentUrl,
    updateSupportRequestStatus,
} from "@/services/supportRequestService";
import { formatDate } from "@/utils/dateUtils";
import {
    StatusBadge,
    PriorityBadge,
    DetailRow,
    DetailPageWrap,
    DetailPageHeader,
    BackBtn,
    DetailPageBody,
    DetailInfoCard,
    DetailInfoCardTitle,
    DetailInfoCardBody,
    CommentSectionWrap,
    CommentListWrap,
    CommentItemWrap,
    CommentAvatar,
    CommentBubble,
    CommentInputArea,
    CommentTextarea,
    CommentSendBtn,
} from "../style";
import {
    REQUEST_STATUS_CONFIG,
    REQUEST_STATUS_OPTIONS,
    PRIORITY_CONFIG,
    getProcessLabel,
    getRequestTypeLabel,
} from "./constants";

const ROW_STATUS_OPTIONS = REQUEST_STATUS_OPTIONS.filter(
    (option) => option.value !== "all"
);

function formatDateTime(value) {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(date);
}

function getInitial(name) {
    const parts = String(name || "?").trim().split(/\s+/);
    const lastPart = parts[parts.length - 1] || "?";

    return lastPart.charAt(0).toUpperCase();
}

function SupportRequestDetail({
    requestId,
    refreshVersion,
    onBack,
    onRecordUpdated,
}) {
    const [messageApi, contextHolder] = message.useMessage();
    const [record, setRecord] = useState(null);
    const [loading, setLoading] = useState(true);
    const [statusSaving, setStatusSaving] = useState(false);
    const [commentSaving, setCommentSaving] = useState(false);
    const [commentText, setCommentText] = useState("");
    const commentsEndRef = useRef(null);
    const textareaRef = useRef(null);

    useEffect(() => {
        let cancelled = false;

        setLoading(true);
        fetchSupportRequest(requestId)
            .then((item) => {
                if (!cancelled) {
                    setRecord(item);
                }
            })
            .catch((error) => {
                if (!cancelled) {
                    setRecord(null);
                    messageApi.error(
                        error?.message || "Không tải được chi tiết yêu cầu."
                    );
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [messageApi, refreshVersion, requestId]);

    useEffect(() => {
        commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [record?.comments]);

    const handleStatusChange = async (status) => {
        setStatusSaving(true);

        try {
            const updatedRequest = await updateSupportRequestStatus(
                requestId,
                status
            );

            setRecord(updatedRequest);
            onRecordUpdated(updatedRequest);
            messageApi.success("Đã cập nhật trạng thái yêu cầu.");
        } catch (error) {
            messageApi.error(
                error?.message || "Không cập nhật được trạng thái yêu cầu."
            );
        } finally {
            setStatusSaving(false);
        }
    };

    const handleSubmitComment = async () => {
        const content = commentText.trim();

        if (!content || commentSaving) {
            return;
        }

        setCommentSaving(true);

        try {
            const comment = await addSupportRequestComment(requestId, content);

            setRecord((currentRecord) => ({
                ...currentRecord,
                comments: [...(currentRecord.comments || []), comment],
            }));
            setCommentText("");
            setTimeout(() => textareaRef.current?.focus(), 0);
        } catch (error) {
            messageApi.error(
                error?.message || "Không gửi được bình luận."
            );
        } finally {
            setCommentSaving(false);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSubmitComment();
        }
    };

    if (loading) {
        return (
            <DetailPageWrap>
                {contextHolder}
                <DetailPageBody
                    style={{ alignItems: "center", justifyContent: "center" }}
                >
                    <Spin size="large" />
                </DetailPageBody>
            </DetailPageWrap>
        );
    }

    if (!record) {
        return (
            <DetailPageWrap>
                {contextHolder}
                <DetailPageHeader>
                    <BackBtn type="button" onClick={onBack}>
                        <FiArrowLeft size={15} />
                        Quay lại
                    </BackBtn>
                </DetailPageHeader>
                <DetailPageBody>
                    <Empty description="Không tìm thấy yêu cầu hỗ trợ" />
                </DetailPageBody>
            </DetailPageWrap>
        );
    }

    const priorityConfig = PRIORITY_CONFIG[record.priority] || {};
    const comments = record.comments || [];
    const attachments = record.attachments || [];

    return (
        <DetailPageWrap>
            {contextHolder}
            <DetailPageHeader>
                <BackBtn type="button" onClick={onBack}>
                    <FiArrowLeft size={15} />
                    Quay lại
                </BackBtn>
                <span className="detail-page-title">
                    {record.requestCode} - {record.title}
                </span>
            </DetailPageHeader>

            <DetailPageBody>
                <DetailInfoCard>
                    <DetailInfoCardTitle>
                        <FiInfo size={14} />
                        Thông tin yêu cầu
                    </DetailInfoCardTitle>
                    <DetailInfoCardBody>
                        <DetailRow>
                            <span className="detail-label">Mã yêu cầu:</span>
                            <span className="detail-value">{record.requestCode}</span>
                        </DetailRow>
                        <DetailRow>
                            <span className="detail-label">Quy trình:</span>
                            <span className="detail-value">
                                {getProcessLabel(record.processKey)} / {" "}
                                {getRequestTypeLabel(record.requestTypeKey)}
                            </span>
                        </DetailRow>
                        <DetailRow>
                            <span className="detail-label">Người tạo:</span>
                            <span className="detail-value">
                                {record.creatorUserName}
                            </span>
                        </DetailRow>
                        <DetailRow>
                            <span className="detail-label">Tiêu đề:</span>
                            <span className="detail-value" style={{ fontWeight: 500 }}>
                                {record.title}
                            </span>
                        </DetailRow>
                        <DetailRow>
                            <span className="detail-label">Người xử lý:</span>
                            <span className="detail-value">{record.handler || "—"}</span>
                        </DetailRow>
                        <DetailRow>
                            <span className="detail-label">Người theo dõi:</span>
                            <span className="detail-value">{record.watcher || "—"}</span>
                        </DetailRow>
                        <DetailRow>
                            <span className="detail-label">Ngày tạo:</span>
                            <span className="detail-value">
                                {formatDateTime(record.createDate)}
                            </span>
                        </DetailRow>
                        <DetailRow>
                            <span className="detail-label">Ngày cần hoàn thành:</span>
                            <span className="detail-value">
                                {formatDate(record.dueDate) || "—"}
                            </span>
                        </DetailRow>
                        <DetailRow>
                            <span className="detail-label">Mức độ ưu tiên:</span>
                            <span className="detail-value">
                                <PriorityBadge
                                    $color={priorityConfig.color}
                                    $bg={priorityConfig.bg}
                                >
                                    {priorityConfig.label}
                                </PriorityBadge>
                            </span>
                        </DetailRow>
                        <DetailRow>
                            <span className="detail-label">Nội dung:</span>
                            <span
                                className="detail-value"
                                style={{ whiteSpace: "pre-wrap" }}
                            >
                                {record.content || "—"}
                            </span>
                        </DetailRow>
                        <DetailRow>
                            <span className="detail-label">Tệp đính kèm:</span>
                            <span className="detail-value">
                                {attachments.length === 0
                                    ? "—"
                                    : attachments.map((attachment, index) => (
                                        <React.Fragment key={attachment.attachmentId}>
                                            {index > 0 && ", "}
                                            <a
                                                href={getSupportAttachmentUrl(
                                                    record.requestId,
                                                    attachment.attachmentId
                                                )}
                                                style={{ color: "#0090cf" }}
                                            >
                                                <FiDownload
                                                    size={13}
                                                    style={{ marginRight: 4 }}
                                                />
                                                {attachment.fileName}
                                            </a>
                                        </React.Fragment>
                                    ))}
                            </span>
                        </DetailRow>
                        <DetailRow style={{ marginBottom: 0 }}>
                            <span className="detail-label">Trạng thái:</span>
                            <span className="detail-value">
                                <Select
                                    value={record.status}
                                    options={ROW_STATUS_OPTIONS}
                                    onChange={handleStatusChange}
                                    disabled={!record.canUpdateStatus}
                                    loading={statusSaving}
                                    size="small"
                                    style={{ width: 170 }}
                                    labelRender={({ value }) => {
                                        const config =
                                            REQUEST_STATUS_CONFIG[value] || {};

                                        return (
                                            <span
                                                style={{
                                                    color: config.color,
                                                    fontWeight: 500,
                                                    fontSize: 13,
                                                }}
                                            >
                                                {config.label}
                                            </span>
                                        );
                                    }}
                                    optionRender={(option) => {
                                        const config =
                                            REQUEST_STATUS_CONFIG[option.value] || {};

                                        return (
                                            <StatusBadge
                                                $color={config.color}
                                                $bg={config.bg}
                                            >
                                                {config.label}
                                            </StatusBadge>
                                        );
                                    }}
                                />
                                {!record.canUpdateStatus && (
                                    <span
                                        style={{
                                            display: "block",
                                            marginTop: 4,
                                            color: "#8c8c8c",
                                            fontSize: 12,
                                        }}
                                    >
                                        Chỉ người xử lý được chỉ định hoặc admin được
                                        thay đổi trạng thái.
                                    </span>
                                )}
                            </span>
                        </DetailRow>
                    </DetailInfoCardBody>
                </DetailInfoCard>

                <CommentSectionWrap>
                    <DetailInfoCardTitle>
                        <FiMessageSquare size={14} />
                        Bình luận ({comments.length})
                    </DetailInfoCardTitle>

                    <CommentListWrap>
                        {comments.length === 0 ? (
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description="Chưa có bình luận"
                            />
                        ) : (
                            comments.map((comment) => (
                                <CommentItemWrap key={comment.commentId}>
                                    <CommentAvatar>
                                        {getInitial(comment.userName)}
                                    </CommentAvatar>
                                    <CommentBubble>
                                        <div className="comment-meta">
                                            <span className="comment-author">
                                                {comment.userName}
                                            </span>
                                            <span className="comment-time">
                                                {formatDateTime(comment.createDate)}
                                            </span>
                                        </div>
                                        <p className="comment-content">
                                            {comment.content}
                                        </p>
                                    </CommentBubble>
                                </CommentItemWrap>
                            ))
                        )}
                        <div ref={commentsEndRef} />
                    </CommentListWrap>

                    <CommentInputArea>
                        <CommentAvatar>T</CommentAvatar>
                        <CommentTextarea
                            ref={textareaRef}
                            value={commentText}
                            onChange={(event) => setCommentText(event.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Nhập bình luận... (Enter để gửi, Shift+Enter để xuống dòng)"
                            rows={1}
                            maxLength={4000}
                        />
                        <CommentSendBtn
                            type="button"
                            onClick={handleSubmitComment}
                            disabled={!commentText.trim() || commentSaving}
                            aria-label="Gửi bình luận"
                        >
                            <FiSend size={15} />
                        </CommentSendBtn>
                    </CommentInputArea>
                </CommentSectionWrap>
            </DetailPageBody>
        </DetailPageWrap>
    );
}

SupportRequestDetail.propTypes = {
    requestId: PropTypes.number.isRequired,
    refreshVersion: PropTypes.number,
    onBack: PropTypes.func,
    onRecordUpdated: PropTypes.func,
};

SupportRequestDetail.defaultProps = {
    refreshVersion: 0,
    onBack: () => {},
    onRecordUpdated: () => {},
};

export default SupportRequestDetail;
