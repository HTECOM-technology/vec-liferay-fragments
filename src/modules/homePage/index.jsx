import React from "react";
import { useNavigate } from "react-router-dom";
import {
    DocumentWidget,
    TaskWidget,
    MissionWidget,
    TrafficWidget,
    GopYSangKienLink,
    KhaoSatBieuQuyetLink,
    QuyTrinhHoTroLink,
    SoTayNhanVienLink,
} from "./components";
import {
    PageWrap,
    DashboardContainer,
    LeftSection,
    RightSection,
    CardsRow,
} from "./style";
import { paths } from "../../router/menuConfig";

function HomePage() {
    const navigate = useNavigate();

    // Mock data - có thể thay bằng API call thực tế
    const documentData = {
        vanBanDenMoi: "05",
        vanBanDiMoi: "12",
        vanBanChoXuLy: "02",
        vanBanChoDuyet: "0",
    };

    const taskData = {
        tongSoCongViec: "03",
        dangXuLy: "03",
        daHoanThanh: "0",
        quaHan: "0",
    };

    const missionData = {
        tongSoNhiemVu: "08",
        dangXuLy: "02",
        daHoanThanh: "04",
        quaHan: "0",
    };

    const trafficData = {
        phuongTienViPham: "08",
        tocDoLuuThong: "02",
        giaSucVaoCaoToc: "0",
        cameraBiLoi: "0",
    };

    const handleGopYSangKien = () => {
        console.log("Navigate to Góp ý - Sáng kiến cải tiến");
        // Implement navigation
    };

    const handleKhaoSatBieuQuyet = () => {
        navigate(paths.khaoSatBieuQuyet);
    };

    const handleQuyTrinhHoTro = () => {
        navigate(paths.quyTrinhHoTro);
    };

    const handleSoTayNhanVien = () => {
        console.log("Navigate to Sổ tay nhân viên");
        // Implement navigation
    };

    return (
        <PageWrap>
            <DashboardContainer>
                <LeftSection>
                    <CardsRow>
                        <DocumentWidget data={documentData} />
                        <TaskWidget data={taskData} />
                        <MissionWidget data={missionData} />
                        <TrafficWidget data={trafficData} />
                    </CardsRow>
                </LeftSection>

                <RightSection>
                    <GopYSangKienLink onClick={handleGopYSangKien} />
                    <KhaoSatBieuQuyetLink onClick={handleKhaoSatBieuQuyet} />
                    <QuyTrinhHoTroLink onClick={handleQuyTrinhHoTro} />
                    <SoTayNhanVienLink onClick={handleSoTayNhanVien} />
                </RightSection>
            </DashboardContainer>
        </PageWrap>
    );
}

export default HomePage;
