import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import { Outlet, Navigate } from "react-router";

function IsAuthenticated({ Role }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const isAuth = async () => {
      try {
        const res = await axios.get("/market-mate/user/myaccount");
        const { role } = res.data;

        if (Role && !Role.includes(role)) {
          setAuthorized(false);
        } else {
          setAuthorized(true);
        }
      } catch {
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    isAuth();
  }, [Role]);

  if (loading) return null;

  if (!authorized) {
    return <Navigate to="/market-mate/login" replace />;
  }

  return <Outlet />;
}

export default IsAuthenticated;
