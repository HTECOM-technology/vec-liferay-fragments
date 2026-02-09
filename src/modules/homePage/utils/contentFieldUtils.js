/**
 * Retrieves the value of a specific field from Liferay structured content fields.
 *
 * Searches through the contentFields array and returns the
 * corresponding contentFieldValue for the given field name.
 *
 * @function getFieldValue
 * @param {Array<Object>} fields - Array of content field objects from structured content.
 * @param {string} fieldName - The name of the field to retrieve.
 * @returns {Object|undefined} The contentFieldValue of the matched field, or undefined if not found.
 *
 * @example
 * const shortDescription = getFieldValue(fields, "shortDescription")?.data;
 */
export const getFieldValue = (fields, fieldName) => {
  return fields.find((f) => f.name === fieldName)?.contentFieldValue;
};
