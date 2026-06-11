import React, { useState, useMemo, useEffect } from "react";
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
    RequestTitleText,
    TablePaginationWrap,
} from "../style";
import {
    MOCK_SUPPORT_REQUESTS,
    PRIORITY_CONFIG,
    PRIORITY_OPTIONS,
    SUB_PROCESS_OPTIONS,
    REQUEST_STATUS_CONFIG,
    REQUEST_STATUS_OPTIONS,
} from "./constants";
import SupportRequestDetail from "./SupportRequestDetail";

const { RangePicker } = DatePicker;

const PAGE_SIZE = 15;

const ROW_STATUS_OPTIONS = REQUEST_STATUS_OPTIONS.filter((o) => o.value !== "all");

// Lấy label sub-process từ key sidebar
const getSubProcessLabel = (itemKey) => {
    if (!itemKey) return "all";
    for (const opts of Object.values(SUB_PROCESS_OPTIONS)) {
        const found = opts.find((o) => o.value === itemKey);
        if (found) return found.label;
    }
    return "all";
};

// Tất cả sub-process options (dùng label làm value để match với mock data)
const SUB_PROCESS_FILTER_OPTS = [
    { value: "all", label: "Tất cả quy trình" },
    ...Object.values(SUB_PROCESS_OPTIONS)
        .flat()
        .map((o) => ({ value: o.label, label: o.label })),
];

function SupportRequestList({ activeItem, activeSection }) {
    const [data, setData] = useState(MOCK_SUPPORT_REQUESTS);
    const [filters, setFilters] = useState({
        status: "all",
        priority: "all",
        subProcess: getSubProcessLabel(activeItem),
        dateRange: null,
    });
    const [page, setPage] = useState(1);
    const [selectedId, setSelectedId] = useState(null);

    // Khi sidebar thay đổi → cập nhật filter sub-process
    useEffect(() => {
        setFilters((prev) => ({ ...prev, subProcess: getSubProcessLabel(activeItem) }));
        setPage(1);
    }, [activeItem]);

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
        setFilters({
            status: "all",
            priority: "all",
            subProcess: getSubProcessLabel(activeItem),
            dateRange: null,
        });
        setPage(1);
    };

    const filteredData = useMemo(() => {
        return data.filter((item) => {
            if (filters.status !== "all" && item.status !== filters.status) return false;
            if (filters.priority !== "all" && item.priority !== filters.priority) return false;
            if (filters.subProcess !== "all" && item.subProcess !== filters.subProcess) return false;
            if (filters.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
                const due = new Date(item.dueDate);
                const from = filters.dateRange[0].startOf("day").toDate();
                const to = filters.dateRange[1].endOf("day").toDate();
                if (due < from || due > to) return false;
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
            <SupportRequestDetail
                record={selectedRecord}
                onBack={() => setSelectedId(null)}
                onStatusChange={handleStatusChange}
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
            dataIndex: "subProcess",
            key: "subProcess",
            width: 180,
            render: (text) => (
                <span style={{ fontSize: 13, color: "#555" }}>{text}</span>
            ),
        },
        {
            title: "Tiêu đề",
            dataIndex: "title",
            key: "title",
            render: (text, record) => (
                <RequestTitleText onClick={() => setSelectedId(record.id)}>
                    {text}
                </RequestTitleText>
            ),
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
            title: "Người theo dõi",
            dataIndex: "watcher",
            key: "watcher",
            width: 130,
            render: (text) => (
                <span style={{ fontSize: 13, color: "#555" }}>{text}</span>
            ),
        },
        {
            title: "Ngày cần hoàn thành",
            dataIndex: "dueDate",
            key: "dueDate",
            width: 160,
            render: (text) => (
                <span style={{ fontSize: 13, color: "#666" }}>{text}</span>
            ),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            width: 140,
            align: "center",
            render: (value, record) => (
                <Select
                    value={value}
                    options={ROW_STATUS_OPTIONS}
                    onChange={(v) => handleStatusChange(record.id, v)}
                    size="small"
                    style={{ width: 120 }}
                    styles={{ popup: { root: { minWidth: 130 } } }}
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
            ),
        },
        {
            title: "Mức độ ưu tiên",
            dataIndex: "priority",
            key: "priority",
            width: 130,
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

    return (
        <MyRequestsWrap>
            <MyRequestsHeader>
                <FiList size={16} color="rgba(0,144,207,1)" />
                <span className="mr-title">Danh sách yêu cầu hỗ trợ</span>
            </MyRequestsHeader>

            <MyRequestsFilter>
                <span className="filter-label">Lọc theo:</span>

                <FilterGroup>
                    <Select
                        value={filters.status}
                        options={statusOpts}
                        onChange={(v) => handleFilterChange("status", v)}
                        style={{ width: 160 }}
                        size="small"
                    />
                </FilterGroup>

                <FilterGroup>
                    <Select
                        value={filters.priority}
                        options={priorityOpts}
                        onChange={(v) => handleFilterChange("priority", v)}
                        style={{ width: 150 }}
                        size="small"
                    />
                </FilterGroup>

                <FilterGroup>
                    <Select
                        value={filters.subProcess}
                        options={SUB_PROCESS_FILTER_OPTS}
                        onChange={(v) => handleFilterChange("subProcess", v)}
                        style={{ width: 220 }}
                        size="small"
                    />
                </FilterGroup>

                <FilterGroup $flex={1}>
                    <span className="filter-label">Ngày hoàn thành:</span>
                    <RangePicker
                        size="small"
                        format="DD/MM/YYYY"
                        value={filters.dateRange}
                        onChange={(dates) => handleFilterChange("dateRange", dates)}
                        placeholder={["Từ ngày", "Đến ngày"]}
                        style={{ flex: 1, minWidth: 220 }}
                    />
                </FilterGroup>

                <ResetFilterBtn onClick={handleReset}>
                    <FiRefreshCw size={12} />
                    Đặt lại
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

export default SupportRequestList;
