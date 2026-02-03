import React from "react";
import "@ant-design/v5-patch-for-react-19";
import "./App.css";

import { ConfigProvider } from "antd";
import AppRouter from "./router";
import vi_VN from 'antd/es/locale/vi_VN';
import dayjs from 'dayjs';

import 'dayjs/locale/vi';

dayjs.locale('vi');

function App() {
  return (
    <ConfigProvider
      locale={vi_VN}
      theme={{
        token: {
          fontFamily: "Inter, sans-serif",
          colorPrimary: "#0090CF",
        },
      }}
    >
      <AppRouter />
    </ConfigProvider>
  );
}

export default App;
