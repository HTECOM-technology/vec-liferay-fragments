import { axiosPrivate } from "../common/axios";

export const getAllBlogBySiteId = async (siteId) => {
  const res = await axiosPrivate.get(
    `/o/headless-delivery/v1.0/sites/${siteId}/blog-postings`,
    {
      params: {
        pageSize: -1,
      },
    }
  );

  return res.data.items;
};
