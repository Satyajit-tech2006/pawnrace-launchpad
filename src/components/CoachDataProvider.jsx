import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import apiClient from "../lib/api"; // Adjust this path if your api.js is located elsewhere
import { ENDPOINTS } from "../lib/endpoints"; // Adjust this path if needed

export default function CoachDataProvider() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSharedData = async () => {
      try {
        // Adjust the fallback URL if your route is slightly different
        const endpoint = ENDPOINTS?.COURSE?.GET_COACH_COURSES || "/api/v1/courses/my-courses";
        const response = await apiClient.get(endpoint);
        
        setCourses(response.data?.data || []);
      } catch (error) {
        console.error("Failed to load coach courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSharedData();
  }, []); // The empty array ensures this fetches EXACTLY once when the coach logs in

  // <Outlet /> renders whatever child page the user clicks (Classes, Students, etc.)
  // The context prop magically passes the data down to them.
  return <Outlet context={{ courses, isLoading, setCourses }} />;
}