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
import { WorkFilterWrap, WorkFilterForm, ButtonWrapper } from "./styles";
import {
  PROJECT_OPTIONS,
  WORK_GROUP_OPTIONS,
  WORK_ASSIGNOR_OPTIONS,
  WORK_STATUS_OPTIONS,
} from "./constants";

const { useBreakpoint } = Grid;

const FILTER_ICON_STYLE = { width: 18, height: 18 };

function WorkFilter({ initialValues, onSearch, isIconOnly = false }) {
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
        <Form.Item name="duAn" style={formItemStyle}>
          <CSelect placeholder="Dự án" options={PROJECT_OPTIONS} allowClear />
        </Form.Item>
        <Form.Item name="nhomCongViec" style={formItemStyle}>
          <CSelect
            placeholder="Nhóm công việc"
            options={WORK_GROUP_OPTIONS}
            allowClear
          />
        </Form.Item>
        <Form.Item name="nguoiGiaoViec" style={formItemStyle}>
          <CSelect
            placeholder="Người giao việc"
            options={WORK_ASSIGNOR_OPTIONS}
            allowClear
          />
        </Form.Item>
        <Form.Item name="trangThai" style={formItemStyle}>
          <CSelect
            placeholder="Trạng thái"
            options={WORK_STATUS_OPTIONS}
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

  if (isMobile) {
    const mobileButton = (
      <MobileFilterButton icon={filterIcon} onClick={handleOpenModal} />
    );

    if (isIconOnly) {
      return (
        <>
          {mobileButton}
          {filterModal}
        </>
      );
    }

    return (
      <WorkFilterWrap>
        {mobileButton}
        {filterModal}
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
