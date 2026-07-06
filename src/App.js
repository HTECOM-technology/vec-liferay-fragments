import "./App.css";
import "dayjs/locale/vi";

import { ConfigProvider } from "antd";
import AppRouter from "./router";
import vi_VN from "antd/es/locale/vi_VN";
import dayjs from "dayjs";

dayjs.locale("vi");

function App() {
  return (
    <ConfigProvider
      locale={vi_VN}
      theme={{
        token: {
          fontFamily: "Inter, sans-serif",
          colorPrimary: "#0090CF",
          borderRadius: 4,
        },
      }}
    >
      <AppRouter />
    </ConfigProvider>
  );
}

export default App;
