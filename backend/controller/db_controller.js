import DbModel from "../model/db_list_model.js"; 


 const createDatabase = async (req, res) => {
  try {
    const { databaseName, ipAddress, databaseType, osVersion, dbVersion } = req.body;

    if (!databaseName || !ipAddress || !databaseType || !osVersion || !dbVersion) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newDb = await DbModel.create(req.body);
    res.status(201).json(newDb);
  } catch (error) {
    console.error("Error creating database:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


 const getDatabaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const dbEntry = await DbModel.findById(id);

    if (!dbEntry) {
      return res.status(404).json({ message: "Database not found" });
    }

    res.status(200).json(dbEntry);
  } catch (error) {
    console.error("Error fetching database:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


 const getAllDatabases = async (req, res) => {
  try {
    const dbEntries = await DbModel.find();
    res.status(200).json(dbEntries);
  } catch (error) {
    console.error("Error fetching databases:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


 const updateDatabase = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedDb = await DbModel.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedDb) {
      return res.status(404).json({ message: "Database not found" });
    }

    res.status(200).json({ message: "Database updated successfully", updatedDb });
  } catch (error) {
    console.error("Error updating database:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete a database entry
 const deleteDatabase = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDb = await DbModel.findByIdAndDelete(id);

    if (!deletedDb) {
      return res.status(404).json({ message: "Database not found" });
    }

    res.status(200).json({ message: "Database deleted successfully" });
  } catch (error) {
    console.error("Error deleting database:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


export {deleteDatabase,updateDatabase,getAllDatabases,getDatabaseById,createDatabase}