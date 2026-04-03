import React, { useState } from "react";
import { CTabs } from "../../components/common";
import { PageWrap } from "./style";
import { BaoCaoTongHopTab, LienKetTraCuuTab } from "./components";

function DoiSoatThuPhiPage() {
  const [activeTab, setActiveTab] = useState("bao-cao-tong-hop");

  return (
    <PageWrap>
      <CTabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: "bao-cao-tong-hop",
            label: "BÁO CÁO TỔNG HỢP",
            children: <BaoCaoTongHopTab />,
          },
          {
            key: "lien-ket-tra-cuu",
            label: "LIÊN KẾT - TRA CỨU",
            children: <LienKetTraCuuTab />,
          },
        ]}
      />
    </PageWrap>
  );
}

export default DoiSoatThuPhiPage;
