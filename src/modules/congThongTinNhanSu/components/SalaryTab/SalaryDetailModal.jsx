import React from "react";
import PropTypes from "prop-types";
import { Modal } from "antd";
import { EyeOutlined, CloseOutlined } from "@ant-design/icons";
import styled from "styled-components";
import avaProfileDefault from "../../../../assets/ava-profile-default.png";

const ModalHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 24px;
    background: rgba(229, 247, 255, 1);
    color: rgba(30, 30, 30, 1);
    margin: -20px -24px 0;
    border-radius: 8px 8px 0 0;
    border-bottom: 1px solid rgba(0, 144, 207, 0.2);

    .header-icon {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 144, 207, 1);
        border-radius: 4px;
    }

    .header-title {
        font-size: 16px;
        font-weight: 600;
        flex: 1;
    }

    .header-close {
        cursor: pointer;
        font-size: 16px;
        opacity: 0.8;
        transition: opacity 0.2s;

        &:hover {
            opacity: 1;
        }
    }
`;

const SalaryIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M10.7273 22H12.5C15.7875 22 17.4312 22 18.5376 21.092C18.7401 20.9258 18.9258 20.7401 19.092 20.5376C20 19.4312 20 17.7875 20 14.5V7.81818C20 6.12494 20 5.27832 19.732 4.60214C19.3012 3.5151 18.3902 2.65765 17.2352 2.2522C16.5168 2 15.6173 2 13.8182 2C10.6698 2 9.09563 2 7.83836 2.44135C5.81714 3.15088 4.22282 4.65142 3.46894 6.55375C3 7.73706 3 9.21865 3 12.1818L3 14.7273C3 17.7966 3 19.3313 3.8477 20.3971C4.09058 20.7025 4.37862 20.9736 4.70307 21.2022C5.83546 22 7.46607 22 10.7273 22Z"
            fill="white"
            fillOpacity="0.3"
        />
        <path
            d="M12.5 22L10.7273 22C7.46607 22 5.83546 22 4.70307 21.2022C4.37862 20.9736 4.09058 20.7025 3.8477 20.3971C3 19.3313 3 17.7966 3 14.7273L3 12.1818C3 9.21865 3 7.73706 3.46894 6.55375C4.22282 4.65142 5.81714 3.15088 7.83836 2.44135C9.09563 2 10.6698 2 13.8182 2C15.6173 2 16.5168 2 17.2352 2.2522C18.3902 2.65765 19.3013 3.5151 19.732 4.60214C20 5.27832 20 6.12494 20 7.81818L20 10.5"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M3 12C3 10.159 4.49238 8.66667 6.33333 8.66667C6.99912 8.66667 7.78404 8.78333 8.43137 8.60988C9.00652 8.45576 9.45576 8.00652 9.60988 7.43136C9.78333 6.78404 9.66667 5.99912 9.66667 5.33333C9.66667 3.49238 11.1591 2 13 2"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M21 20.4923C20.5216 21.3957 19.6512 22 18.6568 22C17.147 22 15.9231 20.6071 15.9231 18.8889V17.1111C15.9231 15.3929 17.147 14 18.6568 14C19.6512 14 20.5216 14.6043 21 15.5077M15 18H18.9231"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
        />
    </svg>
);

const DetailContainer = styled.div`
    margin-top: 13px;
    border: 1px solid rgba(0, 144, 207, 0.1);
    border-radius: 6px;
`;

const SectionHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px;
    border-bottom: 1px solid rgba(0, 144, 207, 0.1);
    background-color: rgba(248, 249, 250, 1);
`;

const SectionTitle = styled.h3`
    font-size: 16px;
    font-weight: 700;
    color: rgba(30, 30, 30, 1);
    margin: 0;
`;

const TotalSalary = styled.div`
    font-size: 14px;
    color: rgba(30, 30, 30, 1);

    span {
        color: rgba(0, 144, 207, 1);
        font-weight: 700;
    }
`;

const ContentWrapper = styled.div`
    display: flex;
    gap: 24px;
    padding: 15px;
`;

const AvatarSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 140px;

    .avatar-placeholder {
        background: #e8e8e8;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 8px;

        .avatar-icon {
            font-size: 48px;
            color: #999;
        }
    }

    .employee-name {
        color: rgba(0, 144, 207, 1);
        font-size: 14px;
        font-weight: 600;
        text-align: center;
    }
`;

const InfoSection = styled.div`
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 10px;
`;

const InfoColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const InfoRow = styled.div`
    display: flex;
    align-items: flex-start;
    min-height: 28px;
    gap: 15px;

    .info-label {
        min-width: 160px;
        color: rgba(30, 30, 30, 1);
        font-weight: 600;
        font-size: 14px;
    }

    .info-value {
        color: rgba(30, 30, 30, 1);
        font-size: 14px;
        font-weight: 400;
        flex: 1;
    }
`;

const DetailButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 24px;
    background: rgba(0, 144, 207, 1);
    color: #fff;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    margin: 24px auto 0;
    transition: background 0.2s;
    outline: none;

    &:hover {
        background: #007bb5;
    }
`;

function SalaryDetailModal({ visible, salary, onClose }) {
    if (!salary) return null;

    // Mở rộng dữ liệu phiếu lương với các trường chi tiết
    const salaryDetail = {
        ...salary,
        ngaySinh: "Thứ sáu, 17/8/1979",
        gioiTinh: "Nam",
        donVi: "VEC",
        stkNganHang: "VCB - **** **** **** 345",
        heSoLuong: "Bậc 1",
        hsPhucCapChucVu: salary.maNV,
        ngayCongLuongCoBan: "23",
        luongCoBan: "6.500.000 VND",
        boSungThem: "-",
        ngayCongLuongBoSung: "-",
        luongBoSungSoTien: "-",
        mucLuongTheoQD: "-",
        phuCapLuongTheoQD: "-",
        xepLoai: "-",
        tongLuong: "10.500.000 VND",
    };

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            width={1180}
            closable={false}
        >
            <ModalHeader>
                <div className="header-icon">
                    <SalaryIcon />
                </div>
                <span className="header-title">
                    Phiếu lương tháng {salary.kyLuong}
                </span>
                <CloseOutlined className="header-close" onClick={onClose} />
            </ModalHeader>

            <DetailContainer>
                <SectionHeader>
                    <SectionTitle>Thông tin chung</SectionTitle>
                    <TotalSalary>
                        Tổng lương: <span>{salaryDetail.tongLuong}</span>
                    </TotalSalary>
                </SectionHeader>

                <ContentWrapper>
                    <AvatarSection>
                        <div className="avatar-placeholder">
                            <img
                                className="avatar-icon"
                                src={avaProfileDefault}
                                alt="avatar"
                                style={{ width: 158, height: 195 }}
                            />
                        </div>
                        <span className="employee-name">{salary.hoTen}</span>
                    </AvatarSection>

                    <InfoSection>
                        <InfoColumn>
                            <InfoRow>
                                <span className="info-label">Mã nhân viên</span>
                                <span className="info-value">{salary.maNV}</span>
                            </InfoRow>
                            <InfoRow>
                                <span className="info-label">Ngày sinh</span>
                                <span className="info-value">{salaryDetail.ngaySinh}</span>
                            </InfoRow>
                            <InfoRow>
                                <span className="info-label">Giới tính</span>
                                <span className="info-value">{salaryDetail.gioiTinh}</span>
                            </InfoRow>
                            <InfoRow>
                                <span className="info-label">Kỳ lương</span>
                                <span className="info-value">{salary.kyLuong}</span>
                            </InfoRow>
                            <InfoRow>
                                <span className="info-label">Chức vụ</span>
                                <span className="info-value">{salary.chucVu}</span>
                            </InfoRow>
                            <InfoRow>
                                <span className="info-label">Phòng ban</span>
                                <span className="info-value">{salary.phongBan}</span>
                            </InfoRow>
                            <InfoRow>
                                <span className="info-label">Đơn vị</span>
                                <span className="info-value">{salaryDetail.donVi}</span>
                            </InfoRow>
                            <InfoRow>
                                <span className="info-label">STK ngân hàng</span>
                                <span className="info-value">
                                    {salaryDetail.stkNganHang}
                                </span>
                            </InfoRow>
                            <InfoRow>
                                <span className="info-label">Hệ số lương</span>
                                <span className="info-value">{salaryDetail.heSoLuong}</span>
                            </InfoRow>
                        </InfoColumn>

                        <InfoColumn>
                            <InfoRow>
                                <span className="info-label">HS phụ cấp chức vụ</span>
                                <span className="info-value">
                                    {salaryDetail.hsPhucCapChucVu}
                                </span>
                            </InfoRow>
                            <InfoRow>
                                <span className="info-label">Ngày công lương cơ bản</span>
                                <span className="info-value">
                                    {salaryDetail.ngayCongLuongCoBan}
                                </span>
                            </InfoRow>
                            <InfoRow>
                                <span className="info-label">Lương cơ bản</span>
                                <span className="info-value">{salaryDetail.luongCoBan}</span>
                            </InfoRow>
                            <InfoRow>
                                <span className="info-label">Bổ sung thêm</span>
                                <span className="info-value">{salaryDetail.boSungThem}</span>
                            </InfoRow>
                            <InfoRow>
                                <span className="info-label">Ngày công lương bổ sung</span>
                                <span className="info-value">
                                    {salaryDetail.ngayCongLuongBoSung}
                                </span>
                            </InfoRow>
                            <InfoRow>
                                <span className="info-label">Lương bổ sung số tiền</span>
                                <span className="info-value">
                                    {salaryDetail.luongBoSungSoTien}
                                </span>
                            </InfoRow>
                            <InfoRow>
                                <span className="info-label">Mức lương theo QĐ</span>
                                <span className="info-value">
                                    {salaryDetail.mucLuongTheoQD}
                                </span>
                            </InfoRow>
                            <InfoRow>
                                <span className="info-label">Phụ cấp lương Theo QĐ</span>
                                <span className="info-value">
                                    {salaryDetail.phuCapLuongTheoQD}
                                </span>
                            </InfoRow>
                            <InfoRow>
                                <span className="info-label">Xếp loại</span>
                                <span className="info-value">{salaryDetail.xepLoai}</span>
                            </InfoRow>
                        </InfoColumn>
                    </InfoSection>
                </ContentWrapper>
            </DetailContainer>

            <DetailButton>
                <EyeOutlined />
                Chi tiết phiếu lương
            </DetailButton>
        </Modal>
    );
}

SalaryDetailModal.propTypes = {
    visible: PropTypes.bool,
    salary: PropTypes.object,
    onClose: PropTypes.func,
};

SalaryDetailModal.defaultProps = {
    visible: false,
    salary: null,
    onClose: () => {},
};

export default SalaryDetailModal;
