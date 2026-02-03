import React from "react";
import PropTypes from "prop-types";
import { Form, Col } from "antd";
import { CSelect, CButton, CRangePicker } from "../../../components/common";
import { FilterSection, FilterRow } from "../style";
import {
    KY_DANH_GIA_OPTIONS,
    KPI_STATUS_OPTIONS,
    PHONG_BAN_OPTIONS,
    DON_VI_OPTIONS,
} from "./constants";

function KPIFilter({ initialValues, onSearch }) {
    const [form] = Form.useForm();

    const onFinish = (values) => {
        onSearch?.(values);
    };

    return (
        <FilterSection>
            <Form
                form={form}
                onFinish={onFinish}
                initialValues={initialValues}
            >
                <FilterRow gutter={[12, 12]}>
                    <Col span={6}>
                        <Form.Item name="dateRange" style={{ width: "100%", marginRight: 0, marginBottom: 0 }}>
                            <CRangePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
                        </Form.Item>
                    </Col>
                    <Col span={3}>
                        <Form.Item name="kyDanhGia" style={{ width: "100%", marginRight: 0, marginBottom: 0 }}>
                            <CSelect
                                placeholder="Kỳ đánh giá"
                                options={KY_DANH_GIA_OPTIONS}
                                allowClear
                            />
                        </Form.Item>
                    </Col>
                    <Col span={3}>
                        <Form.Item name="trangThai" style={{ width: "100%", marginRight: 0, marginBottom: 0 }}>
                            <CSelect
                                placeholder="Trạng thái"
                                options={KPI_STATUS_OPTIONS}
                                allowClear
                            />
                        </Form.Item>
                    </Col>
                    <Col span={3}>
                        <Form.Item name="phongBan" style={{ width: "100%", marginRight: 0, marginBottom: 0 }}>
                            <CSelect
                                placeholder="Phòng ban"
                                options={PHONG_BAN_OPTIONS}
                                allowClear
                            />
                        </Form.Item>
                    </Col>
                    <Col span={3}>
                        <Form.Item name="donVi" style={{ width: "100%", marginRight: 0, marginBottom: 0 }}>
                            <CSelect
                                placeholder="Đơn vị"
                                options={DON_VI_OPTIONS}
                                allowClear
                            />
                        </Form.Item>
                    </Col>
                    <Col span={3}>
                        <Form.Item name="maNhanVien" style={{ width: "100%", marginRight: 0, marginBottom: 0 }}>
                            <CSelect placeholder="Mã nhân viên" allowClear />
                        </Form.Item>
                    </Col>
                    <Col span={3}>
                        <Form.Item style={{ width: "100%", marginRight: 0, marginBottom: 0 }}>
                            <CButton type="primary" htmlType="submit" style={{ width: "100%" }}>
                                Tìm kiếm
                            </CButton>
                        </Form.Item>
                    </Col>
                </FilterRow>
            </Form>
        </FilterSection>
    );
}


KPIFilter.propTypes = {
    initialValues: PropTypes.object,
    onSearch: PropTypes.func,
};

export default KPIFilter;
