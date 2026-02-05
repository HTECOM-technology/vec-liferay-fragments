import React from "react";
import { Form, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import {
  CInput,
  CSelect,
  CRangePicker,
  CButton,
} from "../../../../components/common";
import { FilterSection } from "../../style";
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
      >
        <Space wrap size={9}>
          <Form.Item name="search">
            <CInput placeholder="Tìm kiếm" prefix={<SearchOutlined />} />
          </Form.Item>

          <Form.Item name="tieuDe">
            <CSelect options={TITLE_OPTIONS} placeholder="Tiêu đề" allowClear />
          </Form.Item>

          <Form.Item name="nguoiGui">
            <CSelect
              options={SENDER_OPTIONS}
              placeholder="Tất cả người gửi"
              allowClear
            />
          </Form.Item>

          <Form.Item name="dateRange">
            <CRangePicker format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item>
            <CButton type="primary" htmlType="submit">
              Tìm kiếm
            </CButton>
          </Form.Item>
        </Space>
      </Form>
    </FilterSection>
  );
}

export default MessagesFilter;
