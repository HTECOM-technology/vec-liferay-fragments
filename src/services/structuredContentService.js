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

// ------------------------------------------------------------------------------------------- \\
const FOLDER_ID = "1266988";

export const getStructuredContentsByFolder = async () => {
    const res = await axiosPrivate.get(
        `/o/headless-delivery/v1.0/structured-content-folders/${FOLDER_ID}/structured-contents`,
        {
            params: {
                fields: "title,id",
                pageSize: 20,
            },
        }
    );
    return res.data.items;
};

// ------------------------------------------------------------------------------------------- \\
const CONTENT_STRUCTURE_ID = "1266959";

export const getContentById = async (id) => {
    const res = await axiosPrivate.get(
        `/o/headless-delivery/v1.0/content-structures/${CONTENT_STRUCTURE_ID}/structured-contents`,
        {
            params: {
                pageSize: 100,
            },
        }
    );

    const item = res.data.items.find(item => item.id === id);
    const subGroups = item.contentFields[0].nestedContentFields
        .filter(field => field.name === "subGroups");
    return subGroups;
    // return res.data.items.find(item => item.id === id);
};
