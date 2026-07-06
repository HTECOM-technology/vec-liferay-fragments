import React from "react";
import { Modal } from "antd";
import styled from "styled-components";
import imgChuTichHoiDong from "../../../../assets/nhanSu/chuTich.png";
import imgThanhVienHoiDong1 from "../../../../assets/nhanSu/HDTV1.png";
import imgThanhVienHoiDong2 from "../../../../assets/nhanSu/HDTV2.png";

const StyledModal = styled(Modal)`
  .ant-modal-body {
    padding-top: 70px !important;
  }
`;

const TitlePill = styled.span`
  padding: 16px;
  background: rgba(0, 144, 207, 0.15);
  color: #0090cf;
  border: 1px solid #0090cf33;
  font-family: Inter;
  font-weight: 700;
  font-size: 20px;
  line-height: 22px;
  letter-spacing: 0%;
  text-align: center;
  border-radius: 6px;
  text-align: center;
  margin-bottom: 66px;
`;

const MembersSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
`;

const TopMember = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 240px;
`;

const BottomRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 48px;
  flex-wrap: wrap;
`;

const MemberCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 220px;
`;

const PhotoWrap = styled.div`
  width: 180px;
  height: 220px;
  border-radius: 8px;
  overflow: hidden;
  background: rgba(0, 144, 207, 0.08);
  border: 1px solid rgba(0, 144, 207, 0.15);
  margin-bottom: 12px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const MemberName = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #1e1e1e;
  text-align: center;
  margin-bottom: 4px;
  line-height: 1.35;
`;

const MemberTitle = styled.div`
  font-size: 13px;
  color: rgba(0, 0, 0, 0.6);
  text-align: center;
  line-height: 1.4;
`;

const HOI_DONG_MEMBERS = [
  {
    name: "Trương Việt Đông",
    title: "Chủ tịch Hội đồng Thành viên",
    photo: imgChuTichHoiDong,
    primary: true,
  },
  {
    name: "Lê Quang Vũ",
    title: "Thành viên chuyên trách HĐTV",
    photo: imgThanhVienHoiDong1,
    primary: false,
  },
  {
    name: "Trần Công Hòa",
    title: "Thành viên chuyên trách HĐTV",
    photo: imgThanhVienHoiDong2,
    primary: false,
  },
];

function HoiDongThanhVienModal({ open, onClose }) {
  const primaryMember = HOI_DONG_MEMBERS.find((m) => m.primary);
  const secondaryMembers = HOI_DONG_MEMBERS.filter((m) => !m.primary);

  return (
    <StyledModal
      open={open}
      onCancel={onClose}
      footer={null}
      centered={false}
      width={560}
      closable={true}
      styles={{
        body: { padding: "24px 32px 32px" },
        content: { borderRadius: 8 },
      }}
      closeIcon={
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6L18 18" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      }
      style={{ top: "10%" }}
    >
      <div style={{ textAlign: "center", marginBottom: 66 }}>
        <TitlePill>HỘI ĐỒNG THÀNH VIÊN</TitlePill>
      </div>

      <MembersSection>
        {primaryMember && (
          <TopMember>
            <PhotoWrap>
              <img src={primaryMember.photo} alt={primaryMember.name} />
            </PhotoWrap>
            <MemberName>{primaryMember.name}</MemberName>
            <MemberTitle>{primaryMember.title}</MemberTitle>
          </TopMember>
        )}

        <BottomRow>
          {secondaryMembers.map((member) => (
            <MemberCard key={member.name}>
              <PhotoWrap>
                <img src={member.photo} alt={member.name} />
              </PhotoWrap>
              <MemberName>{member.name}</MemberName>
              <MemberTitle>{member.title}</MemberTitle>
            </MemberCard>
          ))}
        </BottomRow>
      </MembersSection>
    </StyledModal>
  );
}

export default HoiDongThanhVienModal;
