import React from "react";
import dayjs from "dayjs";
import { CButton } from "../../components/common";
import { PageWrap, HeaderActions, FilterButton, FilterForm } from "./style";
import { TrainingCoursesFilter, TrainingCoursesTable, mockTrainingCourses } from "./components";
import { Popover, Row } from "antd";
import { IconFilter } from "../../assets/icon/IconFilter";
import FormFilter from "./components/FormFilter";
const defaultDateFrom = dayjs("2026-12-01");
const defaultDateTo = dayjs("2026-12-31");

function DaoTaoPage() {
  const filterInitialValues = {
    dateRange: [defaultDateFrom, defaultDateTo],
  };

  const handleSearch = (values) => {
    // TODO: tích hợp API tìm kiếm khóa học khi có backend
    // Hiện tại chỉ log ra console để kiểm tra
    // eslint-disable-next-line no-console
    console.log("Tìm kiếm khóa học:", values);
  };

  return (
    <PageWrap>
      <HeaderActions>
        <h3>Thông tin khóa học</h3>
        <CButton
          type="primary"
          icon={
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_7310_3890)">
                <path
                  d="M2.17708 14.6408L2.36374 14.6457C3.73563 14.6816 4.42158 14.6995 5.04554 14.4558C5.66949 14.2121 6.16875 13.7313 7.16724 12.7695L7.16725 12.7695L13.1035 7.05196L9.00016 3L3.19311 9.29633C2.38645 10.1703 1.98312 10.6073 1.7493 11.1455C1.51548 11.6837 1.46883 12.2824 1.37555 13.4798L1.35755 13.7108C1.3244 14.1362 1.30783 14.3489 1.42922 14.4867C1.55061 14.6245 1.75943 14.6299 2.17707 14.6408H2.17708Z"
                  fill="white"
                  fill-opacity="0.2"
                />
                <path
                  d="M13.4967 2.52844L13.4967 2.52843L13.4967 2.52841C12.9846 2.00533 12.7286 1.74378 12.4602 1.5948C11.8127 1.23531 11.0285 1.24709 10.3916 1.62587C10.1277 1.78285 9.87926 2.05197 9.38247 2.59022L9 2.99992L13.1033 7.05187L13.4362 6.73126C13.9631 6.22377 14.2265 5.97002 14.3802 5.70039C14.751 5.04978 14.7625 4.24866 14.4106 3.5872C14.2648 3.31307 14.0088 3.05153 13.4967 2.52844Z"
                  stroke="black"
                  stroke-linejoin="round"
                />
                <path
                  d="M9.38263 2.59022C9.87942 2.05197 10.1278 1.78285 10.3918 1.62587C11.0287 1.24709 11.8129 1.23531 12.4604 1.5948C12.7288 1.74379 12.9848 2.00533 13.4969 2.52843C14.0089 3.05152 14.265 3.31307 14.4108 3.5872C14.7627 4.24866 14.7512 5.04978 14.3804 5.70039C14.2267 5.97002 13.9633 6.22377 13.4364 6.73126L7.16725 12.7694C6.16875 13.7312 5.6695 14.212 5.04554 14.4557C4.42158 14.6995 3.73563 14.6815 2.36374 14.6456L2.17708 14.6408C1.75943 14.6298 1.55061 14.6244 1.42922 14.4866C1.30783 14.3489 1.3244 14.1361 1.35755 13.7107L1.37555 13.4797C1.46883 12.2823 1.51548 11.6836 1.7493 11.1454C1.98312 10.6072 2.38645 10.1702 3.19311 9.29625L9.38263 2.59022Z"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linejoin="round"
                />
                <path d="M8.66699 2.66675L13.3337 7.33341" stroke="white" stroke-width="1.5" stroke-linejoin="round" />
                <path d="M9.3335 14.6667L14.6668 14.6667" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </g>
              <defs>
                <clipPath id="clip0_7310_3890">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>
          }
          className="register-button"
        >
          Đăng ký đào tạo
        </CButton>
        <Popover
          content={
            <FilterForm>
              <Row justify="center">
                <FormFilter />
              </Row>
            </FilterForm>
          }
          trigger="click"
          placement="bottomRight"
          overlayClassName="filter-popover"
          arrow={false}
        >
          <FilterButton>
            <IconFilter style={{ cursor: "pointer" }} />
          </FilterButton>
        </Popover>
      </HeaderActions>

      <TrainingCoursesFilter initialValues={filterInitialValues} onSearch={handleSearch} />
      <TrainingCoursesTable dataSource={mockTrainingCourses} />
    </PageWrap>
  );
}

export default DaoTaoPage;
