import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { DatePicker, Input, message, Pagination, Select, Table } from "antd";
import { FiEye, FiList, FiRefreshCw, FiSearch } from "react-icons/fi";
import {
    fetchSupportRequests,
    updateSupportRequestStatus,
} from "@/services/supportRequestService";
import { formatDate } from "@/utils/dateUtils";
import {
    MyRequestsWrap,
    MyRequestsHeader,
    MyRequestsFilter,
    FilterGroup,
    ResetFilterBtn,
    MyRequestsTable,
    TableSummary,
    StatusBadge,
    PriorityBadge,
    RequestTitleText,
    TablePaginationWrap,
} from "../style";
import {
    PRIORITY_CONFIG,
    PRIORITY_OPTIONS,
    SUB_PROCESS_OPTIONS,
    REQUEST_STATUS_CONFIG,
    REQUEST_STATUS_OPTIONS,
    getRequestTypeLabel,
} from "./constants";
import SupportRequestDetail from "./SupportRequestDetail";

const { RangePicker } = DatePicker;
const PAGE_SIZE = 15;
const ROW_STATUS_OPTIONS = REQUEST_STATUS_OPTIONS.filter(
    (option) => option.value !== "all"
);
const SUB_PROCESS_FILTER_OPTIONS = [
    { value: "all", label: "Tất cả quy trình" },
    ...Object.values(SUB_PROCESS_OPTIONS).flat(),
];

function SupportRequestList({ activeItem, activeSection, refreshVersion }) {
    const [messageApi, contextHolder] = message.useMessage();
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({
        status: "all",
        priority: "all",
        subProcess: activeItem || "all",
        dateRange: null,
    });
    const [page, setPage] = useState(1);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        setFilters((previousFilters) => ({
            ...previousFilters,
            subProcess: activeItem || "all",
        }));
        setPage(1);
    }, [activeItem]);

    useEffect(() => {
        let cancelled = false;

        setLoading(true);
        fetchSupportRequests({
            page,
            pageSize: PAGE_SIZE,
            search: search.trim(),
            status: filters.status,
            priority: filters.priority,
            processKey: activeSection,
            requestTypeKey: filters.subProcess,
            dueFrom: filters.dateRange?.[0]?.format("YYYY-MM-DD") || "",
            dueTo: filters.dateRange?.[1]?.format("YYYY-MM-DD") || "",
        })
            .then((result) => {
                if (!cancelled) {
                    setData(result.items || []);
                    setTotal(result.total || 0);
                }
            })
            .catch((error) => {
                if (!cancelled) {
                    setData([]);
                    setTotal(0);
                    messageApi.error(
                        error?.message || "Không tải được danh sách yêu cầu hỗ trợ."
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
    }, [
        activeSection,
        filters.dateRange,
        filters.priority,
        filters.status,
        filters.subProcess,
        messageApi,
        page,
        refreshVersion,
        search,
    ]);

    const handleStatusChange = async (requestId, status) => {
        setUpdatingId(requestId);

        try {
            const updatedRequest = await updateSupportRequestStatus(
                requestId,
                status
            );

            setData((currentData) =>
                currentData.map((item) =>
                    item.requestId === requestId ? updatedRequest : item
                )
            );
            messageApi.success("Đã cập nhật trạng thái yêu cầu.");
        } catch (error) {
            messageApi.error(
                error?.message || "Không cập nhật được trạng thái yêu cầu."
            );
        } finally {
            setUpdatingId(null);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters((previousFilters) => ({ ...previousFilters, [key]: value }));
        setPage(1);
    };

    const handleReset = () => {
        setSearch("");
        setFilters({
            status: "all",
            priority: "all",
            subProcess: activeItem || "all",
            dateRange: null,
        });
        setPage(1);
    };

    const handleRecordUpdated = (updatedRequest) => {
        setData((currentData) =>
            currentData.map((item) =>
                item.requestId === updatedRequest.requestId ? updatedRequest : item
            )
        );
    };

    if (selectedId) {
        return (
            <SupportRequestDetail
                requestId={selectedId}
                refreshVersion={refreshVersion}
                onBack={() => setSelectedId(null)}
                onRecordUpdated={handleRecordUpdated}
            />
        );
    }

    const columns = [
        {
            title: "STT",
            key: "stt",
            width: 52,
            align: "center",
            render: (_, __, index) => (
                <span style={{ fontSize: 13, color: "#888" }}>
                    {(page - 1) * PAGE_SIZE + index + 1}
                </span>
            ),
        },
        {
            title: "Tên quy trình",
            dataIndex: "requestTypeKey",
            key: "requestTypeKey",
            width: 180,
            render: (value) => (
                <span style={{ fontSize: 13, color: "#555" }}>
                    {getRequestTypeLabel(value)}
                </span>
            ),
        },
        {
            title: "Tiêu đề",
            dataIndex: "title",
            key: "title",
            render: (text, record) => (
                <RequestTitleText onClick={() => setSelectedId(record.requestId)}>
                    {text}
                </RequestTitleText>
            ),
        },
        {
            title: "Người xử lý",
            dataIndex: "handler",
            key: "handler",
            width: 240,
            render: (text) => (
                <span style={{ fontSize: 13, color: "#555" }}>{text || "—"}</span>
            ),
        },
        {
            title: "Người theo dõi",
            dataIndex: "watcher",
            key: "watcher",
            width: 150,
            render: (text) => (
                <span style={{ fontSize: 13, color: "#555" }}>{text || "—"}</span>
            ),
        },
        {
            title: "Ngày cần hoàn thành",
            dataIndex: "dueDate",
            key: "dueDate",
            width: 160,
            render: (text) => (
                <span style={{ fontSize: 13, color: "#666" }}>
                    {formatDate(text) || "—"}
                </span>
            ),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            width: 150,
            align: "center",
            render: (value, record) => (
                <Select
                    value={value}
                    options={ROW_STATUS_OPTIONS}
                    onChange={(nextStatus) =>
                        handleStatusChange(record.requestId, nextStatus)
                    }
                    disabled={!record.canUpdateStatus}
                    loading={updatingId === record.requestId}
                    size="small"
                    style={{ width: 130 }}
                    labelRender={({ value: selectedValue }) => {
                        const config = REQUEST_STATUS_CONFIG[selectedValue] || {};

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
                        const config = REQUEST_STATUS_CONFIG[option.value] || {};

                        return (
                            <StatusBadge $color={config.color} $bg={config.bg}>
                                {config.label}
                            </StatusBadge>
                        );
                    }}
                />
            ),
        },
        {
            title: "Mức độ ưu tiên",
            dataIndex: "priority",
            key: "priority",
            width: 130,
            align: "center",
            render: (value) => {
                const config = PRIORITY_CONFIG[value] || {};

                return (
                    <PriorityBadge $color={config.color} $bg={config.bg}>
                        {config.label}
                    </PriorityBadge>
                );
            },
        },
        {
            title: "",
            key: "action",
            width: 48,
            align: "center",
            render: (_, record) => (
                <button
                    type="button"
                    style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        color: "#0090CF",
                        padding: "4px",
                        display: "flex",
                        alignItems: "center",
                    }}
                    title="Xem chi tiết"
                    onClick={() => setSelectedId(record.requestId)}
                >
                    <FiEye size={15} />
                </button>
            ),
        },
    ];

    return (
        <MyRequestsWrap>
            {contextHolder}
            <MyRequestsHeader>
                <FiList size={16} color="rgba(0,144,207,1)" />
                <span className="mr-title">Danh sách yêu cầu hỗ trợ</span>
            </MyRequestsHeader>

            <MyRequestsFilter>
                <Input
                    prefix={<FiSearch size={13} color="#999" />}
                    placeholder="Tìm theo tiêu đề, người tạo..."
                    value={search}
                    onChange={(event) => {
                        setSearch(event.target.value);
                        setPage(1);
                    }}
                    allowClear
                />

                <span className="filter-label">Lọc theo:</span>

                <FilterGroup>
                    <Select
                        value={filters.status}
                        options={REQUEST_STATUS_OPTIONS}
                        onChange={(value) => handleFilterChange("status", value)}
                        style={{ width: 160 }}
                    />
                </FilterGroup>

                <FilterGroup>
                    <Select
                        value={filters.priority}
                        options={[
                            { value: "all", label: "Tất cả ưu tiên" },
                            ...PRIORITY_OPTIONS,
                        ]}
                        onChange={(value) => handleFilterChange("priority", value)}
                        style={{ width: 150 }}
                    />
                </FilterGroup>

                <FilterGroup>
                    <Select
                        value={filters.subProcess}
                        options={SUB_PROCESS_FILTER_OPTIONS}
                        onChange={(value) =>
                            handleFilterChange("subProcess", value)
                        }
                        style={{ width: 220 }}
                    />
                </FilterGroup>

                <FilterGroup $flex={1} className="range-filter-group">
                    <RangePicker
                        format="DD/MM/YYYY"
                        value={filters.dateRange}
                        onChange={(dates) => handleFilterChange("dateRange", dates)}
                        placeholder={["Từ ngày", "Đến ngày"]}
                        style={{ flex: 1, minWidth: 200 }}
                    />
                </FilterGroup>

                <ResetFilterBtn type="button" onClick={handleReset} title="Đặt lại">
                    <FiRefreshCw size={14} />
                </ResetFilterBtn>
            </MyRequestsFilter>

            <MyRequestsTable>
                <TableSummary>
                    <span className="summary-text">
                        Tổng số: <span>{total}</span> yêu cầu
                    </span>
                </TableSummary>

                <Table
                    dataSource={data}
                    columns={columns}
                    rowKey="requestId"
                    pagination={false}
                    loading={loading}
                    size="small"
                    locale={{ emptyText: "Không có yêu cầu nào" }}
                    rowClassName={(_, index) =>
                        index % 2 === 0 ? "" : "table-row-alt"
                    }
                    style={{ fontSize: 13 }}
                    scroll={{ x: "max-content" }}
                />

                <TablePaginationWrap>
                    <Pagination
                        current={page}
                        pageSize={PAGE_SIZE}
                        total={total}
                        onChange={setPage}
                        showSizeChanger={false}
                        showTotal={(count, range) =>
                            `${range[0]}-${range[1]} / ${count} yêu cầu`
                        }
                        size="small"
                    />
                </TablePaginationWrap>
            </MyRequestsTable>
        </MyRequestsWrap>
    );
}

SupportRequestList.propTypes = {
    activeItem: PropTypes.string,
    activeSection: PropTypes.string,
    refreshVersion: PropTypes.number,
};

SupportRequestList.defaultProps = {
    activeItem: null,
    activeSection: "dich-vu-cntt",
    refreshVersion: 0,
};

export default SupportRequestList;
