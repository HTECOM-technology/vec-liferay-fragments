import React from "react";
import { Form, Space } from "antd";
import { CInput, CSelect, CButton } from "../../../../components/common";
import {
  UNIT_OPTIONS,
  DOCUMENT_TYPE_OPTIONS,
  GROUP_NUMBER_OPTIONS,
  ISSUING_UNIT_OPTIONS,
  DOCUMENT_STATUS_OPTIONS,
} from "./constants";

function DocumentsFilter({ initialValues, onSearch }) {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    onSearch?.(values);
  };

  return (
    <div style={{ padding: "12px 0", borderBottom: "1px solid #0090cf33" }}>
      <Form
        form={form}
        layout="inline"
        onFinish={onFinish}
        initialValues={initialValues}
      >
        <Space wrap size={9}>
          <Form.Item name="search" style={{ marginBottom: 0 }}>
            <CInput placeholder="Tìm kiếm" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item name="donVi" style={{ marginBottom: 0 }}>
            <CSelect
              placeholder="Chọn đơn vị"
              options={UNIT_OPTIONS}
              allowClear
              style={{ width: 150 }}
            />
          </Form.Item>
          <Form.Item name="loaiVanBan" style={{ marginBottom: 0 }}>
            <CSelect
              placeholder="Loại văn bản"
              options={DOCUMENT_TYPE_OPTIONS}
              allowClear
              style={{ width: 150 }}
            />
          </Form.Item>
          <Form.Item name="nhomSo" style={{ marginBottom: 0 }}>
            <CSelect
              placeholder="Nhóm số"
              options={GROUP_NUMBER_OPTIONS}
              allowClear
              style={{ width: 150 }}
            />
          </Form.Item>
          <Form.Item name="donViBanHanh" style={{ marginBottom: 0 }}>
            <CSelect
              placeholder="Đơn vị ban hành"
              options={ISSUING_UNIT_OPTIONS}
              allowClear
              style={{ width: 180 }}
            />
          </Form.Item>
          <Form.Item name="trangThai" style={{ marginBottom: 0 }}>
            <CSelect
              placeholder="Trạng thái"
              options={DOCUMENT_STATUS_OPTIONS}
              allowClear
              style={{ width: 150 }}
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <CButton type="primary" htmlType="submit">
              Tìm kiếm
            </CButton>
          </Form.Item>
        </Space>
      </Form>
    </div>
  );
}

export default DocumentsFilter;
