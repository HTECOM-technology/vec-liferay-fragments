import React, { useState } from "react";
import { Form, Checkbox, Space, Grid } from "antd";
import { PlusOutlined, EyeOutlined, SearchOutlined, FilterOutlined } from "@ant-design/icons";
import {
  CInput,
  CSelect,
  CButton,
  CModal,
} from "../../../../components/common";
import { HeaderSection, MobileFilterButton } from "../../style";
import {
  EventsHeaderTitle,
  EventsHeaderRow,
  EventsCheckboxGroup,
  EventsActionGroup,
  EventsFilterRow,
  EventsFilterCol,
  ButtonWrapper,
} from "./styles";
import {
  EVENT_FILTER_OPTIONS,
  PARTICIPANT_FILTER_OPTIONS,
  MONTHS,
  YEARS,
} from "./constants";

const { useBreakpoint } = Grid;

const FILTER_ICON_STYLE = { width: 18, height: 18 };

function EventsFilter({
  contentTitle,
  initialValues,
  onSearch,
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
  onAddEvent,
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

  const filterFormContent = (
    <Space direction="vertical" size={12} style={{ width: "100%" }}>
      <Form.Item name="search" style={{ marginBottom: 0, width: "100%" }}>
        <CInput placeholder="Tìm kiếm" prefix={<SearchOutlined />} />
      </Form.Item>

      <Form.Item name="lanhDao" style={{ marginBottom: 0, width: "100%" }}>
        <CSelect
          placeholder="Tất cả lãnh đạo"
          options={EVENT_FILTER_OPTIONS}
          allowClear
        />
      </Form.Item>

      <Form.Item name="nguoiThamGia" style={{ marginBottom: 0, width: "100%" }}>
        <CSelect
          placeholder="Tất cả người tham gia"
          options={PARTICIPANT_FILTER_OPTIONS}
          allowClear
        />
      </Form.Item>

      <Form.Item style={{ marginBottom: 0 }}>
        <ButtonWrapper>
          <CButton type="primary" htmlType="submit">
            Tìm kiếm
          </CButton>
        </ButtonWrapper>
      </Form.Item>
    </Space>
  );

  const filterIcon = <FilterOutlined style={{ fontSize: 18, color: "#0090CF" }} />;

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

  return (
    <>
      <HeaderSection>
        <EventsHeaderTitle>{contentTitle}</EventsHeaderTitle>
        {!isMobile && (
          <EventsHeaderRow>
            <EventsCheckboxGroup>
              <Space size={12}>
                <Checkbox defaultChecked>Sự kiện tôi tham gia</Checkbox>
                <Checkbox defaultChecked>Hiển sự kiện trước nhóm con</Checkbox>
              </Space>
            </EventsCheckboxGroup>
            <EventsActionGroup>
              <CButton
                className="add-event-button"
                icon={<PlusOutlined />}
                onClick={onAddEvent}
              >
                Thêm sự kiện
              </CButton>
              <CButton
                type="primary"
                icon={<EyeOutlined />}
                onClick={() => window.open("", "_blank")}
              >
                Xem đầy đủ lịch
              </CButton>
            </EventsActionGroup>
          </EventsHeaderRow>
        )}
        {isMobile && (
          <MobileFilterButton icon={filterIcon} onClick={handleOpenModal} />
        )}
      </HeaderSection>

      {isMobile && (
        <>
          <EventsCheckboxGroup style={{ marginTop: 12, marginBottom: 12 }}>
            <Space direction="vertical" size={8}>
              <Checkbox defaultChecked>Sự kiện tôi tham gia</Checkbox>
              <Checkbox defaultChecked>Hiển thị kiện thuộc nhóm con</Checkbox>
            </Space>
          </EventsCheckboxGroup>
          <EventsFilterRow style={{ marginTop: 0, marginBottom: 12 }}>
            <Space size={8}>
              <CSelect
                value={selectedMonth}
                onChange={onMonthChange}
                options={MONTHS}
                style={{ width: 110 }}
              />
              <CSelect
                value={selectedYear}
                onChange={onYearChange}
                options={YEARS}
                style={{ width: 90 }}
              />
            </Space>
          </EventsFilterRow>
          {filterModal}
        </>
      )}

      {!isMobile && (
        <Form form={form} onFinish={onFinish} initialValues={initialValues}>
          <EventsFilterRow>
            <EventsFilterCol>
              <Form.Item>
                <CSelect
                  value={selectedMonth}
                  onChange={onMonthChange}
                  options={MONTHS}
                  style={{ width: 110 }}
                />
              </Form.Item>

              <Form.Item>
                <CSelect
                  value={selectedYear}
                  onChange={onYearChange}
                  options={YEARS}
                  style={{ width: 90 }}
                />
              </Form.Item>
            </EventsFilterCol>

            <EventsFilterCol>
              <Form.Item name="search" style={{ flex: 1, minWidth: 200 }}>
                <CInput placeholder="Tìm kiếm" prefix={<SearchOutlined />} />
              </Form.Item>

              <Form.Item name="lanhDao">
                <CSelect
                  placeholder="Tất cả lãnh đạo"
                  options={EVENT_FILTER_OPTIONS}
                  allowClear
                  style={{ width: 170 }}
                />
              </Form.Item>

              <Form.Item name="nguoiThamGia">
                <CSelect
                  placeholder="Tất cả người tham gia"
                  options={PARTICIPANT_FILTER_OPTIONS}
                  allowClear
                  style={{ width: 170 }}
                />
              </Form.Item>

              <Form.Item>
                <CButton type="primary" htmlType="submit">
                  Tìm kiếm
                </CButton>
              </Form.Item>
            </EventsFilterCol>
          </EventsFilterRow>
        </Form>
      )}
    </>
  );
}

export default EventsFilter;
