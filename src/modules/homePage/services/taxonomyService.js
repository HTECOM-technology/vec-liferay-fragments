import { axiosPrivate } from "../common/axios";

/**
 * Fetches all taxonomy vocabularies available for a specific Liferay site.
 *
 * @async
 * @function getVocabulariesBySite
 * @param {number|string} siteId - The Liferay site (group) ID.
 * @returns {Promise<Array>} A promise that resolves to an array of taxonomy vocabulary objects.
 *
 * @example
 * const vocabularies = await getVocabulariesBySite(20117);
 */
export const getVocabulariesBySite = async (siteId) => {
  const res = await axiosPrivate.get(
    `/o/headless-admin-taxonomy/v1.0/sites/${siteId}/taxonomy-vocabularies`
  );
  return res.data.items;
};

/**
 * Fetches all taxonomy categories for a given taxonomy vocabulary.
 *
 * @async
 * @function getCategoriesByVocabulary
 * @param {number|string} vocabularyId - The taxonomy vocabulary ID.
 * @returns {Promise<Array>} A promise that resolves to an array of taxonomy category objects.
 *
 * @example
 * const categories = await getCategoriesByVocabulary(45678);
 */
export const getCategoriesByVocabulary = async (vocabularyId) => {
  const res = await axiosPrivate.get(
    `/o/headless-admin-taxonomy/v1.0/taxonomy-vocabularies/${vocabularyId}/taxonomy-categories`
  );
  return res.data.items;
};
