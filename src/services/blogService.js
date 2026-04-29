import { axiosPrivate } from "../common/axios";

// export const getAllBlogBySiteId = async (siteId) => {
//   const res = await axiosPrivate.get(
//     `/o/headless-delivery/v1.0/sites/${siteId}/blog-postings`,
//     {
//       params: {
//         pageSize: -1,
//       },
//     }
//   );

//   return res.data.items;
// };

export const getAllBlogBySiteId = async (siteId, categoryId) => {
  const res = await axiosPrivate.get(
    `/o/headless-delivery/v1.0/content-structures/38305/structured-contents`,
    {
      params: {
        filter: `taxonomyCategoryIds/any(t:t eq ${categoryId})`,
        sort: "datePublished:desc",
        pageSize: 10,
        page: 1,
      },
    }
  );

  return res.data.items;
};

export const getLatestBlogs = async (vocabularyId = 1215209, pageSize = 10) => {
  const catRes = await axiosPrivate.get(
    `/o/headless-admin-taxonomy/v1.0/taxonomy-vocabularies/${vocabularyId}/taxonomy-categories`
  );
  const categoryIds = catRes.data.items.map((c) => c.id);

  const contentRes = await axiosPrivate.get(
    `/o/headless-delivery/v1.0/content-structures/38305/structured-contents`,
    {
      params: {
        filter: `taxonomyCategoryIds/any(t:t in (${categoryIds.join(",")}))`,
        sort: "datePublished:desc",
        pageSize,
        page: 1,
      },
    }
  );

  return contentRes.data.items;
};
