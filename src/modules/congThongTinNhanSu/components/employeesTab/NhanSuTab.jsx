import React, { useEffect, useMemo, useState } from "react";
import { Alert, message } from "antd";
import dayjs from "dayjs";
import NhanSuFilter from "./NhanSuFilter";
import NhanSuTable from "./NhanSuTable";
import BirthdayTable from "./BirthdayTable";
import EmployeeDetailModal from "./EmployeeDetailModal";
import { FilterTagsContainer, FilterTag } from "./styleNhanSu";
import SoDoToChuc from "./SoDoToChuc";
import { ttnsService } from "../../../../services/ttnsService";
import {
  buildSelectOptions,
  buildSelectOptionsFromEmployees,
  mapEmployeeRecord,
  matchesEmployeeFilters,
} from "./employeeData";

const DEFAULT_PAGE_SIZE = 16;
const GENDER_OPTIONS = [
  { value: "", label: "Giới tính" },
  { value: "1", label: "Nam" },
  { value: "2", label: "Nữ" },
];
const WORK_STATUS_OPTIONS = [
  { value: "", label: "Tình trạng" },
  { value: "LV", label: "Đang làm việc" },
  { value: "NV", label: "Đã nghỉ việc" },
  { value: "CTV", label: "Cộng tác viên" },
  { value: "NH", label: "Nghỉ hưu" },
  { value: "TV", label: "Thử việc" },
  { value: "TS", label: "Thai sản" },
];

// Icons
const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_7270_18516)">
      <path d="M13.6666 5.66667C13.6666 6.58714 12.9204 7.33333 11.9999 7.33333C11.0794 7.33333 10.3333 6.58714 10.3333 5.66667C10.3333 4.74619 11.0794 4 11.9999 4C12.9204 4 13.6666 4.74619 13.6666 5.66667Z" fill="currentColor" fillOpacity="0.2" />
      <path d="M5.66659 5.66667C5.66659 6.58714 4.92039 7.33333 3.99992 7.33333C3.07944 7.33333 2.33325 6.58714 2.33325 5.66667C2.33325 4.74619 3.07944 4 3.99992 4C4.92039 4 5.66659 4.74619 5.66659 5.66667Z" fill="currentColor" fillOpacity="0.2" />
      <path d="M2.38916 9.28407C1.70798 9.63508 -0.0780504 10.3518 1.00976 11.2487C1.54115 11.6868 2.13297 12.0001 2.87704 12.0001H7.12287C7.86695 12.0001 8.45877 11.6868 8.99016 11.2486C10.078 10.3518 8.29194 9.63508 7.61076 9.28407C6.01339 8.46097 3.98653 8.46097 2.38916 9.28407Z" fill="currentColor" fillOpacity="0.2" />
      <path d="M8.38916 9.28407C7.70798 9.63508 5.92195 10.3518 7.00976 11.2487C7.54115 11.6868 8.13297 12.0001 8.87704 12.0001H13.1229C13.8669 12.0001 14.4588 11.6868 14.9902 11.2486C16.078 10.3518 14.2919 9.63508 13.6108 9.28407C12.0134 8.46097 9.98653 8.46097 8.38916 9.28407Z" fill="currentColor" fillOpacity="0.2" />
      <path d="M13.8494 12C14.3489 12 14.7462 11.6856 15.103 11.2461C15.8333 10.3463 14.6342 9.62723 14.1769 9.27507C13.712 8.91708 13.1929 8.71428 12.6667 8.66667M12 7.33333C12.9205 7.33333 13.6667 6.58714 13.6667 5.66667C13.6667 4.74619 12.9205 4 12 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M2.1506 12C1.65106 12 1.25374 11.6856 0.89699 11.2461C0.166685 10.3463 1.36574 9.62723 1.82306 9.27507C2.28794 8.91708 2.80701 8.71428 3.33329 8.66667M3.66663 7.33333C2.74615 7.33333 1.99996 6.58714 1.99996 5.66667C1.99996 4.74619 2.74615 4 3.66663 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5.38916 10.074C4.70798 10.4953 2.92195 11.3553 4.00976 12.4315C4.54115 12.9573 5.13297 13.3333 5.87704 13.3333H10.1229C10.8669 13.3333 11.4588 12.9573 11.9902 12.4315C13.078 11.3553 11.2919 10.4953 10.6108 10.074C9.01339 9.08632 6.98653 9.08632 5.38916 10.074Z" fill="currentColor" fillOpacity="0.2" />
      <path d="M5.38916 10.074C4.70798 10.4953 2.92195 11.3553 4.00976 12.4315C4.54115 12.9573 5.13297 13.3333 5.87704 13.3333H10.1229C10.8669 13.3333 11.4588 12.9573 11.9902 12.4315C13.078 11.3553 11.2919 10.4953 10.6108 10.074C9.01339 9.08632 6.98653 9.08632 5.38916 10.074Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.3333 5.00008C10.3333 6.28875 9.28862 7.33341 7.99996 7.33341C6.71129 7.33341 5.66663 6.28875 5.66663 5.00008C5.66663 3.71142 6.71129 2.66675 7.99996 2.66675C9.28862 2.66675 10.3333 3.71142 10.3333 5.00008Z" fill="currentColor" fillOpacity="0.2" />
      <path d="M10.3333 5.00008C10.3333 6.28875 9.28862 7.33341 7.99996 7.33341C6.71129 7.33341 5.66663 6.28875 5.66663 5.00008C5.66663 3.71142 6.71129 2.66675 7.99996 2.66675C9.28862 2.66675 10.3333 3.71142 10.3333 5.00008Z" stroke="currentColor" strokeWidth="1.5" />
    </g>
    <defs>
      <clipPath id="clip0_7270_18516">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const OrgIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_7289_9409)">
      <path
        d="M4.13249 6.4H3.66671H3.20092C1.86162 6.4 0.958645 7.83224 1.48622 9.11975C1.55971 9.2991 1.72833 9.41539 1.9149 9.41539H2.24295C2.35353 9.41539 2.44992 9.49409 2.47673 9.60629L2.89907 11.3731C2.98713 11.7416 3.30362 12 3.66671 12C4.02979 12 4.34629 11.7416 4.43435 11.3731L4.85668 9.60629C4.8835 9.49409 4.97988 9.41539 5.09046 9.41539H5.41852C5.60508 9.41539 5.7737 9.2991 5.84719 9.11975C6.37477 7.83224 5.47179 6.4 4.13249 6.4Z"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <path d="M4.83337 5.2C4.83337 5.86274 4.31104 6.4 3.66671 6.4C3.02238 6.4 2.50004 5.86274 2.50004 5.2C2.50004 4.53726 3.02238 4 3.66671 4C4.31104 4 4.83337 4.53726 4.83337 5.2Z" fill="currentColor" fillOpacity="0.2" />
      <path d="M4.83333 5.2C4.83333 5.86274 4.311 6.4 3.66667 6.4C3.02233 6.4 2.5 5.86274 2.5 5.2C2.5 4.53726 3.02233 4 3.66667 4C4.311 4 4.83333 4.53726 4.83333 5.2Z" fill="white" />
      <path
        d="M10.6667 3.33325C10.6667 2.39044 10.6667 1.91904 10.9596 1.62615C11.2525 1.33325 11.7239 1.33325 12.6667 1.33325C13.6096 1.33325 14.081 1.33325 14.3739 1.62615C14.6667 1.91904 14.6667 2.39044 14.6667 3.33325C14.6667 4.27606 14.6667 4.74747 14.3739 5.04036C14.081 5.33325 13.6096 5.33325 12.6667 5.33325C11.7239 5.33325 11.2525 5.33325 10.9596 5.04036C10.6667 4.74747 10.6667 4.27606 10.6667 3.33325Z"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <path
        d="M10.6667 12.6667C10.6667 11.7239 10.6667 11.2525 10.9596 10.9596C11.2525 10.6667 11.7239 10.6667 12.6667 10.6667C13.6096 10.6667 14.081 10.6667 14.3739 10.9596C14.6667 11.2525 14.6667 11.7239 14.6667 12.6667C14.6667 13.6096 14.6667 14.081 14.3739 14.3739C14.081 14.6667 13.6096 14.6667 12.6667 14.6667C11.7239 14.6667 11.2525 14.6667 10.9596 14.3739C10.6667 14.081 10.6667 13.6096 10.6667 12.6667Z"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <path
        d="M3.66671 6.4C4.31104 6.4 4.83337 5.86274 4.83337 5.2C4.83337 4.53726 4.31104 4 3.66671 4C3.02238 4 2.50004 4.53726 2.50004 5.2C2.50004 5.86274 3.02238 6.4 3.66671 6.4ZM3.66671 6.4H3.20092C1.86162 6.4 0.958645 7.83224 1.48622 9.11975C1.55971 9.2991 1.72833 9.41539 1.9149 9.41539H2.24295C2.35353 9.41539 2.44992 9.49409 2.47673 9.60629L2.89907 11.3731C2.98713 11.7416 3.30362 12 3.66671 12C4.02979 12 4.34629 11.7416 4.43435 11.3731L4.85668 9.60629C4.8835 9.49409 4.97988 9.41539 5.09046 9.41539H5.41852C5.60508 9.41539 5.7737 9.2991 5.84719 9.11975C6.37477 7.83224 5.47179 6.4 4.13249 6.4H3.66671Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M10.6667 3.33325C10.6667 2.39044 10.6667 1.91904 10.9596 1.62615C11.2525 1.33325 11.7239 1.33325 12.6667 1.33325C13.6096 1.33325 14.081 1.33325 14.3739 1.62615C14.6667 1.91904 14.6667 2.39044 14.6667 3.33325C14.6667 4.27606 14.6667 4.74747 14.3739 5.04036C14.081 5.33325 13.6096 5.33325 12.6667 5.33325C11.7239 5.33325 11.2525 5.33325 10.9596 5.04036C10.6667 4.74747 10.6667 4.27606 10.6667 3.33325Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M10.6667 12.6667C10.6667 11.7239 10.6667 11.2525 10.9596 10.9596C11.2525 10.6667 11.7239 10.6667 12.6667 10.6667C13.6096 10.6667 14.081 10.6667 14.3739 10.9596C14.6667 11.2525 14.6667 11.7239 14.6667 12.6667C14.6667 13.6096 14.6667 14.081 14.3739 14.3739C14.081 14.6667 13.6096 14.6667 12.6667 14.6667C11.7239 14.6667 11.2525 14.6667 10.9596 14.3739C10.6667 14.081 10.6667 13.6096 10.6667 12.6667Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M10.6667 3.33325H10C8.36468 3.45512 8 4.13535 8 6.43511L8 9.56473C8 11.8645 8.36468 12.5447 10 12.6666H10.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </g>
    <defs>
      <clipPath id="clip0_7289_9409">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const CakeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_7289_3408)">
      <ellipse cx="8.00004" cy="12.0002" rx="6.66667" ry="2.66667" fill="currentColor" fillOpacity="0.2" />
      <ellipse cx="8" cy="5.66667" rx="4" ry="1.66667" fill="currentColor" fillOpacity="0.2" />
      <path d="M6.66671 4.00008C6.66671 4.73646 7.26366 5.33341 8.00004 5.33341C8.73642 5.33341 9.33337 4.73646 9.33337 4.00008C9.33337 3.2637 8.73642 2.66675 8.00004 2.66675C7.26366 2.66675 6.66671 3.2637 6.66671 4.00008Z" fill="currentColor" fillOpacity="0.2" />
      <path d="M8 7.33427C5.79086 7.33427 4 6.61567 4 5.72925V11.3343C4 12.0706 5.79086 12.6676 8 12.6676C10.2091 12.6676 12 12.0706 12 11.3343V5.72925C12 6.61567 10.2091 7.33427 8 7.33427Z" fill="currentColor" fillOpacity="0.2" />
      <path d="M11 4.66675C11.6224 4.94969 12 5.32135 12 5.7284C12 6.61482 10.2091 7.33341 8 7.33341C5.79086 7.33341 4 6.61482 4 5.7284C4 5.32135 4.37764 4.94969 5 4.66675" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4 8.66675C4 9.40313 5.79086 10.0001 8 10.0001C10.2091 10.0001 12 9.40313 12 8.66675" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 6V11.3333C12 12.0697 10.2091 12.6667 8 12.6667C5.79086 12.6667 4 12.0697 4 11.3333V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M13.6667 10.6667C14.3007 11.0676 14.6667 11.5407 14.6667 12.0473C14.6667 13.494 11.682 14.6667 8.00008 14.6667C4.31818 14.6667 1.33342 13.494 1.33342 12.0473C1.33342 11.5407 1.6995 11.0676 2.33342 10.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8.00004 2.66683C8.73642 2.66683 9.33337 3.26378 9.33337 4.00016C9.33337 4.73654 8.73642 5.3335 8.00004 5.3335C7.26366 5.3335 6.66671 4.73654 6.66671 4.00016C6.66671 3.26378 7.26366 2.66683 8.00004 2.66683ZM8.00004 2.66683C8.00004 2.3335 8.26671 1.60016 9.33337 1.3335" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </g>
    <defs>
      <clipPath id="clip0_7289_3408">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const FILTER_TAGS = [
  { key: "organization", label: "Sơ đồ tổ chức", icon: OrgIcon },
  { key: "all", label: "Danh bạ", icon: GridIcon },
  { key: "birthday", label: "Sinh nhật", icon: CakeIcon },
];

function getNextBirthdayDate(employee, referenceDate) {
  if (!employee.ngaySinhMonth || !employee.ngaySinhDay) {
    return Number.MAX_SAFE_INTEGER;
  }

  let nextBirthday = dayjs(new Date(referenceDate.year(), employee.ngaySinhMonth - 1, employee.ngaySinhDay));

  if (nextBirthday.isBefore(referenceDate.startOf("day"))) {
    nextBirthday = nextBirthday.add(1, "year");
  }

  return nextBirthday.valueOf();
}

function NhanSuTab() {
  const [employees, setEmployees] = useState([]);
  const [birthdayEmployees, setBirthdayEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [employeesTotal, setEmployeesTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [activeTag, setActiveTag] = useState("organization");
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month() + 1);
  const [appliedSearch, setAppliedSearch] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    chucVu: "",
    phongBan: "",
    donVi: "",
    gioiTinh: "",
    tinhTrang: "",
  });
  const [appliedFilters, setAppliedFilters] = useState({
    chucVu: "",
    phongBan: "",
    donVi: "",
    gioiTinh: "",
    tinhTrang: "",
  });
  const [loading, setLoading] = useState(false);
  const [birthdayLoading, setBirthdayLoading] = useState(false);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const hasAdvancedFilters = useMemo(() => {
    return Boolean(appliedFilters.chucVu || appliedFilters.phongBan || appliedFilters.donVi || appliedFilters.gioiTinh || appliedFilters.tinhTrang);
  }, [appliedFilters.chucVu, appliedFilters.donVi, appliedFilters.gioiTinh, appliedFilters.phongBan, appliedFilters.tinhTrang]);

  useEffect(() => {
    let isMounted = true;

    const loadLookupData = async () => {
      setLookupLoading(true);

      try {
        const [departmentsData, positionsData] = await Promise.all([
          ttnsService.getDepartments(),
          ttnsService.getPositions(),
        ]);

        if (!isMounted) {
          return;
        }

        setDepartments(departmentsData);
        setPositions(positionsData);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        message.error("Không thể tải danh mục phòng ban hoặc chức vụ từ API TTNS");
      } finally {
        if (isMounted) {
          setLookupLoading(false);
        }
      }
    };

    loadLookupData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (hasAdvancedFilters) {
      return undefined;
    }

    let isMounted = true;

    const loadEmployeesPage = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const response = await ttnsService.getEmployees({
          q: appliedSearch.trim(),
          page: currentPage,
          pageSize,
        });

        if (!isMounted) {
          return;
        }

        setEmployees((response?.items || []).map(mapEmployeeRecord));
        setEmployeesTotal(Number(response?.total) || 0);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const nextErrorMessage = ttnsService.getErrorMessage(error);
        setEmployees([]);
        setEmployeesTotal(0);
        setErrorMessage(nextErrorMessage);
        message.error("Không thể tải dữ liệu nhân sự từ API TTNS");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadEmployeesPage();

    return () => {
      isMounted = false;
    };
  }, [appliedSearch, currentPage, hasAdvancedFilters, pageSize]);

  useEffect(() => {
    if (!hasAdvancedFilters || activeTag !== "all") {
      return undefined;
    }

    let isMounted = true;

    const loadAllEmployees = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const items = await ttnsService.getAllEmployees({ q: appliedSearch.trim() });

        if (!isMounted) {
          return;
        }

        const mappedEmployees = items.map(mapEmployeeRecord);
        setEmployees(mappedEmployees);
        setEmployeesTotal(mappedEmployees.length);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const nextErrorMessage = ttnsService.getErrorMessage(error);
        setEmployees([]);
        setEmployeesTotal(0);
        setErrorMessage(nextErrorMessage);
        message.error("Không thể tải dữ liệu nhân sự từ API TTNS");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadAllEmployees();

    return () => {
      isMounted = false;
    };
  }, [activeTag, appliedSearch, hasAdvancedFilters]);

  useEffect(() => {
    if (activeTag !== "birthday") {
      return undefined;
    }

    let isMounted = true;

    const loadBirthdayEmployees = async () => {
      setBirthdayLoading(true);
      setErrorMessage("");

      try {
        const items = await ttnsService.getAllEmployees();

        if (!isMounted) {
          return;
        }

        setBirthdayEmployees(items.map(mapEmployeeRecord));
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const nextErrorMessage = ttnsService.getErrorMessage(error);
        setBirthdayEmployees([]);
        setErrorMessage(nextErrorMessage);
        message.error("Không thể tải dữ liệu sinh nhật từ API TTNS");
      } finally {
        if (isMounted) {
          setBirthdayLoading(false);
        }
      }
    };

    loadBirthdayEmployees();

    return () => {
      isMounted = false;
    };
  }, [activeTag]);

  const filteredData = useMemo(() => {
    return employees.filter((employee) => matchesEmployeeFilters(employee, appliedFilters));
  }, [appliedFilters, employees]);

  const paginatedData = useMemo(() => {
    if (!hasAdvancedFilters) {
      return filteredData;
    }

    return filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }, [currentPage, filteredData, hasAdvancedFilters, pageSize]);

  const birthdayData = useMemo(() => {
    const referenceDate = dayjs();

    return birthdayEmployees
      .filter((item) => item.ngaySinhMonth === selectedMonth)
      .sort((a, b) => {
        const nextBirthdayA = getNextBirthdayDate(a, referenceDate);
        const nextBirthdayB = getNextBirthdayDate(b, referenceDate);

        if (nextBirthdayA !== nextBirthdayB) {
          return nextBirthdayA - nextBirthdayB;
        }

        if ((a.ngaySinhDay || 0) !== (b.ngaySinhDay || 0)) {
          return (a.ngaySinhDay || 0) - (b.ngaySinhDay || 0);
        }

        return a.hoTen.localeCompare(b.hoTen, "vi");
      });
  }, [birthdayEmployees, selectedMonth]);

  const filterOptions = useMemo(() => {
    const fallbackDepartmentOptions = buildSelectOptionsFromEmployees(
      hasAdvancedFilters ? employees : birthdayEmployees,
      "phongBanValue",
      "phongBan",
      "Phòng ban"
    );
    const fallbackPositionOptions = buildSelectOptionsFromEmployees(
      hasAdvancedFilters ? employees : birthdayEmployees,
      "chucVuValue",
      "chucVu",
      "Chức vụ"
    );

    return {
      chucVuOptions: positions.length
        ? buildSelectOptions(positions, "ma_vtr", "ten_vtr", "Chức vụ")
        : fallbackPositionOptions,
      phongBanOptions: departments.length
        ? buildSelectOptions(departments, "ma_bp", "ten_bp", "Phòng ban")
        : fallbackDepartmentOptions,
      donViOptions: buildSelectOptionsFromEmployees(
        hasAdvancedFilters ? employees : birthdayEmployees,
        "donVi",
        "donVi",
        "Đơn vị"
      ),
      gioiTinhOptions: GENDER_OPTIONS,
      tinhTrangOptions: WORK_STATUS_OPTIONS,
    };
  }, [birthdayEmployees, departments, employees, hasAdvancedFilters, positions]);

  const directoryTotal = hasAdvancedFilters ? filteredData.length : employeesTotal;

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value || "",
    }));
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setAppliedSearch(filters.search);
    setAppliedFilters({
      chucVu: filters.chucVu,
      phongBan: filters.phongBan,
      donVi: filters.donVi,
      gioiTinh: filters.gioiTinh,
      tinhTrang: filters.tinhTrang,
    });
  };

  const handlePaginationChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handleEmployeeClick = (record) => {
    setSelectedEmployee(record);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedEmployee(null);
  };

  const handleTagChange = (tag) => {
    setActiveTag(tag);
    setCurrentPage(1);
  };

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
  };

  return (
    <div>
      <FilterTagsContainer>
        {FILTER_TAGS.map((tag) => {
          const IconComponent = tag.icon;
          return (
            <FilterTag key={tag.key} $active={activeTag === tag.key} onClick={() => handleTagChange(tag.key)}>
              <IconComponent />
              {tag.label}
            </FilterTag>
          );
        })}
      </FilterTagsContainer>

      {activeTag === "birthday" ? (
        <>
          {errorMessage ? <Alert type="error" showIcon message={errorMessage} style={{ marginBottom: 16 }} /> : null}
          <BirthdayTable data={birthdayData} loading={birthdayLoading} selectedMonth={selectedMonth} onMonthChange={handleMonthChange} onEmployeeClick={handleEmployeeClick} />
        </>
      ) : activeTag === "organization" ? (
        <SoDoToChuc />
      ) : (
        <>
          {errorMessage ? <Alert type="error" showIcon message={errorMessage} style={{ marginBottom: 16 }} /> : null}
          <NhanSuFilter totalCount={directoryTotal} filters={filters} onFilterChange={handleFilterChange} onSearch={handleSearch} filterOptions={filterOptions} />

          <NhanSuTable
            data={paginatedData}
            loading={loading || lookupLoading}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: directoryTotal,
            }}
            onPaginationChange={handlePaginationChange}
            onPageSizeChange={handlePageSizeChange}
            onEmployeeClick={handleEmployeeClick}
          />
        </>
      )}

      <EmployeeDetailModal visible={isModalVisible} employee={selectedEmployee} onClose={handleCloseModal} />
    </div>
  );
}

export default NhanSuTab;
