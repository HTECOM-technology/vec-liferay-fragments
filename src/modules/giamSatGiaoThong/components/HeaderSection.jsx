import React, { useEffect, useMemo } from 'react';
import { Select } from 'antd';
import styled from 'styled-components';
import { Header, Title, Filters } from '../style';

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

const HeaderSection = ({
  routes,
  selectedRoute,
  onFilterChange
}) => {
  const routeOptions = useMemo(() => {
    return routes.map((route) => ({
      value: String(route.id),
      label: route.title || route.name || String(route.id),
    }));
  }, [routes]);

  useEffect(() => {
    if (selectedRoute || routeOptions.length === 0) return;

    const timer = setTimeout(() => {
      onFilterChange('route', routeOptions[0].value);
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [onFilterChange, routeOptions, selectedRoute]);

  return (
    <Header>
      <Title>Tình trạng giao thông trên tuyến</Title>
      <Filters>
        <CustomSelect
          value={selectedRoute}
          onChange={(value) => onFilterChange('route', value)}
          options={routeOptions}
          placeholder="Cao tốc TP. Hồ Chí Minh - Long..."
        />
      </Filters>
    </Header>
  );
};

export default HeaderSection;
