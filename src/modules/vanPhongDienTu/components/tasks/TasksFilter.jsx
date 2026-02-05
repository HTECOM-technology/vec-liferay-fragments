import React from "react";
import { Form, Space } from "antd";
import { CInput, CSelect, CButton } from "../../../../components/common";
import { ASSIGNOR_OPTIONS, PROCESSOR_OPTIONS, COOPERATOR_OPTIONS, TASK_STATUS_OPTIONS } from "./constants";

function TasksFilter({ initialValues, onSearch }) {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    onSearch?.(values);
  };

  return (
    <div style={{ padding: "12px 0", borderBottom: "1px solid #0090cf33" }}>
      <Form
        form={form}
        layout="inline"
        onFinish={onFinish}
        initialValues={initialValues}
      >
        <Space wrap size={9}>
          <Form.Item name="search" style={{ marginBottom: 0 }}>
            <CInput placeholder="Tìm kiếm" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item name="nguoiGiaoViec" style={{ marginBottom: 0 }}>
            <CSelect
              placeholder="Người giao việc"
              options={ASSIGNOR_OPTIONS}
              allowClear
              style={{ width: 180 }}
            />
          </Form.Item>
          <Form.Item name="xuLyChinh" style={{ marginBottom: 0 }}>
            <CSelect
              placeholder="Xử lý chính"
              options={PROCESSOR_OPTIONS}
              allowClear
              style={{ width: 150 }}
            />
          </Form.Item>
          <Form.Item name="phoiHop" style={{ marginBottom: 0 }}>
            <CSelect
              placeholder="Phối hợp"
              options={COOPERATOR_OPTIONS}
              allowClear
              style={{ width: 150 }}
            />
          </Form.Item>
          <Form.Item name="trangThai" style={{ marginBottom: 0 }}>
            <CSelect
              placeholder="Trạng thái"
              options={TASK_STATUS_OPTIONS}
              allowClear
              style={{ width: 150 }}
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <CButton type="primary" htmlType="submit">
              Tìm kiếm
            </CButton>
          </Form.Item>
        </Space>
      </Form>
    </div>
  );
}

export default TasksFilter;
