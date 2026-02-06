import React, { useState } from "react";
import { Form, Space, Grid } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { CInput, CSelect, CButton, CModal } from "../../../../components/common";
import { MobileFilterButton } from "../../style";
import {
  UNIT_OPTIONS,
  DOCUMENT_TYPE_OPTIONS,
  GROUP_NUMBER_OPTIONS,
  ISSUING_UNIT_OPTIONS,
  DOCUMENT_STATUS_OPTIONS,
} from "./constants";

const { useBreakpoint } = Grid;

function DocumentsFilter({ initialValues, onSearch }) {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const onFinish = (values) => {
    onSearch?.(values);
    if (isMobile) {
      setIsModalVisible(false);
    }
  };

  const filterFormContent = (
    <Space wrap size={9} direction={isMobile ? "vertical" : "horizontal"} style={{ width: isMobile ? '100%' : 'auto' }}>
      <Form.Item name="search" style={{ marginBottom: 0, width: isMobile ? '100%' : 200 }}>
        <CInput placeholder="Tìm kiếm" style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="donVi" style={{ marginBottom: 0, width: isMobile ? '100%' : 150 }}>
        <CSelect
          placeholder="Chọn đơn vị"
          options={UNIT_OPTIONS}
          allowClear
          style={{ width: '100%' }}
        />
      </Form.Item>
      <Form.Item name="loaiVanBan" style={{ marginBottom: 0, width: isMobile ? '100%' : 150 }}>
        <CSelect
          placeholder="Loại văn bản"
          options={DOCUMENT_TYPE_OPTIONS}
          allowClear
          style={{ width: '100%' }}
        />
      </Form.Item>
      <Form.Item name="nhomSo" style={{ marginBottom: 0, width: isMobile ? '100%' : 150 }}>
        <CSelect
          placeholder="Nhóm số"
          options={GROUP_NUMBER_OPTIONS}
          allowClear
          style={{ width: '100%' }}
        />
      </Form.Item>
      <Form.Item name="donViBanHanh" style={{ marginBottom: 0, width: isMobile ? '100%' : 180 }}>
        <CSelect
          placeholder="Đơn vị ban hành"
          options={ISSUING_UNIT_OPTIONS}
          allowClear
          style={{ width: '100%' }}
        />
      </Form.Item>
      <Form.Item name="trangThai" style={{ marginBottom: 0, width: isMobile ? '100%' : 150 }}>
        <CSelect
          placeholder="Trạng thái"
          options={DOCUMENT_STATUS_OPTIONS}
          allowClear
          style={{ width: '100%' }}
        />
      </Form.Item>
      <Form.Item style={{ marginBottom: 0, width: isMobile ? '100%' : 'auto' }}>
        <CButton type="primary" htmlType="submit" block={isMobile}>
          Tìm kiếm
        </CButton>
      </Form.Item>
    </Space>
  );

  if (isMobile) {
    return (
      <div style={{ padding: "12px 0", borderBottom: "1px solid #0090cf33" }}>
        <MobileFilterButton
          icon={<MenuOutlined />}
          onClick={() => setIsModalVisible(true)}
        />
        <CModal
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width="90%"
          closable={false}
          title={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={initialValues}
          >
            {filterFormContent}
          </Form>
        </CModal>
      </div>
    );
  }

  return (
    <div style={{ padding: "12px 0", borderBottom: "1px solid #0090cf33" }}>
      <Form
        form={form}
        layout="inline"
        onFinish={onFinish}
        initialValues={initialValues}
      >
        {filterFormContent}
      </Form>
    </div>
  );
}

export default DocumentsFilter;
