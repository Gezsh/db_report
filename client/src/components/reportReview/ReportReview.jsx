import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ReportReview.css";

const ReportReview = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usernames, setUsernames] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 6;

  // Date filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/report/get_all_report", {
          withCredentials: true,
        });
        console.log(response)

        const sortedReports = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setReports(sortedReports);
        setFilteredReports(sortedReports);

        const userIds = [...new Set(sortedReports.map(report => report.userId).filter(id => id))];

        const userResponses = await Promise.all(
          userIds.map(id => axios.get(`http://localhost:5000/api/user/get_A_user/${id}`, { withCredentials: true }))
        );

        const userMap = {};
        userResponses.forEach((response) => {
          const user = response.data.data;
          if (user && user._id) {
            userMap[user._id] = user.firstName || "Unknown User";
          }
        });

        setUsernames(userMap);
      } catch (err) {
        setError("Failed to fetch reports");
      }
      setLoading(false);
    };

    fetchReports();
  }, []);

  // Filter reports based on selected date range
  useEffect(() => {
    if (startDate && endDate) {
      const filtered = reports.filter(report => {
        const reportDate = new Date(report.createdAt);
        return reportDate >= new Date(startDate) && reportDate <= new Date(endDate);
      });
      setFilteredReports(filtered);
    } else {
      setFilteredReports(reports);
    }
  }, [startDate, endDate, reports]);

  // Get the current reports for the page
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);

  // Handle next and previous page
  const nextPage = () => {
    if (currentPage < Math.ceil(filteredReports.length / reportsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };



  const [selectedImage, setSelectedImage] = useState(null);

  // Add this function to handle image clicks
  const handleImageClick = (imagePath) => {
    
    if (imagePath) {
      const correctedPath = `http://localhost:5000/${imagePath.replace('public/', '')}`;
      setSelectedImage(correctedPath);
    }
  };



  return (
    <div className="review-container">
      <h2>📋 Review Reports</h2>

      {/* Date Filter Section */}
      <div className="date_filter">
        <label>Start Date:</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />

        <label>End Date:</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>

      {/* Add image modal */}
      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <div className="modal-content">
            <img src={selectedImage} alt="Uploaded proof" />
          </div>
        </div>
      )}


      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <div className="report-table-container">
        <table className="report-table">
          <thead>
            <tr>
              <th>Database Name</th>
              <th>IP Address</th>
              <th>Database Type</th>
              <th>Incident</th>
              <th>Synchronization</th>
              <th>Backup Completed</th>
              <th>Resource Availability</th>
              <th>Remarks</th>
              <th>Submitted By</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {currentReports.length > 0 ? (
              currentReports.map((report) => (
                <tr key={report._id}>
                  <td>{report.databaseName}</td>
                  <td>{report.ipAddress}</td>
                  <td>{report.databaseType}</td>
                  <td>{report.anyIncident}</td>
                  <td>
                    {report.synchronizationFile ? (
                      <button 
                        className="proof-button"
                        onClick={() => handleImageClick(report.synchronizationFile)}
                      >
                        {report.synchronization}
                      </button>
                    ) : (
                      report.synchronization
                    )}
                  </td>
                  <td>
                    {report.backupFile ? (
                      <button 
                        className="proof-button"
                        onClick={() => handleImageClick(report.backupFile)}
                      >
                        {report.backupCompleted}
                      </button>
                    ) : (
                      report.backupCompleted
                    )}
                  </td>
                  <td>
                    {report.resourceFile ? (
                      <button 
                        className="proof-button"
                        onClick={() => handleImageClick(report.resourceFile)}
                      >
                        {report.resourceAvailability}
                      </button>
                    ) : (
                      report.resourceAvailability
                    )}
                  </td>
                  <td>{report.remark}</td>
                  <td>{usernames[report?.userId] || "Unknown User"}</td>
                  <td>{new Date(report.createdAt).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10">No reports available.</td>
              </tr>
            )}

          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>⬅ Previous</button>
        <span> Page {currentPage} of {Math.ceil(filteredReports.length / reportsPerPage)} </span>
        <button onClick={nextPage} disabled={currentPage === Math.ceil(filteredReports.length / reportsPerPage)}>Next ➡</button>
      </div>
      
    </div>
  );
};

export default ReportReview;
