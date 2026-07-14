import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Alert, Button, Empty, Modal, Select, Spin, Tag, message } from "antd";
import {
    CheckCircleFilled,
    CloseOutlined,
    UsergroupAddOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import {
    fetchSupportHandlerUsers,
    fetchSupportOrganizations,
    formatHandlerLabel,
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

const SelectedArea = styled.div`
    border: 1px solid #e8edf3;
    border-radius: 8px;
    overflow: hidden;
    background: #fff;
`;

const SelectedAreaHeader = styled.div`
    padding: 10px 14px;
    background: linear-gradient(180deg, #f7fbfe 0%, #eef6fb 100%);
    border-bottom: 1px solid #e8edf3;
    color: #365168;
    font-size: 13px;
    font-weight: 700;
`;

const SelectedAreaContent = styled.div`
    max-height: 168px;
    overflow-y: auto;
`;

const SelectedRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 8px 14px;
    border-bottom: 1px solid #f0f3f7;
    font-size: 13px;
    color: #263746;

    &:last-child {
        border-bottom: 0;
    }

    .selected-remove {
        border: 0;
        background: transparent;
        color: #96a5b3;
        cursor: pointer;
        padding: 2px;
        line-height: 1;
        transition: color 0.2s ease;

        &:hover {
            color: #ff4d4f;
        }
    }
`;

const SelectedEmpty = styled.div`
    padding: 12px 14px;
    color: #96a5b3;
    font-size: 12px;
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
            users: configuration?.users || [],
        };

        return result;
    }, {});
}

function isConfigured(draft) {
    return Boolean(draft?.users?.length);
}

function mergeUserOptions(preferredOptions, fallbackOptions) {
    const optionsMap = new Map();

    [...(fallbackOptions || []), ...(preferredOptions || [])].forEach(
        (option) => {
            if (option?.userId) {
                optionsMap.set(Number(option.userId), option);
            }
        }
    );

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
    const [filterOrganizationIds, setFilterOrganizationIds] = useState([]);
    const [filterDepartmentIds, setFilterDepartmentIds] = useState([]);
    const [departmentGroups, setDepartmentGroups] = useState([]);
    const [departmentMap, setDepartmentMap] = useState(new Map());
    const [memberOptions, setMemberOptions] = useState([]);
    const [loadingOrganizations, setLoadingOrganizations] = useState(false);
    const [loadingDepartments, setLoadingDepartments] = useState(false);
    const [loadingMembers, setLoadingMembers] = useState(false);

    const activeRequestType = useMemo(
        () => requestTypes.find((item) => item.key === activeTypeKey) || null,
        [activeTypeKey, requestTypes]
    );
    const activeDraft = activeTypeKey ? drafts[activeTypeKey] : null;
    const selectedUsers = useMemo(
        () => activeDraft?.users || [],
        [activeDraft?.users]
    );
    // Giữ những người đã chọn (kể cả từ đơn vị/phòng ban khác) luôn có mặt
    // trong options; bản ghi đã lưu được ưu tiên để không mất cặp ĐV-PB.
    const currentMemberOptions = useMemo(
        () => mergeUserOptions(selectedUsers, memberOptions),
        [memberOptions, selectedUsers]
    );
    const organizationIdsKey = filterOrganizationIds.join(",");
    const departmentIdsKey = filterDepartmentIds.join(",");

    useEffect(() => {
        if (!open) {
            return;
        }

        setDrafts(createDrafts(requestTypes, configurations));
        setActiveTypeKey(requestTypes[0]?.key || null);
        setFilterOrganizationIds([]);
        setFilterDepartmentIds([]);
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
        if (!open || !filterOrganizationIds.length) {
            setDepartmentGroups([]);
            setDepartmentMap(new Map());
            setFilterDepartmentIds([]);
            return undefined;
        }

        let cancelled = false;

        setLoadingDepartments(true);
        Promise.all(
            filterOrganizationIds.map(async (organizationId) => {
                const organization = organizationOptions.find(
                    (item) => item.organizationId === organizationId
                );
                const departments = await fetchSupportOrganizations(
                    organizationId
                );

                return { organization, departments };
            })
        )
            .then((results) => {
                if (cancelled) {
                    return;
                }

                const map = new Map();
                const groups = results
                    .filter((result) => result.organization)
                    .map((result) => ({
                        label: result.organization.name,
                        title: result.organization.name,
                        options: result.departments.map((department) => {
                            const option = {
                                value: department.organizationId,
                                label: department.name,
                                departmentId: department.organizationId,
                                departmentName: department.name,
                                organizationId:
                                    result.organization.organizationId,
                                organizationName: result.organization.name,
                            };

                            map.set(department.organizationId, option);

                            return option;
                        }),
                    }));

                setDepartmentGroups(groups);
                setDepartmentMap(map);
                setFilterDepartmentIds((previous) =>
                    previous.filter((departmentId) => map.has(departmentId))
                );
            })
            .catch((error) => {
                if (!cancelled) {
                    setDepartmentGroups([]);
                    setDepartmentMap(new Map());
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [organizationIdsKey, organizationOptions, messageApi, open]);

    useEffect(() => {
        if (!open || !filterDepartmentIds.length) {
            setMemberOptions([]);
            return undefined;
        }

        let cancelled = false;

        setLoadingMembers(true);
        Promise.all(
            filterDepartmentIds
                .map((departmentId) => departmentMap.get(departmentId))
                .filter(Boolean)
                .map(async (department) => {
                    const users = await fetchSupportHandlerUsers(
                        department.organizationId,
                        department.departmentId
                    );

                    return users.map((user) => {
                        const taggedUser = {
                            ...user,
                            organizationId: department.organizationId,
                            organizationName: department.organizationName,
                            departmentId: department.departmentId,
                            departmentName: department.departmentName,
                        };

                        return {
                            ...taggedUser,
                            label: formatHandlerLabel(taggedUser),
                        };
                    });
                })
        )
            .then((results) => {
                if (!cancelled) {
                    // Một người thuộc nhiều phòng ban đã lọc chỉ hiện một lần
                    setMemberOptions(mergeUserOptions([], results.flat()));
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [departmentIdsKey, departmentMap, messageApi, open]);

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

    const handleOrganizationFilterChange = (organizationIds) => {
        setFilterOrganizationIds(organizationIds || []);
    };

    const handleDepartmentFilterChange = (departmentIds) => {
        setFilterDepartmentIds(departmentIds || []);
    };

    const handleMembersChange = (userIds) => {
        const users = (userIds || [])
            .map((userId) =>
                currentMemberOptions.find((item) => item.userId === userId)
            )
            .filter(Boolean);

        updateActiveDraft({ users });
    };

    const handleRemoveUser = (userId) => {
        updateActiveDraft({
            users: selectedUsers.filter((user) => user.userId !== userId),
        });
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
                `Vui lòng chọn ít nhất một người xử lý cho “${
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
                    message="Mỗi loại yêu cầu được gán cho nhiều người xử lý, có thể thuộc nhiều đơn vị, phòng ban khác nhau. Thay đổi áp dụng cho yêu cầu tạo mới và toàn bộ yêu cầu đang chờ xử lý."
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
                                            Chọn đơn vị, phòng ban để lọc danh sách
                                            thành viên rồi chọn người xử lý. Có thể
                                            lặp lại với đơn vị, phòng ban khác để
                                            chọn thêm người.
                                        </p>
                                    </div>
                                    <UsergroupAddOutlined
                                        style={{ color: "#0090cf", fontSize: 24 }}
                                    />
                                </EditorHeading>

                                <SelectGroup>
                                    <label className="select-label">Đơn vị</label>
                                    <Select
                                        mode="multiple"
                                        placeholder="Chọn Đơn vị"
                                        value={filterOrganizationIds}
                                        onChange={handleOrganizationFilterChange}
                                        options={organizationOptions}
                                        loading={loadingOrganizations}
                                        showSearch
                                        allowClear
                                        optionFilterProp="label"
                                        maxTagCount="responsive"
                                    />
                                </SelectGroup>

                                <SelectGroup>
                                    <label className="select-label">Phòng ban</label>
                                    <Select
                                        mode="multiple"
                                        placeholder="Chọn phòng ban"
                                        value={filterDepartmentIds}
                                        onChange={handleDepartmentFilterChange}
                                        options={departmentGroups}
                                        disabled={!filterOrganizationIds.length}
                                        loading={loadingDepartments}
                                        showSearch
                                        allowClear
                                        optionFilterProp="label"
                                        maxTagCount="responsive"
                                    />
                                </SelectGroup>

                                <SelectGroup>
                                    <label className="select-label">
                                        Người xử lý <span className="required">*</span>
                                    </label>
                                    <Select
                                        mode="multiple"
                                        placeholder={
                                            filterDepartmentIds.length
                                                ? "Chọn người xử lý"
                                                : "Chọn đơn vị, phòng ban để hiển thị thành viên"
                                        }
                                        value={selectedUsers.map(
                                            (user) => user.userId
                                        )}
                                        onChange={handleMembersChange}
                                        options={currentMemberOptions}
                                        disabled={!currentMemberOptions.length}
                                        loading={loadingMembers}
                                        showSearch
                                        allowClear
                                        optionFilterProp="label"
                                        maxTagCount="responsive"
                                    />
                                </SelectGroup>

                                <SelectedArea>
                                    <SelectedAreaHeader>
                                        Người xử lý đã chọn ({selectedUsers.length})
                                    </SelectedAreaHeader>
                                    <SelectedAreaContent>
                                        {selectedUsers.length === 0 ? (
                                            <SelectedEmpty>
                                                Chưa chọn người xử lý nào
                                            </SelectedEmpty>
                                        ) : (
                                            selectedUsers.map((user) => (
                                                <SelectedRow key={user.userId}>
                                                    <span>
                                                        {formatHandlerLabel(user)}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        className="selected-remove"
                                                        aria-label={`Bỏ chọn ${user.fullName || user.screenName}`}
                                                        onClick={() =>
                                                            handleRemoveUser(user.userId)
                                                        }
                                                    >
                                                        <CloseOutlined />
                                                    </button>
                                                </SelectedRow>
                                            ))
                                        )}
                                    </SelectedAreaContent>
                                </SelectedArea>
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
