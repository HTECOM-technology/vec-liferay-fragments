import React, { useState, useMemo, useCallback } from "react";
import { Select, Input } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import SalaryCard from "./SalaryCard";
import SalaryDetailModal from "./SalaryDetailModal";
import {
    SalaryContainer,
    SalaryHeader,
    SalaryTitle,
    FilterSection,
    FilterSelect,
    CardsGrid,
    PaginationContainer,
    PaginationInfo,
    PaginationNav,
    GoToPage,
} from "./style";

// Mock data cho phiếu lương
const generateSalaryData = () => {
    const data = [];
    const currentYear = 2025;

    for (let month = 12; month >= 1; month--) {
        data.push({
            id: `salary-${currentYear}-${month}`,
            hoTen: "Nguyễn Văn A",
            maNV: "VEC0123",
            kyLuong: `${String(month).padStart(2, "0")}/${currentYear}`,
            chucVu: "Chuyên viên",
            phongBan: "Văn phòng",
            thang: month,
            nam: currentYear,
        });
    }

    // Thêm dữ liệu năm trước
    for (let month = 12; month >= 1; month--) {
        data.push({
            id: `salary-${currentYear - 1}-${month}`,
            hoTen: "Nguyễn Văn A",
            maNV: "VEC0123",
            kyLuong: `${String(month).padStart(2, "0")}/${currentYear - 1}`,
            chucVu: "Chuyên viên",
            phongBan: "Văn phòng",
            thang: month,
            nam: currentYear - 1,
        });
    }

    // Thêm thêm dữ liệu để có 61 phiếu
    for (let i = 0; i < 37; i++) {
        const year = 2023 - Math.floor(i / 12);
        const month = 12 - (i % 12);
        data.push({
            id: `salary-${year}-${month}-extra-${i}`,
            hoTen: "Nguyễn Văn A",
            maNV: "VEC0123",
            kyLuong: `${String(month).padStart(2, "0")}/${year}`,
            chucVu: "Chuyên viên",
            phongBan: "Văn phòng",
            thang: month,
            nam: year,
        });
    }

    return data;
};

const mockSalaryData = generateSalaryData();

function SalaryTab() {
    // State cho filters
    const [filters, setFilters] = useState({
        thang: "",
        nam: "",
        sapXep: "moinhat",
    });

    // State cho pagination
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 12,
    });

    // State cho modal chi tiết phiếu lương
    const [selectedSalary, setSelectedSalary] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Options cho các filter
    const thangOptions = [
        { value: "", label: "Chọn tháng" },
        ...Array.from({ length: 12 }, (_, i) => ({
            value: i + 1,
            label: `Tháng ${i + 1}`,
        })),
    ];

    const namOptions = [
        { value: "", label: "Năm" },
        { value: 2025, label: "2025" },
        { value: 2024, label: "2024" },
        { value: 2023, label: "2023" },
        { value: 2022, label: "2022" },
    ];

    const sapXepOptions = [
        { value: "moinhat", label: "Mới nhất" },
        { value: "cunhat", label: "Cũ nhất" },
    ];

    // Lọc và sắp xếp dữ liệu
    const filteredData = useMemo(() => {
        let result = [...mockSalaryData];

        // Lọc theo tháng
        if (filters.thang) {
            result = result.filter((item) => item.thang === filters.thang);
        }

        // Lọc theo năm
        if (filters.nam) {
            result = result.filter((item) => item.nam === filters.nam);
        }

        // Sắp xếp
        if (filters.sapXep === "cunhat") {
            result.sort((a, b) => {
                if (a.nam !== b.nam) return a.nam - b.nam;
                return a.thang - b.thang;
            });
        } else {
            result.sort((a, b) => {
                if (a.nam !== b.nam) return b.nam - a.nam;
                return b.thang - a.thang;
            });
        }

        return result;
    }, [filters]);

    // Dữ liệu hiển thị theo pagination
    const paginatedData = useMemo(() => {
        const { current, pageSize } = pagination;
        const startIndex = (current - 1) * pageSize;
        return filteredData.slice(startIndex, startIndex + pageSize);
    }, [filteredData, pagination]);

    const totalPages = Math.ceil(filteredData.length / pagination.pageSize);

    // Handlers
    const handleFilterChange = useCallback((field, value) => {
        setFilters((prev) => ({
            ...prev,
            [field]: value,
        }));
        setPagination((prev) => ({
            ...prev,
            current: 1,
        }));
    }, []);

    const handlePaginationChange = useCallback((page) => {
        setPagination((prev) => ({
            ...prev,
            current: page,
        }));
    }, []);

    const handlePageSizeChange = useCallback((size) => {
        setPagination({
            current: 1,
            pageSize: size,
        });
    }, []);

    const handleCardClick = useCallback((salary) => {
        setSelectedSalary(salary);
        setIsModalVisible(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalVisible(false);
        setSelectedSalary(null);
    }, []);

    // Render pagination numbers
    const renderPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 6;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (pagination.current <= 4) {
                for (let i = 1; i <= 6; i++) {
                    pages.push(i);
                }
                pages.push("...");
                pages.push(totalPages);
            } else if (pagination.current >= totalPages - 3) {
                pages.push(1);
                pages.push("...");
                for (let i = totalPages - 5; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push("...");
                for (let i = pagination.current - 1; i <= pagination.current + 1; i++) {
                    pages.push(i);
                }
                pages.push("...");
                pages.push(totalPages);
            }
        }

        return pages;
    };

    return (
        <SalaryContainer>
            <SalaryHeader>
                <SalaryTitle>Phiếu lương của tôi</SalaryTitle>
                <FilterSection>
                    <FilterSelect>
                        <Select
                            value={filters.thang}
                            onChange={(value) => handleFilterChange("thang", value)}
                            options={thangOptions}
                            style={{ width: 130 }}
                        />
                    </FilterSelect>
                    <FilterSelect>
                        <Select
                            value={filters.nam}
                            onChange={(value) => handleFilterChange("nam", value)}
                            options={namOptions}
                            style={{ width: 100 }}
                        />
                    </FilterSelect>
                    <FilterSelect>
                        <Select
                            value={filters.sapXep}
                            onChange={(value) => handleFilterChange("sapXep", value)}
                            options={sapXepOptions}
                            style={{ width: 120 }}
                        />
                    </FilterSelect>
                </FilterSection>
            </SalaryHeader>

            <CardsGrid>
                {paginatedData.map((salary) => (
                    <SalaryCard key={salary.id} data={salary} onClick={handleCardClick} />
                ))}
            </CardsGrid>

            <PaginationContainer>
                <PaginationInfo>
                    <span>Hiển thị</span>
                    <Select
                        value={pagination.pageSize}
                        onChange={handlePageSizeChange}
                        options={[
                            { value: 8, label: `8 / ${filteredData.length}` },
                            { value: 12, label: `12 / ${filteredData.length}` },
                            { value: 16, label: `16 / ${filteredData.length}` },
                            { value: 20, label: `20 / ${filteredData.length}` },
                        ]}
                        style={{ width: 100 }}
                    />
                </PaginationInfo>

                <PaginationNav>
                    <button
                        className="page-btn"
                        onClick={() => handlePaginationChange(pagination.current - 1)}
                        disabled={pagination.current === 1}
                    >
                        <LeftOutlined />
                    </button>

                    {renderPageNumbers().map((page, index) =>
                        page === "..." ? (
                            <span key={`ellipsis-${index}`} className="page-ellipsis">
                                ...
                            </span>
                        ) : (
                            <button
                                key={page}
                                className={`page-btn ${pagination.current === page ? "active" : ""}`}
                                onClick={() => handlePaginationChange(page)}
                            >
                                {page}
                            </button>
                        )
                    )}

                    <button
                        className="page-btn"
                        onClick={() => handlePaginationChange(pagination.current + 1)}
                        disabled={pagination.current === totalPages}
                    >
                        <RightOutlined />
                    </button>
                </PaginationNav>

                <GoToPage>
                    <span>Tới trang</span>
                    <Input
                        type="number"
                        min={1}
                        max={totalPages}
                        onPressEnter={(e) => {
                            const page = parseInt(e.target.value, 10);
                            if (page >= 1 && page <= totalPages) {
                                handlePaginationChange(page);
                            }
                        }}
                    />
                </GoToPage>
            </PaginationContainer>

            {/* Modal chi tiết phiếu lương */}
            <SalaryDetailModal
                visible={isModalVisible}
                salary={selectedSalary}
                onClose={handleCloseModal}
            />
        </SalaryContainer>
    );
}

export default SalaryTab;
