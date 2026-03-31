import React, { useState } from "react";
import { CTabs } from "../../components/common";
import { PageWrap } from "./style";
import { EventsTab, mockEventsData } from "./components";
import ThongBaoTab from "./components/ThongBaoTab";
import LienKetTraCuuTab from "./components/LienKetTraCuuTab";

function VanPhongDienTuPage() {
  const [activeTab, setActiveTab] = useState("thong-bao");
  const [activeEventsGroup, setActiveEventsGroup] = useState("ban-lanh-dao");
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [selectedYear, setSelectedYear] = useState(2026);

  return (
    <PageWrap>
      <CTabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: "thong-bao",
            label: "THÔNG BÁO",
            children: <ThongBaoTab />,
          },
          {
            key: "lich-co-quan",
            label: "LỊCH CƠ QUAN",
            children: (
              <EventsTab
                activeGroup={activeEventsGroup}
                onGroupChange={(group) => setActiveEventsGroup(group)}
                dataSource={mockEventsData}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                onMonthChange={setSelectedMonth}
                onYearChange={setSelectedYear}
              />
            ),
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

export default VanPhongDienTuPage;

