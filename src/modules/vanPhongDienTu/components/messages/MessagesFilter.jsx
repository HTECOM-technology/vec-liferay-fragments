import React, { useState } from "react";
import { Form, Space, Grid } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import {
  CInput,
  CSelect,
  CDatePicker,
  CButton,
  CModal,
} from "../../../../components/common";
import { FilterSection, MobileFilterButton } from "../../style";
import { TITLE_OPTIONS, SENDER_OPTIONS } from "./constants";
import MenuFilterIcon from "../../../../assets/icon/menu-filter-icon.svg";

const { useBreakpoint } = Grid;

function MessagesFilter({ initialValues, onSearch }) {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const screens = useBreakpoint();
  
  // Detect mobile: screens smaller than md (768px)
  const isMobile = !screens.md;

  const onFinish = (values) => {
    onSearch?.(values);
    if (isMobile) {
      setIsModalVisible(false);
    }
  };

  const handleShowModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const filterFormContent = (
    <Space wrap size={9} direction={isMobile ? "vertical" : "horizontal"} style={{ width: isMobile ? '100%' : 'auto' }}>
      <Form.Item name="search" style={{ width: isMobile ? '100%' : 'auto', marginBottom: isMobile ? 8 : 0 }}>
        <CInput placeholder="Tìm kiếm" suffix={<SearchOutlined />} />
      </Form.Item>

      <Form.Item name="tieuDe" style={{ width: isMobile ? '100%' : 'auto', marginBottom: isMobile ? 8 : 0 }}>
        <CSelect options={TITLE_OPTIONS} placeholder="Tiêu đề" allowClear />
      </Form.Item>

      <Form.Item name="nguoiGui" style={{ width: isMobile ? '100%' : 'auto', marginBottom: isMobile ? 8 : 0 }}>
        <CSelect
          options={SENDER_OPTIONS}
          placeholder="Tất cả người gửi"
          allowClear
        />
      </Form.Item>

      {isMobile ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', marginBottom: 8 }}>
          <Form.Item name="dateFrom" style={{ flex: 1, marginBottom: 0 }}>
            <CDatePicker format="DD/MM/YYYY" placeholder="Từ ngày" style={{ width: '100%' }} />
          </Form.Item>
          <span style={{ color: '#666', flexShrink: 0 }}>Đến</span>
          <Form.Item name="dateTo" style={{ flex: 1, marginBottom: 0 }}>
            <CDatePicker format="DD/MM/YYYY" placeholder="Đến ngày" style={{ width: '100%' }} />
          </Form.Item>
        </div>
      ) : (
        <Form.Item name="dateRange" style={{ width: 'auto' }}>
          <Space>
            <CDatePicker format="DD/MM/YYYY" placeholder="Từ ngày" />
            <span style={{ color: '#666' }}>Đến</span>
            <CDatePicker format="DD/MM/YYYY" placeholder="Đến ngày" />
          </Space>
        </Form.Item>
      )}

      <Form.Item style={{ width: isMobile ? '100%' : 'auto', marginBottom: 0 }}>
        <div style={{ textAlign: 'center' }}>
          <CButton type="primary" htmlType="submit">
            Tìm kiếm
          </CButton>
        </div>
      </Form.Item>
    </Space>
  );

  if (isMobile) {
    return (
      <FilterSection>
        <MobileFilterButton
          icon={<img src={MenuFilterIcon} alt="filter" style={{ width: 18, height: 18 }} />}
          onClick={handleShowModal}
        />
        <CModal
          open={isModalVisible}
          onCancel={handleCloseModal}
          footer={null}
          width={372}
          closable={false}
          closeIcon={null}
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
      </FilterSection>
    );
  }

  return (
    <FilterSection>
      <Form
        form={form}
        layout="inline"
        onFinish={onFinish}
        initialValues={initialValues}
      >
        {filterFormContent}
      </Form>
    </FilterSection>
  );
}

export default MessagesFilter;
