import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export const UserSession = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setToken(token);
    } else {
      navigate("/login");
    }
  }, []);

  return <>{token ? <Outlet /> : null}</>;
};
