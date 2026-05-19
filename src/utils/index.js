export const baseApiUrl = () => {
  const url = process.env.REACT_APP_BASE_API_URL ?? '';
  if (url.includes('localhost') || url.includes('127.0.0.1') || url.includes('0.0.0.0')) {
    return url;
  }
  return '';
}
