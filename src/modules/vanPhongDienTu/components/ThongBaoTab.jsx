import React from "react";
import { Table } from "antd";
import { Wrap, Section, SectionTitle } from "./thongBao/styled";
import { tableProps } from "./thongBao/columns";
import { congVanData, congViecData, tinNhanData } from "./thongBao/mockData";

function ThongBaoTab() {
  return (
    <Wrap>
      <Section>
        <SectionTitle>Công văn, văn bản mới cần xử lý</SectionTitle>
        <Table {...tableProps} dataSource={congVanData} />
      </Section>

      <Section>
        <SectionTitle>Công việc mới cần xử lý</SectionTitle>
        <Table {...tableProps} dataSource={congViecData} />
      </Section>

      <Section>
        <SectionTitle>Tin nhắn mới</SectionTitle>
        <Table {...tableProps} dataSource={tinNhanData} />
      </Section>
    </Wrap>
  );
}

export default ThongBaoTab;
