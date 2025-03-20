import express from 'express'
import Report from '../model/report_model.js'


// const addNewReport = async (req, res) => {
//   try {
//     if (!req.body) {
//       return res.status(400).json({ message: "There is no data to be added" });
//     }

//     const userId = req.user?.userID; // Get user ID from authentication middleware

//     if (!userId) {
//       return res.status(401).json({ message: "Unauthorized: User ID is required" });
//     }

//     const rep = await Report.create({ ...req.body, userId });

//     res.status(201).json(rep);
//   } catch (error) {
//     console.error("Error adding report:", error);
//     res.status(500).json({ message: "Something went wrong", error });
//   }
// };

const addNewReport = async (req, res) => {
    try {
      if (!req.body) {
        return res.status(400).json({ message: "There is no data to be added" });
      }
  
      const userId = req.user?.userID; // Get user ID from authentication middleware
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized: User ID is required" });
      }
  
      let filePath = "";
      if (req.file) {
        filePath = req.file.path; // Store the file path
      }
  
      const reportData = {
        ...req.body,
        userId,
        synchronizationFile: req.files?.synchronizationFile?.[0]?.path.replace(/public[/\\]/, ''),
        backupFile: req.files?.backupFile?.[0]?.path.replace(/public[/\\]/, ''),
        resourceFile: req.files?.resourceFile?.[0]?.path.replace(/public[/\\]/, '')
    };
  
      const rep = await Report.create(reportData);
    console.log(rep)
      res.status(201).json(rep);
    } catch (error) {
      console.error("Error adding report:", error);
      res.status(500).json({ message: "Something went wrong", error });
    }
  };
  

// const updateReport= async (req,res)=>{
//     const { id } = req.params;
//     console.log(id)
//     const rep = await Report.findByIdAndUpdate(id, { ...req.body }, { new: true });
//     res.status(200).json(rep);
// }

const updateReport = async (req, res) => {
  try {
      const { id } = req.params; // Extract user ID from URL
      const { reportId, updatedFields = {} } = req.body; // Ensure updatedFields is an object

      console.log(id, reportId);
      if (!reportId) {
          return res.status(400).json({ message: "Report ID is required" });
      }

      if (!id) {
          return res.status(401).json({ message: "Unauthorized: User ID is required" });
      }

      // Find the report
      const report = await Report.findOne({ _id: reportId });

      if (!report) {
          return res.status(404).json({ message: "Report not found" });
      }

      console.log("Existing Report:", report);
      console.log("Received Files:", req.files);

      // Ensure updatedFields is an object before modifying
      if (req.files?.synchronizationFile) {
          updatedFields.synchronizationFile = req.files.synchronizationFile[0].path.replace(/public[/\\]/, '');
      }
      if (req.files?.backupFile) {
          updatedFields.backupFile = req.files.backupFile[0].path.replace(/public[/\\]/, '');
      }
      if (req.files?.resourceFile) {
          updatedFields.resourceFile = req.files.resourceFile[0].path.replace(/public[/\\]/, '');
      }

      // Merge updatedFields into the existing report
      Object.assign(report, updatedFields);
      await report.save();

      res.status(200).json({ message: "Report updated successfully", report });
  } catch (error) {
      console.error("Error updating report:", error);
      res.status(500).json({ message: "Server error", error });
  }
};


  

// const getAReport =async (req,res)=>{
//     const {id} =req.params;
//     console.log(id)
//     const aReport= await Report.findById({userId : id});
//     console.log(aReport)
//     res.status(200).json(aReport)
// }

const getAReport = async (req, res) => {
    try {
      const { id } = req.params; // This is the user's ID
      console.log("User ID:", id);
  
      // Ensure the ID is a valid ObjectId
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: "Invalid User ID format." });
      }
  
      // Find all reports where `userId` matches `id`
      const reports = await Report.find({ userId: id });
  
      if (!reports.length) {
        return res.status(404).json({ message: "No reports found for this user." });
      }
  
      res.status(200).json(reports);
    } catch (error) {
      console.error("Error fetching reports:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  

const getAllReport =async (req,res)=>{
    const allReport=await Report.find({})
    res.status(200).json(allReport)
}


export {addNewReport,updateReport,getAReport,getAllReport}