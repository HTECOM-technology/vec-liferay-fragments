import React from "react";
import { Form, Col } from "antd";
import { CInput, CSelect, CDatePicker, CButton } from "../../../../components/common";
import { FilterSection, FilterRow } from "../../style";
import { TITLE_OPTIONS, SENDER_OPTIONS } from "./constants";

function MessagesFilter({ initialValues, onSearch }) {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    onSearch?.(values);
  };

  return (
    <FilterSection>
      <Form
        form={form}
        layout="inline"
        onFinish={onFinish}
        initialValues={initialValues}
        style={{ display: "block" }}
      >
        <FilterRow>
          <Col>
            <Form.Item name="search">
              <CInput placeholder="Tìm kiếm" style={{ width: 200 }} />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="tieuDe">
              <CSelect
                placeholder="Tiêu đề"
                options={TITLE_OPTIONS}
                allowClear
                style={{ width: 150 }}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="nguoiGui">
              <CSelect
                placeholder="Tất cả người gửi"
                options={SENDER_OPTIONS}
                allowClear
                style={{ width: 180 }}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="dateFrom">
              <CDatePicker
                placeholder="01/12/2025"
                format="DD/MM/YYYY"
                style={{ width: 130 }}
              />
            </Form.Item>
          </Col>
          <Col style={{ lineHeight: "32px" }}>Đến</Col>
          <Col>
            <Form.Item name="dateTo">
              <CDatePicker
                placeholder="30/12/2025"
                format="DD/MM/YYYY"
                style={{ width: 130 }}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item>
              <CButton type="primary" htmlType="submit">
                Tìm kiếm
              </CButton>
            </Form.Item>
          </Col>
        </FilterRow>
      </Form>
    </FilterSection>
  );
}

export default MessagesFilter;
