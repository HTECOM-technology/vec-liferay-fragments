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
} from "./styleNhanSu";

function NhanSuFilter({ totalCount, filters, onFilterChange, onSearch, filterOptions }) {
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
                        onPressEnter={onSearch}
                    />
                </SearchInput>

                <FilterSelect>
                    <Select
                        value={filters.chucVu}
                        onChange={(value) => onFilterChange("chucVu", value)}
                        options={filterOptions.chucVuOptions}
                    />
                </FilterSelect>

                <FilterSelect>
                    <Select
                        value={filters.phongBan}
                        onChange={(value) => onFilterChange("phongBan", value)}
                        options={filterOptions.phongBanOptions}
                    />
                </FilterSelect>

                <FilterSelect>
                    <Select
                        value={filters.donVi}
                        onChange={(value) => onFilterChange("donVi", value)}
                        options={filterOptions.donViOptions}
                    />
                </FilterSelect>

                <FilterSelect>
                    <Select
                        value={filters.gioiTinh}
                        onChange={(value) => onFilterChange("gioiTinh", value)}
                        options={filterOptions.gioiTinhOptions}
                    />
                </FilterSelect>

                <FilterSelect>
                    <Select
                        value={filters.tinhTrang}
                        onChange={(value) => onFilterChange("tinhTrang", value)}
                        options={filterOptions.tinhTrangOptions}
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
    filterOptions: PropTypes.shape({
        chucVuOptions: PropTypes.array,
        phongBanOptions: PropTypes.array,
        donViOptions: PropTypes.array,
        gioiTinhOptions: PropTypes.array,
        tinhTrangOptions: PropTypes.array,
    }),
};

NhanSuFilter.defaultProps = {
    totalCount: 0,
    filters: {},
    onFilterChange: () => { },
    onSearch: () => { },
    filterOptions: {
        chucVuOptions: [{ value: "", label: "Chức vụ" }],
        phongBanOptions: [{ value: "", label: "Phòng ban" }],
        donViOptions: [{ value: "", label: "Đơn vị" }],
        gioiTinhOptions: [{ value: "", label: "Giới tính" }],
        tinhTrangOptions: [{ value: "", label: "Tình trạng" }],
    },
};

export default NhanSuFilter;
