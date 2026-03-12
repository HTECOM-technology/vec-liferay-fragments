import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { memo } from "react";
import { MainLayout } from "../components/layout";
import { VanPhongDienTuPage, DoiSoatThuPhiPage, CongThongTinNhanSuPage, SoTayNhanVienPage, KhaoSatBieuQuyetPage, HomePage, QuyTrinhHoTroPage, BieuMauTaiLieuPage, LoginPage, GiamSatGiaoThongPage } from "../modules";
import { paths } from "./menuConfig";
import TinTucSuKienPage from "../modules/tinTucSuKien";

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path={paths.dangNhap} element={<LoginPage />} />
        <Route path={paths.trangChu} element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path={paths.vanPhongDienTu} element={<VanPhongDienTuPage />} />
          <Route path={paths.doiSoatThuPhi} element={<DoiSoatThuPhiPage />} />
          <Route path={paths.congThongTinNhanSu} element={<CongThongTinNhanSuPage />} />
          <Route path={paths.giamSatGiaoThong} element={<GiamSatGiaoThongPage />} />
          <Route path={paths.tinTucSuKien} element={<TinTucSuKienPage />} />
          <Route path={paths.bieuMauTaiLieu} element={<BieuMauTaiLieuPage />} />
          <Route path={paths.soTayNhanVien} element={<SoTayNhanVienPage />} />
          <Route path={paths.khaoSatBieuQuyet} element={<KhaoSatBieuQuyetPage />} />
          <Route path={paths.quyTrinhHoTro} element={<QuyTrinhHoTroPage />} />
        </Route>
        <Route path="*" element={<Navigate to={paths.trangChu} replace />} />
      </Routes>
    </Router>
  );
}

export default memo(AppRouter);
