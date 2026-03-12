import React, { useState } from "react";
import { EditOutlined, FilterOutlined } from "@ant-design/icons";
import { Grid } from "antd";
import { CButton, CTablePagination } from "../../../../components/common";
import KPIFilter from "./KPIFilter";
import KPITable from "./KPITable";
import { HeaderActions } from "../../style";
import { mockKPIData, getPhongBanGroup, getCurrentUserPhongBan } from "../constants";

function KPITab() {
    const [dataSource] = useState(mockKPIData);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterVisible, setFilterVisible] = useState(false);
    const screens = Grid.useBreakpoint();

    const handleSearch = (values) => {
        console.log("Search KPI:", values);
        // Mock search logic
    };

    const handleEvaluateVP = () => {
        // TODO: thay thế bằng URL thực tế khi có
        window.location.href = "https://qlns.tctvec.vn/FBO/Main/zhredirect.aspx?id=zchrpai";
    };
    const handleEvaluateQL = () => {
        // TODO: thay thế bằng URL thực tế khi có
        window.location.href = "https://qlns.tctvec.vn/FBO/Main/zhredirect.aspx?id=zchrpaiSouth";
    };

    // Phân loại phòng ban: khối văn phòng → handleEvaluateVP, QLDA → handleEvaluateQL (khi có user phòng ban)
    const userPhongBan = getCurrentUserPhongBan();
    const phongBanGroup = getPhongBanGroup(userPhongBan);
    const handleEvaluate = phongBanGroup === "qlda" ? handleEvaluateQL : handleEvaluateVP;

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
                    <CButton type="primary" icon={<EditOutlined />} onClick={handleEvaluate}>
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
