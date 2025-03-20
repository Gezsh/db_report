import React, { useEffect, useState } from "react";
import "./Databases.css";
import axios from "axios";

const Databases = () => {
  const [databases, setDatabases] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedDatabase, setSelectedDatabase] = useState(null);
  const [formData, setFormData] = useState({
    databaseName: "",
    ipAddress: "",
    databaseType: "",
    osVersion: "",
    dbVersion: "",
  });

  // Fetch all databases
  useEffect(() => {
    fetchDatabases();
  }, []);

  const fetchDatabases = async () => {
    try {
      const response = await axios.get("https://db-report-backend.onrender.com/api/db/get_all_db", {
        withCredentials: true,
      });
      setDatabases(response.data);
    } catch (error) {
      console.error("Error fetching databases:", error);
    }
  };

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Open Create Modal
  const openCreateModal = () => {
    setFormData({
      databaseName: "",
      ipAddress: "",
      databaseType: "",
      osVersion: "",
      dbVersion: "",
    });
    setIsCreateModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (db) => {
    setSelectedDatabase(db._id);
    setFormData(db);
    setIsEditModalOpen(true);
  };

  // Open Delete Confirmation
  const openDeleteConfirm = (db) => {
    setSelectedDatabase(db._id);
    setIsDeleteConfirmOpen(true);
  };

  // Create Database
  const handleCreate = async () => {
    try {
      await axios.post("https://db-report-backend.onrender.com/api/db/create_db", formData, {
        withCredentials: true,
      });
      setIsCreateModalOpen(false);
      fetchDatabases();
    } catch (error) {
      console.error("Error creating database:", error);
    }
  };

  // Update Database
  const handleUpdate = async () => {
    try {
      await axios.patch(`https://db-report-backend.onrender.com/api/db/update_db/${selectedDatabase}`, formData, {
        withCredentials: true,
      });
      setIsEditModalOpen(false);
      fetchDatabases();
    } catch (error) {
      console.error("Error updating database:", error);
    }
  };

  // Delete Database
  const handleDelete = async () => {
    try {
      await axios.delete(`https://db-report-backend.onrender.com/api/db/delete_db/${selectedDatabase}`, {
        withCredentials: true,
      });
      setIsDeleteConfirmOpen(false);
      fetchDatabases();
    } catch (error) {
      console.error("Error deleting database:", error);
    }
  };

  return (
    <div className="databases-page">
      <div className="databases-container">
        <h2>Databases</h2>
        <button className="create-db-btn" onClick={openCreateModal}>➕ Create Database</button>
        <table className="databases-table">
          <thead>
            <tr>
              <th>Database Name</th>
              <th>IP Address</th>
              <th>Type</th>
              <th>OS Version</th>
              <th>DB Version</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {databases.map((db) => (
              <tr key={db._id}>
                <td>{db.databaseName}</td>
                <td>{db.ipAddress}</td>
                <td>{db.databaseType}</td>
                <td>{db.osVersion}</td>
                <td>{db.dbVersion}</td>
                <td className="action-buttons">
                  <button className="edit-btn" onClick={() => openEditModal(db)}>✏️ Edit</button>
                  <button className="delete-btn" onClick={() => openDeleteConfirm(db)}>🗑️ Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Create Database</h3>
            <label>Database Name</label>
            <input type="text" name="databaseName" value={formData.databaseName} onChange={handleChange} />
            <label>IP Address</label>
            <input type="text" name="ipAddress" value={formData.ipAddress} onChange={handleChange} />
            <label>Database Type</label>
            <input type="text" name="databaseType" value={formData.databaseType} onChange={handleChange} />
            <label>OS Version</label>
            <input type="text" name="osVersion" value={formData.osVersion} onChange={handleChange} />
            <label>DB Version</label>
            <input type="text" name="dbVersion" value={formData.dbVersion} onChange={handleChange} />
            <div className="modal-buttons">
              <button className="submit-btn" onClick={handleCreate}>✅ Submit</button>
              <button className="cancel-btn" onClick={() => setIsCreateModalOpen(false)}>❌ Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Database</h3>
            <label>Database Name</label>
            <input type="text" name="databaseName" value={formData.databaseName} onChange={handleChange} />
            <label>IP Address</label>
            <input type="text" name="ipAddress" value={formData.ipAddress} onChange={handleChange} />
            <label>Database Type</label>
            <input type="text" name="databaseType" value={formData.databaseType} onChange={handleChange} />
            <label>OS Version</label>
            <input type="text" name="osVersion" value={formData.osVersion} onChange={handleChange} />
            <label>DB Version</label>
            <input type="text" name="dbVersion" value={formData.dbVersion} onChange={handleChange} />
            <div className="modal-buttons">
              <button className="submit-btn" onClick={handleUpdate}>✅ Update</button>
              <button className="cancel-btn" onClick={() => setIsEditModalOpen(false)}>❌ Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {isDeleteConfirmOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Are you sure you want to delete?</h3>
            <div className="modal-buttons">
              <button className="submit-btn" onClick={handleDelete}>✅ YES</button>
              <button className="cancel-btn" onClick={() => setIsDeleteConfirmOpen(false)}>❌ NO</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Databases;
