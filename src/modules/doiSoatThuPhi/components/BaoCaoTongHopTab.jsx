import React from "react";
import { Table } from "antd";
import BieuDoCard from "./baoCaoTongHop/BieuDoCard";
import { suCoColumns, suKienColumns, loiColumns, commonTableProps } from "./baoCaoTongHop/tables";
import { rawLuuLuongData, rawDoanhThuData, mockSuCo, mockSuKien, mockLoi } from "./baoCaoTongHop/mockData";
import { Wrap, ChartsRow, TableSection, TableSectionTitle } from "./baoCaoTongHop/styled";

function BaoCaoTongHopTab() {
  return (
    <Wrap>
      {/* Biểu đồ */}
      <ChartsRow>
        <BieuDoCard
          title="Biểu đồ lưu lượng xe"
          rawData={rawLuuLuongData}
          color="rgba(0, 144, 207, 1)"
          yUnit="N"
        />
        <BieuDoCard
          title="Biểu đồ doanh thu"
          rawData={rawDoanhThuData}
          color="rgba(0, 166, 62, 1)"
          yUnit="tỷ"
        />
      </ChartsRow>

      {/* Thông báo sự cố */}
      <TableSection>
        <TableSectionTitle>Thông báo sự cố</TableSectionTitle>
        <Table {...commonTableProps} columns={suCoColumns} dataSource={mockSuCo} />
      </TableSection>

      {/* Thông tin sự kiện */}
      <TableSection>
        <TableSectionTitle>Thông tin sự kiện</TableSectionTitle>
        <Table {...commonTableProps} columns={suKienColumns} dataSource={mockSuKien} />
      </TableSection>

      {/* Thông tin lỗi */}
      <TableSection>
        <TableSectionTitle>Thông tin lỗi</TableSectionTitle>
        <Table {...commonTableProps} columns={loiColumns} dataSource={mockLoi} />
      </TableSection>
    </Wrap>
  );
}

export default BaoCaoTongHopTab;
