import React, { useState, useRef, useEffect } from "react";
import { Select } from "antd";
import { FiArrowLeft, FiSend, FiInfo, FiMessageSquare } from "react-icons/fi";
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
} from "./constants";

const ROW_STATUS_OPTIONS = REQUEST_STATUS_OPTIONS.filter((o) => o.value !== "all");

const INITIAL_COMMENTS = [
    {
        id: 1,
        author: "Nguyễn Văn A",
        content: "Đã tiếp nhận yêu cầu và đang tiến hành phân công xử lý.",
        createdAt: "08:30 10/04/2026",
    },
    {
        id: 2,
        author: "Trần Thị B",
        content: "Đang trong quá trình xử lý, dự kiến sẽ hoàn thành đúng hạn.",
        createdAt: "14:15 12/04/2026",
    },
];

function SupportRequestDetail({ record, onBack, onStatusChange }) {
    const [comments, setComments] = useState(INITIAL_COMMENTS);
    const [commentText, setCommentText] = useState("");
    const commentsEndRef = useRef(null);
    const textareaRef = useRef(null);

    useEffect(() => {
        commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [comments]);

    const handleSubmit = () => {
        const text = commentText.trim();
        if (!text) return;
        const now = new Date();
        const pad = (n) => String(n).padStart(2, "0");
        const createdAt = `${pad(now.getHours())}:${pad(now.getMinutes())} ${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;
        setComments((prev) => [
            ...prev,
            { id: Date.now(), author: "Tôi", content: text, createdAt },
        ]);
        setCommentText("");
        setTimeout(() => textareaRef.current?.focus(), 0);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const priorityCfg = PRIORITY_CONFIG[record.priority] || {};

    const getInitial = (name) => {
        const parts = name.trim().split(" ");
        return parts[parts.length - 1][0].toUpperCase();
    };

    return (
        <DetailPageWrap>
            <DetailPageHeader>
                <BackBtn onClick={onBack}>
                    <FiArrowLeft size={15} />
                    Quay lại
                </BackBtn>
                <span className="detail-page-title">{record.title}</span>
            </DetailPageHeader>

            <DetailPageBody>
                {/* Thông tin yêu cầu */}
                <DetailInfoCard>
                    <DetailInfoCardTitle>
                        <FiInfo size={14} />
                        Thông tin yêu cầu
                    </DetailInfoCardTitle>
                    <DetailInfoCardBody>
                        <DetailRow>
                            <span className="detail-label">Tên quy trình:</span>
                            <span className="detail-value">{record.process}</span>
                        </DetailRow>
                        <DetailRow>
                            <span className="detail-label">Tiêu đề:</span>
                            <span className="detail-value" style={{ fontWeight: 500 }}>
                                {record.title}
                            </span>
                        </DetailRow>
                        <DetailRow>
                            <span className="detail-label">Người xử lý:</span>
                            <span className="detail-value">{record.handler}</span>
                        </DetailRow>
                        <DetailRow>
                            <span className="detail-label">Người theo dõi:</span>
                            <span className="detail-value">{record.watcher}</span>
                        </DetailRow>
                        <DetailRow>
                            <span className="detail-label">Ngày cần hoàn thành:</span>
                            <span className="detail-value">{record.dueDate}</span>
                        </DetailRow>
                        <DetailRow>
                            <span className="detail-label">Mức độ ưu tiên:</span>
                            <span className="detail-value">
                                <PriorityBadge $color={priorityCfg.color} $bg={priorityCfg.bg}>
                                    {priorityCfg.label}
                                </PriorityBadge>
                            </span>
                        </DetailRow>
                        <DetailRow style={{ marginBottom: 0 }}>
                            <span className="detail-label">Trạng thái:</span>
                            <span className="detail-value">
                                <Select
                                    value={record.status}
                                    options={ROW_STATUS_OPTIONS}
                                    onChange={(v) => onStatusChange(record.id, v)}
                                    size="small"
                                    style={{ width: 160 }}
                                    labelRender={({ value: v }) => {
                                        const c = REQUEST_STATUS_CONFIG[v] || {};
                                        return (
                                            <span style={{ color: c.color, fontWeight: 500, fontSize: 13 }}>
                                                {c.label}
                                            </span>
                                        );
                                    }}
                                    optionRender={(opt) => {
                                        const c = REQUEST_STATUS_CONFIG[opt.value] || {};
                                        return (
                                            <StatusBadge $color={c.color} $bg={c.bg}>
                                                {c.label}
                                            </StatusBadge>
                                        );
                                    }}
                                />
                            </span>
                        </DetailRow>
                    </DetailInfoCardBody>
                </DetailInfoCard>

                {/* Bình luận */}
                <CommentSectionWrap>
                    <DetailInfoCardTitle>
                        <FiMessageSquare size={14} />
                        Bình luận ({comments.length})
                    </DetailInfoCardTitle>

                    <CommentListWrap>
                        {comments.map((c) => (
                            <CommentItemWrap key={c.id}>
                                <CommentAvatar>{getInitial(c.author)}</CommentAvatar>
                                <CommentBubble>
                                    <div className="comment-meta">
                                        <span className="comment-author">{c.author}</span>
                                        <span className="comment-time">{c.createdAt}</span>
                                    </div>
                                    <p className="comment-content">{c.content}</p>
                                </CommentBubble>
                            </CommentItemWrap>
                        ))}
                        <div ref={commentsEndRef} />
                    </CommentListWrap>

                    <CommentInputArea>
                        <CommentAvatar>T</CommentAvatar>
                        <CommentTextarea
                            ref={textareaRef}
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Nhập bình luận... (Enter để gửi, Shift+Enter để xuống dòng)"
                            rows={1}
                        />
                        <CommentSendBtn
                            onClick={handleSubmit}
                            disabled={!commentText.trim()}
                        >
                            <FiSend size={15} />
                        </CommentSendBtn>
                    </CommentInputArea>
                </CommentSectionWrap>
            </DetailPageBody>
        </DetailPageWrap>
    );
}

export default SupportRequestDetail;
