import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Alert, Button, Empty, Modal, Select, Spin, Tag, message } from "antd";
import { CheckCircleFilled, UsergroupAddOutlined } from "@ant-design/icons";
import styled from "styled-components";
import {
    fetchSupportHandlerUsers,
    fetchSupportOrganizations,
} from "@/services/supportHandlerSettingsService";

const ModalBody = styled.div`
    min-height: 440px;
`;

const SettingsLayout = styled.div`
    display: grid;
    grid-template-columns: minmax(250px, 0.8fr) minmax(380px, 1.4fr);
    gap: 16px;
    min-height: 420px;

    @media (max-width: 767px) {
        grid-template-columns: 1fr;
    }
`;

const TypeList = styled.div`
    border: 1px solid #e8edf3;
    border-radius: 8px;
    overflow: hidden;
    background: #fff;
`;

const TypeListHeader = styled.div`
    padding: 12px 14px;
    background: linear-gradient(180deg, #f7fbfe 0%, #eef6fb 100%);
    border-bottom: 1px solid #e8edf3;
    color: #365168;
    font-size: 13px;
    font-weight: 700;
`;

const TypeListContent = styled.div`
    max-height: 376px;
    overflow-y: auto;
`;

const TypeButton = styled.button`
    display: flex;
    width: 100%;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px;
    padding: 12px 14px;
    border: 0;
    border-bottom: 1px solid #f0f3f7;
    background: ${(props) => (props.$active ? "#e9f7fd" : "#fff")};
    color: ${(props) => (props.$active ? "#007bb5" : "#263746")};
    text-align: left;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease;

    &:hover,
    &:focus-visible {
        background: #f3faff;
        color: #007bb5;
        outline: none;
    }

    &:last-child {
        border-bottom: 0;
    }

    .type-label {
        flex: 1;
        min-width: 0;
        font-size: 13px;
        font-weight: 500;
        line-height: 1.4;
    }
`;

const EditorPanel = styled.div`
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: 16px;
    padding: 18px;
    border: 1px solid #e8edf3;
    border-radius: 8px;
    background: #fff;
`;

const EditorHeading = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    padding-bottom: 14px;
    border-bottom: 1px solid #edf1f5;

    .heading-title {
        margin: 0 0 4px;
        color: #1f2d3d;
        font-size: 16px;
        font-weight: 700;
    }

    .heading-description {
        margin: 0;
        color: #66798a;
        font-size: 12px;
        line-height: 1.5;
    }
`;

const SelectGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;

    .select-label {
        color: #263746;
        font-size: 13px;
        font-weight: 600;
    }

    .required {
        color: #ff4d4f;
    }

    .ant-select {
        width: 100%;
    }
`;

const EmptyEditor = styled.div`
    display: flex;
    min-height: 360px;
    align-items: center;
    justify-content: center;
`;

function createDrafts(requestTypes, configurations) {
    const configurationMap = new Map(
        (configurations || []).map((item) => [item.requestTypeKey, item])
    );

    return (requestTypes || []).reduce((result, requestType) => {
        const configuration = configurationMap.get(requestType.key);

        result[requestType.key] = {
            processKey: requestType.processKey,
            requestTypeKey: requestType.key,
            organizationId: configuration?.organizationId || null,
            departmentId: configuration?.departmentId || null,
            userIds: configuration?.userIds || [],
            users: configuration?.users || [],
        };

        return result;
    }, {});
}

function isConfigured(draft) {
    return Boolean(
        draft?.organizationId &&
        draft?.departmentId &&
        draft?.userIds?.length
    );
}

function mergeUserOptions(primaryOptions, fallbackOptions) {
    const optionsMap = new Map();

    [...(fallbackOptions || []), ...(primaryOptions || [])].forEach((option) => {
        if (option?.userId) {
            optionsMap.set(Number(option.userId), option);
        }
    });

    return Array.from(optionsMap.values());
}

function SupportHandlerSettingsModal({
    open,
    requestTypes,
    configurations,
    loading,
    saving,
    onCancel,
    onSave,
}) {
    const [messageApi, contextHolder] = message.useMessage();
    const [drafts, setDrafts] = useState({});
    const [activeTypeKey, setActiveTypeKey] = useState(null);
    const [organizationOptions, setOrganizationOptions] = useState([]);
    const [departmentOptions, setDepartmentOptions] = useState([]);
    const [memberOptions, setMemberOptions] = useState([]);
    const [loadingOrganizations, setLoadingOrganizations] = useState(false);
    const [loadingDepartments, setLoadingDepartments] = useState(false);
    const [loadingMembers, setLoadingMembers] = useState(false);

    const activeRequestType = useMemo(
        () => requestTypes.find((item) => item.key === activeTypeKey) || null,
        [activeTypeKey, requestTypes]
    );
    const activeDraft = activeTypeKey ? drafts[activeTypeKey] : null;
    const currentMemberOptions = useMemo(
        () => mergeUserOptions(memberOptions, activeDraft?.users),
        [activeDraft?.users, memberOptions]
    );

    useEffect(() => {
        if (!open) {
            return;
        }

        setDrafts(createDrafts(requestTypes, configurations));
        setActiveTypeKey(requestTypes[0]?.key || null);
    }, [configurations, open, requestTypes]);

    useEffect(() => {
        if (!open) {
            return;
        }

        let cancelled = false;

        setLoadingOrganizations(true);
        fetchSupportOrganizations(0)
            .then((items) => {
                if (!cancelled) {
                    setOrganizationOptions(items);
                }
            })
            .catch((error) => {
                if (!cancelled) {
                    setOrganizationOptions([]);
                    messageApi.error(
                        error?.message || "Không tải được danh sách đơn vị."
                    );
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoadingOrganizations(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [messageApi, open]);

    useEffect(() => {
        if (!open || !activeDraft?.organizationId) {
            setDepartmentOptions([]);
            return;
        }

        let cancelled = false;

        setLoadingDepartments(true);
        fetchSupportOrganizations(activeDraft.organizationId)
            .then((items) => {
                if (!cancelled) {
                    setDepartmentOptions(items);
                }
            })
            .catch((error) => {
                if (!cancelled) {
                    setDepartmentOptions([]);
                    messageApi.error(
                        error?.message || "Không tải được danh sách phòng ban."
                    );
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoadingDepartments(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [activeDraft?.organizationId, messageApi, open]);

    useEffect(() => {
        if (
            !open ||
            !activeDraft?.organizationId ||
            !activeDraft?.departmentId
        ) {
            setMemberOptions([]);
            return;
        }

        let cancelled = false;

        setLoadingMembers(true);
        fetchSupportHandlerUsers(
            activeDraft.organizationId,
            activeDraft.departmentId
        )
            .then((items) => {
                if (!cancelled) {
                    setMemberOptions(items);
                }
            })
            .catch((error) => {
                if (!cancelled) {
                    setMemberOptions([]);
                    messageApi.error(
                        error?.message || "Không tải được danh sách thành viên."
                    );
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoadingMembers(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [
        activeDraft?.departmentId,
        activeDraft?.organizationId,
        messageApi,
        open,
    ]);

    const updateActiveDraft = (changes) => {
        if (!activeTypeKey) {
            return;
        }

        setDrafts((currentDrafts) => ({
            ...currentDrafts,
            [activeTypeKey]: {
                ...currentDrafts[activeTypeKey],
                ...changes,
            },
        }));
    };

    const handleOrganizationChange = (organizationId) => {
        updateActiveDraft({
            organizationId: organizationId || null,
            departmentId: null,
            userIds: [],
            users: [],
        });
    };

    const handleDepartmentChange = (departmentId) => {
        updateActiveDraft({
            departmentId: departmentId || null,
            userIds: [],
            users: [],
        });
    };

    const handleMembersChange = (userIds) => {
        const selectedUsers = currentMemberOptions.filter((item) =>
            userIds.includes(item.userId)
        );

        updateActiveDraft({ userIds, users: selectedUsers });
    };

    const handleSave = () => {
        const draftItems = requestTypes.map((item) => drafts[item.key]);
        const incompleteDraft = draftItems.find((item) => !isConfigured(item));

        if (incompleteDraft) {
            const requestType = requestTypes.find(
                (item) => item.key === incompleteDraft.requestTypeKey
            );

            setActiveTypeKey(incompleteDraft.requestTypeKey);
            messageApi.error(
                `Vui lòng chọn đủ đơn vị, phòng ban và ít nhất một người xử lý cho “${
                    requestType?.label || incompleteDraft.requestTypeKey
                }”. Tất cả loại yêu cầu đều bắt buộc có người xử lý.`
            );
            return;
        }

        onSave(draftItems);
    };

    const footer = [
        <Button key="close" onClick={onCancel} disabled={saving}>
            Đóng
        </Button>,
        <Button
            key="save"
            type="primary"
            loading={saving}
            disabled={loading || requestTypes.length === 0}
            onClick={handleSave}
        >
            Lưu
        </Button>,
    ];

    return (
        <Modal
            open={open}
            title="Cấu hình người xử lý yêu cầu hỗ trợ"
            onCancel={onCancel}
            footer={footer}
            width={960}
            destroyOnClose
        >
            {contextHolder}
            <ModalBody>
                <Alert
                    type="info"
                    showIcon
                    message="Mỗi loại yêu cầu được gán cho nhiều người thuộc phòng ban đã chọn hoặc các phòng ban cấp dưới. Thay đổi áp dụng cho yêu cầu tạo mới và toàn bộ yêu cầu đang chờ xử lý."
                    style={{ marginBottom: 16 }}
                />

                {loading ? (
                    <EmptyEditor>
                        <Spin size="large" />
                    </EmptyEditor>
                ) : requestTypes.length === 0 ? (
                    <EmptyEditor>
                        <Empty description="Không có loại yêu cầu để cấu hình" />
                    </EmptyEditor>
                ) : (
                    <SettingsLayout>
                        <TypeList>
                            <TypeListHeader>Loại yêu cầu hỗ trợ</TypeListHeader>
                            <TypeListContent>
                                {requestTypes.map((requestType) => {
                                    const configured = isConfigured(
                                        drafts[requestType.key]
                                    );

                                    return (
                                        <TypeButton
                                            key={requestType.key}
                                            type="button"
                                            $active={requestType.key === activeTypeKey}
                                            onClick={() =>
                                                setActiveTypeKey(requestType.key)
                                            }
                                        >
                                            <span className="type-label">
                                                {requestType.label}
                                            </span>
                                            {configured ? (
                                                <CheckCircleFilled
                                                    style={{ color: "#52c41a", marginTop: 2 }}
                                                    aria-label="Đã cấu hình"
                                                />
                                            ) : (
                                                <Tag color="default">Chưa cấu hình</Tag>
                                            )}
                                        </TypeButton>
                                    );
                                })}
                            </TypeListContent>
                        </TypeList>

                        {activeRequestType && activeDraft ? (
                            <EditorPanel>
                                <EditorHeading>
                                    <div>
                                        <h3 className="heading-title">
                                            {activeRequestType.label}
                                        </h3>
                                        <p className="heading-description">
                                            Chọn một đơn vị, một phòng ban và các thành
                                            viên thuộc phòng ban đó hoặc các phòng ban cấp dưới.
                                        </p>
                                    </div>
                                    <UsergroupAddOutlined
                                        style={{ color: "#0090cf", fontSize: 24 }}
                                    />
                                </EditorHeading>

                                <SelectGroup>
                                    <label className="select-label">
                                        Đơn vị <span className="required">*</span>
                                    </label>
                                    <Select
                                        placeholder="Chọn Đơn vị"
                                        value={activeDraft.organizationId}
                                        onChange={handleOrganizationChange}
                                        options={organizationOptions}
                                        loading={loadingOrganizations}
                                        showSearch
                                        allowClear
                                        optionFilterProp="label"
                                    />
                                </SelectGroup>

                                <SelectGroup>
                                    <label className="select-label">
                                        Phòng ban <span className="required">*</span>
                                    </label>
                                    <Select
                                        placeholder="Chọn phòng ban"
                                        value={activeDraft.departmentId}
                                        onChange={handleDepartmentChange}
                                        options={departmentOptions}
                                        disabled={!activeDraft.organizationId}
                                        loading={loadingDepartments}
                                        showSearch
                                        allowClear
                                        optionFilterProp="label"
                                    />
                                </SelectGroup>

                                <SelectGroup>
                                    <label className="select-label">
                                        Người xử lý <span className="required">*</span>
                                    </label>
                                    <Select
                                        mode="multiple"
                                        placeholder="Chọn người xử lý"
                                        value={activeDraft.userIds}
                                        onChange={handleMembersChange}
                                        options={currentMemberOptions}
                                        disabled={!activeDraft.departmentId}
                                        loading={loadingMembers}
                                        showSearch
                                        allowClear
                                        optionFilterProp="label"
                                        maxTagCount="responsive"
                                    />
                                </SelectGroup>

                            </EditorPanel>
                        ) : null}
                    </SettingsLayout>
                )}
            </ModalBody>
        </Modal>
    );
}

SupportHandlerSettingsModal.propTypes = {
    open: PropTypes.bool,
    requestTypes: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            processKey: PropTypes.string.isRequired,
        })
    ),
    configurations: PropTypes.arrayOf(PropTypes.object),
    loading: PropTypes.bool,
    saving: PropTypes.bool,
    onCancel: PropTypes.func,
    onSave: PropTypes.func,
};

SupportHandlerSettingsModal.defaultProps = {
    open: false,
    requestTypes: [],
    configurations: [],
    loading: false,
    saving: false,
    onCancel: () => {},
    onSave: () => {},
};

export default SupportHandlerSettingsModal;
