import React from "react";
import "../styles/Dashborad.css";
import '../styles/responsive.css';
import archive from "../assets/images/archive-02.svg";
import alertIcon  from "../assets/images/alert-02.svg";
import notebook from "../assets/images/notebook-icon.svg";
import chating from "../assets/images/chat-icon.svg"; 
import ranking from "../assets/images/rankin-icon.svg";
import fileExport from "../assets/images/file-export.svg";
import time from '../assets/images/time-quarter-pass.svg';
import element from '../assets/images/elements.svg';
import bullet from "../assets/images/Bullet.svg";
import openFile from "../assets/images/file.svg";
import cardIcon from "../assets/images/card-icon-1.svg";
import cardIcon1 from "../assets/images/card-icon-2.svg";
import cardIcon3 from "../assets/images/card-icon-3.svg";
import cardIcon5 from "../assets/images/card-icon-5.svg";
import cardIcon4 from "../assets/images/briefcase-03.svg";
import fileShhader from "../assets/images/file-shredder.svg";
import validation from "../assets/images/validation.svg";
import hourGlass from "../assets/images/hour-glass.svg";
import accident from "../assets/images/accident.svg";
import cctv from "../assets/images/cctv-camera.svg";
import frame from "../assets/images/Frame.svg";
import dashboradSpeed from "../assets/images/dashboard-speed-01.svg";
import calender from "../assets/images/calendar.svg";
import callIcon from "../assets/images/call-icon.svg";
import calender1 from "../assets/images/calendar-1.svg";
import candel from "../assets/images/candel.svg";
import cake from "../assets/images/cake.svg";
import containerIcon from "../assets/images/Container.svg";
import containerIcon1 from "../assets/images/Container2.svg";
import containerIcon2 from "../assets/images/Container3.svg";
import containerIcon3 from "../assets/images/Container4.svg";

// component
import News from './News'
import TrafficCameraMonitor from './Trafficcameramonitor';

export default function Dashboard() {
  
  return (
    <div className="container-fluid">
      <div className="dashboard">
        <div className="dashboard-upper-cards pb-2">
          <div className="dashboard-upper-card">

            <div className="doc-card">
              {/* Header */}
              <div className="doc-card-header d-flex align-items-center">
                <div className="doc-card-icon-div d-flex justify-content-center align-items-center">
                <img src={archive} alt="icon" />
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
                      <img src={element} alt="" />
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
                    <img src={fileExport} alt="" />
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
                      <img src={time} alt="" />
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
                      <img src={alertIcon} alt="" />
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
                <img src={cardIcon4} alt="icon" />
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
                      <img src={fileShhader} alt="" />
                    </div>
                  </div>
                </div>

                <div className="col-6 doc-item">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <p className="min-hight-30">
                       Đang xử lý
                  
                      </p>
                      <h3>03</h3>
                    </div>
                     <div className="doc-item-icon">
                    <img src={hourGlass} alt="" />
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
                      <img src={validation} alt="" />
                    </div>
                  </div>
                </div>

                <div className="col-6 doc-item">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <p className="min-hight-30">
                       Quá hạn
                        
                      </p>
                      <h3>0</h3>
                    </div>
                    <div className="doc-item-icon">
                      <img src={alertIcon} alt="" />
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
                <img src={cardIcon3} alt="icon" />
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
                      <img src={fileShhader} alt="" />
                    </div>
                  </div>
                </div>

                <div className="col-6 doc-item">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <p className="min-hight-30">
                       Đang xử lý
                  
                      </p>
                      <h3>02</h3>
                    </div>
                     <div className="doc-item-icon">
                    <img src={hourGlass} alt="" />
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
                      <img src={validation} alt="" />
                    </div>
                  </div>
                </div>

                <div className="col-6 doc-item">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <p className="min-hight-30">
                       Quá hạn
                        
                      </p>
                      <h3>0</h3>
                    </div>
                    <div className="doc-item-icon">
                      <img src={alertIcon} alt="" />
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
                <img src={cardIcon3} alt="icon" />
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
                      <img src={accident} alt="" />
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
                    <img src={dashboradSpeed} alt="" />
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
                      <img src={frame} alt="" />
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
                      <img src={cctv} alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
           <div className="dashboard-upper-card mobile-d-none">

            <div className="doc-card doc-single-card mb-2">
            
              <div className="doc-card-header d-flex align-items-center p-0">
                <div className="d-flex justify-content-center p-0 image-w-50 align-items-center">
                <img src={chating} alt="icon " />
                </div>
                <span className="primary-color p-8">Góp ý - Sáng kiến cải tiến</span>
              </div>

              
              
            </div>
             <div className="doc-card doc-single-card  mb-2">
            
              <div className="doc-card-header p-0 d-flex align-items-center image-w-50">
                
                <img src={ranking} alt="icon " />
               
                <span className="primary-color p-8">Khảo sát & biểu quyết nội bộ</span>
              </div>

              
              
             </div>
             <div className="doc-card mb-2 doc-single-card">
             
              <div className="doc-card-header  d-flex align-items-center p-0">
                <div className=" d-flex justify-content-center p-0 image-w-50 align-items-center">
                <img src={callIcon} alt="icon" />
                </div>
                <span className="primary-color p-8">Quy trình - Yêu cầu hỗ trợ</span>
              </div>

              
              
             </div>
             <div className="doc-card doc-single-card">
              
              <div className="doc-card-header  d-flex align-items-center p-0">
                <div className=" d-flex justify-content-center p-0 image-w-50 align-items-center">
                <img src={notebook} alt="icon" />
                </div>
                <span className="primary-color p-8">Sổ tay nhân viên</span>
              </div>

              
              
             </div>
          </div>
        </div>

        <div className="mt-4 dashboard-upper-cards pb-2 mobile-d-block">
           <div className="dashboard-upper-card ">

            <div className="doc-card doc-single-card mb-2">
            
              <div className="doc-card-header d-flex align-items-center p-0">
                <div className="d-flex justify-content-center p-0 image-w-50 align-items-center">
                <img src={chating} alt="icon " />
                </div>
                <span className="primary-color p-8">Góp ý - Sáng kiến cải tiến</span>
              </div>

              
              
            </div>
             <div className="doc-card doc-single-card  mb-2">
            
              <div className="doc-card-header p-0 d-flex align-items-center image-w-50">
                
                <img src={ranking} alt="icon " />
               
                <span className="primary-color p-8">Khảo sát & biểu quyết nội bộ</span>
              </div>

              
              
             </div>
             <div className="doc-card mb-2 doc-single-card">
             
              <div className="doc-card-header  d-flex align-items-center p-0">
                <div className=" d-flex justify-content-center p-0 image-w-50 align-items-center">
                <img src={callIcon} alt="icon" />
                </div>
                <span className="primary-color p-8">Quy trình - Yêu cầu hỗ trợ</span>
              </div>

              
              
             </div>
             <div className="doc-card doc-single-card">
              
              <div className="doc-card-header  d-flex align-items-center p-0">
                <div className=" d-flex justify-content-center p-0 image-w-50 align-items-center">
                <img src={notebook} alt="icon" />
                </div>
                <span className="primary-color p-8">Sổ tay nhân viên</span>
              </div>

              
              
             </div>
          </div>
        </div>

        <div className="dashboard-upper-cards mt-4">
          <div className="dashboard-upper-card">

            <div className="doc-card">
            
              <div className="doc-card-header d-flex align-items-center">
                <div className="doc-card-icon-div d-flex justify-content-center align-items-center">
                <img src={cardIcon1} alt="icon" />
                </div>
                <span>Văn bản mới</span>
              </div>
                <div className="height-290 overflow-y">
                  <div className="card-body-list">
                    <ul>
                      <li className="d-flex align-items-start pb-2 mb-2">
                        <div className="upper-card-icon">
                        <img src={bullet} alt="" /> 
                        </div>
                        <div className="upper-card-content">
                          <p className="mb-1">
                            Công bố danh mục thủ tục hành chính mới ban hành, thủ tục hành chính bị bãi bỏ lĩnh vực hoạt động...
                            </p>
                            <div className="card-content-date">
                              <span className="red-text">1562/QĐ-TTPVHCC</span> - <span>12/06/2024</span>
                            </div>
                        </div>
                      </li>
                      <li className="d-flex align-items-start pb-2 mb-2">
                        <div className="upper-card-icon">
                        <img src={bullet} alt="" /> 
                        </div>
                        <div className="upper-card-content">
                          <p className="mb-1">
                            Công bố danh mục thủ tục hành chính mới ban hành, thủ tục hành chính bị bãi bỏ lĩnh vực hoạt động...
                            </p>
                            <div className="card-content-date">
                              <span className="red-text">1562/QĐ-TTPVHCC</span> - <span>12/06/2024</span>
                            </div>
                        </div>
                      </li>
                      <li className="d-flex align-items-start pb-2 mb-2">
                        <div className="upper-card-icon">
                        <img src={bullet} alt="" /> 
                        </div>
                        <div className="upper-card-content">
                          <p className="mb-1">
                            Công bố danh mục thủ tục hành chính mới ban hành, thủ tục hành chính bị bãi bỏ lĩnh vực hoạt động...
                            </p>
                            <div className="card-content-date">
                              <span className="red-text">1562/QĐ-TTPVHCC</span> - <span>12/06/2024</span>
                            </div>
                        </div>
                      </li>
                    </ul>
                  </div>
              </div>
            </div>
          </div>

          <div className="dashboard-upper-card">

            <div className="doc-card">
            
              <div className="doc-card-header d-flex align-items-center justify-content-between">
                <div className="d-flex justify-content-center align-items-center gap-8">
                  <div className="doc-card-icon-div d-flex justify-content-center align-items-center">                  
                    <img src={calender} alt="icon" />
                  </div>
                  <span>Lịch cơ quan</span>
                </div>
                <div className="d-flex align-items-center gap-8">
                    <input type="checkbox" name="" id="" className="checkbox-custom" />
                    <span>SK tôi tham gia</span>
                </div>
              </div>
                <div className="height-290 overflow-y">
                <div className="d-flex align-items-center gap-8 px-12 py-10  border-bottom">
                  <img src={calender1} alt="" />
                  <p class="text-14">Hôm nay (08/01/2026) </p>
                </div>
              <div className="card-body-list">
                 <div className="light-border-bottom mb-2 pb-2">
                   <ul class="list-icon">
                    <li><p className="font-bold">TGĐ - Phạm Hồng Quang  | 09:00 AM</p></li>
                   </ul>
                   <p class="line-2 sm-text margin-top-5">Họp kiểm điểm dự án BLLT và mở rộng HLD (Chuẩn bị: PTGĐ Nam chỉ đạo c/b báo...</p>
                 </div>
                  <div className="light-border-bottom mb-2 pb-2">
                   <ul class="list-icon">
                    <li><p className="font-bold">TGĐ - Phạm Hồng Quang  | 09:00 AM</p></li>
                   </ul>
                   <p class="line-2 sm-text margin-top-5">Họp kiểm điểm dự án BLLT và mở rộng HLD (Chuẩn bị: PTGĐ Nam chỉ đạo c/b báo...</p>
                 </div>
                  <div className="light-border-bottom mb-2 pb-2">
                   <ul class="list-icon">
                    <li><p className="font-bold">TGĐ - Phạm Hồng Quang  | 09:00 AM</p></li>
                   </ul>
                   <p class="line-2 sm-text margin-top-5">Họp kiểm điểm dự án BLLT và mở rộng HLD (Chuẩn bị: PTGĐ Nam chỉ đạo c/b báo...</p>
                 </div>
                  
              </div>
              </div>
            </div>
          </div>

           
           <div className="dashboard-upper-card">

            <div className="doc-card">
             
              <div className="doc-card-header d-flex align-items-center justify-content-between">
                <div className="d-flex justify-content-center align-items-center gap-8">
                  <div className="doc-card-icon-div d-flex justify-content-center align-items-center">                  
                    <img src={candel} alt="icon" />
                  </div>
                  <span>Sinh nhật công ty</span>
                </div>
                <div className="d-flex align-items-center justify-content-end gap-8">
                    <input type="month" name="" id="" class="custom-date" />
              </div>
               
                
              </div>
                <div className="height-290 overflow-y">
                <div className="card-body-list">
                 <div className="">
                    <div className="d-flex align-items-center gap-8 pb-2  border-bottom">
                        <img src={calender1} alt="" />
                        <p class="text-14">Hôm nay <strong>Thứ 6, 09/01/2026 </strong> </p>
                    </div>
                    <div className="light-border-bottom mb-2 pb-2">
                       <div className="d-flex align-items-center gap-8 pt-2   ">
                        <img src={cake} alt="" />
                        <p class="text-14">Phan Thị Thùy Linh </p>
                    </div>
                   
                    </div>
                 </div>
                  <div>
                    <div className="d-flex align-items-center gap-8 pb-2  border-bottom">
                        <img src={calender1} alt="" />
                        <p class="text-14">Ngày mai <strong>Thứ bảy, 10/1/2026 </strong></p>
                    </div>
                    <div className="light-border-bottom mb-2 pb-2">
                       <div className="d-flex align-items-center gap-8 pt-2   ">
                          <img src={cake} alt="" />
                          <p class="text-14">Bùi Minh Phượng</p>
                       </div>
                       <div className="d-flex align-items-center gap-8 pt-2   ">
                          <img src={cake} alt="" />
                          <p class="text-14">Nguyễn Hồng Sơn</p>
                       </div>
                        <div className="d-flex align-items-center gap-8 pt-2 ">
                          <img src={cake} alt="" />
                          <p class="text-14">Nguyễn Minh Thảo</p>
                       </div>
                   
                    </div>
                 </div>
                 <div>
                     <div className="d-flex align-items-center gap-8 pb-2  border-bottom">
                        <img src={calender1} alt="" />
                        <p class="text-14">Ngày kia  <strong>Chủ nhật, 11/01/2026</strong></p>
                    </div>
                 </div>
   
              <span className="sm-text pt-2 font-medium d-block">Không có ai sinh nhật</span>
              </div>
                </div>
            </div>
          </div>
           <div className="dashboard-upper-card">

            <div className="doc-card">
              
              <div className="doc-card-header d-flex align-items-center justify-content-between ">
                <div className="d-flex align-items-center gap-8">
                  <div className="doc-card-icon-div d-flex justify-content-center align-items-center">
                    <img src={cardIcon5} alt="icon" />
                  </div>
                  <span>Hoạt động nhân sự</span>
                </div>
                <div className="d-flex align-items-center justify-content-end">
                    <select name="" id="" className="custom-select-cls">
                      <option value="Mới nhất">Mới nhất</option>
                       <option value="Mới nhất">Mới nhất</option>
                    </select>
                </div>
                
              </div>
              <div className="height-290 overflow-y">
                <div className="card-body-list">
                   <div className="hr-box d-flex gap-8 pb-2 mb-2 border-bottom">
                     <div className="hr-box-icon">
                       <img src={containerIcon} alt="icon" />
                     </div>
                     <div className="hr-box-content ">
                      <p className="mb-0 font-medium">Quyết định bổ nhiệm </p>
                      <span className="sm-text pt-1 d-block">Ông NVA thành nhân viên kế toán</span>
                     </div>
                   </div>

                   <div className="hr-box d-flex gap-8 pb-2 mb-2 border-bottom">
                     <div className="hr-box-icon">
                       <img src={containerIcon1} alt="icon" />
                     </div>
                     <div className="hr-box-content ">
                      <p className="mb-0 font-medium">Quyết định nghỉ việc</p>
                      <span className="sm-text pt-1 d-block">Quyết thị nghỉ việc Bà Nguyễn Thị A</span>
                     </div>
                   </div>

                   <div className="hr-box d-flex gap-8 pb-2 mb-2 border-bottom">
                     <div className="hr-box-icon">
                       <img src={containerIcon2} alt="icon" />
                     </div>
                     <div className="hr-box-content ">
                      <p className="mb-0 font-medium">Thông báo nghỉ phép</p>
                      <span className="sm-text pt-1 d-block">Bà Nguyễn Thị A xin thông báo nghỉ phép</span>
                     </div>
                   </div>

                   <div className="hr-box d-flex gap-8 pb-2 mb-2 border-bottom">
                     <div className="hr-box-icon">
                       <img src={containerIcon3} alt="icon" />
                     </div>
                     <div className="hr-box-content ">
                      <p className="mb-0 font-medium">Quyết định khen thưởng</p>
                      <span className="sm-text pt-1 d-block">Ông NVA được khen thưởng nhờ đóng...</span>
                     </div>
                   </div>

                   <div className="hr-box d-flex gap-8 pb-2 mb-2 border-bottom">
                     <div className="hr-box-icon">
                       <img src={containerIcon} alt="icon" />
                     </div>
                     <div className="hr-box-content ">
                      <p className="mb-0 font-medium">Quyết định bổ nhiệm</p>
                      <span className="sm-text pt-1 d-block">Ông NVA thành nhân viên kế toán</span>
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
                <img src={cardIcon} alt="icon" />
                </div>
                <span>Công văn - Văn bản</span>
              </div>

           
              <div className="row no-gutters doc-card-body height-290 overflow-y">
               <div className="card-files d-flex align-items-center mb-1">
                <img src={openFile} alt="" /> <p className="">Biểu mẫu tờ trình</p>
               </div>

                <div className="card-files d-flex align-items-center mb-1">
                <img src={openFile} alt="" /> <p className="">Biểu mẫu quyết định</p>
               </div>
                <div className="card-files d-flex align-items-center mb-1">
                <img src={openFile} alt="" /> <p className="">Biểu mẫu văn phòng</p>
               </div>
                <div className="card-files d-flex align-items-center mb-1">
                <img src={openFile} alt="" /> <p className="">Biểu mẫu thanh toán</p>
               </div>
                <div className="card-files d-flex align-items-center mb-1 ">
                <img src={openFile} alt="" /> <p className="">Biểu mẫu hợp đồng</p>
               </div>
               <div className="card-files d-flex align-items-center mb-1 ">
                <img src={openFile} alt="" /> <p className="">Biểu mẫu quyết toán</p>
               </div>
              </div>
            </div>
          </div>
        </div>
        <div className="dashboard-upper-cards bottom-area row mt-4">
          <div className="col-lg-8">
              <News />
            </div>

            <div className="col-lg-4 mt-4 mt-lg-0" style={{'padding-right':0}}>
              <TrafficCameraMonitor />
            </div>
        </div>
        
      </div>
    </div>
  );
}
