import { useEffect, useState } from "react";
import React from "react";
import { getShortLinksVanPhongDienTu } from "../../../../services/lienKetTraCuuService";
import {
  IconTraCuuVBDi,
  IconTraCuuVBDen,
  IconXeOTo,
  IconXacNhanDiVe,
  IconPhongHop,
  IconLichDonVi,
  IconHoSoCongViec,
  IconGiaoViec,
  IconBaoCaoTHCaNhan,
  IconBaoCaoCTCaNhan,
  IconBaoCaoTHDonVi,
  IconBaoCaoXLVB,
  IconDefault,
} from "./icons";


const iconList = [
  <IconTraCuuVBDi />,
  <IconTraCuuVBDen />,
  <IconXeOTo />,
  <IconXacNhanDiVe />,
  <IconPhongHop />,
  <IconLichDonVi />,
  <IconHoSoCongViec />,
  <IconGiaoViec />,
  <IconBaoCaoTHCaNhan />,
  <IconBaoCaoCTCaNhan />,
  <IconBaoCaoTHDonVi />,
  <IconBaoCaoXLVB />,
  <IconDefault />,
];

function useLienKetTraCuu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getShortLinksVanPhongDienTu()
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
