import React from "react";
import PropTypes from "prop-types";
import { Modal } from "antd";
import { EyeOutlined, CloseOutlined } from "@ant-design/icons";
import styled from "styled-components";
import iconHeader from "../../../../assets/icon-header.png";
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
        color: #fff;
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

const DetailContainer = styled.div`
    margin-top: 13px;
    border: 1px solid rgba(0, 144, 207, 0.1);
    border-radius: 6px;
`;

const SectionTitle = styled.h3`
    font-size: 16px;
    font-weight: 700;
    color: rgba(30, 30, 30, 1);
    margin: 0px 0 16px;
    padding: 15px;
    border-bottom: 1px solid rgba(0, 144, 207, 0.1);
    background-color: rgba(248, 249, 250, 1);
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
    min-width: 158px;

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
        font-size: 16px;
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

    .info-label {
        min-width: 120px;
        color: #333;
        font-weight: 600;
        font-size: 14px;
    }

    .info-value {
        color: #666;
        font-size: 14px;
        font-weight: 400;
        flex: 1;
        padding-left: 5px;
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

function EmployeeDetailModal({ visible, employee, onClose }) {
    if (!employee) return null;

    const employeeDetail = {
        ...employee,
        ngaySinhFull: `Thứ sáu, ${employee.ngaySinh}`,
        nguyenQuan: "-",
        tenTiengAnh: "-",
        ngayVaoLam: "01/12/2020",
        noiSinh: "Hà Nội",
        honNhan: "Đã lập gia đình",
        phongBanCT: employee.phongBan,
        tonGiao: "Không",
        soCMND: "***********",
        theDoan: "-",
        theDang: "-",
        diaChiThuongTru:
            "D2303 Tháp Đông - Tòa Hancorp Plaza - 72D Trần Đăng Ninh, Phường Dịch Vọng, Quận Cầu Giấy",
        diaChiLienHe:
            "D2303 Tháp Đông - Tòa Hancorp Plaza - 72D Trần Đăng Ninh, Phường Dịch Vọng, Quận Cầu Giấy",
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
                    <img
                        src={iconHeader}
                        alt="avatar"
                        style={{ width: 16, height: 16 }}
                    />
                </div>
                <span className="header-title">{employee.hoTen}</span>
                <CloseOutlined className="header-close" onClick={onClose} />
            </ModalHeader>

            <DetailContainer>
                <SectionTitle>Thông tin chung</SectionTitle>

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
                        <span className="employee-name">{employee.hoTen}</span>
                    </AvatarSection>

                    <InfoSection>
                        <InfoColumn>
                            <InfoRow>
                                <span className="info-label">Mã nhân viên</span>
                                <span className="info-value">{employee.maNV}</span>
                            </InfoRow>
                            <InfoRow>
                                <span className="info-label">Ngày sinh</span>
                                <span className="info-value">
                                    {employeeDetail.ngaySinhFull}
                                </span>
                            </InfoRow>
                            <InfoRow>
                                <span className="info-label">Nguyên quán</span>
                                <span className="info-value">
                                    {employeeDetail.nguyenQuan}
                                </span>
                            </InfoRow>
                            <InfoRow>
                                <span className="info-label">Giới tính</span>
                                <span className="info-value">{employee.gioiTinh}</span>
                            </InfoRow>
                            <InfoRow>
                                <span className="info-label">Tên tiếng Anh</span>
                                <span className="info-value">
                                    {employeeDetail.tenTiengAnh}
                                </span>
                            </InfoRow>
                            <InfoRow>
                                <span className="info-label">Ngày vào làm</span>
                                <span className="info-value">
                                    {employeeDetail.ngayVaoLam}
                                </span>
                            </InfoRow>
                            <InfoRow>
                                <span className="info-label">Nơi sinh</span>
                                <span className="info-value">{employeeDetail.noiSinh}</span>
                            </InfoRow>
                            <InfoRow>
                                <span className="info-label">Hôn nhân</span>
                                <span className="info-value">{employeeDetail.honNhan}</span>
                            </InfoRow>
                            <InfoRow>
                                <span className="info-label">Phòng ban/CT</span>
                                <span className="info-value">
                                    {employeeDetail.phongBanCT}
                                </span>
                            </InfoRow>
                            <InfoRow>
                                <span className="info-label">Chức vụ</span>
                                <span className="info-value">{employee.chucVu}</span>
                            </InfoRow>
                        </InfoColumn>

                        <InfoColumn>
                            <InfoRow>
                                <span className="info-label">Điện thoại</span>
                                <span className="info-value">{employee.dienThoai}</span>
                            </InfoRow>
                            <InfoRow>
                                <span className="info-label">Tôn giáo</span>
                                <span className="info-value">{employeeDetail.tonGiao}</span>
                            </InfoRow>
                            <InfoRow>
                                <span className="info-label">Số CMND</span>
                                <span className="info-value">{employeeDetail.soCMND}</span>
                            </InfoRow>
                            <InfoRow>
                                <span className="info-label">Thẻ Đoàn</span>
                                <span className="info-value">{employeeDetail.theDoan}</span>
                            </InfoRow>
                            <InfoRow>
                                <span className="info-label">Thẻ Đảng</span>
                                <span className="info-value">{employeeDetail.theDang}</span>
                            </InfoRow>
                            <InfoRow>
                                <span className="info-label">Địa chỉ thường trú</span>
                                <span className="info-value">
                                    {employeeDetail.diaChiThuongTru}
                                </span>
                            </InfoRow>
                            <InfoRow>
                                <span className="info-label">Địa chỉ liên hệ</span>
                                <span className="info-value">
                                    {employeeDetail.diaChiLienHe}
                                </span>
                            </InfoRow>
                        </InfoColumn>
                    </InfoSection>
                </ContentWrapper>
            </DetailContainer>

            <DetailButton>
                <EyeOutlined />
                Chi tiết nhân sự
            </DetailButton>
        </Modal>
    );
}

EmployeeDetailModal.propTypes = {
    visible: PropTypes.bool,
    employee: PropTypes.object,
    onClose: PropTypes.func,
};

EmployeeDetailModal.defaultProps = {
    visible: false,
    employee: null,
    onClose: () => {},
};

export default EmployeeDetailModal;
