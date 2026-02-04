import React from "react";
import { Form, Col } from "antd";
import { CInput, CSelect, CButton } from "../../../../components/common";
import { FilterSection, FilterRow } from "../../style";
import { PROJECT_OPTIONS, WORK_GROUP_OPTIONS, WORK_ASSIGNOR_OPTIONS, WORK_STATUS_OPTIONS } from "./constants";

function WorkFilter({ initialValues, onSearch }) {
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
        <FilterRow>
          <Col>
            <Form.Item name="search">
              <CInput placeholder="Tìm kiếm" style={{ width: 200 }} />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="duAn">
              <CSelect
                placeholder="Dự án"
                options={PROJECT_OPTIONS}
                allowClear
                style={{ width: 150 }}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="nhomCongViec">
              <CSelect
                placeholder="Nhóm công việc"
                options={WORK_GROUP_OPTIONS}
                allowClear
                style={{ width: 180 }}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="nguoiGiaoViec">
              <CSelect
                placeholder="Người giao việc"
                options={WORK_ASSIGNOR_OPTIONS}
                allowClear
                style={{ width: 180 }}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="trangThai">
              <CSelect
                placeholder="Trạng thái"
                options={WORK_STATUS_OPTIONS}
                allowClear
                style={{ width: 150 }}
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

export default WorkFilter;
