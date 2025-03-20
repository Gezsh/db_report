import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { submitReportStart, submitReportSuccess, submitReportFailure } from "../../redux/features/report";
import "./ReportForm.css";

const ReportForm = () => {
  const dispatch = useDispatch();
  const id = useSelector((state) => state.user.user.data._id);
  
  const initialFormData = {
    databaseName: "",
    ipAddress: "",
    databaseType: "",
    osVersion: "",
    dbVersion: "",
    synchronization: "Yes",
    backupCompleted: "Yes",
    resourceAvailability: "Yes",
    anyIncident: "",
    remark: "",
  };
  
  const [formData, setFormData] = useState(initialFormData);
  const [databases, setDatabases] = useState([]);
  const [synchronizationFile, setSynchronizationFile] = useState(null);
  const [backupFile, setBackupFile] = useState(null);
  const [resourceFile, setResourceFile] = useState(null);

  // Fetch databases from backend
  useEffect(() => {
    const fetchDatabases = async () => {
      try {
        const response = await axios.get(`https://db-report-backend.onrender.com/api/db/get_all_db`,
         
        );
       
        setDatabases(response.data);
      } catch (error) {
        console.error("Error fetching databases:", error);
      }
    };
    fetchDatabases();
  }, []);

  // Handle database selection and auto-fill related fields
  const handleDatabaseChange = (e) => {
    const selectedDb = databases.find(db => db.databaseName === e.target.value);
    setFormData({
      ...formData,
      databaseName: selectedDb?.databaseName || "",
      ipAddress: selectedDb?.ipAddress || "",
      databaseType: selectedDb?.databaseType || "",
      osVersion: selectedDb?.osVersion || "",
      dbVersion: selectedDb?.dbVersion || "",
    });
  };

  // Handle other input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(submitReportStart());

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    if (synchronizationFile) formDataToSend.append('synchronizationFile', synchronizationFile);
    if (backupFile) formDataToSend.append('backupFile', backupFile);
    if (resourceFile) formDataToSend.append('resourceFile', resourceFile);

    try {
      const response = await axios.post(
        `https://db-report-backend.onrender.com/api/report/add_report/${id}`,
        formDataToSend,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      dispatch(submitReportSuccess(response.data));
      alert("✅ Report submitted successfully!");

      setFormData(initialFormData);
    } catch (error) {
      dispatch(submitReportFailure(error.response?.data || "Failed to submit report"));
      alert("❌ Error submitting report: " + (error.response?.data || error.message));
    }
  };

  return (
    <div className="report-form-container">
      <h2>Submit Your Report</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          {/* Dropdown for selecting database */}
          <select name="databaseName" value={formData.databaseName} onChange={handleDatabaseChange} required>
            <option value="">Select Database</option>
            {databases.map((db) => (
              <option key={db._id} value={db.databaseName}>{db.databaseName}</option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <input type="text" name="ipAddress" placeholder="IP Address" value={formData.ipAddress} onChange={handleChange} required />
          <input type="text" name="databaseType" placeholder="Database Type" value={formData.databaseType} onChange={handleChange} required />
        </div>

        <div className="input-group">
          <input type="text" name="osVersion" placeholder="OS Version" value={formData.osVersion} onChange={handleChange} required />
          <input type="text" name="dbVersion" placeholder="DB Version" value={formData.dbVersion} onChange={handleChange} required />
        </div>

        {/* Dropdowns for Yes/No fields with file inputs */}
        <div className="input-group">
          <label>Synchronization</label>
          <select name="synchronization" value={formData.synchronization} onChange={handleChange}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          <input type="file" onChange={(e) => setSynchronizationFile(e.target.files[0])} />
        </div>

        <div className="input-group">
          <label>Backup Completed</label>
          <select name="backupCompleted" value={formData.backupCompleted} onChange={handleChange}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          <input type="file" onChange={(e) => setBackupFile(e.target.files[0])} />
        </div>

        <div className="input-group">
          <label>Resource Availability</label>
          <select name="resourceAvailability" value={formData.resourceAvailability} onChange={handleChange}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          <input type="file" onChange={(e) => setResourceFile(e.target.files[0])} />
        </div>

        <div className="input-group">
          <input type="text" name="anyIncident" placeholder="Any Incident" value={formData.anyIncident} onChange={handleChange} required />
        </div>

        <div className="input-group">
          <textarea name="remark" placeholder="Remarks (optional)" value={formData.remark} onChange={handleChange}></textarea>
        </div>

        <button type="submit">🚀 Submit Report</button>
      </form>
    </div>
  );
};

export default ReportForm;
