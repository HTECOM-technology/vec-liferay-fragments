import React, { useMemo } from "react";
import { Grid } from "antd";
import { CTable } from "../../../../components/common";
import { mockEventsData } from "./constants";
import { TableContainer, TableText, CenterText, MultiLineText } from "../../style";
import {
  DateCell,
  SessionCell,
  EventContent,
  EventTitle,
  EventLink,
} from "./styles";

const { useBreakpoint } = Grid;

function EventsTable({ dataSource = mockEventsData, onEventClick }) {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  // Tính toán rowSpan cho cột "Ngày"
  const calculateNgayRowSpans = useMemo(() => {
    const rowSpans = [];
    let i = 0;

    while (i < dataSource.length) {
      const currentValue = dataSource[i].ngay;

      if (currentValue) {
        let span = 1;

        // Đếm các row tiếp theo có ngay rỗng (thuộc cùng nhóm ngày)
        while (i + span < dataSource.length && !dataSource[i + span].ngay) {
          span++;
        }

        rowSpans.push(span);

        for (let j = 1; j < span; j++) {
          rowSpans.push(0);
        }

        i += span;
      } else {
        rowSpans.push(1);
        i++;
      }
    }

    return rowSpans;
  }, [dataSource]);

  // Tính toán rowSpan cho cột "Buổi"
  const calculateBuoiRowSpans = useMemo(() => {
    const rowSpans = [];
    let i = 0;

    while (i < dataSource.length) {
      const currentValue = dataSource[i].buoi;

      if (currentValue) {
        let span = 1;

        // Đếm các row tiếp theo có buoi rỗng (thuộc cùng nhóm buổi)
        while (i + span < dataSource.length && !dataSource[i + span].buoi) {
          span++;
        }

        rowSpans.push(span);

        for (let j = 1; j < span; j++) {
          rowSpans.push(0);
        }

        i += span;
      } else {
        rowSpans.push(1);
        i++;
      }
    }

    return rowSpans;
  }, [dataSource]);

  const mobileColumns = useMemo(
    () => [
      {
        title: "Ngày tháng",
        dataIndex: "ngay",
        key: "ngay",
        width: 80,
        align: "center",
        onHeaderCell: () => ({
          colSpan: 2,
        }),
        onCell: (_, index) => ({
          rowSpan: calculateNgayRowSpans[index] || 0,
        }),
        render: (text, record) => {
          if (!text) return null;
          return (
            <div>
              {text.split("\n").map((line, i) => (
                <DateCell key={i}>{line}</DateCell>
              ))}
            </div>
          );
        },
      },
      {
        title: "",
        dataIndex: "buoi",
        key: "buoi",
        width: 60,
        align: "center",
        onHeaderCell: () => ({
          colSpan: 0,
        }),
        onCell: (_, index) => ({
          rowSpan: calculateBuoiRowSpans[index] || 0,
        }),
        render: (text) => {
          if (!text) return null;
          return <SessionCell>{text}</SessionCell>;
        },
      },
      {
        title: "Nội dung công việc",
        key: "noiDungCongViec",
        align: "left",
        onHeaderCell: () => ({
          style: { textAlign: "center" },
        }),
        render: (_, record) => (
          <EventContent>
            <EventTitle>
              {record.noiDungCongViec} | {record.time}
            </EventTitle>
            <EventLink href="#">{record.detail}</EventLink>
          </EventContent>
        ),
      },
    ],
    [calculateNgayRowSpans, calculateBuoiRowSpans],
  );

  const desktopColumns = useMemo(
    () => [
      {
        title: "Ngày tháng",
        dataIndex: "ngay",
        key: "ngay",
        width: 80,
        align: "center",
        onHeaderCell: () => ({
          colSpan: 2,
        }),
        onCell: (_, index) => ({
          rowSpan: calculateNgayRowSpans[index] || 0,
        }),
        render: (text) => {
          if (!text) return null;
          return text
            .split("\n")
            .map((line, i) => <DateCell key={i}>{line}</DateCell>);
        },
      },
      {
        title: "",
        dataIndex: "buoi",
        key: "buoi",
        width: 60,
        align: "center",
        onHeaderCell: () => ({
          colSpan: 0,
        }),
        onCell: (_, index) => ({
          rowSpan: calculateBuoiRowSpans[index] || 0,
        }),
        render: (text) => {
          if (!text) return null;
          return <SessionCell>{text}</SessionCell>;
        },
      },
      {
        title: "Nội dung công việc",
        key: "noiDungCongViec",
        width: 350,
        align: "left",
        onHeaderCell: () => ({
          style: { textAlign: "center" },
        }),
        render: (_, record) => (
          <EventContent>
            <EventTitle>
              {record.noiDungCongViec} | {record.time}
            </EventTitle>
            <EventLink href="#">{record.detail}</EventLink>
          </EventContent>
        ),
      },
      {
        title: "Chuẩn bị",
        dataIndex: "chuanBi",
        key: "chuanBi",
        width: 150,
        align: "center",
        render: (text) => <TableText>{text}</TableText>,
      },
      {
        title: "Thành phần tham gia",
        dataIndex: "thanhPhanThamGia",
        key: "thanhPhanThamGia",
        width: 200,
        align: "center",
        render: (text) => <TableText>{text}</TableText>,
      },
      {
        title: "Địa điểm",
        dataIndex: "diaDiem",
        key: "diaDiem",
        width: 220,
        align: "center",
        render: (text) => <TableText>{text}</TableText>,
      },
      {
        title: "Chủ trì",
        dataIndex: "chuTri",
        key: "chuTri",
        width: 200,
        align: "center",
        render: (text) => {
          if (text === "-") return <CenterText>{text}</CenterText>;
          return (
            <MultiLineText>
              {text.split("\n").map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </MultiLineText>
          );
        },
      },
    ],
    [calculateNgayRowSpans, calculateBuoiRowSpans],
  );

  const columns = isMobile ? mobileColumns : desktopColumns;

  return (
    <TableContainer>
      <CTable
        columns={columns}
        dataSource={dataSource}
        scroll={isMobile ? { x: 'max-content' } : { x: 1400, y: "calc(100vh - 430px)" }}
        pagination={false}
        size="middle"
        bordered
        onRow={(record) => ({
          onClick: () => onEventClick?.(record),
        })}
      />
    </TableContainer>
  );
}

export default EventsTable;
