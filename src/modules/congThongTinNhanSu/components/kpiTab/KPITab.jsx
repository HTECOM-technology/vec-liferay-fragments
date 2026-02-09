import React, { useState } from "react";
import { EditOutlined, FilterOutlined } from "@ant-design/icons";
import { Grid } from "antd";
import { CButton, CTablePagination } from "../../../../components/common";
import KPIFilter from "./KPIFilter";
import KPITable from "./KPITable";
import { HeaderActions } from "../../style";
import { mockKPIData } from "../constants";

function KPITab() {
    const [dataSource] = useState(mockKPIData);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterVisible, setFilterVisible] = useState(false);
    const screens = Grid.useBreakpoint();

    const handleSearch = (values) => {
        console.log("Search KPI:", values);
        // Mock search logic
    };

    return (
        <div>
            <HeaderActions>
                <h3>KPI nhân viên</h3>
                <div style={{ display: 'flex', gap: 8 }}>
                    {!screens.md && (
                        <CButton
                            icon={<FilterOutlined />}
                            onClick={() => setFilterVisible(true)}
                        />
                    )}
                    <CButton type="primary" icon={<EditOutlined />}>
                        Đánh giá
                    </CButton>
                </div>
            </HeaderActions>

            <KPIFilter
                onSearch={handleSearch}
                open={filterVisible}
                onClose={() => setFilterVisible(false)}
            />

            <KPITable dataSource={dataSource} />

            <CTablePagination
                current={currentPage}
                total={172}
                pageSize={16}
                onChange={(page, size) => {
                    setCurrentPage(page);
                    console.log("Page change:", page, size);
                }}
            />
        </div>
    );
}

export default KPITab;
