import React from "react";
import PropTypes from "prop-types";
import { Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import {
    HeaderRow,
    TitleSection,
    PageTitle,
    FilterSection,
    SearchInput,
    FilterSelect,
    SearchButton,
} from "../style";

const chucVuOptions = [
    { value: "", label: "Chức vụ" },
    { value: "gd", label: "Giám đốc" },
    { value: "pgd", label: "Phó Giám đốc" },
    { value: "tp", label: "Trưởng phòng" },
    { value: "cv", label: "Chuyên viên" },
    { value: "nv", label: "Nhân viên" },
];

const phongBanOptions = [
    { value: "", label: "Phòng ban" },
    { value: "hdtv", label: "Hội Đồng thành viên" },
    { value: "btgd", label: "Ban Tổng Giám đốc" },
    { value: "vp", label: "Văn phòng" },
    { value: "tckt", label: "Tài chính kế toán" },
    { value: "nhansu", label: "Nhân sự" },
];

const donViOptions = [
    { value: "", label: "Đơn vị" },
    { value: "vec", label: "VEC" },
    { value: "vec-e", label: "VEC E" },
    { value: "vec-o", label: "VEC O" },
];

const gioiTinhOptions = [
    { value: "", label: "Giới tính" },
    { value: "nam", label: "Nam" },
    { value: "nu", label: "Nữ" },
];

const tinhTrangOptions = [
    { value: "", label: "Tình trạng" },
    { value: "danglamviec", label: "Đang làm việc" },
    { value: "nghiviec", label: "Nghỉ việc" },
    { value: "nghiphep", label: "Nghỉ phép" },
];

function NhanSuFilter({ totalCount, filters, onFilterChange, onSearch }) {
    return (
        <HeaderRow>
            <TitleSection>
                <PageTitle>Danh sách nhân sự ({totalCount})</PageTitle>
            </TitleSection>

            <FilterSection>
                <SearchInput>
                    <Input
                        placeholder="Tìm kiếm"
                        prefix={<SearchOutlined style={{ color: "#999" }} />}
                        value={filters.search}
                        onChange={(e) => onFilterChange("search", e.target.value)}
                    />
                </SearchInput>

                <FilterSelect>
                    <Select
                        value={filters.chucVu}
                        onChange={(value) => onFilterChange("chucVu", value)}
                        options={chucVuOptions}
                        style={{ width: 170 }}
                    />
                </FilterSelect>

                <FilterSelect>
                    <Select
                        value={filters.phongBan}
                        onChange={(value) => onFilterChange("phongBan", value)}
                        options={phongBanOptions}
                        style={{ width: 170 }}
                    />
                </FilterSelect>

                <FilterSelect>
                    <Select
                        value={filters.donVi}
                        onChange={(value) => onFilterChange("donVi", value)}
                        options={donViOptions}
                        style={{ width: 170 }}
                    />
                </FilterSelect>

                <FilterSelect>
                    <Select
                        value={filters.gioiTinh}
                        onChange={(value) => onFilterChange("gioiTinh", value)}
                        options={gioiTinhOptions}
                        style={{ width: 170 }}
                    />
                </FilterSelect>

                <FilterSelect>
                    <Select
                        value={filters.tinhTrang}
                        onChange={(value) => onFilterChange("tinhTrang", value)}
                        options={tinhTrangOptions}
                        style={{ width: 170 }}
                    />
                </FilterSelect>

                <SearchButton onClick={onSearch}>Tìm kiếm</SearchButton>
            </FilterSection>
        </HeaderRow>
    );
}

NhanSuFilter.propTypes = {
    totalCount: PropTypes.number,
    filters: PropTypes.object,
    onFilterChange: PropTypes.func,
    onSearch: PropTypes.func,
};

NhanSuFilter.defaultProps = {
    totalCount: 0,
    filters: {},
    onFilterChange: () => {},
    onSearch: () => {},
};

export default NhanSuFilter;
