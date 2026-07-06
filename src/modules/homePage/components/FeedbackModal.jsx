import React, { useState } from 'react';
import '../styles/Feedbackmodal.css';

const FeedbackModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    unit: '',
    position: '',
    department: '',
    subject: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
    // You can add your API call here
    onClose();
    // Reset form after submission
    setFormData({
      fullName: '',
      email: '',
      unit: '',
      position: '',
      department: '',
      subject: '',
      description: ''
    });
  };

  const handleOverlayClick = (e) => {
    // Close modal when clicking on overlay (not on modal content)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="vhc-feedback-modal-overlay" onClick={handleOverlayClick}>
      <div className="vhc-feedback-modal">
        {/* Modal Header */}
        <div className="vhc-feedback-modal__header">
            <div className="vhc-feedback-modal__header-content">
              <div className="vhc-feedback-modal__icon-wrapper">
              <img src='/documents/d/intranet/container-3-' alt="" />
            </div>
            <h2 className="vhc-feedback-modal__title">
              Góp ý - Sáng kiến cải tiến
            </h2>
          </div>
          <button
            onClick={onClose}
            className="vhc-feedback-modal__close-btn"
            type="button"
            aria-label="Close modal"
          >
            <svg className="vhc-feedback-modal__close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="vhc-feedback-form">
          <div className="vhc-feedback-form__fields">
            {/* Full Name */}
            <div className="vhc-feedback-form__field">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Họ và tên"
                className="vhc-feedback-form__input"
                required
              />
            </div>

            {/* Email and Unit */}
            <div className="vhc-feedback-form__row">
              <div className="vhc-feedback-form__field vhc-feedback-form__field--half">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="vhc-feedback-form__input"
                  required
                />
              </div>
              <div className="vhc-feedback-form__field vhc-feedback-form__field--half">
                <div className="vhc-feedback-form__select-wrapper">
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="vhc-feedback-form__select"
                    required
                  >
                    <option value="">Đơn vị</option>
                    <option value="unit1">Đơn vị 1</option>
                    <option value="unit2">Đơn vị 2</option>
                    <option value="unit3">Đơn vị 3</option>
                  </select>
                  <svg className="vhc-feedback-form__select-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Position and Department */}
            <div className="vhc-feedback-form__row">
              <div className="vhc-feedback-form__field vhc-feedback-form__field--half">
                <div className="vhc-feedback-form__select-wrapper">
                  <select
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className="vhc-feedback-form__select"
                    required
                  >
                    <option value="">Chức vụ</option>
                    <option value="manager">Quản lý</option>
                    <option value="staff">Nhân viên</option>
                    <option value="intern">Thực tập sinh</option>
                  </select>
                  <svg className="vhc-feedback-form__select-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <div className="vhc-feedback-form__field vhc-feedback-form__field--half">
                <div className="vhc-feedback-form__select-wrapper">
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="vhc-feedback-form__select"
                    required
                  >
                    <option value="">Phòng ban</option>
                    <option value="hr">Nhân sự</option>
                    <option value="it">Công nghệ thông tin</option>
                    <option value="finance">Tài chính</option>
                    <option value="marketing">Marketing</option>
                  </select>
                  <svg className="vhc-feedback-form__select-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Subject */}
            <div className="vhc-feedback-form__field">
              <div className="vhc-feedback-form__select-wrapper">
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="vhc-feedback-form__select"
                  required
                >
                  <option value="">Chủ đề</option>
                  <option value="suggestion">Góp ý</option>
                  <option value="innovation">Sáng kiến cải tiến</option>
                  <option value="complaint">Khiếu nại</option>
                  <option value="other">Khác</option>
                </select>
                <svg className="vhc-feedback-form__select-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Description */}
            <div className="vhc-feedback-form__field">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Mô tả"
                rows="6"
                className="vhc-feedback-form__textarea"
                required
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="vhc-feedback-form__submit-wrapper">
              <button
                type="submit"
                className="vhc-feedback-form__submit-btn"
              >
                Gửi góp ý
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
