import React, { useState, useMemo } from "react";
import { Select, Table, Pagination, DatePicker } from "antd";
import { FiList, FiRefreshCw, FiEye } from "react-icons/fi";
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
    MOCK_MY_REQUESTS,
    REQUEST_STATUS_OPTIONS,
    REQUEST_STATUS_CONFIG,
    PRIORITY_CONFIG,
    PRIORITY_OPTIONS,
    PROCESS_OPTIONS,
} from "./constants";
import MyRequestDetail from "./MyRequestDetail";

const { RangePicker } = DatePicker;

const PAGE_SIZE = 5;

function MyRequests() {
    const [data, setData] = useState(MOCK_MY_REQUESTS);
    const [filters, setFilters] = useState({
        status: "all",
        priority: "all",
        process: "all",
        dateRange: null,
    });
    const [page, setPage] = useState(1);
    const [selectedId, setSelectedId] = useState(null);

    const handleStatusChange = (id, newStatus) => {
        setData((prev) =>
            prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
    };

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setPage(1);
    };

    const handleReset = () => {
        setFilters({ status: "all", priority: "all", process: "all", dateRange: null });
        setPage(1);
    };

    const filteredData = useMemo(() => {
        return data.filter((item) => {
            if (filters.status !== "all" && item.status !== filters.status) return false;
            if (filters.priority !== "all" && item.priority !== filters.priority) return false;
            if (filters.process !== "all") {
                const processLabel = PROCESS_OPTIONS.find((p) => p.value === filters.process)?.label;
                if (processLabel && item.process !== processLabel) return false;
            }
            if (filters.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
                const created = new Date(item.createdAt);
                const from = filters.dateRange[0].startOf("day").toDate();
                const to = filters.dateRange[1].endOf("day").toDate();
                if (created < from || created > to) return false;
            }
            return true;
        });
    }, [filters, data]);

    const pagedData = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filteredData.slice(start, start + PAGE_SIZE);
    }, [filteredData, page]);

    // Nếu đang xem chi tiết → hiển thị trang chi tiết
    const selectedRecord = selectedId ? data.find((item) => item.id === selectedId) : null;
    if (selectedRecord) {
        return (
            <MyRequestDetail
                record={selectedRecord}
                onBack={() => setSelectedId(null)}
                onStatusChange={handleStatusChange}
            />
        );
    }

    const columns = [
        {
            title: "Mã yêu cầu",
            dataIndex: "id",
            key: "id",
            width: 120,
            render: (text, record) => (
                <RequestIdText onClick={() => setSelectedId(record.id)}>{text}</RequestIdText>
            ),
        },
        {
            title: "Tiêu đề",
            dataIndex: "title",
            key: "title",
            render: (text, record) => (
                <RequestTitleText onClick={() => setSelectedId(record.id)}>{text}</RequestTitleText>
            ),
        },
        {
            title: "Quy trình",
            dataIndex: "process",
            key: "process",
            width: 130,
            render: (text) => (
                <span style={{ fontSize: 13, color: "#555" }}>{text}</span>
            ),
        },
        {
            title: "Ưu tiên",
            dataIndex: "priority",
            key: "priority",
            width: 100,
            align: "center",
            render: (value) => {
                const cfg = PRIORITY_CONFIG[value] || {};
                return (
                    <PriorityBadge $color={cfg.color} $bg={cfg.bg}>
                        {cfg.label}
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
                const cfg = REQUEST_STATUS_CONFIG[value] || {};
                return (
                    <StatusBadge $color={cfg.color} $bg={cfg.bg}>
                        {cfg.label}
                    </StatusBadge>
                );
            },
        },
        {
            title: "Người xử lý",
            dataIndex: "handler",
            key: "handler",
            width: 130,
            render: (text) => (
                <span style={{ fontSize: 13, color: "#555" }}>{text}</span>
            ),
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 100,
            render: (text) => (
                <span style={{ fontSize: 13, color: "#666" }}>{text}</span>
            ),
        },
        {
            title: "Hạn xử lý",
            dataIndex: "dueDate",
            key: "dueDate",
            width: 100,
            render: (text) => (
                <span style={{ fontSize: 13, color: "#666" }}>{text}</span>
            ),
        },
        {
            title: "",
            key: "action",
            width: 48,
            align: "center",
            render: (_, record) => (
                <button
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
                    onClick={() => setSelectedId(record.id)}
                >
                    <FiEye size={15} />
                </button>
            ),
        },
    ];

    const statusOpts = [...REQUEST_STATUS_OPTIONS];
    const priorityOpts = [
        { value: "all", label: "Tất cả ưu tiên" },
        ...PRIORITY_OPTIONS,
    ];
    const processOpts = [
        { value: "all", label: "Tất cả quy trình" },
        ...PROCESS_OPTIONS,
    ];

    return (
        <MyRequestsWrap>
            <MyRequestsHeader>
                <FiList size={16} color="rgba(0,144,207,1)" />
                <span className="mr-title">Yêu cầu của tôi</span>
            </MyRequestsHeader>

            <MyRequestsFilter>
                <span className="filter-label">Lọc theo:</span>

                <FilterGroup>
                    <Select
                        value={filters.status}
                        options={statusOpts}
                        onChange={(v) => handleFilterChange("status", v)}
                        style={{ width: 160 }}
                    />
                </FilterGroup>

                <FilterGroup>
                    <Select
                        value={filters.priority}
                        options={priorityOpts}
                        onChange={(v) => handleFilterChange("priority", v)}
                        style={{ width: 150 }}
                    />
                </FilterGroup>

                <FilterGroup>
                    <Select
                        value={filters.process}
                        options={processOpts}
                        onChange={(v) => handleFilterChange("process", v)}
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

                <ResetFilterBtn onClick={handleReset} title="Đặt lại">
                    <FiRefreshCw size={14} />
                </ResetFilterBtn>
            </MyRequestsFilter>

            <MyRequestsTable>
                <TableSummary>
                    <span className="summary-text">
                        Tổng số: <span>{filteredData.length}</span> yêu cầu
                    </span>
                </TableSummary>

                <Table
                    dataSource={pagedData}
                    columns={columns}
                    rowKey="id"
                    pagination={false}
                    size="small"
                    locale={{ emptyText: "Không có yêu cầu nào" }}
                    rowClassName={(_, idx) => (idx % 2 === 0 ? "" : "table-row-alt")}
                    style={{ fontSize: 13 }}
                    scroll={{ x: "max-content" }}
                />

                <TablePaginationWrap>
                    <Pagination
                        current={page}
                        pageSize={PAGE_SIZE}
                        total={filteredData.length}
                        onChange={setPage}
                        showSizeChanger={false}
                        showTotal={(total, range) =>
                            `${range[0]}-${range[1]} / ${total} yêu cầu`
                        }
                        size="small"
                    />
                </TablePaginationWrap>
            </MyRequestsTable>
        </MyRequestsWrap>
    );
}

export default MyRequests;
