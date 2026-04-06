import { useEffect, useState } from "react";
import React from "react";
import { getShortLinksCongThongTinNhanSu } from "../../../../services/lienKetTraCuuService";
import {
  IconDangKyNghi,
  IconXacNhanCong,
  IconLamThemGio,
  IconKPIThang,
  IconDaoTao,
  IconChamCong,
  IconPhepNam,
  IconThongTinCaNhan,
  IconPhieuLuong,
  IconDanhSachNV,
  IconTuyenDung,
  IconBaoCaoNhanSu,
  IconDefault,
} from "./icons";


const iconList = [
  <IconDangKyNghi />,
  <IconXacNhanCong />,
  <IconLamThemGio />,
  <IconKPIThang />,
  <IconDaoTao />,
  <IconChamCong />,
  <IconPhepNam />,
  <IconThongTinCaNhan />,
  <IconPhieuLuong />,
  <IconDanhSachNV />,
  <IconTuyenDung />,
  <IconBaoCaoNhanSu />,
  <IconDefault />
];

function useLienKetTraCuu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getShortLinksCongThongTinNhanSu()
      .then((apiItems) => {
        const data = (apiItems || []).map((item, index) => ({
          ...item,
          icon: iconList[index] ?? <IconDefault />,
          title: item.title.replace(" Báo cáo", "\nBáo cáo"),
        }));
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return { items, loading, error };
}

export default useLienKetTraCuu;
