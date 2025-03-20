import React from "react";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import HistoryComponent from "../../components/history/HistoryComponent"; // Import History Component
import "./History.css";

const History = () => {
  return (
    <div className="history">
      {/* Sidebar must be included */}
      <Sidebar />

      <div className="history-content">
        <div className="main-content">
          <HistoryComponent />
        </div>
      </div>
    </div>
  );
};

export default History;
