import React, { useState } from "react";
import { Form, Checkbox, Space, Grid } from "antd";
import { PlusOutlined, EyeOutlined, SearchOutlined, MenuOutlined } from "@ant-design/icons";
import { CInput, CSelect, CButton, CModal } from "../../../../components/common";
import { HeaderSection, MobileFilterButton } from "../../style";
import {
  EventsHeaderTitle,
  EventsHeaderRow,
  EventsCheckboxGroup,
  EventsActionGroup,
  EventsFilterRow,
  EventsFilterCol,
} from "./styles";
import {
  EVENT_FILTER_OPTIONS,
  PARTICIPANT_FILTER_OPTIONS,
  MONTHS,
  YEARS,
} from "./constants";

const { useBreakpoint } = Grid;

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

  const onFinish = (values) => {
    onSearch?.(values);
    if (isMobile) {
      setIsModalVisible(false);
    }
  };

  const filterFormContent = (
    <Space direction="vertical" size={12} style={{ width: '100%' }}>
      <Form.Item name="search" style={{ marginBottom: 0, width: '100%' }}>
        <CInput placeholder="Tìm kiếm" prefix={<SearchOutlined />} />
      </Form.Item>

      <Form.Item name="lanhDao" style={{ marginBottom: 0, width: '100%' }}>
        <CSelect
          placeholder="Tất cả lãnh đạo"
          options={EVENT_FILTER_OPTIONS}
          allowClear
        />
      </Form.Item>

      <Form.Item name="nguoiThamGia" style={{ marginBottom: 0, width: '100%' }}>
        <CSelect
          placeholder="Tất cả người tham gia"
          options={PARTICIPANT_FILTER_OPTIONS}
          allowClear
        />
      </Form.Item>

      <Form.Item style={{ marginBottom: 0 }}>
        <CButton type="primary" htmlType="submit" block>
          Tìm kiếm
        </CButton>
      </Form.Item>
    </Space>
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
              <CButton type="primary" icon={<EyeOutlined />}>
                Xem đầy đủ lịch
              </CButton>
            </EventsActionGroup>
          </EventsHeaderRow>
        )}
        {isMobile && (
          <MobileFilterButton
            icon={<MenuOutlined />}
            onClick={() => setIsModalVisible(true)}
          />
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
