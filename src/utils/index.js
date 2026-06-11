export const baseApiUrl = () => {
  const url = process.env.REACT_APP_BASE_API_URL ?? '';
  if (url.includes('localhost') || url.includes('127.0.0.1') || url.includes('0.0.0.0')) {
    return url;
  }
  return '';
}

function callLiferayService(path, params) {
  return new Promise((resolve, reject) => {
    window.Liferay.Service(path, params, resolve, reject);
  });
}

export const getUserInfo = async () => {if (!window.Liferay?.ThemeDisplay) {
  if (process.env.REACT_APP_FORCE_ADMIN === 'true') {
      return {
        userId: 0,
        firstName: 'Dev',
        lastName: 'Admin',
        emailAddress: 'admin@dev.local',
        ldapServerId: 0,
      };
    }
    return null;
  }
  const isLogined = window.Liferay.ThemeDisplay.isSignedIn();
  if (!isLogined) {
    return null;
  }
  try {
    const userId = window.Liferay.ThemeDisplay.getUserId();
    return await callLiferayService(
      "/user/get-user-by-id",
      { userId }
    );
  } catch (e) {
    console.error('getUserInfo error: ', e);
    return null;
  }
}

export const getTtnsUserId = (user) => {
  const ldapServerId = Number(user?.ldapServerId || 0)

  return Number.isFinite(ldapServerId) && ldapServerId > 0 ? ldapServerId : 0
}
