import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Alert, Input, Select, Checkbox, DatePicker, Upload, message } from "antd";
import { fetchSupportHandlerAssignment } from "@/services/supportHandlerSettingsService";
import {
    createSupportRequest,
    fetchSupportRequestUsers,
} from "@/services/supportRequestService";
import {
    BoldOutlined,
    ItalicOutlined,
    UnderlineOutlined,
    StrikethroughOutlined,
    AlignLeftOutlined,
    AlignCenterOutlined,
    AlignRightOutlined,
    MenuOutlined,
    OrderedListOutlined,
    UnorderedListOutlined,
    LinkOutlined,
    PictureOutlined,
    TableOutlined,
    FontSizeOutlined,
    MinusOutlined,
    MoreOutlined,
    UploadOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
} from "@ant-design/icons";
import {
    FormWrap,
    FormHeader,
    FormContent,
    FormRow,
    FormGroup,
    CheckboxGroup,
    DateRangeGroup,
    EditorWrap,
    EditorToolbar,
    ToolbarButton,
    ToolbarSelect,
    EditorContent,
    AttachmentSection,
    AttachmentHeader,
    AttachmentContent,
    UploadButton,
    UploadHint,
    FormActions,
    SubmitButton,
} from "../style";
import {
    PROCESS_OPTIONS,
    SUB_PROCESS_OPTIONS,
    PRIORITY_OPTIONS,
    PERIOD_TYPE_OPTIONS,
    NOTIFICATION_OPTIONS,
    FONT_FAMILY_OPTIONS,
    FONT_SIZE_OPTIONS,
    PARAGRAPH_STYLE_OPTIONS,
} from "./constants";

function RequestForm({ activeItem, activeSection, assignmentVersion, onCreated }) {
    const [messageApi, contextHolder] = message.useMessage();
    const [handlerUsers, setHandlerUsers] = useState([]);
    const [handlerLoading, setHandlerLoading] = useState(false);
    const [handlerStatus, setHandlerStatus] = useState("loading");
    const [handlerError, setHandlerError] = useState("");
    const [followerUsers, setFollowerUsers] = useState([]);
    const [followersLoading, setFollowersLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        process: activeSection || "dich-vu-cntt",
        subProcess: activeItem || "gop-y-cai-tien",
        title: "",
        handler: [],         // mảng id user được chọn
        handlerDetails: [],  // mảng { id, name, email, roles } để submit
        followers: [],
        notifications: ["thong-bao"],
        dueDate: null,
        priority: "thuong",
        phase: "Ban CNTT ghi nhận ý kiến (Giai đoạn mặc định)",
        startDate: null,
        endDate: null,
        periodType: "",
        content: "",
        attachments: [],
        relatedRequest: "",
    });

    useEffect(() => {
        if (!activeSection || !activeItem) {
            setHandlerUsers([]);
            setHandlerStatus("missing");
            setFormData((previousFormData) => ({
                ...previousFormData,
                handler: [],
                handlerDetails: [],
            }));
            return undefined;
        }

        let cancelled = false;

        const fetchAssignment = async () => {
            setHandlerLoading(true);
            setHandlerStatus("loading");
            setHandlerError("");
            setHandlerUsers([]);
            setFormData((previousFormData) => ({
                ...previousFormData,
                process: activeSection,
                subProcess: activeItem,
                handler: [],
                handlerDetails: [],
            }));

            try {
                const assignment = await fetchSupportHandlerAssignment(
                    activeSection,
                    activeItem
                );

                if (cancelled) {
                    return;
                }

                const users = assignment.users || [];
                const configured = assignment.configured && users.length > 0;

                setHandlerUsers(users);
                setHandlerStatus(configured ? "configured" : "missing");
                setFormData((previousFormData) => ({
                    ...previousFormData,
                    process: activeSection,
                    subProcess: activeItem,
                    handler: configured ? users.map((user) => user.userId) : [],
                    handlerDetails: configured
                        ? users.map((user) => ({
                            id: user.userId,
                            name: user.fullName || user.screenName,
                            email: user.emailAddress,
                            roles: [],
                        }))
                        : [],
                }));
            } catch (error) {
                if (cancelled) {
                    return;
                }

                console.error("Không thể tải cấu hình người xử lý:", error);
                setHandlerUsers([]);
                setHandlerStatus("error");
                setHandlerError(
                    error?.message || "Không tải được cấu hình người xử lý."
                );
                setFormData((previousFormData) => ({
                    ...previousFormData,
                    process: activeSection,
                    subProcess: activeItem,
                    handler: [],
                    handlerDetails: [],
                }));
            } finally {
                if (!cancelled) {
                    setHandlerLoading(false);
                }
            }
        };

        fetchAssignment();

        return () => {
            cancelled = true;
        };
    }, [activeItem, activeSection, assignmentVersion]);

    useEffect(() => {
        let cancelled = false;

        setFollowersLoading(true);
        fetchSupportRequestUsers()
            .then((items) => {
                if (!cancelled) {
                    setFollowerUsers(items);
                }
            })
            .catch((error) => {
                if (!cancelled) {
                    console.error("Không thể tải danh sách người theo dõi:", error);
                    setFollowerUsers([]);
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setFollowersLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            process: activeSection,
            subProcess: activeItem,
        }));
    }, [activeSection, activeItem]);

    const handleChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleNotificationChange = (checkedValues) => {
        handleChange("notifications", checkedValues);
    };

    const handleSubmit = async () => {
        if (handlerLoading) {
            messageApi.warning("Đang tải cấu hình người xử lý. Vui lòng chờ.");
            return;
        }

        if (handlerStatus === "error") {
            messageApi.error(
                handlerError || "Không tải được cấu hình người xử lý."
            );
            return;
        }

        if (handlerStatus !== "configured" || formData.handler.length === 0) {
            messageApi.error(
                "Loại yêu cầu chưa được cấu hình người xử lý"
            );
            return;
        }

        if (!formData.title.trim()) {
            messageApi.error("Vui lòng nhập tiêu đề yêu cầu.");
            return;
        }

        setSubmitting(true);

        try {
            const createdRequest = await createSupportRequest(formData);

            onCreated(createdRequest);
        } catch (error) {
            messageApi.error(
                error?.message || "Không tạo được yêu cầu hỗ trợ."
            );
        } finally {
            setSubmitting(false);
        }
    };

    // const getSubProcessLabel = () => {
    //     const subProcesses = SUB_PROCESS_OPTIONS[formData.process] || [];
    //     const found = subProcesses.find((item) => item.value === formData.subProcess);
    //     return found ? found.label : "";
    // };

    const FormIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.09883 20.4647C11.0393 20.5118 12.9607 20.5118 14.9012 20.4647C18.0497 20.3883 19.6239 20.3501 20.755 19.2539C21.8862 18.1576 21.9189 16.6777 21.9842 13.7179V13.7178C22.0053 12.7661 22.0053 11.8201 21.9842 10.8684C21.9392 8.82941 21.9097 7.49275 21.5259 6.5L12 11.3276L2.47411 6.5C2.09032 7.49275 2.0608 8.82941 2.01576 10.8684C1.99474 11.8201 1.99475 12.7661 2.01577 13.7178C2.08114 16.6777 2.11383 18.1576 3.24496 19.2539C4.37608 20.3501 5.95033 20.3883 9.09883 20.4647Z" fill="#0090CF" fillOpacity="0.2" />
            <path d="M14.9036 3.53657C12.9631 3.48781 11.0418 3.48781 9.10128 3.53656C5.95278 3.61566 4.37854 3.65521 3.24741 4.79065C2.89549 5.14391 2.64989 5.53563 2.47656 6L12.0025 11L21.5283 6C21.355 5.53563 21.1094 5.14392 20.7575 4.79066C19.6264 3.65523 18.0521 3.61568 14.9036 3.53657Z" fill="white" />
            <path d="M22 12.5001C22 12.0087 21.9947 11.0172 21.9842 10.5244C21.9189 7.45886 21.8862 5.92609 20.7551 4.79066C19.6239 3.65523 18.0497 3.61568 14.9012 3.53657C12.9607 3.48781 11.0393 3.48781 9.09882 3.53656C5.95033 3.61566 4.37608 3.65521 3.24495 4.79065C2.11382 5.92608 2.08114 7.45885 2.01576 10.5244C1.99474 11.5101 1.99475 12.4899 2.01577 13.4756C2.08114 16.5412 2.11383 18.0739 3.24496 19.2094C4.37608 20.3448 5.95033 20.3843 9.09883 20.4634C9.90159 20.4836 10.7011 20.4954 11.5 20.4989" stroke="#0090CF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 6L8.91302 9.92462C11.4387 11.3585 12.5613 11.3585 15.087 9.92462L22 6" stroke="#0090CF" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M22 17.5L14 17.5M22 17.5C22 16.7998 20.0057 15.4915 19.5 15M22 17.5C22 18.2002 20.0057 19.5085 19.5 20" stroke="#0090CF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );

    return (
        <>
            {contextHolder}
            <FormWrap>
            <FormHeader>
                <FormIcon className="form-icon" />
                <span className="form-title">Gửi yêu cầu</span>
            </FormHeader>

            <FormContent>
                {/* Quy trình row */}
                <FormRow className="two-columns">
                    <FormGroup>
                        <span className="form-label">Quy trình</span>
                        <div className="form-control">
                            <Select
                                value={formData.process}
                                onChange={(value) => handleChange("process", value)}
                                options={PROCESS_OPTIONS}
                                disabled
                            />
                        </div>
                    </FormGroup>
                    <FormGroup>
                        <div className="form-control">
                            <Select
                                value={formData.subProcess}
                                onChange={(value) => handleChange("subProcess", value)}
                                options={SUB_PROCESS_OPTIONS[formData.process] || []}
                                disabled
                            />
                        </div>
                    </FormGroup>
                </FormRow>

                {/* Tiêu đề */}
                <FormRow>
                    <FormGroup>
                        <span className="form-label">
                            Tiêu đề <span className="required">*</span>
                        </span>
                        <div className="form-control">
                            <Input
                                placeholder="Nhập"
                                value={formData.title}
                                onChange={(e) => handleChange("title", e.target.value)}
                            />
                        </div>
                    </FormGroup>
                </FormRow>

                {/* Người xử lý */}
                <FormRow>
                    <FormGroup>
                        <span className="form-label">
                            Người xử lý <span className="required">*</span>
                        </span>
                        <div className="form-control">
                            <Select
                                mode="multiple"
                                placeholder={
                                    handlerStatus === "missing"
                                        ? "Loại yêu cầu chưa được cấu hình người xử lý"
                                        : "Người xử lý được cấu hình tự động"
                                }
                                value={formData.handler}
                                loading={handlerLoading}
                                disabled
                                options={handlerUsers.map((user) => ({
                                    value: user.userId,
                                    label: user.fullName || user.screenName,
                                    emailAddress: user.emailAddress,
                                }))}
                                style={{ width: "100%" }}
                            />
                            {handlerStatus === "missing" && (
                                <Alert
                                    type="warning"
                                    showIcon
                                    message="Loại yêu cầu chưa được cấu hình người xử lý"
                                    style={{ marginTop: 8 }}
                                />
                            )}
                            {handlerStatus === "error" && (
                                <Alert
                                    type="error"
                                    showIcon
                                    message={handlerError}
                                    style={{ marginTop: 8 }}
                                />
                            )}
                        </div>
                    </FormGroup>
                </FormRow>

                {/* Người theo dõi */}
                <FormRow>
                    <FormGroup>
                        <span className="form-label">Người theo dõi</span>
                        <div className="form-control">
                            <Select
                                mode="multiple"
                                placeholder="Chọn"
                                value={formData.followers}
                                onChange={(value) => handleChange("followers", value)}
                                options={followerUsers}
                                loading={followersLoading}
                                showSearch
                                optionFilterProp="label"
                                allowClear
                                maxTagCount="responsive"
                            />
                        </div>
                    </FormGroup>
                </FormRow>

                {/* Thông báo */}
                <FormRow>
                    <FormGroup>
                        <span className="form-label">Thông báo</span>
                        <div className="form-control">
                            <CheckboxGroup>
                                <Checkbox.Group
                                    value={formData.notifications}
                                    onChange={handleNotificationChange}
                                >
                                    {NOTIFICATION_OPTIONS.map((opt) => (
                                        <Checkbox key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </Checkbox>
                                    ))}
                                </Checkbox.Group>
                            </CheckboxGroup>
                        </div>
                    </FormGroup>
                </FormRow>

                {/* Ngày cần HT */}
                <FormRow>
                    <FormGroup>
                        <span className="form-label">Ngày cần HT</span>
                        <div className="form-control">
                            <DatePicker
                                placeholder="Chọn ngày"
                                value={formData.dueDate}
                                onChange={(date) => handleChange("dueDate", date)}
                                style={{ width: "100%" }}
                            />
                        </div>
                    </FormGroup>
                </FormRow>

                {/* Mức độ ưu tiên */}
                <FormRow>
                    <FormGroup>
                        <span className="form-label">Mức độ ưu tiên</span>
                        <div className="form-control">
                            <Select
                                value={formData.priority}
                                onChange={(value) => handleChange("priority", value)}
                                options={PRIORITY_OPTIONS}
                            />
                        </div>
                    </FormGroup>
                </FormRow>

                {/* Giai đoạn đầu tiên */}
                {/* <FormRow>
                    <FormGroup>
                        <span className="form-label">Giai đoạn đầu tiên</span>
                        <div className="form-control">
                            <Input value={formData.phase} disabled />
                        </div>
                    </FormGroup>
                </FormRow> */}

                {/* Thời gian */}
                <FormRow>
                    <FormGroup>
                        <span className="form-label">Thời gian</span>
                        <DateRangeGroup>
                            <DatePicker
                                placeholder="Ngày bắt đầu"
                                value={formData.startDate}
                                onChange={(date) => handleChange("startDate", date)}
                            />
                            <DatePicker
                                placeholder="Ngày kết thúc"
                                value={formData.endDate}
                                onChange={(date) => handleChange("endDate", date)}
                            />
                            <Select
                                placeholder="Loại trình ký"
                                value={formData.periodType}
                                onChange={(value) => handleChange("periodType", value)}
                                options={PERIOD_TYPE_OPTIONS}
                                allowClear
                            />
                        </DateRangeGroup>
                    </FormGroup>
                </FormRow>

                {/* Rich Text Editor */}
                <EditorWrap>
                    <EditorToolbar>
                        <ToolbarButton><BoldOutlined /></ToolbarButton>
                        <ToolbarButton><ItalicOutlined /></ToolbarButton>
                        <ToolbarButton><UnderlineOutlined /></ToolbarButton>
                        <ToolbarButton><StrikethroughOutlined /></ToolbarButton>

                        <span className="toolbar-divider" />

                        <ToolbarButton><AlignLeftOutlined /></ToolbarButton>
                        <ToolbarButton><AlignCenterOutlined /></ToolbarButton>
                        <ToolbarButton><AlignRightOutlined /></ToolbarButton>
                        <ToolbarButton><MenuOutlined /></ToolbarButton>

                        <span className="toolbar-divider" />

                        <ToolbarSelect>
                            <Select
                                defaultValue="doan-van"
                                options={PARAGRAPH_STYLE_OPTIONS}
                                size="small"
                            />
                        </ToolbarSelect>

                        <ToolbarSelect>
                            <Select
                                defaultValue="times-new-roman"
                                options={FONT_FAMILY_OPTIONS}
                                size="small"
                            />
                        </ToolbarSelect>

                        <ToolbarSelect>
                            <Select
                                defaultValue="12"
                                options={FONT_SIZE_OPTIONS}
                                size="small"
                            />
                        </ToolbarSelect>

                        <span className="toolbar-divider" />

                        <ToolbarButton><FontSizeOutlined /></ToolbarButton>
                        <ToolbarButton><TableOutlined /></ToolbarButton>
                        <ToolbarButton><PictureOutlined /></ToolbarButton>
                        <ToolbarButton><LinkOutlined /></ToolbarButton>

                        <span className="toolbar-divider" />

                        <ToolbarButton><OrderedListOutlined /></ToolbarButton>
                        <ToolbarButton><UnorderedListOutlined /></ToolbarButton>

                        <span className="toolbar-divider" />

                        <ToolbarButton><MenuUnfoldOutlined /></ToolbarButton>
                        <ToolbarButton><MenuFoldOutlined /></ToolbarButton>

                        <span className="toolbar-divider" />

                        <ToolbarButton><FontSizeOutlined /></ToolbarButton>
                        <ToolbarButton><MinusOutlined /></ToolbarButton>
                        <ToolbarButton><MoreOutlined /></ToolbarButton>
                    </EditorToolbar>

                    <EditorContent>
                        <Input.TextArea
                            value={formData.content}
                            onChange={(e) => handleChange("content", e.target.value)}
                            placeholder={activeItem === "gop-y-cai-tien" ? `ĐỀ XUẤT, GỢI Ý CẢI TIẾN CHẤT LƯỢNG\n\nNgười góp ý:\nBộ phận:\nNội dung góp ý, đề xuất:` : ""}
                            autoSize={{ minRows: 8, maxRows: 15 }}
                            style={{
                                border: "none",
                                resize: "none",
                                padding: "12px",
                                fontSize: "14px",
                            }}
                        />
                    </EditorContent>
                </EditorWrap>

                {/* Tài liệu đính kèm */}
                <AttachmentSection>
                    <AttachmentHeader>
                        <UploadOutlined />
                        <span>Tài liệu đính kèm</span>
                    </AttachmentHeader>
                    <AttachmentContent>
                        <Upload
                            fileList={formData.attachments}
                            onChange={({ fileList }) => handleChange("attachments", fileList)}
                            beforeUpload={(file) => {
                                if (file.size > 10 * 1024 * 1024) {
                                    messageApi.error(
                                        `Tệp ${file.name} vượt quá giới hạn 10 MB.`
                                    );
                                    return Upload.LIST_IGNORE;
                                }

                                return false;
                            }}
                            multiple
                        >
                            <UploadButton>Chọn tệp</UploadButton>
                        </Upload>
                        {formData.attachments.length === 0 && (
                            <UploadHint>không có tệp nào được chọn</UploadHint>
                        )}
                    </AttachmentContent>
                </AttachmentSection>

                {/* Yêu cầu liên quan */}
                {/* <FormRow>
                    <FormGroup>
                        <span className="form-label">Yêu cầu liên quan</span>
                        <div className="form-control">
                            <Input
                                placeholder="Nhập"
                                value={formData.relatedRequest}
                                onChange={(e) => handleChange("relatedRequest", e.target.value)}
                            />
                        </div>
                    </FormGroup>
                </FormRow> */}

                {/* Submit button */}
                <FormActions>
                    <SubmitButton
                        onClick={handleSubmit}
                        disabled={handlerLoading || submitting}
                    >
                        {submitting ? "Đang gửi..." : "Gửi yêu cầu"}
                    </SubmitButton>
                </FormActions>
            </FormContent>
            </FormWrap>
        </>
    );
}

RequestForm.propTypes = {
    activeItem: PropTypes.string,
    activeSection: PropTypes.string,
    assignmentVersion: PropTypes.number,
    onCreated: PropTypes.func,
};

RequestForm.defaultProps = {
    activeItem: "gop-y-cai-tien",
    activeSection: "dich-vu-cntt",
    assignmentVersion: 0,
    onCreated: () => {},
};

export default RequestForm;
