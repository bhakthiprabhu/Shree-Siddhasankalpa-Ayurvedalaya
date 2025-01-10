"use client";
import React from "react";
import { useParams } from "next/navigation";
import NavBar from "@/components/NavBar/NavBar";
import withAuth from "@/hoc/withAuth"; 

const DashboardPage = () => {
  const params = useParams();
  const location = params?.location;
  
  return (
    <div>
      <NavBar location={location} />
    </div>
  );
};

export default withAuth(DashboardPage);
