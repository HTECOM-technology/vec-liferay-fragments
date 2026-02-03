import React from "react";
import { Form, Col, Select } from "antd";
import { CSelect, CButton, CRangePicker } from "../../../components/common";
import { FilterSection, FilterRow } from "../style";
import { LOAI_GD_LECH_OPTIONS } from "./constants";

const { Option: SelectOption } = Select;
function DataReconciliationFilter({ initialValues, onSearch }) {
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
          <Col span={3}>
            <Form.Item name="tuyen" >
              <CSelect placeholder="Tuyến" allowClear>
                <SelectOption value="nb-lc">Nội bài - Lào Cai</SelectOption>
              </CSelect>
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="tram" >
              <CSelect placeholder="Chọn trạm" allowClear>
                <SelectOption value="km6">Km6</SelectOption>
                <SelectOption value="ic13">IC13</SelectOption>
              </CSelect>
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="maEtag" >
              <CSelect placeholder="Mã Etag" allowClear />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="maGDBE" >
              <CSelect placeholder="Mã GD BE" allowClear />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="bienSoXe" >
              <CSelect placeholder="Biển số xe" allowClear />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="loaiGD" >
              <CSelect placeholder="Loại GD" allowClear />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="loaiGDLech" >
              <CSelect
                mode="multiple"
                placeholder="Loại giao dịch lệch"

                options={LOAI_GD_LECH_OPTIONS}
                maxTagCount="responsive"
              />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="loaiSaiLech" >
              <CSelect placeholder="Loại sai lệch" allowClear />
            </Form.Item>
          </Col>

          <Col span={3}>
            <Form.Item name="trangThaiGiaiTrinh" >
              <CSelect placeholder="Trạng thái giải trình" allowClear />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item name="date" >
              <CRangePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item>
              <CButton type="primary" htmlType="submit" style={{ width: '100%' }}>
                Tìm kiếm
              </CButton>
            </Form.Item>
          </Col>
        </FilterRow>
      </Form>
    </FilterSection>
  );
}

export default DataReconciliationFilter;
