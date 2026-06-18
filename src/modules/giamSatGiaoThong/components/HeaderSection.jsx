import React, { useEffect, useMemo } from 'react';
import { Select, Tooltip } from 'antd';
import styled from 'styled-components';
import { FiSettings } from 'react-icons/fi';
import { Header, Title, Filters } from '../style';
import useUserInfo from '@/hooks/useUserInfo';

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

  @media (max-width: 768px) {
    width: 100% !important;

    .ant-select-selection-item,
    .ant-select-selection-placeholder {
      font-size: 14px !important;
    }
  }
`;

const SettingButton = styled.button`
  width: 40px;
  height: 40px;
  border: 1px solid #d5e4ef;
  border-radius: 10px;
  background: linear-gradient(180deg, #ffffff 0%, #f4f8fb 100%);
  color: #0f6ea8;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 8px 18px rgba(15, 110, 168, 0.12);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: #8fc2e3;
    box-shadow: 0 12px 22px rgba(15, 110, 168, 0.16);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
    box-shadow: none;
    transform: none;
  }
`;

const HeaderSection = ({
  routes,
  selectedRoute,
  onFilterChange,
  onOpenSettings,
}) => {
  const { user } = useUserInfo();

  const isAllowUpdateSetting = useMemo(() => {
    return user && user.screenName === 'admin';
  }, [user]);

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
        {isAllowUpdateSetting && (
          <Tooltip title="Cấu hình hiển thị camera">
            <SettingButton
              type="button"
              onClick={onOpenSettings}
              disabled={!selectedRoute}
              aria-label="Cấu hình hiển thị camera"
            >
              <FiSettings size={18} />
            </SettingButton>
          </Tooltip>
        )}
      </Filters>
    </Header>
  );
};

export default HeaderSection;
