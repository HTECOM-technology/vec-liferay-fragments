export const baseApiUrl = () => {
  const url = process.env.REACT_APP_BASE_API_URL ?? '';
  return url;
}
