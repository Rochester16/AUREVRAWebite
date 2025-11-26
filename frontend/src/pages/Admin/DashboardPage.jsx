import React from "react";
import AdminNavbar from "../../components/AdminNavBar";

export default function DashboardPage() {
  return (
    <>
      <AdminNavbar />
      <div className="admin-page">
        <h1>Admin Dashboard</h1>
        <p>Welcome admin! Here is your overview.</p>
      </div>
    </>
  );
}
