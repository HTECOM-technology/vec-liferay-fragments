import React from "react";
import PropTypes from "prop-types";
import { Form, Col, Grid, Modal } from "antd";
import { CSelect, CButton, CRangePicker } from "../../../../components/common";
import { FilterSection, FilterRow, MobileDateRangeGlobalStyle } from "../../style";
import {
    KY_DANH_GIA_OPTIONS,
    KPI_STATUS_OPTIONS,
    PHONG_BAN_OPTIONS,
    DON_VI_OPTIONS,
} from "../constants";

const { useBreakpoint } = Grid;

function KPIFilter({ initialValues, onSearch, open, onClose }) {
    const [form] = Form.useForm();
    const screens = useBreakpoint();

    const onFinish = (values) => {
        onSearch?.(values);
        if (!screens.md) {
            onClose?.();
        }
    };

    const formContent = (
        <Form
            form={form}
            onFinish={onFinish}
            initialValues={initialValues}
            layout={!screens.md ? "vertical" : "horizontal"}
        >
            {!screens.md && <MobileDateRangeGlobalStyle />}
            <FilterRow gutter={[12, 12]}>
                <Col xs={24} md={6}>
                    <Form.Item name="dateRange" style={{ width: "100%", marginRight: 0, marginBottom: 0 }}>
                        <CRangePicker
                            format="DD/MM/YYYY"
                            style={{ width: "100%" }}
                            dropdownClassName={!screens.md ? "mobile-range-picker-dropdown" : undefined}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} md={3}>
                    <Form.Item name="kyDanhGia" style={{ width: "100%", marginRight: 0, marginBottom: 0 }}>
                        <CSelect
                            placeholder="Kỳ đánh giá"
                            options={KY_DANH_GIA_OPTIONS}
                            allowClear
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={3}>
                    <Form.Item name="trangThai" style={{ width: "100%", marginRight: 0, marginBottom: 0 }}>
                        <CSelect
                            placeholder="Trạng thái"
                            options={KPI_STATUS_OPTIONS}
                            allowClear
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={3}>
                    <Form.Item name="phongBan" style={{ width: "100%", marginRight: 0, marginBottom: 0 }}>
                        <CSelect
                            placeholder="Phòng ban"
                            options={PHONG_BAN_OPTIONS}
                            allowClear
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={3}>
                    <Form.Item name="donVi" style={{ width: "100%", marginRight: 0, marginBottom: 0 }}>
                        <CSelect
                            placeholder="Đơn vị"
                            options={DON_VI_OPTIONS}
                            allowClear
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={3}>
                    <Form.Item name="maNhanVien" style={{ width: "100%", marginRight: 0, marginBottom: 0 }}>
                        <CSelect placeholder="Mã nhân viên" allowClear />
                    </Form.Item>
                </Col>
                <Col xs={24} md={3}>
                    <Form.Item style={{ width: "100%", marginRight: 0, marginBottom: 0 }}>
                        <CButton type="primary" htmlType="submit" style={{ width: "100%" }}>
                            Tìm kiếm
                        </CButton>
                    </Form.Item>
                </Col>
            </FilterRow>
        </Form>
    );

    if (!screens.md) {
        return (
            <Modal
                title="Bộ lọc"
                open={open}
                onCancel={onClose}
                footer={null}
                centered
                width="90%"
                bodyStyle={{ padding: 16 }}
            >
                {formContent}
            </Modal>
        );
    }

    return (
        <FilterSection>
            {formContent}
        </FilterSection>
    );
}


KPIFilter.propTypes = {
    initialValues: PropTypes.object,
    onSearch: PropTypes.func,
    open: PropTypes.bool,
    onClose: PropTypes.func,
    dataSource: PropTypes.array, // Added to fix potential lint error, though not used in original
};

export default KPIFilter;
