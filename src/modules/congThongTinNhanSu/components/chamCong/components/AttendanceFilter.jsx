import React from "react";
import { Form } from "antd";
import { FilterSection, FilterRow } from "../style";
import FormFilter from "./FormFilter";

function AttendanceFilter({ initialValues, onSearch }) {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    onSearch?.(values);
  };

  return (
    <FilterSection>
      <Form form={form} layout="inline" onFinish={onFinish} initialValues={initialValues} style={{ display: "block" }}>
        <FilterRow>
          <FormFilter />
        </FilterRow>
      </Form>
    </FilterSection>
  );
}

export default AttendanceFilter;
