import React, { useState, useMemo } from "react";
import { Select, Table, Pagination, Modal, DatePicker } from "antd";
import {
    FiList,
    FiRefreshCw,
    FiEye,
    FiCalendar,
    FiUser,
    FiAlertCircle,
    FiClock,
    FiCheckCircle,
} from "react-icons/fi";
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
    DetailRow,
} from "../style";
import {
    MOCK_MY_REQUESTS,
    REQUEST_STATUS_OPTIONS,
    REQUEST_STATUS_CONFIG,
    PRIORITY_CONFIG,
    PRIORITY_OPTIONS,
    PROCESS_OPTIONS,
} from "./constants";

const { RangePicker } = DatePicker;

const PAGE_SIZE = 5;

function MyRequests() {
    const [filters, setFilters] = useState({
        status: "all",
        priority: "all",
        process: "all",
        dateRange: null,
    });
    const [page, setPage] = useState(1);
    const [detailRecord, setDetailRecord] = useState(null);

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setPage(1);
    };

    const handleReset = () => {
        setFilters({ status: "all", priority: "all", process: "all", dateRange: null });
        setPage(1);
    };

    const filteredData = useMemo(() => {
        return MOCK_MY_REQUESTS.filter((item) => {
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
    }, [filters]);

    const pagedData = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filteredData.slice(start, start + PAGE_SIZE);
    }, [filteredData, page]);

    const columns = [
        {
            title: "Mã yêu cầu",
            dataIndex: "id",
            key: "id",
            width: 120,
            render: (text, record) => (
                <RequestIdText onClick={() => setDetailRecord(record)}>{text}</RequestIdText>
            ),
        },
        {
            title: "Tiêu đề",
            dataIndex: "title",
            key: "title",
            render: (text, record) => (
                <RequestTitleText onClick={() => setDetailRecord(record)}>{text}</RequestTitleText>
            ),
        },
        {
            title: "Quy trình",
            dataIndex: "process",
            key: "process",
            width: 130,
            render: (text) => (
                <span style={{ fontSize: 12, color: "#555" }}>{text}</span>
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
                <span style={{ fontSize: 12, color: "#555" }}>{text}</span>
            ),
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 100,
            render: (text) => (
                <span style={{ fontSize: 12, color: "#666" }}>{text}</span>
            ),
        },
        {
            title: "Hạn xử lý",
            dataIndex: "dueDate",
            key: "dueDate",
            width: 100,
            render: (text) => (
                <span style={{ fontSize: 12, color: "#666" }}>{text}</span>
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
                    onClick={() => setDetailRecord(record)}
                >
                    <FiEye size={15} />
                </button>
            ),
        },
    ];

    const statusOpts = [
        ...REQUEST_STATUS_OPTIONS,
    ];
    const priorityOpts = [
        { value: "all", label: "Tất cả ưu tiên" },
        ...PRIORITY_OPTIONS,
    ];
    const processOpts = [
        { value: "all", label: "Tất cả quy trình" },
        ...PROCESS_OPTIONS,
    ];

    const activeDetail = detailRecord;
    const detailStatusCfg = activeDetail ? (REQUEST_STATUS_CONFIG[activeDetail.status] || {}) : {};
    const detailPriorityCfg = activeDetail ? (PRIORITY_CONFIG[activeDetail.priority] || {}) : {};

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
                        value={filters.process}
                        options={processOpts}
                        onChange={(v) => handleFilterChange("process", v)}
                        style={{ width: 180 }}
                        size="small"
                    />
                </FilterGroup>

                <FilterGroup $flex={1}>
                    <span className="filter-label">Ngày tạo:</span>
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

            {/* Detail modal */}
            <Modal
                open={!!detailRecord}
                onCancel={() => setDetailRecord(null)}
                footer={null}
                title={
                    <span style={{ fontSize: 15, fontWeight: 600, color: "#333" }}>
                        Chi tiết yêu cầu
                    </span>
                }
                width={560}
            >
                {activeDetail && (
                    <div style={{ paddingTop: 8 }}>
                        <DetailRow>
                            <span className="detail-label">
                                <FiAlertCircle size={13} style={{ marginRight: 4, verticalAlign: "middle" }} />
                                Mã yêu cầu:
                            </span>
                            <span className="detail-value" style={{ color: "#0090CF", fontWeight: 600 }}>
                                {activeDetail.id}
                            </span>
                        </DetailRow>

                        <DetailRow>
                            <span className="detail-label">Tiêu đề:</span>
                            <span className="detail-value" style={{ fontWeight: 500 }}>
                                {activeDetail.title}
                            </span>
                        </DetailRow>

                        <DetailRow>
                            <span className="detail-label">Quy trình:</span>
                            <span className="detail-value">{activeDetail.process}</span>
                        </DetailRow>

                        <DetailRow>
                            <span className="detail-label">Quy trình con:</span>
                            <span className="detail-value">{activeDetail.subProcess}</span>
                        </DetailRow>

                        <DetailRow>
                            <span className="detail-label">Trạng thái:</span>
                            <span className="detail-value">
                                <StatusBadge $color={detailStatusCfg.color} $bg={detailStatusCfg.bg}>
                                    {detailStatusCfg.label}
                                </StatusBadge>
                            </span>
                        </DetailRow>

                        <DetailRow>
                            <span className="detail-label">Ưu tiên:</span>
                            <span className="detail-value">
                                <PriorityBadge $color={detailPriorityCfg.color} $bg={detailPriorityCfg.bg}>
                                    {detailPriorityCfg.label}
                                </PriorityBadge>
                            </span>
                        </DetailRow>

                        <DetailRow>
                            <span className="detail-label">
                                <FiUser size={13} style={{ marginRight: 4, verticalAlign: "middle" }} />
                                Người xử lý:
                            </span>
                            <span className="detail-value">{activeDetail.handler}</span>
                        </DetailRow>

                        <DetailRow>
                            <span className="detail-label">
                                <FiCalendar size={13} style={{ marginRight: 4, verticalAlign: "middle" }} />
                                Ngày tạo:
                            </span>
                            <span className="detail-value">{activeDetail.createdAt}</span>
                        </DetailRow>

                        <DetailRow>
                            <span className="detail-label">
                                <FiClock size={13} style={{ marginRight: 4, verticalAlign: "middle" }} />
                                Hạn xử lý:
                            </span>
                            <span className="detail-value">{activeDetail.dueDate}</span>
                        </DetailRow>

                        <DetailRow>
                            <span className="detail-label">
                                <FiCheckCircle size={13} style={{ marginRight: 4, verticalAlign: "middle" }} />
                                Cập nhật lần cuối:
                            </span>
                            <span className="detail-value">{activeDetail.updatedAt}</span>
                        </DetailRow>
                    </div>
                )}
            </Modal>
        </MyRequestsWrap>
    );
}

export default MyRequests;
