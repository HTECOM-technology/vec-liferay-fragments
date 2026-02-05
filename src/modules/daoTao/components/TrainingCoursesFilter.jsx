import React from "react";
import { Form, Col } from "antd";
import { CInput, CSelect, CButton, CRangePicker } from "../../../components/common";
import { FilterSection, FilterRow } from "../style";

function TrainingCoursesFilter({ initialValues, onSearch }) {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    onSearch?.(values);
  };

  return (
    <FilterSection>
      <Form form={form} layout="inline" onFinish={onFinish} initialValues={initialValues} style={{ display: "block" }}>
        <FilterRow>
          <Col span={6}>
            <Form.Item name="dateRange">
              <CRangePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="maKhoaHoc">
              <CInput placeholder="Mã khóa học" />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="monHoc">
              <CSelect placeholder="Môn học" allowClear />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="donViDaoTao">
              <CSelect placeholder="Đơn vị đào tạo" allowClear />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="loaiHinhDaoTao">
              <CSelect placeholder="Loại hình đào tạo" allowClear />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="trangThai">
              <CSelect placeholder="Trạng thái" allowClear />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item>
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

export default TrainingCoursesFilter;
