import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import "./HistoryComponent.css";

const HistoryComponent = () => {
  const userId = useSelector((state) => state.user.user.data._id);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingReport, setEditingReport] = useState(null);
  const [updatedFields, setUpdatedFields] = useState({});
  const [synchronizationFile, setSynchronizationFile] = useState(null);
  const [backupFile, setBackupFile] = useState(null);
  const [resourceFile, setResourceFile] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/report/get_A_report/${userId}`,
          { withCredentials: true }
        );

        // Sort by createdAt in descending order (latest first)
        const sortedHistory = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setHistory(sortedHistory);
      } catch (err) {
        setError("Failed to fetch history");
      }
      setLoading(false);
    };

    fetchHistory();
  }, [userId]);

  const handleEditClick = (report) => {
    setEditingReport(report);
    setUpdatedFields({
      databaseName: report.databaseName,
      ipAddress: report.ipAddress,
      databaseType: report.databaseType,
      anyIncident: report.anyIncident,
      remark: report.remark,
      synchronization: report.synchronization,
      backupCompleted: report.backupCompleted,
    });
  };

  const handleCancelClick = () => {
    setEditingReport(null);
  };

  const handleChange = (e, field) => {
    setUpdatedFields({ ...updatedFields, [field]: e.target.value });
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (fileType === "synchronizationFile") setSynchronizationFile(file);
    if (fileType === "backupFile") setBackupFile(file);
    if (fileType === "resourceFile") setResourceFile(file);
  };

  const handleSubmitClick = async () => {
    if (!editingReport) return;

    try {
      const formData = new FormData();
      formData.append("reportId", editingReport._id);
      formData.append("anyIncident", updatedFields.anyIncident);
      formData.append("synchronization", updatedFields.synchronization);
      formData.append("backupCompleted", updatedFields.backupCompleted);
      formData.append("remark", updatedFields.remark);

      if (synchronizationFile) formData.append("synchronizationFile", synchronizationFile);
      if (backupFile) formData.append("backupFile", backupFile);
      if (resourceFile) formData.append("resourceFile", resourceFile);

      await axios.patch(
        `http://localhost:5000/api/report/update_report/${userId}`,
        formData,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );

      setHistory(history.map(report =>
        report._id === editingReport._id ? { ...report, ...updatedFields } : report
      ));
      setEditingReport(null);
    } catch (error) {
      alert("❌ Failed to update report");
    }
  };

  return (
    <div className="history-container">
      <h2>📜 Report History</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <div className="history-list">
        {history.length > 0 ? (
          history.map((report) => (
            <div key={report._id} className="history-item">
              <p><strong>Database Name:</strong> {report.databaseName}</p>
              <p><strong>IP Address:</strong> {report.ipAddress}</p>
              <p><strong>Database Type:</strong> {report.databaseType}</p>
              <p><strong>Incident:</strong> {report.anyIncident}</p>
              <p><strong>Remarks:</strong> {report.remark}</p>
              <p><strong>Synchronization:</strong> {report.synchronization}</p>
              <p><strong>Backup Completed:</strong> {report.backupCompleted}</p>
              <p><strong>Date:</strong> {new Date(report.createdAt).toLocaleString()}</p>

              <button className="edit-btn" onClick={() => handleEditClick(report)}>Edit</button>
            </div>
          ))
        ) : (
          <p>No past reports found.</p>
        )}
      </div>

      {/* Edit Form Modal */}
      {editingReport && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Report</h3>

            <label>Database Name: <input type="text" value={updatedFields.databaseName} onChange={(e) => handleChange(e, "databaseName")} /></label>
            <label>IP Address: <input type="text" value={updatedFields.ipAddress} onChange={(e) => handleChange(e, "ipAddress")} /></label>
            <label>Database Type: <input type="text" value={updatedFields.databaseType} onChange={(e) => handleChange(e, "databaseType")} /></label>
            <label>Incident: <textarea value={updatedFields.anyIncident} onChange={(e) => handleChange(e, "anyIncident")} /></label>
            <label>Synchronization: <input type="text" value={updatedFields.synchronization} onChange={(e) => handleChange(e, "synchronization")} /></label>
            <label>Backup Completed: <input type="text" value={updatedFields.backupCompleted} onChange={(e) => handleChange(e, "backupCompleted")} /></label>
            <label>Remarks: <textarea value={updatedFields.remark} onChange={(e) => handleChange(e, "remark")} /></label>

            <label>Synchronization File: <input type="file" onChange={(e) => handleFileChange(e, "synchronizationFile")} /></label>
            <label>Backup File: <input type="file" onChange={(e) => handleFileChange(e, "backupFile")} /></label>
            <label>Resource File: <input type="file" onChange={(e) => handleFileChange(e, "resourceFile")} /></label>

            <div className="button-group">
              <button className="submit-btn" onClick={handleSubmitClick}>Submit</button>
              <button className="cancel-btn" onClick={handleCancelClick}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryComponent;
