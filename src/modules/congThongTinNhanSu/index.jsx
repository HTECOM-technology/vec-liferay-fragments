import React, { useState } from "react";
import { CTabs } from "../../components/common";
import { PageWrap } from "./style";
import { KPITab, NhanSuTab, SalaryTab } from "./components";
import DaoTaoPage from "../daoTao";
import ChamCongPage from "../chamCong";

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
            children: <ChamCongPage />,
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
