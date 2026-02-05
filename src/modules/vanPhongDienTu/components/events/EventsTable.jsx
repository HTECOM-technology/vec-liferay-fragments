import React, { useMemo } from "react";
import { CTable } from "../../../../components/common";
import { mockEventsData } from "./constants";
import {
  TableContainer,
  DateCell,
  SessionCell,
  EventContent,
  EventTitle,
  EventLink,
  TableText,
  CenterText,
  MultiLineText,
} from "../../style";

function EventsTable({ dataSource = mockEventsData, onEventClick }) {
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

  const columns = useMemo(
    () => [
      {
        title: "Ngày tháng",
        children: [
          {
            dataIndex: "ngay",
            key: "ngay",
            width: 80,
            align: "center",
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
            dataIndex: "buoi",
            key: "buoi",
            width: 60,
            align: "center",
            onCell: (_, index) => ({
              rowSpan: calculateBuoiRowSpans[index] || 0,
            }),
            render: (text) => {
              if (!text) return null;
              return <SessionCell>{text}</SessionCell>;
            },
          },
        ],
      },
      {
        title: "Nội dung công việc",
        key: "noiDungCongViec",
        width: 350,
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
        render: (text) => <TableText>{text}</TableText>,
      },
      {
        title: "Thành phần tham gia",
        dataIndex: "thanhPhanThamGia",
        key: "thanhPhanThamGia",
        width: 200,
        render: (text) => <TableText>{text}</TableText>,
      },
      {
        title: "Địa điểm",
        dataIndex: "diaDiem",
        key: "diaDiem",
        width: 220,
        render: (text) => <TableText>{text}</TableText>,
      },
      {
        title: "Chủ trì",
        dataIndex: "chuTri",
        key: "chuTri",
        width: 200,
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

  return (
    <TableContainer>
      <CTable
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: 1400, y: "calc(100vh - 490px)" }}
        pagination={false}
        size="middle"
        onRow={(record) => ({
          onClick: () => onEventClick?.(record),
        })}
      />
    </TableContainer>
  );
}

export default EventsTable;
