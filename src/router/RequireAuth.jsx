import { Outlet } from "react-router-dom";
import AuthService from "../modules/auth/AuthService";

function RequireAuth() {
  // if (!AuthService.isAuthenticated()) {
  //   window.location.href = '/c/admin?redirect=/web/guest/intranet';
  //   return <></>;
  // }

  return <Outlet />;
}

export default RequireAuth;
