import { axiosPrivate } from "../common/axios";

export const getQuickLinks = async () => {
    const res = await axiosPrivate.get("/o/c/quicklinkstrangches/");
    return res.data.items;
};