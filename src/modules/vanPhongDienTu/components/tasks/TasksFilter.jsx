import React from "react";
import { Form, Col } from "antd";
import { CInput, CSelect, CButton } from "../../../../components/common";
import { FilterSection, FilterRow } from "../../style";
import { ASSIGNOR_OPTIONS, PROCESSOR_OPTIONS, COOPERATOR_OPTIONS, TASK_STATUS_OPTIONS } from "./constants";

function TasksFilter({ initialValues, onSearch }) {
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
            <Form.Item name="nguoiGiaoViec">
              <CSelect
                placeholder="Người giao việc"
                options={ASSIGNOR_OPTIONS}
                allowClear
                style={{ width: 180 }}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="xuLyChinh">
              <CSelect
                placeholder="Xử lý chính"
                options={PROCESSOR_OPTIONS}
                allowClear
                style={{ width: 150 }}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="phoiHop">
              <CSelect
                placeholder="Phối hợp"
                options={COOPERATOR_OPTIONS}
                allowClear
                style={{ width: 150 }}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="trangThai">
              <CSelect
                placeholder="Trạng thái"
                options={TASK_STATUS_OPTIONS}
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

export default TasksFilter;
