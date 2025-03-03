const DocumentService = require("../services/documentService");
const StudentService = require("../services/studentService");
const fs = require("fs");
const path = require("path");
const asyncHandler = require("../utils/asyncHandler");

class DocumentController {
  // async uploadDocument(req, res) {
  //   try {
  //     console.log("File received:", req.file);

  //     if (!req.file) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "No file uploaded",
  //       });
  //     }
  //     // Get student ID from associated StudentDetails
  //     const userId = req.user.id;

  //     // Find the student
  //     const student = await StudentService.findStudentByUserId(userId);
  //     if (!student) {
  //       return errorResponse(res, "Student not found.", 404);
  //     }
  //     console.log("Student found in upload:", student);
  //     if (!req.file) {
  //       return res.status(400).json({ error: "No file uploaded" });
  //     }
  //     console.log("Uploading document for student:", req.file);
  //     const document = await DocumentService.createDocument(
  //       student, // Use studentDetails ID
  //       req.file
  //     );
  //     res.json({
  //       success: true,
  //       message: "File uploaded successfully",
  //       file: req.file,
  //     });
  //     res.status(201).json(document);
  //   } catch (error) {
  //     res.status(500).json({ error: "Upload failed", details: error.message });
  //   }
  // }
  async uploadDocument(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Get student through service
      const student = await StudentService.findStudentByUserId(req.user.id);

      if (!student) {
        return res.status(404).json({ error: "Student profile not found" });
      }

      const document = await DocumentService.createDocument(
        student.id, // Pass studentDetails ID
        req.file
      );

      res.status(201).json(document);
    } catch (error) {
      res.status(500).json({
        error: "Upload failed",
        details: error.message,
      });
    }
  }
  async getDocuments(req, res) {
    try {
      // Get authenticated user's student details
      const student = await StudentService.findStudentByUserId(req.user.id);

      if (!student) {
        return res.status(404).json({ error: "Student profile not found" });
      }

      // Fetch documents using student ID
      const documents = await DocumentService.getDocuments(student.id);
      res.json(documents);
    } catch (error) {
      res.status(500).json({
        error: "Failed to fetch documents",
        details: error.message,
      });
    }
  }

  // async downloadDocument(req, res) {
  //   try {
  //     console.log("Download request for document:", req.params.documentId);

  //     const document = await DocumentService.getDocumentById(
  //       req.params.documentId
  //     );

  //     if (!document) {
  //       console.error("Document not found:", req.params.documentId);
  //       return res.status(404).json({ error: "Document not found" });
  //     }

  //     const filePath = path.join(process.cwd(), document.path);
  //     console.log("Serving file from path:", filePath);

  //     res.download(filePath, document.filename);
  //   } catch (error) {
  //     console.error("Download error:", error.message, error.stack);
  //     res.status(500).json({
  //       error: "File download failed",
  //       details: error.message,
  //     });
  //   }
  // }

  async downloadDocument(req, res) {
    try {
      console.log("Download request for document:", req.params.documentId);
      // Fetch document from database
      const document = await DocumentService.getDocumentById(
        req.params.documentId
      );

      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }

      // Construct absolute file path correctly
      const filePath = path.resolve(document.path);

      // Log after defining `filePath`
      console.log("File Path:", filePath);
      console.log("File Exists:", fs.existsSync(filePath));

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "File not found on server" });
      }

      // Set headers correctly
      res.setHeader("Content-Type", document.mimetype);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${path.basename(document.filename)}"`
      );

      // Stream the file to the client
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      console.error("Download error:", error);
      res
        .status(500)
        .json({ error: "File download failed", details: error.message });
    }
  }
  async deleteDocument(req, res) {
    try {
      console.log("Delete request for document:", req.params.documentId);

      const document = await DocumentService.deleteDocument(
        req.params.documentId
      );

      if (!document) {
        console.error(
          "Document not found for deletion:",
          req.params.documentId
        );
        return res.status(404).json({ error: "Document not found" });
      }

      console.log("Deleting physical file:", document.path);
      fs.unlinkSync(document.path);

      res.json({ message: "Document deleted successfully" });
    } catch (error) {
      console.error("Delete error:", error.message, error.stack);
      res.status(500).json({
        error: "Document deletion failed",
        details: error.message,
      });
    }
  }
  async getAllRecords(req, res, next) {
    try {
      const records = await DocumentService.getAllHealthRecords();
      console.log("All records fetched:", records);
      res.json(records);
    } catch (error) {
      next(error); // Pass the error to the error-handling middleware
    }
  }
}

const documentController = new DocumentController();

// Properly export individual methods wrapped with asyncHandler
module.exports = {
  uploadDocument: asyncHandler(
    documentController.uploadDocument.bind(documentController)
  ),
  getDocuments: asyncHandler(
    documentController.getDocuments.bind(documentController)
  ),
  downloadDocument: asyncHandler(
    documentController.downloadDocument.bind(documentController)
  ),
  deleteDocument: asyncHandler(
    documentController.deleteDocument.bind(documentController)
  ),
  getAllRecords: asyncHandler(
    documentController.getAllRecords.bind(documentController)
  ),
};
