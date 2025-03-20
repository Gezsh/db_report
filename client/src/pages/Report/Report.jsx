import React from "react";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import ReportForm from "../../components/reportForm/ReportForm";
import ReportReview from "../../components/reportReview/ReportReview";
import { useSelector } from "react-redux";
import "./Report.css";

const Report = () => {
  const user = useSelector((state) => state.user.user);

  return (
    <div className="report">
      {/* Sidebar must be included */}
      <Sidebar />

      <div className="report-content">
        <div className="main-content">
          {user?.data?.role === "staff" ? <ReportForm /> : <ReportReview />}
        </div>
      </div>
    </div>
  );
};

export default Report;
