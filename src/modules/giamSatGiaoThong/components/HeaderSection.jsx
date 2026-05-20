import React from 'react';
import { Select, DatePicker, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import styled from 'styled-components';
import { Header, Title, Filters } from '../style';

const SearchInput = styled(Input)`
  width: 300px;
  height: 40px !important;
  border-radius: 6px !important;
  display: flex;
  align-items: center;

  .ant-input {
    font-size: 15px !important;
    height: 38px !important;
  }

  .ant-input-prefix {
    margin-right: 8px;
  }
`;

const CustomSelect = styled(Select)`
  width: 350px;
  height: 40px !important;

  .ant-select-selector {
    height: 40px !important;
    padding: 8px 11px !important;
    border-radius: 6px !important;
  }

  .ant-select-selection-item,
  .ant-select-selection-placeholder {
    line-height: 22px !important;
    font-size: 15px !important;
  }
`;

const CustomDatePicker = styled(DatePicker)`
  width: 200px;
  height: 40px !important;
  padding: 8px 11px !important;
  border-radius: 6px !important;

  .ant-picker-input > input {
    font-size: 15px !important;
  }
`;

const SearchButton = styled.button`
  height: 40px;
  padding: 0 24px;
  background: #0090cf;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #007ab8;
  }
`;

const HeaderSection = ({
  routes,
  selectedRoute,
  selectedDate,
  searchKeyword,
  onFilterChange,
  onSearch
}) => {
  const routeOptions = [
    { value: '', label: 'Tất cả tuyến đường' },
    ...routes.map((route) => ({
      value: route.id.toString(),
      label: route.title,
    }))
  ];

  const dateValue = selectedDate ? dayjs(selectedDate) : null;

  return (
    <Header>
      <Title>Tình trạng giao thông trên tuyến</Title>
      <Filters>
        <SearchInput
          placeholder="Tìm kiếm"
          prefix={<SearchOutlined />}
          value={searchKeyword}
          onChange={(e) => onFilterChange('search', e.target.value)}
          allowClear
        />

        <CustomSelect
          value={selectedRoute}
          onChange={(value) => onFilterChange('route', value)}
          options={routeOptions}
          placeholder="Cao tốc TP. Hồ Chí Minh - Long..."
        />

        <CustomDatePicker
          value={dateValue}
          onChange={(date) => {
            const dateString = date ? date.format('YYYY-MM-DD') : '';
            onFilterChange('date', dateString);
          }}
          format="DD/MM/YYYY"
          placeholder="15/01/2025"
        />

        <SearchButton onClick={onSearch}>
          Tìm kiếm
        </SearchButton>
      </Filters>
    </Header>
  );
};

export default HeaderSection;
