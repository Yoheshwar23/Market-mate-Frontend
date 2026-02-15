import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import { Outlet, Navigate } from "react-router-dom";

function IsAuthenticated({ Role }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const isAuth = async () => {
      try {
        const res = await axios.get("/market-mate/user/myaccount");
        const { role } = res.data.user || res.data;  // Match your controller response

        setAuthorized(Role ? Role.includes(role) : true);
      } catch (err) {
        console.log('Auth check failed:', err.response?.status);  // Log 401 expected pre-login
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    isAuth();
  }, [Role]);

  if (loading) {
    return <div>Loading...</div>;  // Or spinner component [web:37]
  }

  return authorized ? <Outlet /> : <Navigate to="/market-mate/login" replace />;
}

export default IsAuthenticated;
