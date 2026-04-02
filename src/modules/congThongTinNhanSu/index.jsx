import React, { useState } from "react";
import { CTabs } from "../../components/common";
import { PageWrap } from "./style";
import { NhanSuTab } from "./components";
import LienKetTraCuuTab from "./components/LienKetTraCuuTab";

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
            key: "lienKetTraCuu",
            label: "LIÊN KẾT - TRA CỨU",
            children: <LienKetTraCuuTab />,
          },
        ]}
      />
    </PageWrap>
  );
}

export default CongThongTinNhanSuPage;
