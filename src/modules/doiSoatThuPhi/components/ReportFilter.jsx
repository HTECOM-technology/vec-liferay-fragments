import React from "react";
import { Form, Col, Select } from "antd";
import { CSelect, CButton, CRangePicker } from "../../../components/common";
import { FilterSection, FilterRow } from "../style";

const { Option: SelectOption } = Select;

function ReportFilter({ initialValues, onSearch }) {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    onSearch?.(values);
  };

  return (
    <FilterSection>
      <Form form={form} layout="inline" onFinish={onFinish} initialValues={initialValues} style={{ display: "block" }}>
        <FilterRow $last>
          <Col xl={6} md={6} sm={24} xs={24}>
            <Form.Item name="tuyen">
              <CSelect placeholder="Tuyến" allowClear>
                <SelectOption value="nb-lc">Nội bài - Lào Cai</SelectOption>
              </CSelect>
            </Form.Item>
          </Col>
          <Col xl={3} md={6} sm={24} xs={24}>
            <Form.Item name="tram">
              <CSelect placeholder="Trạm" allowClear>
                <SelectOption value="km6">Km6</SelectOption>
              </CSelect>
            </Form.Item>
          </Col>
          <Col xl={6} md={12} sm={24} xs={24}>
            <Form.Item name="date">
              <CRangePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xl={3} md={6} sm={12} xs={12}>
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

export default ReportFilter;
