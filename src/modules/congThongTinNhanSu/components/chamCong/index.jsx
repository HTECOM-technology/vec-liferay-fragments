import React, { useState } from "react";
import dayjs from "dayjs";
import { CButton } from "../../../../components/common";
import { PageWrap, HeaderActions, FilterButton, FilterForm, CheckboxLabel } from "./style";
import { AttendanceFilter, AttendanceTable, mockAttendanceRecords } from "./components";
import { Popover, Row, Checkbox, Dropdown } from "antd";
import { EditOutlined, DownOutlined } from "@ant-design/icons";
import { IconFilter } from "../../../../assets/icon/IconFilter";
import FormFilter from "./components/FormFilter";

const defaultDateFrom = dayjs("2026-12-01");
const defaultDateTo = dayjs("2026-12-31");

function ChamCongPage() {
    const [showMyDataOnly, setShowMyDataOnly] = useState(false);

    const filterInitialValues = {
        dateRange: [defaultDateFrom, defaultDateTo],
    };

    const handleSearch = (values) => {
        // TODO: tích hợp API tìm kiếm chấm công khi có backend
        // eslint-disable-next-line no-console
        console.log("Tìm kiếm chấm công:", values);
    };

    const handleRegisterOvertime = () => {
        // TODO: thay thế bằng URL thực tế khi có
        window.location.href = "https://qlns.tctvec.vn/FBO/Main/zhredirect.aspx?id=zchrEmployeeOvertimeRegister2";
    };

    const handleRegisterLeave = () => {
        // TODO: thay thế bằng URL thực tế khi có
        window.location.href = "https://qlns.tctvec.vn/FBO/Main/zhredirect.aspx?id=hrLeaveInput";
    };

    const handleRegisterConfirmWork = () => {
        // TODO: thay thế bằng URL thực tế khi có
        window.location.href = "https://qlns.tctvec.vn/FBO/Main/zhredirect.aspx?id=zchdxxnc";
    };

    const registerMenuItems = [
        {
            key: "overtime",
            label: "Đăng ký làm thêm giờ",
            onClick: handleRegisterOvertime,
        },
        {
            key: "leave",
            label: "Đăng ký nghỉ, vắng mặt, công tác",
            onClick: handleRegisterLeave,
        },
        {
            key: "confirm",
            label: "Đăng ký xác nhận công",
            onClick: handleRegisterConfirmWork,
        },
    ];

    const handleApprove = () => {
        // TODO: thay thế bằng URL thực tế khi có
        window.location.href = "https://qlns.tctvec.vn/FBO/Main/zhredirect.aspx?id=zchrdxnc";
    };

    return (
        <PageWrap>
            <HeaderActions>
                <div className="heading-group">
                    <h3>Xem số liệu chấm công</h3>
                    <Popover
                        content={
                            <FilterForm>
                                <Row justify="center">
                                    <FormFilter />
                                </Row>
                            </FilterForm>
                        }
                        trigger="click"
                        placement="bottomRight"
                        overlayClassName="filter-popover"
                        arrow={false}
                    >
                        <FilterButton>
                            <IconFilter style={{ cursor: "pointer" }} />
                        </FilterButton>
                    </Popover>
                </div>
                <div className="button-group">
                    <CheckboxLabel className="action-buttons">
                        <Checkbox checked={showMyDataOnly} onChange={(e) => setShowMyDataOnly(e.target.checked)}>
                            Chỉ dữ liệu chấm công của tôi
                        </Checkbox>
                    </CheckboxLabel>
                    <div className="button-pair">
                        <Dropdown menu={{ items: registerMenuItems }} trigger={["click"]}>
                            <CButton
                                type="default"
                                className="action-buttons register-button"
                                icon={<EditOutlined />}
                                size="small"
                            >
                                Đăng ký <DownOutlined style={{ fontSize: 14 }} />
                            </CButton>
                        </Dropdown>
                        <CButton
                            type="primary"
                            className="action-buttons approve-button"
                            onClick={handleApprove}
                            icon={<EditOutlined />}
                            size="small"
                        >
                            Phê duyệt
                        </CButton>
                    </div>
                </div>
            </HeaderActions>

            <AttendanceFilter initialValues={filterInitialValues} onSearch={handleSearch} />
            <AttendanceTable dataSource={mockAttendanceRecords} />
        </PageWrap>
    );
}

export default ChamCongPage;
