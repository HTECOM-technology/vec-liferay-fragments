import React from "react";

import { CRangePicker, CInput, CSelect, CButton } from "../../../../components/common";
import { Col, Form } from "antd";
const FormFilter = () => {
  return (
    <>
      <Col xl={6} md={12} sm={24} xs={24}>
        <Form.Item name="dateRange">
          <CRangePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
        </Form.Item>
      </Col>
      <Col xl={3} md={6} sm={24} xs={24}>
        <Form.Item name="maKhoaHoc">
          <CInput placeholder="Mã khóa học" />
        </Form.Item>
      </Col>
      <Col xl={3} md={6} sm={24} xs={24}>
        <Form.Item name="monHoc">
          <CSelect placeholder="Môn học" allowClear />
        </Form.Item>
      </Col>
      <Col xl={3} md={6} sm={24} xs={24}>
        <Form.Item name="donViDaoTao">
          <CSelect placeholder="Đơn vị đào tạo" allowClear />
        </Form.Item>
      </Col>
      <Col xl={3} md={6} sm={24} xs={24}>
        <Form.Item name="loaiHinhDaoTao">
          <CSelect placeholder="Loại hình đào tạo" allowClear />
        </Form.Item>
      </Col>
      <Col xl={3} md={6} sm={24} xs={24}>
        <Form.Item name="trangThai">
          <CSelect placeholder="Trạng thái" allowClear />
        </Form.Item>
      </Col>
      <Col xl={3} md={6} sm={8} xs={8}>
        <Form.Item style={{ textAlign: "center" }}>
          <CButton type="primary" htmlType="submit" style={{ width: "100%" }}>
            Tìm kiếm
          </CButton>
        </Form.Item>
      </Col>
    </>
  );
};

export default FormFilter;
