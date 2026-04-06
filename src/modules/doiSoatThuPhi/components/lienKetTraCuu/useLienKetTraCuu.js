import { useEffect, useState } from "react";
import React from "react";
import { getShortLinksDoiSoatThuPhi } from "../../../../services/lienKetTraCuuService";
import {
  IconDashboard,
  IconGiamSatGiaoDich,
  IconDoiSoatThuPhi,
  IconHoTroGiaiTrinh,
  IconYeuCauXuLyLoi,
  IconKPIHeThong,
  IconKPIVanHanh,
  IconBaoCaoThongKe,
  IconDefault,
} from "./icons";


const iconList = [
  <IconDashboard />,
  <IconGiamSatGiaoDich />,
  <IconDoiSoatThuPhi />,
  <IconHoTroGiaiTrinh />,
  <IconYeuCauXuLyLoi />,
  <IconKPIHeThong />,
  <IconKPIVanHanh />,
  <IconBaoCaoThongKe />,
  <IconDefault />,
];

function useLienKetTraCuu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getShortLinksDoiSoatThuPhi()
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
