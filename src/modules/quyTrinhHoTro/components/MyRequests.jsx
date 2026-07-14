import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { DatePicker, message, Pagination, Select, Table } from "antd";
import { FiEye, FiList, FiRefreshCw } from "react-icons/fi";
import { fetchSupportRequests } from "@/services/supportRequestService";
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
    RequestIdText,
    RequestTitleText,
    TablePaginationWrap,
} from "../style";
import {
    REQUEST_STATUS_OPTIONS,
    REQUEST_STATUS_CONFIG,
    PRIORITY_CONFIG,
    PRIORITY_OPTIONS,
    PROCESS_OPTIONS,
    getProcessLabel,
} from "./constants";
import SupportRequestDetail from "./SupportRequestDetail";

const { RangePicker } = DatePicker;
const PAGE_SIZE = 5;

function MyRequests({ refreshVersion }) {
    const [messageApi, contextHolder] = message.useMessage();
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        status: "all",
        priority: "all",
        process: "all",
        dateRange: null,
    });
    const [page, setPage] = useState(1);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        let cancelled = false;

        setLoading(true);
        fetchSupportRequests({
            mine: true,
            page,
            pageSize: PAGE_SIZE,
            status: filters.status,
            priority: filters.priority,
            processKey: filters.process,
            createdFrom: filters.dateRange?.[0]?.format("YYYY-MM-DD") || "",
            createdTo: filters.dateRange?.[1]?.format("YYYY-MM-DD") || "",
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
                        error?.message || "Không tải được yêu cầu của tôi."
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
        filters.dateRange,
        filters.priority,
        filters.process,
        filters.status,
        messageApi,
        page,
        refreshVersion,
    ]);

    const handleFilterChange = (key, value) => {
        setFilters((previousFilters) => ({ ...previousFilters, [key]: value }));
        setPage(1);
    };

    const handleReset = () => {
        setFilters({
            status: "all",
            priority: "all",
            process: "all",
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
            title: "Mã yêu cầu",
            dataIndex: "requestCode",
            key: "requestCode",
            width: 145,
            render: (text, record) => (
                <RequestIdText onClick={() => setSelectedId(record.requestId)}>
                    {text}
                </RequestIdText>
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
            title: "Quy trình",
            dataIndex: "processKey",
            key: "processKey",
            width: 130,
            render: (value) => (
                <span style={{ fontSize: 13, color: "#555" }}>
                    {getProcessLabel(value)}
                </span>
            ),
        },
        {
            title: "Ưu tiên",
            dataIndex: "priority",
            key: "priority",
            width: 100,
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
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            width: 120,
            align: "center",
            render: (value) => {
                const config = REQUEST_STATUS_CONFIG[value] || {};

                return (
                    <StatusBadge $color={config.color} $bg={config.bg}>
                        {config.label}
                    </StatusBadge>
                );
            },
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
            title: "Ngày tạo",
            dataIndex: "createDate",
            key: "createDate",
            width: 110,
            render: (text) => (
                <span style={{ fontSize: 13, color: "#666" }}>
                    {formatDate(text)}
                </span>
            ),
        },
        {
            title: "Hạn xử lý",
            dataIndex: "dueDate",
            key: "dueDate",
            width: 110,
            render: (text) => (
                <span style={{ fontSize: 13, color: "#666" }}>
                    {formatDate(text) || "—"}
                </span>
            ),
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
                <span className="mr-title">Yêu cầu của tôi</span>
            </MyRequestsHeader>

            <MyRequestsFilter>
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
                        value={filters.process}
                        options={[
                            { value: "all", label: "Tất cả quy trình" },
                            ...PROCESS_OPTIONS,
                        ]}
                        onChange={(value) => handleFilterChange("process", value)}
                        style={{ width: 180 }}
                    />
                </FilterGroup>

                <FilterGroup $flex={1} className="range-filter-group">
                    <RangePicker
                        format="DD/MM/YYYY"
                        value={filters.dateRange}
                        onChange={(dates) => handleFilterChange("dateRange", dates)}
                        placeholder={["Từ ngày", "Đến ngày"]}
                        style={{ flex: 1, minWidth: 0 }}
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

MyRequests.propTypes = {
    refreshVersion: PropTypes.number,
};

MyRequests.defaultProps = {
    refreshVersion: 0,
};

export default MyRequests;
