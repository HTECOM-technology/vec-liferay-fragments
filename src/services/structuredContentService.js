import { axiosPrivate } from "../common/axios";

const STRUCTURE_ID = "38305";

export const getStructuredContentsByCategory = async (categoryId) => {
    const res = await axiosPrivate.get(
        `/o/headless-delivery/v1.0/content-structures/${STRUCTURE_ID}/structured-contents`,
        {
            params: {
                filter: `taxonomyCategoryIds/any(t:t eq ${categoryId})`,
                pageSize: 200,
                sort: "datePublished:desc",
            },
        }
    );
    return res.data.items;
};

export const getStructuredContentById = async (id) => {
    const res = await axiosPrivate.get(
        `/o/headless-delivery/v1.0/structured-contents/${id}`
    );
    return res.data;
};