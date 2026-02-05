import React from "react";
import { Form, Col, Checkbox, Space, Button } from "antd";
import { PlusOutlined, EyeOutlined } from "@ant-design/icons";
import { CInput, CSelect, CButton } from "../../../../components/common";
import { FilterSection, FilterRow } from "../../style";
import { EVENT_FILTER_OPTIONS, PARTICIPANT_FILTER_OPTIONS, MONTHS, YEARS } from "./constants";

function EventsFilter({ initialValues, onSearch, selectedMonth, selectedYear, onMonthChange, onYearChange }) {
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
        style={{ display: "block" }}
      >
        <FilterRow style={{ marginBottom: 16 }}>
          <Col>
            <Space>
              <Checkbox>Sự kiện tôi tham gia</Checkbox>
              <Checkbox>Hiện sự kiện thuộc nhóm con</Checkbox>
            </Space>
          </Col>
          <Col style={{ marginLeft: "auto" }}>
            <Space>
              <CButton type="primary" icon={<PlusOutlined />}>
                Thêm sự kiện
              </CButton>
              <CButton icon={<EyeOutlined />}>
                Xem đầy đủ lịch
              </CButton>
            </Space>
          </Col>
        </FilterRow>

        <FilterRow>
          <Col>
            <Form.Item style={{ marginBottom: 0, marginRight: 8 }}>
              <CSelect
                value={selectedMonth}
                onChange={onMonthChange}
                options={MONTHS}
                style={{ width: 120 }}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item style={{ marginBottom: 0, marginRight: 12 }}>
              <CSelect
                value={selectedYear}
                onChange={onYearChange}
                options={YEARS}
                style={{ width: 100 }}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="search">
              <CInput placeholder="Tìm kiếm" style={{ width: 200 }} />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="lanhDao">
              <CSelect
                placeholder="Tất cả lãnh đạo"
                options={EVENT_FILTER_OPTIONS}
                allowClear
                style={{ width: 180 }}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="nguoiThamGia">
              <CSelect
                placeholder="Tất cả người tham gia"
                options={PARTICIPANT_FILTER_OPTIONS}
                allowClear
                style={{ width: 200 }}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item>
              <CButton type="primary" htmlType="submit">
                Tìm kiếm
              </CButton>
            </Form.Item>
          </Col>
        </FilterRow>
      </Form>
    </FilterSection>
  );
}

export default EventsFilter;
