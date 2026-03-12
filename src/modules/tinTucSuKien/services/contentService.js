import { axiosPrivate } from "../common/axios";

/**
 * Content Service
 *
 * Provides helper functions to interact with Liferay Headless Delivery APIs
 * for fetching content structures and structured content entries.
 */

/**
 * Fetches all content structures available for a given Liferay site.
 *
 * Uses the Headless Delivery API to retrieve content structures
 * associated with a site (group).
 *
 * @async
 * @function getContentStructures
 * @param {number|string} siteId - Liferay site (group) ID.
 * @returns {Promise<Array<Object>>} Resolves to an array of content structure objects.
 *
 * @example
 * const structures = await getContentStructures(20117);
 */
export const getContentStructures = async (siteId) => {
  const res = await axiosPrivate.get(
    `/o/headless-delivery/v1.0/sites/${siteId}/content-structures`,
    {
      params: {
        pageSize: -1, // Fetch all structures without pagination
      },
    }
  );

  return res.data.items;
};

/**
 * Fetches structured content entries for a given content structure.
 *
 * Supports optional filtering by taxonomy category and pagination.
 *
 * @async
 * @function getStructuredContents
 * @param {number|string} structureId - Content structure ID.
 * @param {number|string} [categoryId] - Optional taxonomy category ID for filtering.
 * @param {number} [page=1] - Page number for pagination.
 * @param {number} [pageSize=20] - Number of items per page.
 * @returns {Promise<Array<Object>>} Resolves to an array of structured content items.
 *
 * @example
 * // Fetch all contents
 * const items = await getStructuredContents(34807);
 *
 * @example
 * // Fetch contents filtered by category
 * const items = await getStructuredContents(34807, 12345);
 */
export const getStructuredContents = async (
  structureId,
  categoryId,
  page = 1,
  pageSize = 20
) => {
  const res = await axiosPrivate.get(
    `/o/headless-delivery/v1.0/content-structures/${structureId}/structured-contents`,
    {
      params: {
        page,
        pageSize,
        /**
         * Liferay taxonomy filter:
         * Filters content that contains the given taxonomy category ID
         */
        filter: categoryId
          ? `taxonomyCategoryIds/any(t:t eq ${categoryId})`
          : undefined,
      },
    }
  );

  return res.data.items;
};
