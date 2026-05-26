import { getUserInfo } from "@/utils";
import { useEffect, useState } from "react";

export default function useUserInfo() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const init = async () => {
      const user = await getUserInfo();
      setUser(user);
    }
    init();
  }, []);

  return { user };
}
