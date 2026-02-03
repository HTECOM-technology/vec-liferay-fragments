import React, { useState } from "react";
import { CTabs } from "../../components/common";
import { PageWrap } from "./style";
import { KPITab } from "./components";

function CongThongTinNhanSuPage() {
  const [activeTab, setActiveTab] = useState("kpi");

  return (
    <PageWrap>
      <CTabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: "nhanSu",
            label: "NHÂN SỰ",
            children: <div style={{ padding: 16 }}>Module Nhân sự đang phát triển</div>,
          },
          {
            key: "kpi",
            label: "KPI",
            children: <KPITab />,
          },
          {
            key: "daoTao",
            label: "ĐÀO TẠO",
            children: <div style={{ padding: 16 }}>Module Đào tạo đang phát triển</div>,
          },
          {
            key: "chamCong",
            label: "CHẤM CÔNG",
            children: <div style={{ padding: 16 }}>Module Chấm công đang phát triển</div>,
          },
          {
            key: "luong",
            label: "LƯƠNG",
            children: <div style={{ padding: 16 }}>Module Lương đang phát triển</div>,
          },
        ]}
      />
    </PageWrap>
  );
}

export default CongThongTinNhanSuPage;
