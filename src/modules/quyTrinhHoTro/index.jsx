import React, { useMemo, useState } from "react";
import { message, Tooltip } from "antd";
import { FiSettings } from "react-icons/fi";
import useUserInfo from "@/hooks/useUserInfo";
import {
    fetchSupportHandlerConfigurations,
    saveSupportHandlerConfigurations,
} from "@/services/supportHandlerSettingsService";
import {
    Sidebar,
    RequestForm,
    MyRequests,
    SupportRequestList,
    SupportHandlerSettingsModal,
    MENU_SECTIONS,
} from "./components";
import {
    PageWrap,
    PageHeader,
    HeaderActions,
    MyRequestButton,
    SettingsButton,
    ContentWrap,
} from "./style";

function QuyTrinhHoTroPage() {
    const [messageApi, contextHolder] = message.useMessage();
    const { user } = useUserInfo();

    // State cho màn danh sách (list view)
    const [listActiveSection, setListActiveSection] = useState("dich-vu-cntt");
    const [listActiveItem, setListActiveItem] = useState(null);

    // State cho màn tạo mới (form view) — độc lập với list
    const [formActiveSection, setFormActiveSection] = useState("dich-vu-cntt");
    const [formActiveItem, setFormActiveItem] = useState(null);

    // "support-list" | "form" | "my-requests"
    const [view, setView] = useState("support-list");
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [settingsLoading, setSettingsLoading] = useState(false);
    const [settingsSaving, setSettingsSaving] = useState(false);
    const [handlerConfigurations, setHandlerConfigurations] = useState([]);
    const [assignmentVersion, setAssignmentVersion] = useState(0);
    const [requestRefreshVersion, setRequestRefreshVersion] = useState(0);

    const isAllowUpdateSetting = useMemo(
        () => user?.screenName === "admin",
        [user]
    );
    const requestTypes = useMemo(
        () =>
            MENU_SECTIONS.flatMap((section) =>
                section.items.map((item) => ({
                    ...item,
                    processKey: section.key,
                }))
            ),
        []
    );

    // Sidebar hiển thị active theo view hiện tại
    const sidebarActiveSection = view === "support-list" ? listActiveSection : formActiveSection;
    const sidebarActiveItem = view === "support-list" ? listActiveItem : formActiveItem;

    const handleItemSelect = (sectionKey, itemKey) => {
        if (view === "support-list") {
            // Ở list view → chỉ filter danh sách, không chuyển view
            setListActiveSection(sectionKey);
            setListActiveItem(itemKey);
        } else {
            // Ở form / my-requests → cập nhật form state và đảm bảo về form view
            setFormActiveSection(sectionKey);
            setFormActiveItem(itemKey);
            if (view !== "form") setView("form");
        }
    };

    const handleCreateNew = () => {
        if (view === "form") {
            // Đang ở form → quay lại danh sách (giữ nguyên list state)
            setView("support-list");
        } else {
            // Đang ở list hoặc my-requests → mở form
            // Khởi tạo form state từ list state, nếu list chưa chọn mục nào thì lấy mục đầu tiên
            if (listActiveItem) {
                setFormActiveSection(listActiveSection);
                setFormActiveItem(listActiveItem);
            } else {
                const firstSection = MENU_SECTIONS[0];
                setFormActiveSection(firstSection.key);
                setFormActiveItem(firstSection.items[0].key);
            }
            setView("form");
        }
    };

    const handleOpenSettings = async () => {
        setSettingsOpen(true);
        setSettingsLoading(true);

        try {
            const items = await fetchSupportHandlerConfigurations();

            setHandlerConfigurations(items);
        } catch (error) {
            setSettingsOpen(false);
            messageApi.error(
                error?.message || "Không tải được cấu hình người xử lý."
            );
        } finally {
            setSettingsLoading(false);
        }
    };

    const handleCloseSettings = () => {
        if (!settingsSaving) {
            setSettingsOpen(false);
        }
    };

    const handleSaveSettings = async (items) => {
        setSettingsSaving(true);

        try {
            const result = await saveSupportHandlerConfigurations(items);

            setHandlerConfigurations(result.items || []);
            setAssignmentVersion((currentVersion) => currentVersion + 1);
            setRequestRefreshVersion((currentVersion) => currentVersion + 1);
            setSettingsOpen(false);
            messageApi.success(
                `Đã lưu cấu hình và cập nhật ${
                    result.updatedPendingRequestCount || 0
                } yêu cầu đang chờ xử lý.`
            );
        } catch (error) {
            messageApi.error(
                error?.message || "Không lưu được cấu hình người xử lý."
            );
        } finally {
            setSettingsSaving(false);
        }
    };

    const handleRequestCreated = (createdRequest) => {
        setListActiveSection(createdRequest.processKey);
        setListActiveItem(createdRequest.requestTypeKey);
        setRequestRefreshVersion((currentVersion) => currentVersion + 1);
        setView("support-list");
        messageApi.success(
            `Đã tạo yêu cầu ${createdRequest.requestCode || "hỗ trợ"}.`
        );
    };

    const headerTitle = view === "my-requests"
        ? "Yêu cầu của tôi"
        : view === "form"
        ? "Tạo yêu cầu hỗ trợ"
        : "Danh sách yêu cầu hỗ trợ";

    const CreateIcon = () => (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 3v10M3 8h10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );

    const SupportListIcon = () => (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 4h12M2 8h12M2 12h8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );

    const MySupportIcon = () => (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.6663 8.00004C14.6663 4.31814 11.6816 1.33337 7.99967 1.33337C4.31778 1.33337 1.33301 4.31814 1.33301 8.00004C1.33301 11.6819 4.31778 14.6667 7.99967 14.6667C11.6816 14.6667 14.6663 11.6819 14.6663 8.00004Z" fill="white" fillOpacity="0.2" />
            <path d="M10.133 7.73337C10.133 6.40789 9.05849 5.33337 7.73301 5.33337C6.40752 5.33337 5.33301 6.40789 5.33301 7.73337C5.33301 9.05886 6.40752 10.1334 7.73301 10.1334C9.05849 10.1334 10.133 9.05886 10.133 7.73337Z" fill="#0090CF" />
            <path d="M14.6663 8.00004C14.6663 4.31814 11.6816 1.33337 7.99967 1.33337C4.31778 1.33337 1.33301 4.31814 1.33301 8.00004C1.33301 11.6819 4.31778 14.6667 7.99967 14.6667C11.6816 14.6667 14.6663 11.6819 14.6663 8.00004Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M10.136 11.197C10.4289 11.4899 10.9038 11.4899 11.1967 11.197C11.4896 10.9041 11.4896 10.4293 11.1967 10.1364L10.6663 10.6667L10.136 11.197ZM9.59967 9.60004L9.06934 10.1304L10.136 11.197L10.6663 10.6667L11.1967 10.1364L10.13 9.06971L9.59967 9.60004ZM10.133 7.73337H10.883C10.883 5.99368 9.4727 4.58337 7.73301 4.58337V5.33337V6.08337C8.64428 6.08337 9.38301 6.8221 9.38301 7.73337H10.133ZM7.73301 5.33337V4.58337C5.99331 4.58337 4.58301 5.99368 4.58301 7.73337H5.33301H6.08301C6.08301 6.8221 6.82174 6.08337 7.73301 6.08337V5.33337ZM5.33301 7.73337H4.58301C4.58301 9.47307 5.99331 10.8834 7.73301 10.8834V10.1334V9.38337C6.82174 9.38337 6.08301 8.64464 6.08301 7.73337H5.33301ZM7.73301 10.1334V10.8834C9.4727 10.8834 10.883 9.47307 10.883 7.73337H10.133H9.38301C9.38301 8.64464 8.64428 9.38337 7.73301 9.38337V10.1334Z" fill="white" />
        </svg>
    );

    return (
        <PageWrap>
            {contextHolder}
            <PageHeader>
                <span className="header-title">{headerTitle}</span>
                <HeaderActions>
                    {isAllowUpdateSetting && (
                        <Tooltip title="Cấu hình người xử lý yêu cầu hỗ trợ">
                            <SettingsButton
                                type="button"
                                onClick={handleOpenSettings}
                                aria-label="Cấu hình người xử lý yêu cầu hỗ trợ"
                            >
                                <FiSettings size={18} />
                            </SettingsButton>
                        </Tooltip>
                    )}
                    <MyRequestButton
                        onClick={handleCreateNew}
                        style={view === "form" ? { background: "#007bb5" } : {}}
                    >
                        {view === "form" ? <SupportListIcon /> : <CreateIcon />}
                        {view === "form" ? "Danh sách" : "Tạo mới yêu cầu hỗ trợ"}
                    </MyRequestButton>
                    <MyRequestButton
                        onClick={() => setView((v) => v === "my-requests" ? "support-list" : "my-requests")}
                        style={view === "my-requests" ? { background: "#007bb5" } : {}}
                    >
                        <MySupportIcon />
                        {view === "my-requests" ? "Quay lại danh sách" : "Yêu cầu của tôi"}
                    </MyRequestButton>
                </HeaderActions>
            </PageHeader>

            <ContentWrap>
                <Sidebar
                    activeSection={sidebarActiveSection}
                    activeItem={sidebarActiveItem}
                    onItemSelect={handleItemSelect}
                />
                {view === "my-requests" ? (
                    <MyRequests refreshVersion={requestRefreshVersion} />
                ) : view === "form" ? (
                    <RequestForm
                        activeItem={formActiveItem}
                        activeSection={formActiveSection}
                        assignmentVersion={assignmentVersion}
                        onCreated={handleRequestCreated}
                    />
                ) : (
                    <SupportRequestList
                        activeItem={listActiveItem}
                        activeSection={listActiveSection}
                        refreshVersion={requestRefreshVersion}
                    />
                )}
            </ContentWrap>

            <SupportHandlerSettingsModal
                open={settingsOpen}
                requestTypes={requestTypes}
                configurations={handlerConfigurations}
                loading={settingsLoading}
                saving={settingsSaving}
                onCancel={handleCloseSettings}
                onSave={handleSaveSettings}
            />
        </PageWrap>
    );
}

export default QuyTrinhHoTroPage;
