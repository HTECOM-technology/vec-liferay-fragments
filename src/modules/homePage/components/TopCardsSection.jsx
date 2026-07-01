import React from "react";
import { useNavigate } from "react-router-dom";

export default function TopCardsSection() {
  const navigate = useNavigate();
  return (
    <>
      <div className="dashboard-upper-cards pb-2">
        <div className="dashboard-upper-card">
          <div className="doc-card">
            {/* Header */}
            <div className="doc-card-header d-flex align-items-center">
              <div className="doc-card-icon-div d-flex justify-content-center align-items-center">
                <img src={"/documents/d/guest/archive-02"} alt="icon" />
              </div>
              <span>Công văn - Văn bản</span>
            </div>

            {/* Body */}
            <div className="row no-gutters doc-card-body">
              <div className="col-6 doc-item padding-right-8">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="min-hight-30">
                      Số văn bản
                      <br />
                      đến mới
                    </p>
                    <h3>05</h3>
                  </div>
                  <div className="doc-item-icon">
                    <img src={"/documents/d/guest/elements-1-"} alt="" />
                  </div>
                </div>
              </div>

              <div className="col-6 doc-item">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="min-hight-30">
                      Số văn bản
                      <br />
                      đi mới
                    </p>
                    <h3>12</h3>
                  </div>
                  <div className="doc-item-icon">
                    <img src={"/documents/d/guest/file-export"} alt="" />
                  </div>
                </div>
              </div>

              <div className="col-6 doc-item padding-right-8">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="min-hight-30">
                      Số văn bản
                      <br />
                      chờ xử lý
                    </p>
                    <h3>02</h3>
                  </div>
                  <div className="doc-item-icon">
                    <img src={"/documents/d/guest/time-quarter-pass"} alt="" />
                  </div>
                </div>
              </div>

              <div className="col-6 doc-item">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="min-hight-30">
                      Số văn bản
                      <br />
                      chờ duyệt
                    </p>
                    <h3>0</h3>
                  </div>
                  <div className="doc-item-icon">
                    <img src={"/documents/d/guest/alert-02"} alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="dashboard-upper-card">
          <div className="doc-card">
            {/* Header */}
            <div className="doc-card-header d-flex align-items-center">
              <div className="doc-card-icon-div d-flex justify-content-center align-items-center">
                <img src={"/documents/d/guest/briefcase-03"} alt="icon" />
              </div>
              <span>Công việc</span>
            </div>

            {/* Body */}
            <div className="row no-gutters doc-card-body">
              <div className="col-6 doc-item padding-right-8">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="min-hight-30">
                      Tổng số
                      <br />
                      công việc
                    </p>
                    <h3>03</h3>
                  </div>
                  <div className="doc-item-icon">
                    <img src={"/documents/d/guest/file-shredder"} alt="" />
                  </div>
                </div>
              </div>

              <div className="col-6 doc-item">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="min-hight-30">Đang xử lý</p>
                    <h3>03</h3>
                  </div>
                  <div className="doc-item-icon">
                    <img src={"/documents/d/guest/hour-glass"} alt="" />
                  </div>
                </div>
              </div>

              <div className="col-6 doc-item padding-right-8">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="min-hight-30">
                      Đã hoàn
                      <br />
                      thành
                    </p>
                    <h3>00</h3>
                  </div>
                  <div className="doc-item-icon">
                    <img src={"/documents/d/guest/validation"} alt="" />
                  </div>
                </div>
              </div>

              <div className="col-6 doc-item">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="min-hight-30">Quá hạn</p>
                    <h3>0</h3>
                  </div>
                  <div className="doc-item-icon">
                    <img src={"/documents/d/guest/alert-02"} alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="dashboard-upper-card">
          <div className="doc-card">
            {/* Header */}
            <div className="doc-card-header d-flex align-items-center">
              <div className="doc-card-icon-div d-flex justify-content-center align-items-center">
                <img src={"/documents/d/guest/card-icon-3"} alt="icon" />
              </div>
              <span>Nhiệm vụ</span>
            </div>

            {/* Body */}
            <div className="row no-gutters doc-card-body">
              <div className="col-6 doc-item padding-right-8">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="min-hight-30">
                      Tổng số
                      <br />
                      công việc
                    </p>
                    <h3>08</h3>
                  </div>
                  <div className="doc-item-icon">
                    <img src={"/documents/d/guest/file-shredder"} alt="" />
                  </div>
                </div>
              </div>

              <div className="col-6 doc-item">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="min-hight-30">Đang xử lý</p>
                    <h3>02</h3>
                  </div>
                  <div className="doc-item-icon">
                    <img src={"/documents/d/guest/hour-glass"} alt="" />
                  </div>
                </div>
              </div>

              <div className="col-6 doc-item padding-right-8">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="min-hight-30">
                      Đã hoàn
                      <br />
                      thành
                    </p>
                    <h3>04</h3>
                  </div>
                  <div className="doc-item-icon">
                    <img src={"/documents/d/guest/validation"} alt="" />
                  </div>
                </div>
              </div>

              <div className="col-6 doc-item">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="min-hight-30">Quá hạn</p>
                    <h3>0</h3>
                  </div>
                  <div className="doc-item-icon">
                    <img src={"/documents/d/guest/alert-02"} alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="dashboard-upper-card">
          <div className="doc-card">
            <div className="doc-card-header d-flex align-items-center">
              <div className="doc-card-icon-div d-flex justify-content-center align-items-center">
                <img src={"/documents/d/guest/card-icon-3"} alt="icon" />
              </div>
              <span>Tình trạng giao thông</span>
            </div>

            <div className="row no-gutters doc-card-body">
              <div className="col-6 doc-item padding-right-8">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="min-hight-30">
                      SL phương
                      <br />
                      tiện vi phạm
                    </p>
                    <h3>08</h3>
                  </div>
                  <div className="doc-item-icon">
                    <img src={"/documents/d/guest/accident"} alt="" />
                  </div>
                </div>
              </div>

              <div className="col-6 doc-item">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p>
                      Tốc độ lưu
                      <br />
                      thông TB
                    </p>
                    <h3>02</h3>
                  </div>
                  <div className="doc-item-icon">
                    <img src={"/documents/d/guest/dashboard-speed-01"} alt="" />
                  </div>
                </div>
              </div>

              <div className="col-6 doc-item padding-right-8">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p>
                      SL gia súc
                      <br />
                      đi vào cao tốc
                    </p>
                    <h3>02</h3>
                  </div>
                  <div className="doc-item-icon">
                    <img src={"/documents/d/guest/frame"} alt="" />
                  </div>
                </div>
              </div>

              <div className="col-6 doc-item">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p>
                      Số lượng
                      <br />
                      camera bị lỗi
                    </p>
                    <h3>0</h3>
                  </div>
                  <div className="doc-item-icon">
                    <img src={"/documents/d/guest/cctv-camera"} alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="dashboard-upper-card mobile-d-none">
          {/*
          <div className="doc-card doc-single-card mb-2">
            <div className="doc-card-header d-flex align-items-center p-0">
              <div className="d-flex justify-content-center p-0 image-w-50 align-items-center">
                <img src={"/documents/d/guest/chat-icon"} alt="icon " />
              </div>
              <span className="primary-color p-8">
                Góp ý - Sáng kiến cải tiến
              </span>
            </div>
          </div>
          <div className="doc-card doc-single-card  mb-2">
            <div className="doc-card-header p-0 d-flex align-items-center image-w-50">
              <img src={"/documents/d/guest/rankin-icon"} alt="icon " />
              <a
                href="/web/intranet/khao-sat-va-bieu-quyet-noi-bo"
                className="primary-color p-8"
              >
                Khảo sát & biểu quyết nội bộ
              </a>
            </div>
          </div>
          */}
          <div className="doc-card mb-2 doc-single-card">
            <div className="doc-card-header  d-flex align-items-center p-0">
              <div className=" d-flex justify-content-center p-0 image-w-50 align-items-center">
                <img src={"/documents/d/guest/call-icon"} alt="icon" />
              </div>
              {/* <span className="primary-color p-8">Quy trình - Yêu cầu hỗ trợ</span> */}
              <a
                href="/web/intranet/quy-trinh-yeu-cau-ho-tro"
                className="primary-color p-8"
              >
                Quy trình - Yêu cầu hỗ trợ
              </a>
            </div>
          </div>
          <div className="doc-card doc-single-card">
            <div className="doc-card-header  d-flex align-items-center p-0">
              <div className=" d-flex justify-content-center p-0 image-w-50 align-items-center">
                <img src={"/documents/d/guest/notebook-icon"} alt="icon" />
              </div>
              <span className="primary-color p-8" style={{ cursor: "pointer" }} onClick={() => navigate("/bieu-mau-tai-lieu?tab=so-tay-nhan-vien")}>Sổ tay nhân viên</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 dashboard-upper-cards pb-2 mobile-d-block">
        <div className="dashboard-upper-card ">
          <div className="doc-card doc-single-card mb-2">
            <div className="doc-card-header d-flex align-items-center p-0">
              <div className="d-flex justify-content-center p-0 image-w-50 align-items-center">
                <img src={"/documents/d/guest/chat-icon"} alt="icon " />
              </div>
              <span className="primary-color p-8">
                Góp ý - Sáng kiến cải tiến
              </span>
            </div>
          </div>
          <div className="doc-card doc-single-card  mb-2">
            <div className="doc-card-header p-0 d-flex align-items-center image-w-50">
              <img src={"/documents/d/guest/rankin-icon"} alt="icon " />
              <a
                href="/web/intranet/khao-sat-va-bieu-quyet-noi-bo"
                className="primary-color p-8"
              >
                Khảo sát & biểu quyết nội bộ
              </a>
            </div>
          </div>
          <div className="doc-card mb-2 doc-single-card">
            <div className="doc-card-header  d-flex align-items-center p-0">
              <div className=" d-flex justify-content-center p-0 image-w-50 align-items-center">
                <img src={"/documents/d/guest/call-icon"} alt="icon" />
              </div>
              {/* <span className="primary-color p-8">Quy trình - Yêu cầu hỗ trợ</span> */}
              <a
                href="/web/intranet/quy-trinh-yeu-cau-ho-tro"
                className="primary-color p-8"
              >
                Quy trình - Yêu cầu hỗ trợ
              </a>
            </div>
          </div>
          <div className="doc-card doc-single-card">
            <div className="doc-card-header  d-flex align-items-center p-0">
              <div className=" d-flex justify-content-center p-0 image-w-50 align-items-center">
                <img src={"/documents/d/guest/notebook-icon"} alt="icon" />
              </div>
              <span className="primary-color p-8" style={{ cursor: "pointer" }} onClick={() => navigate("/bieu-mau-tai-lieu?tab=so-tay-nhan-vien")}>Sổ tay nhân viên</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

