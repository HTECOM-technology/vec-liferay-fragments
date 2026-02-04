import React from "react";
import { Form, Col } from "antd";
import { CInput, CSelect, CButton } from "../../../../components/common";
import { FilterSection, FilterRow } from "../../style";
import {
  UNIT_OPTIONS,
  DOCUMENT_TYPE_OPTIONS,
  GROUP_NUMBER_OPTIONS,
  ISSUING_UNIT_OPTIONS,
  DOCUMENT_STATUS_OPTIONS,
} from "./constants";

function DocumentsFilter({ initialValues, onSearch }) {
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
            <Form.Item name="donVi">
              <CSelect
                placeholder="Chọn đơn vị"
                options={UNIT_OPTIONS}
                allowClear
                style={{ width: 150 }}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="loaiVanBan">
              <CSelect
                placeholder="Loại văn bản"
                options={DOCUMENT_TYPE_OPTIONS}
                allowClear
                style={{ width: 150 }}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="nhomSo">
              <CSelect
                placeholder="Nhóm số"
                options={GROUP_NUMBER_OPTIONS}
                allowClear
                style={{ width: 140 }}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="donViBanHanh">
              <CSelect
                placeholder="Đơn vị ban hành"
                options={ISSUING_UNIT_OPTIONS}
                allowClear
                style={{ width: 180 }}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="trangThai">
              <CSelect
                placeholder="Trạng thái"
                options={DOCUMENT_STATUS_OPTIONS}
                allowClear
                style={{ width: 140 }}
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

export default DocumentsFilter;
