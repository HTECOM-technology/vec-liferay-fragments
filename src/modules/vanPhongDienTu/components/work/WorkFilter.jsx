import React, { useState } from "react";
import { Form, Space, Grid } from "antd";
import { MenuOutlined, SearchOutlined } from "@ant-design/icons";
import { CInput, CSelect, CButton, CModal } from "../../../../components/common";
import { MobileFilterButton } from "../../style";
import { WorkFilterWrap, WorkFilterForm } from "./styles";
import { PROJECT_OPTIONS, WORK_GROUP_OPTIONS, WORK_ASSIGNOR_OPTIONS, WORK_STATUS_OPTIONS } from "./constants";

const { useBreakpoint } = Grid;

function WorkFilter({ initialValues, onSearch, isIconOnly = false }) {
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
      <Form.Item name="search" style={{ width: isMobile ? '100%' : 'auto' }}>
        <CInput placeholder="Tìm kiếm" suffix={<SearchOutlined />} />
      </Form.Item>
      <Form.Item name="duAn" style={{ width: isMobile ? '100%' : 'auto' }}>
        <CSelect
          placeholder="Dự án"
          options={PROJECT_OPTIONS}
          allowClear
        />
      </Form.Item>
      <Form.Item name="nhomCongViec" style={{ width: isMobile ? '100%' : 'auto' }}>
        <CSelect
          placeholder="Nhóm công việc"
          options={WORK_GROUP_OPTIONS}
          allowClear
        />
      </Form.Item>
      <Form.Item name="nguoiGiaoViec" style={{ width: isMobile ? '100%' : 'auto' }}>
        <CSelect
          placeholder="Người giao việc"
          options={WORK_ASSIGNOR_OPTIONS}
          allowClear
        />
      </Form.Item>
      <Form.Item name="trangThai" style={{ width: isMobile ? '100%' : 'auto' }}>
        <CSelect
          placeholder="Trạng thái"
          options={WORK_STATUS_OPTIONS}
          allowClear
        />
      </Form.Item>
      <Form.Item style={{ width: isMobile ? '100%' : 'auto' }}>
        <CButton type="primary" htmlType="submit" block={isMobile}>
          Tìm kiếm
        </CButton>
      </Form.Item>
    </Space>
  );

  if (isMobile) {
    if (isIconOnly) {
      return (
        <MobileFilterButton
          icon={<MenuOutlined />}
          onClick={() => setIsModalVisible(true)}
        />
      );
    }

    return (
      <WorkFilterWrap>
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
      </WorkFilterWrap>
    );
  }

  return (
    <WorkFilterWrap>
      <WorkFilterForm
        form={form}
        layout="inline"
        onFinish={onFinish}
        initialValues={initialValues}
      >
        {filterFormContent}
      </WorkFilterForm>
    </WorkFilterWrap>
  );
}

export default WorkFilter;
