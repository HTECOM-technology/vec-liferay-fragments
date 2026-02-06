import React, { useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import { CButton, CTablePagination } from "../../../components/common";
import KPIFilter from "./KPIFilter";
import KPITable from "./KPITable";
import { HeaderActions } from "../style";
import { mockKPIData } from "./constants";

function KPITab() {
    const [dataSource] = useState(mockKPIData);
    const [currentPage, setCurrentPage] = useState(1);

    const handleSearch = (values) => {
        console.log("Search KPI:", values);
        // Mock search logic
    };

    return (
        <div>
            <HeaderActions>
                <h3>KPI nhân viên</h3>
                <CButton type="primary" icon={<EditOutlined />}>
                    Đánh giá
                </CButton>
            </HeaderActions>

            <KPIFilter onSearch={handleSearch} />

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