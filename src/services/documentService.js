import { axiosPrivate } from "../common/axios";

/**
 * Fetches all document folders for a specific site (group).
 *
 * @async
 * @function getFolders
 * @param {number|string} siteId - The Liferay site (group) ID.
 * @returns {Promise<Array>} A promise that resolves to an array of document folder objects.
 */
export const getFolders = async (siteId) => {
  const res = await axiosPrivate.get(
    `/o/headless-delivery/v1.0/sites/${siteId}/document-folders`
  );
  return res.data.items;
};

/**
 * Fetches documents within a specific folder.
 *
 * @async
 * @function getDocuments
 * @param {number|string} folderId - The ID of the document folder.
 * @returns {Promise<Array>} A promise that resolves to an array of document objects.
 */
export const getDocuments = async (folderId) => {
  const res = await axiosPrivate.get(
    `/o/headless-delivery/v1.0/document-folders/${folderId}/documents`
  );
  return res.data.items;
};

/**
 * Uploads a document to a specific folder.
 *
 * @async
 * @function uploadDocument
 * @param {number|string} folderId - The ID of the document folder.
 * @param {File} file - The file to upload.
 * @returns {Promise<Object>} A promise that resolves to the created document object.
 */
export const uploadDocument = async (folderId, file) => {
  const formData = new FormData();
  formData.append("file", file);
  
  const res = await axiosPrivate.post(
    `/o/headless-delivery/v1.0/document-folders/${folderId}/documents`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data;
};

/**
 * Deletes a document by ID.
 *
 * @async
 * @function deleteDocument
 * @param {number|string} documentId - The ID of the document to delete.
 * @returns {Promise<void>}
 */
export const deleteDocument = async (documentId) => {
  await axiosPrivate.delete(`/o/headless-delivery/v1.0/documents/${documentId}`);
};

/**
 * Fetches document content as a Blob.
 * 
 * @async
 * @function getDocumentBlob
 * @param {string} contentUrl - The URL of the document content.
 * @returns {Promise<Blob>}
 */
export const getDocumentBlob = async (contentUrl) => {
  const res = await axiosPrivate.get(contentUrl, {
    responseType: 'blob'
  });
  return res.data;
};
