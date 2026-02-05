import React from "react";
import { Form } from "antd";
import { CInput, CSelect, CButton } from "../../../../components/common";
import { WorkFilterWrap, WorkFilterForm } from "../../style";
import { PROJECT_OPTIONS, WORK_GROUP_OPTIONS, WORK_ASSIGNOR_OPTIONS, WORK_STATUS_OPTIONS } from "./constants";

function WorkFilter({ initialValues, onSearch }) {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    onSearch?.(values);
  };

  return (
    <WorkFilterWrap>
      <WorkFilterForm
        form={form}
        layout="inline"
        onFinish={onFinish}
        initialValues={initialValues}
      >
        <Form.Item name="search">
          <CInput placeholder="Tìm kiếm" />
        </Form.Item>
        <Form.Item name="duAn">
          <CSelect
            placeholder="Dự án"
            options={PROJECT_OPTIONS}
            allowClear
          />
        </Form.Item>
        <Form.Item name="nhomCongViec">
          <CSelect
            placeholder="Nhóm công việc"
            options={WORK_GROUP_OPTIONS}
            allowClear
          />
        </Form.Item>
        <Form.Item name="nguoiGiaoViec">
          <CSelect
            placeholder="Người giao việc"
            options={WORK_ASSIGNOR_OPTIONS}
            allowClear
          />
        </Form.Item>
        <Form.Item name="trangThai">
          <CSelect
            placeholder="Trạng thái"
            options={WORK_STATUS_OPTIONS}
            allowClear
          />
        </Form.Item>
        <Form.Item>
          <CButton type="primary" htmlType="submit">
            Tìm kiếm
          </CButton>
        </Form.Item>
      </WorkFilterForm>
    </WorkFilterWrap>
  );
}

export default WorkFilter;
