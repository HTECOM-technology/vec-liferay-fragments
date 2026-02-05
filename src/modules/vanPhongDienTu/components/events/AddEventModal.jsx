import React from "react";
import { Form, Input, Row, Col } from "antd";
import { CInput, CSelect, CDatePicker, CButton, CModal } from "../../../../components/common";
import styled from "styled-components";
import dayjs from "dayjs";
import { HOST_OPTIONS, NOTIFICATION_OPTIONS } from "./constants";

const { TextArea } = Input;

const ModalContent = styled.div`
  .ant-form-item {
    margin-bottom: 16px;
  }

  .ant-form-item-label > label {
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
  }

  .ant-picker {
    width: 100%;
  }

  textarea {
    resize: none;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
`;

function AddEventModal({ visible, onClose, onSubmit }) {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log("Form values:", values);
      onSubmit?.(values);
      form.resetFields();
      onClose();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <CModal
      title="Thêm sự kiện"
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={1040}
      centered
    >
      <ModalContent>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            ngay: dayjs(),
          }}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="tenSuKien"
                label="Tên sự kiện"
                rules={[{ required: true, message: "Vui lòng nhập tên sự kiện" }]}
              >
                <CInput placeholder="Nhập tên sự kiện" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="chuTri"
                label="Chủ trì"
              >
                <CSelect
                  placeholder="Chọn chủ trì"
                  options={HOST_OPTIONS}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="chuanBi"
                label="Chuẩn bị"
              >
                <CSelect
                  placeholder="Chọn người chuẩn bị"
                  mode="multiple"
                  allowClear
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="thanhPhanThamGia"
                label="Thành phần tham gia"
              >
                <CSelect
                  placeholder="Chọn thành phần tham gia"
                  mode="multiple"
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="diaDiem"
                label="Địa điểm"
              >
                <CSelect
                  placeholder="Chọn địa điểm"
                  allowClear
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="taiNguyen"
                label="Tài nguyên"
              >
                <CSelect
                  placeholder="Chọn tài nguyên"
                  mode="multiple"
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="taiLieuKem"
                label="Tài liệu kèm"
              >
                <CSelect
                  placeholder="Chọn tài liệu kèm"
                  mode="multiple"
                  allowClear
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="ngay"
                label="Chọn ngày"
                rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
              >
                <CDatePicker
                  format="DD/MM/YYYY"
                  placeholder="Chọn ngày"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="gio"
                label="Chọn giờ"
              >
                <CInput placeholder="08:00 AM" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="danhSachThongBao"
                label="Đánh sách thông báo"
              >
                <CSelect
                  placeholder="Chọn danh sách thông báo"
                  options={NOTIFICATION_OPTIONS}
                  mode="multiple"
                  allowClear
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="noiDungSuKien"
                label="Nội dung sự kiện"
              >
                <TextArea
                  rows={4}
                  placeholder="Nhập nội dung sự kiện"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <ModalFooter>
          <CButton onClick={handleCancel}>
            Hủy tao
          </CButton>
          <CButton type="primary" onClick={handleSubmit}>
            Tao sự kiện
          </CButton>
        </ModalFooter>
      </ModalContent>
    </CModal>
  );
}

export default AddEventModal;
