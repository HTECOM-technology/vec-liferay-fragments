import React, { useState } from "react";
import { CTabs } from "../../components/common";
import { PageWrap } from "./style";
import { KPITab, NhanSuTab, SalaryTab, DaoTaoPage } from "./components";

function CongThongTinNhanSuPage() {
  const [activeTab, setActiveTab] = useState("nhanSu");

  return (
    <PageWrap>
      <CTabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: "nhanSu",
            label: "NHÂN SỰ",
            children: <NhanSuTab />,
          },
          {
            key: "kpi",
            label: "KPI",
            children: <KPITab />,
          },
          {
            key: "daoTao",
            label: "ĐÀO TẠO",
            children: <DaoTaoPage />,
          },
          {
            key: "chamCong",
            label: "CHẤM CÔNG",
            children: <div style={{ padding: 16 }}>Module Chấm công đang phát triển</div>,
          },
          {
            key: "luong",
            label: "LƯƠNG",
            children: <SalaryTab />,
          },
        ]}
      />
    </PageWrap>
  );
}

export default CongThongTinNhanSuPage;
