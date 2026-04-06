import { axiosPrivate } from "../common/axios";

/**
 * Fetches short links for Van Phong Dien Tu module.
 *
 * @async
 * @function getShortLinksVanPhongDienTu
 * @returns {Promise<Array>} A promise that resolves to an array of short link objects.
 */
export const getShortLinksVanPhongDienTu = async () => {
  const res = await axiosPrivate.get("/o/c/shortlinkvnphngints/");
  return res.data.items;
};

/**
 * Fetches short links for Cong Thong Tin Nhan Su module.
 *
 * @async
 * @function getShortLinksCongThongTinNhanSu
 * @returns {Promise<Array>} A promise that resolves to an array of short link objects.
 */
export const getShortLinksCongThongTinNhanSu = async () => {
  const res = await axiosPrivate.get("/o/c/shortlinkthngtinnhnses/");
  return res.data.items;
};

/**
 * Fetches short links for Doi Soat Thu Phi module.
 *
 * @async
 * @function getShortLinksDoiSoatThuPhi
 * @returns {Promise<Array>} A promise that resolves to an array of short link objects.
 */
export const getShortLinksDoiSoatThuPhi = async () => {
  const res = await axiosPrivate.get("/o/c/shortlinkisotthuphs/");
  return res.data.items;
};
