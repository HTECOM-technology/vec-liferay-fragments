import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Col, Row } from "antd";
import HoiDongThanhVienModal from "./HoiDongThanhVienModal";
import {
  getStructuredContentsByFolder,
  getContentById
} from "../../../../services/structuredContentService";

// --- Styled components ---
const ChartWrap = styled.div`
  padding: 40px 24px 24px;
  min-width: 1000px;
  background: #fff;
  color: #333;
  font-family: inherit;
`;

const Node = styled.div`
  padding: 10px 14px;
  text-align: center;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  white-space: normal;
  width: 253px;
  line-height: 1.35;
  position: relative;
  min-height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &.red {
    background: #e31c2a;
    border-color: #e31c2a;
    & > div {
      color: #fff !important;
    }
  }

  &.blue {
    background: #0090cf;
    & > div {
      color: #fff !important;
    }
    border-color: #0090cf;
  }

  &.white {
    background: #fff;
    border: 1.5px solid #0090cf;
  }

  &.outline {
    border: 1.5px solid #0090cf;
    background-color: #c9efff;
    & > div {
      color: #0090cf !important;
    }
  }
`;

const NodeLabel = styled.div`
  line-height: 1.3;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 15px;
  color: #555555;
  letter-spacing: 0;
`;

const TopLeftCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: fit-content;
`;

const TopRightCol = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  top: -65%;
  right: calc(-100% - 85px);
`;

const MiddleRow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 0;
`;

const BranchConnectorWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const ThreeColumns = styled.div`
  display: flex;
  justify-content: center;
  gap: 85px;
  flex-wrap: wrap;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 220px;
  max-width: 280px;
`;

function NodeBox({ label, members, type = "white", children, onClick }) {
  return (
    <Node className={type} onClick={onClick} role={onClick ? "button" : undefined}>
      <NodeLabel dangerouslySetInnerHTML={{ __html: label }} />
      {/* {members != null && <NodeMembers>Số lượng thành viên: {members}</NodeMembers>} */}
      {children}
    </Node>
  );
}

const SoDoToChuc = () => {
  const CONTENT_ID = 1266992

  const [hoiDongModalOpen, setHoiDongModalOpen] = useState(false);
  const [itemsHDTV, setItemsHDTV] = useState([]);
  const [itemHDTV, setItemHDTV] = useState(null);
  const [blockThamMuu, setBlockThamMuu] = useState(null);
  const [blockQuanLyDuAn, setBlockQuanLyDuAn] = useState(null);
  const [blockCongTy, setBlockCongTy] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const dataHDTV = await getStructuredContentsByFolder();

      const filtered = dataHDTV.filter(item =>
        [1269592, 1269608].includes(item.id)
      );
      const single = dataHDTV.find(item => item.id === 1266992);

      setItemsHDTV(filtered);
      setItemHDTV(single);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const contentHDTV = await getContentById(CONTENT_ID);

      if (Array.isArray(contentHDTV) && contentHDTV.length >= 3) {
        setBlockThamMuu(contentHDTV[0]);
        setBlockQuanLyDuAn(contentHDTV[1]);
        setBlockCongTy(contentHDTV[2]);
      }
    };
    fetchData();
  }, []);

  return (
    <ChartWrap>
      <HoiDongThanhVienModal open={hoiDongModalOpen} onClose={() => setHoiDongModalOpen(false)} />

      {/* Hàng 1: HĐTV — đường ngang (chữ L) — bên phải: đường dọc rồi BAN KIỂM SOÁT, dưới đó BAN KIỂM TRA VÀ KIỂM TOÁN NỘI BỘ */}
      <Row justify={"center"}>
        <Col span={8} style={{ display: "flex", justifyContent: "center" }}>
          <NodeBox label="HỘI ĐỒNG THÀNH VIÊN" members={3} type="red" onClick={() => setHoiDongModalOpen(true)}>
            <TopRightCol onClick={(e) => e.stopPropagation()}>
              <svg width="82" height="93" viewBox="0 0 82 93" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M0.75 39.2998C0.335786 39.2998 0 39.6356 0 40.0498C0 40.464 0.335786 40.7998 0.75 40.7998V40.0498V39.2998ZM81.5801 4.5498C81.873 4.25691 81.873 3.8427 81.5801 3.5498L78.25 0.219678C77.9571 -0.0732155 77.5429 -0.0732155 77.25 0.219678L73.4199 4.0498L77.25 7.87993C77.5429 8.17282 77.9571 8.17282 78.25 7.87993L81.5801 4.5498ZM0.75 40.0498V40.7998H19.25V40.0498V39.2998H0.75V40.0498ZM55.25 4.0498V4.7998H77.75V4.0498V3.2998H55.25V4.0498ZM37.25 22.0498H38C38 12.5229 45.7231 4.7998 55.25 4.7998V4.0498V3.2998C44.8947 3.2998 36.5 11.6945 36.5 22.0498H37.25ZM19.25 40.0498V40.7998C29.6053 40.7998 38 32.4051 38 22.0498H37.25H36.5C36.5 31.5767 28.7769 39.2998 19.25 39.2998V40.0498Z"
                  fill="#D9D9D9"
                />
                <path
                  d="M0.75 39.2998C0.335786 39.2998 0 39.6356 0 40.0498C0 40.464 0.335786 40.7998 0.75 40.7998V40.0498V39.2998ZM81.5801 89.0498C81.873 88.7569 81.873 88.3427 81.5801 88.0498L78.25 84.7197C77.9571 84.4268 77.5429 84.4268 77.25 84.7197L73.4199 88.5498L77.25 92.3799C77.5429 92.6728 77.9571 92.6728 78.25 92.3799L81.5801 89.0498ZM0.75 40.0498V40.7998H13.25V40.0498V39.2998H0.75V40.0498ZM37.25 64.0498H36.5V64.5498H37.25H38V64.0498H37.25ZM61.25 88.5498V89.2998H77.75V88.5498V87.7998H61.25V88.5498ZM37.25 64.5498H36.5C36.5 78.2188 47.581 89.2998 61.25 89.2998V88.5498V87.7998C48.4094 87.7998 38 77.3904 38 64.5498H37.25ZM13.25 40.0498V40.7998C26.0906 40.7998 36.5 51.2092 36.5 64.0498H37.25H38C38 50.3808 26.919 39.2998 13.25 39.2998V40.0498Z"
                  fill="#D9D9D9"
                />
              </svg>

              <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                {itemsHDTV.map((item) => (
                  <NodeBox key={item.id} label={item.title} members={item.members} type="blue" />
                ))}
              </div>
            </TopRightCol>
          </NodeBox>
        </Col>
      </Row>

      {/* Hàng 2: từ HĐTV xuống — BAN TỔNG GIÁM ĐỐC */}
      <MiddleRow>
        <TopLeftCol>
          <svg width="9" height="26" viewBox="0 0 9 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M4.7998 0.75C4.7998 0.335786 4.46402 0 4.0498 0C3.63559 0 3.2998 0.335786 3.2998 0.75H4.0498H4.7998ZM3.5498 25.5801C3.8427 25.873 4.25691 25.873 4.5498 25.5801L7.87993 22.25C8.17282 21.9571 8.17282 21.5429 7.87993 21.25L4.0498 17.4199L0.219678 21.25C-0.0732155 21.5429 -0.0732155 21.9571 0.219678 22.25L3.5498 25.5801ZM4.0498 0.75H3.2998V21.75H4.0498H4.7998V0.75H4.0498Z"
              fill="#D9D9D9"
            />
          </svg>

          {/* <NodeBox label="BAN TỔNG GIÁM ĐỐC" members={5} type="red" /> */}
          <NodeBox label={itemHDTV?.title} members={5} type="red" />
        </TopLeftCol>
      </MiddleRow>

      {/* Từ BTGĐ: đường dọc → đường ngang → 3 cột (mỗi cột: ô KHỐI → dọc → ô KHỐI lặp → dọc → đơn vị) */}
      <MiddleRow>
        <BranchConnectorWrap>
          <svg width="684" height="71" viewBox="0 0 684 71" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M342.3 0.75C342.3 0.335786 341.964 0 341.55 0C341.135 0 340.8 0.335786 340.8 0.75H341.55H342.3ZM3.5498 70.5801C3.8427 70.873 4.25691 70.873 4.5498 70.5801L7.87993 67.25C8.17282 66.9571 8.17282 66.5429 7.87993 66.25L4.0498 62.4199L0.219678 66.25C-0.0732155 66.5429 -0.0732155 66.9571 0.219678 67.25L3.5498 70.5801ZM341.55 0.75H340.8V7.75H341.55H342.3V0.75H341.55ZM317.55 31.75V31H28.0498V31.75V32.5H317.55V31.75ZM4.0498 55.75H3.2998V66.75H4.0498H4.7998V55.75H4.0498ZM28.0498 31.75V31C14.3807 31 3.2998 42.081 3.2998 55.75H4.0498H4.7998C4.7998 42.9094 15.2092 32.5 28.0498 32.5V31.75ZM341.55 7.75H340.8C340.8 20.5906 330.39 31 317.55 31V31.75V32.5C331.219 32.5 342.3 21.419 342.3 7.75H341.55Z"
              fill="#D9D9D9"
            />
            <path d="M342.3 0.75C342.3 0.335786 341.964 0 341.55 0C341.135 0 340.8 0.335786 340.8 0.75H341.55H342.3ZM341.05 70.5801C341.342 70.873 341.757 70.873 342.05 70.5801L345.38 67.25C345.673 66.9571 345.673 66.5429 345.38 66.25L341.55 62.4199L337.719 66.25C337.427 66.5429 337.427 66.9571 337.719 67.25L341.05 70.5801ZM341.55 0.75H340.8V66.75H341.55H342.3V0.75H341.55Z" fill="#D9D9D9" />
            <path
              d="M342.3 0.75C342.3 0.335786 341.964 0 341.55 0C341.135 0 340.8 0.335786 340.8 0.75H341.55H342.3ZM678.55 70.5801C678.843 70.873 679.257 70.873 679.55 70.5801L682.88 67.25C683.173 66.9571 683.173 66.5429 682.88 66.25L679.05 62.4199L675.22 66.25C674.927 66.5429 674.927 66.9571 675.22 67.25L678.55 70.5801ZM341.55 0.75H340.8V7.75H341.55H342.3V0.75H341.55ZM365.55 31.75V32.5H655.05V31.75V31H365.55V31.75ZM679.05 55.75H678.3V66.75H679.05H679.8V55.75H679.05ZM655.05 31.75V32.5C667.89 32.5 678.3 42.9094 678.3 55.75H679.05H679.8C679.8 42.081 668.719 31 655.05 31V31.75ZM341.55 7.75H340.8C340.8 21.419 351.881 32.5 365.55 32.5V31.75V31C352.709 31 342.3 20.5906 342.3 7.75H341.55Z"
              fill="#D9D9D9"
            />
          </svg>

          <ThreeColumns>
            <Column>
              {blockThamMuu?.nestedContentFields && (() => {
                const subtitle = blockThamMuu.nestedContentFields.find(f => f.name === "subtitle");
                const contents = blockThamMuu.nestedContentFields.filter(f => f.name === "content");
                const allItems = [subtitle, ...contents];

                return allItems.map((f, index, arr) => (
                  <React.Fragment key={index}>
                    <NodeBox
                      label={f.contentFieldValue.data}
                      type={index === 0 ? "outline" : "white"}
                    />
                    {index < arr.length - 1 && (
                      <svg width="9" height="28" viewBox="0 0 9 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M4.7998 0.75C4.7998 0.335786 4.46402 0 4.0498 0C3.63559 0 3.2998 0.335786 3.2998 0.75H4.0498H4.7998ZM3.5498 27.5801C3.8427 27.873 4.25691 27.873 4.5498 27.5801L7.87993 24.25C8.17282 23.9571 8.17282 23.5429 7.87993 23.25L4.0498 19.4199L0.219678 23.25C-0.0732155 23.5429 -0.0732155 23.9571 0.219678 24.25L3.5498 27.5801ZM4.0498 0.75H3.2998V23.75H4.0498H4.7998V0.75H4.0498Z"
                          fill="#D9D9D9"
                        />
                      </svg>
                    )}
                  </React.Fragment>
                ));
              })()}
            </Column>

            <Column>
              {blockQuanLyDuAn?.nestedContentFields && (() => {
                const subtitle = blockQuanLyDuAn.nestedContentFields.find(f => f.name === "subtitle");
                const contents = blockQuanLyDuAn.nestedContentFields.filter(f => f.name === "content");
                const allItems = [subtitle, ...contents];

                return allItems.map((f, index, arr) => (
                  <React.Fragment key={index}>
                    <NodeBox
                      label={f.contentFieldValue.data}
                      type={index === 0 ? "outline" : "white"}
                    />
                    {index < arr.length - 1 && (
                      <svg width="9" height="28" viewBox="0 0 9 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M4.7998 0.75C4.7998 0.335786 4.46402 0 4.0498 0C3.63559 0 3.2998 0.335786 3.2998 0.75H4.0498H4.7998ZM3.5498 27.5801C3.8427 27.873 4.25691 27.873 4.5498 27.5801L7.87993 24.25C8.17282 23.9571 8.17282 23.5429 7.87993 23.25L4.0498 19.4199L0.219678 23.25C-0.0732155 23.5429 -0.0732155 23.9571 0.219678 24.25L3.5498 27.5801ZM4.0498 0.75H3.2998V23.75H4.0498H4.7998V0.75H4.0498Z"
                          fill="#D9D9D9"
                        />
                      </svg>
                    )}
                  </React.Fragment>
                ));
              })()}
            </Column>

            <Column>
              {blockCongTy?.nestedContentFields && (() => {
                const subtitle = blockCongTy.nestedContentFields.find(f => f.name === "subtitle");
                const contents = blockCongTy.nestedContentFields.filter(f => f.name === "content");
                const allItems = [subtitle, ...contents];

                return allItems.map((f, index, arr) => (
                  <React.Fragment key={index}>
                    <NodeBox
                      label={f.contentFieldValue.data}
                      type={index === 0 ? "outline" : "white"}
                    />
                    {index < arr.length - 1 && (
                      <svg width="9" height="28" viewBox="0 0 9 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M4.7998 0.75C4.7998 0.335786 4.46402 0 4.0498 0C3.63559 0 3.2998 0.335786 3.2998 0.75H4.0498H4.7998ZM3.5498 27.5801C3.8427 27.873 4.25691 27.873 4.5498 27.5801L7.87993 24.25C8.17282 23.9571 8.17282 23.5429 7.87993 23.25L4.0498 19.4199L0.219678 23.25C-0.0732155 23.5429 -0.0732155 23.9571 0.219678 24.25L3.5498 27.5801ZM4.0498 0.75H3.2998V23.75H4.0498H4.7998V0.75H4.0498Z"
                          fill="#D9D9D9"
                        />
                      </svg>
                    )}
                  </React.Fragment>
                ));
              })()}
            </Column>
          </ThreeColumns>
        </BranchConnectorWrap>
      </MiddleRow>
    </ChartWrap>
  );
};

export default SoDoToChuc;
