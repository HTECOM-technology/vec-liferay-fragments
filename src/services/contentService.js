import { axiosPrivate } from "../common/axios";

/**
 * Fetches all content structures for a given Liferay site.
 *
 * @async
 * @function getContentStructures
 * @param {number|string} siteId - The Liferay site (group) ID.
 * @returns {Promise<Array>} A promise that resolves to an array of content structure objects.
 *
 * @example
 * const structures = await getContentStructures(20117);
 */
export const getContentStructures = async (siteId) => {
  const res = await axiosPrivate.get(
    `/o/headless-delivery/v1.0/sites/${siteId}/content-structures`
  );
  return res.data.items;
};

/**
 * Fetches structured content entries for a specific content structure.
 *
 * @async
 * @function getStructuredContents
 * @param {number|string} structureId - The content structure ID.
 * @returns {Promise<Array>} A promise that resolves to an array of structured content items.
 *
 * @example
 * const contents = await getStructuredContents(34807);
 */
export const getStructuredContents = async (structureId) => {
  const res = await axiosPrivate.get(
    `/o/headless-delivery/v1.0/content-structures/${structureId}/structured-contents`
  );
  return res.data.items;
};
