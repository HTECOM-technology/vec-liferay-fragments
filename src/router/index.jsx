import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { memo } from "react";
import { MainLayout } from "../components/layout";
import { VanPhongDienTuPage, DoiSoatThuPhiPage, CongThongTinNhanSuPage, SoTayNhanVienPage, KhaoSatBieuQuyetPage, HomePage, QuyTrinhHoTroPage, BieuMauTaiLieuPage, GiamSatGiaoThongPage } from "../modules";
import { paths } from "./menuConfig";
import TinTucSuKienPage from "../modules/tinTucSuKien";
import TinTucCategoryPage from "../modules/tinTucSuKien/pages/TinTucCategoryPage";
import TinTucDetailPage from "../modules/tinTucSuKien/pages/TinTucDetailPage";
import RequireAuth from "./RequireAuth";

function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* VietDM: tạm thời off page đăng nhập, sử dụng đăng nhập của Liferay Internet */}
        {/* <Route path={paths.dangNhap} element={<LoginPage />} /> */}
        <Route element={<RequireAuth />}>
          <Route element={<MainLayout />}>
            <Route path={paths.trangChu} element={<HomePage />} />
            <Route path={paths.vanPhongDienTu} element={<VanPhongDienTuPage />} />
            <Route path={paths.doiSoatThuPhi} element={<DoiSoatThuPhiPage />} />
            <Route path={paths.congThongTinNhanSu} element={<CongThongTinNhanSuPage />} />
            <Route path={paths.giamSatGiaoThong} element={<GiamSatGiaoThongPage />} />
            <Route path={paths.tinTucSuKien}>
              <Route index element={<TinTucSuKienPage />} />
              <Route path=":slug" element={<TinTucCategoryPage />} />
              <Route path=":slug/:id" element={<TinTucDetailPage />} />
            </Route>
            <Route path={paths.bieuMauTaiLieu} element={<BieuMauTaiLieuPage />} />
            <Route path={paths.soTayNhanVien} element={<SoTayNhanVienPage />} />
            <Route path={paths.khaoSatBieuQuyet} element={<KhaoSatBieuQuyetPage />} />
            <Route path={paths.quyTrinhHoTro} element={<QuyTrinhHoTroPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to={paths.trangChu} replace />} />
      </Routes>
    </Router>
  );
}

export default memo(AppRouter);
