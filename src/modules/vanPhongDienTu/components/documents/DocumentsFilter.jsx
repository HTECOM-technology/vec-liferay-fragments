import React, { useState } from "react";
import { Form, Space, Grid } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import {
  CInput,
  CSelect,
  CButton,
  CModal,
} from "../../../../components/common";
import { MobileFilterButton, FilterSection } from "../../style";
import MenuFilterIcon from "../../../../assets/icon/menu-filter-icon.svg";
import { ButtonWrapper } from "./styles";
import {
  UNIT_OPTIONS,
  DOCUMENT_TYPE_OPTIONS,
  GROUP_NUMBER_OPTIONS,
  ISSUING_UNIT_OPTIONS,
  DOCUMENT_STATUS_OPTIONS,
} from "./constants";

const { useBreakpoint } = Grid;

const FILTER_ICON_STYLE = { width: 18, height: 18 };

function DocumentsFilter({
  initialValues,
  onSearch,
  renderMobileButton,
  isMobileView,
}) {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const handleOpenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);

  const onFinish = (values) => {
    onSearch?.(values);
    if (isMobile) {
      handleCloseModal();
    }
  };

  const formItemStyle = isMobile ? { width: "100%" } : { width: "auto" };

  const filterFormContent = (
    <FilterSection>
      <Space
        wrap
        size={9}
        direction={isMobile ? "vertical" : "horizontal"}
        style={formItemStyle}
      >
        <Form.Item name="search" style={formItemStyle}>
          <CInput placeholder="Tìm kiếm" suffix={<SearchOutlined />} />
        </Form.Item>
        <Form.Item name="donVi" style={formItemStyle}>
          <CSelect
            placeholder="Chọn đơn vị"
            options={UNIT_OPTIONS}
            allowClear
          />
        </Form.Item>
        <Form.Item name="loaiVanBan" style={formItemStyle}>
          <CSelect
            placeholder="Loại văn bản"
            options={DOCUMENT_TYPE_OPTIONS}
            allowClear
          />
        </Form.Item>
        <Form.Item name="nhomSo" style={formItemStyle}>
          <CSelect
            placeholder="Nhóm số"
            options={GROUP_NUMBER_OPTIONS}
            allowClear
          />
        </Form.Item>
        <Form.Item name="donViBanHanh" style={formItemStyle}>
          <CSelect
            placeholder="Đơn vị ban hành"
            options={ISSUING_UNIT_OPTIONS}
            allowClear
          />
        </Form.Item>
        <Form.Item name="trangThai" style={formItemStyle}>
          <CSelect
            placeholder="Trạng thái"
            options={DOCUMENT_STATUS_OPTIONS}
            allowClear
          />
        </Form.Item>
        <Form.Item style={formItemStyle}>
          <ButtonWrapper>
            <CButton type="primary" htmlType="submit">
              Tìm kiếm
            </CButton>
          </ButtonWrapper>
        </Form.Item>
      </Space>
    </FilterSection>
  );

  const filterIcon = (
    <img src={MenuFilterIcon} alt="filter" style={FILTER_ICON_STYLE} />
  );

  const filterModal = (
    <CModal
      open={isModalVisible}
      onCancel={handleCloseModal}
      footer={null}
      width={372}
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
  );

  const wrapperStyle = {
    padding: "12px 0",
    borderBottom: "1px solid #0090cf33",
  };

  if (isMobile) {
    const mobileButton = renderMobileButton ? (
      renderMobileButton({ onClick: handleOpenModal })
    ) : (
      <div style={wrapperStyle}>
        <MobileFilterButton icon={filterIcon} onClick={handleOpenModal} />
      </div>
    );

    return (
      <>
        {mobileButton}
        {filterModal}
      </>
    );
  }

  return (
    <div style={wrapperStyle}>
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
