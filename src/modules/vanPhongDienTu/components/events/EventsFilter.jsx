import React from "react";
import { Form, Checkbox, Space } from "antd";
import { PlusOutlined, EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { CInput, CSelect, CButton } from "../../../../components/common";
import {
  HeaderSection,
  EventsHeaderTitle,
  EventsHeaderRow,
  EventsCheckboxGroup,
  EventsActionGroup,
  EventsFilterRow,
  EventsFilterCol,
} from "../../style";
import {
  EVENT_FILTER_OPTIONS,
  PARTICIPANT_FILTER_OPTIONS,
  MONTHS,
  YEARS,
} from "./constants";

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

  const onFinish = (values) => {
    onSearch?.(values);
  };

  return (
    <>
      <HeaderSection>
        <EventsHeaderTitle>{contentTitle}</EventsHeaderTitle>
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
      </HeaderSection>

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
    </>
  );
}

export default EventsFilter;
