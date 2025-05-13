import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
import { useAuth } from "../../context/data";

function ProtectRoutes(props) {
    const { authURL } = useAuth();
    const { Component } = props;
    const [redirectToLogin, setRedirectToLogin] = useState(false);
    const [loading, setLoading] = useState(true); // Start with loading state true

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`${authURL}/root/auth/authenticate`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": import.meta.env.VITE_APIKEY,
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    const data = await response.json();
                    localStorage.setItem("user", JSON.stringify(data));
                    toast.success("Login successful", {
                        duration: 3000,
                        position: "bottom-right",
                    });
                } else if (response.status === 403) {
                    toast.error("Access Forbiden", {
                        duration: 3000,
                        position: "bottom-right",
                    });
                    setRedirectToLogin(true);
                } else if (response.status === 401) {
                    console.log(`Token Invalid!`);
                    console.log(`Login First!`);
                    setRedirectToLogin(true);
                } else if (response.status === 404) {
                    console.log("No Token Found");
                    setRedirectToLogin(true);
                } else {
                    toast.error("Internal Server Error", {
                        duration: 3000,
                        position: "bottom-right",
                    });
                    setRedirectToLogin(true);
                }
            } catch (error) {
                console.error("Error while verifying token:", error);
                setRedirectToLogin(true);
            } finally {
                setTimeout(() => setLoading(false), 2000); // Show loader for 5 seconds
            }
        };

        verifyToken();
    }, [redirectToLogin, authURL]);

    if (redirectToLogin) {
        return <Navigate to="/" />;
    }

    return (
        <>
            {loading && <Loader />} {/* Show loader if loading is true */}
            {!loading && <Component />} {/* Show component after loading is false */}
        </>
    );
}

export default ProtectRoutes;
