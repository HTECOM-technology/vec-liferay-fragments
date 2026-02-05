import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { memo } from "react";
import { MainLayout } from "../components/layout";
import { VanPhongDienTuPage, DoiSoatThuPhiPage, CongThongTinNhanSuPage } from "../modules";
import { paths } from "./menuConfig";

function HomePlaceholder() {
  return (
    <div>
      <h1>Trang chủ</h1>
      <p>Nội dung trang chủ.</p>
    </div>
  );
}

function PlaceholderPage({ title }) {
  return (
    <div>
      <h1>{title}</h1>
      <p>Nội dung trang (placeholder).</p>
    </div>
  );
}

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path={paths.trangChu} element={<MainLayout />}>
          <Route index element={<HomePlaceholder />} />
          <Route path={paths.vanPhongDienTu} element={<VanPhongDienTuPage />} />
          <Route path={paths.doiSoatThuPhi} element={<DoiSoatThuPhiPage />} />
          <Route path={paths.congThongTinNhanSu} element={<CongThongTinNhanSuPage />} />
          <Route path={paths.giamSatGiaoThong} element={<PlaceholderPage title="Giám sát giao thông" />} />
          <Route path={paths.tinTucSuKien} element={<PlaceholderPage title="Tin tức - Sự kiện" />} />
          <Route path={paths.bieuMauTaiLieu} element={<PlaceholderPage title="Biểu mẫu tài liệu" />} />
          <Route path={paths.soTayNhanVien} element={<PlaceholderPage title="Sổ tay nhân viên" />} />
        </Route>
        <Route path="*" element={<Navigate to={paths.trangChu} replace />} />
      </Routes>
    </Router>
  );
}

export default memo(AppRouter);
