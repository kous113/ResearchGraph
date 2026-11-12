
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Upload,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  Info,
  BrainCircuit,
  Network,
  Lightbulb,
  LoaderCircle,
} from "lucide-react";

import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import { uploadAndAnalyzePaper } from "../../services/paperService";

import "../../styles/uploadPaper.css";

function UploadPaper() {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const MAX_FILE_SIZE = 20 * 1024 * 1024;

  const handleFile = (file) => {
    setError("");

    if (!file) return;

    const isPDF =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPDF) {
      setSelectedFile(null);
      setError("Invalid file type. Please select a PDF file.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setSelectedFile(null);
      setError("File size exceeds 20 MB. Please select a smaller PDF.");
      return;
    }

    setSelectedFile(file);
  };

  const handleFileChange = (event) => {
    handleFile(event.target.files[0]);
    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    handleFile(event.dataTransfer.files[0]);
  };

  const removeFile = () => {
    if (isUploading) return;
    setSelectedFile(null);
    setError("");
  };

  const handleUpload = async () => {
    if (!selectedFile || isUploading) return;

    try {
      setIsUploading(true);
      setError("");

      const result = await uploadAndAnalyzePaper(selectedFile);

      navigate(`/papers/${result.paper.id}`, {
        state: { paper: { ...result.paper, analysis: result.analysis } },
      });
    } catch (err) {
      console.error("Paper upload error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to upload and analyse paper. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <Topbar />

      <main className="dashboard-main upload-main">
        <div className="upload-heading">
          <div>
            <h1>Upload Research Paper</h1>
            <p>
              Add a research paper to your library and explore its insights.
            </p>
          </div>

          <Link to="/papers" className="back-to-papers">
            My Papers
          </Link>
        </div>

        <section className="upload-container">
          <div className="upload-section-heading">
            <h2>Upload a PDF Document</h2>
            <p>
              Select a research paper in PDF format to get started.
            </p>
          </div>

          <div
            className={`upload-dropzone ${isDragging ? "dragging" : ""}`}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <div className="upload-cloud-icon">
              <Upload size={30} />
            </div>

            <h3>Drag and drop your PDF here</h3>
            <p>or</p>

            <button
              type="button"
              className="browse-files-btn"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
            >
              Browse Files
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              hidden
              onChange={handleFileChange}
            />

            <span className="upload-file-restrictions">
              PDF files only · Maximum file size: 20 MB
            </span>
          </div>

          {error && (
            <div className="upload-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {selectedFile && (
            <div className="selected-file-card">
              <div className="selected-file-icon">
                <FileText size={23} />
              </div>

              <div className="selected-file-info">
                <h4>{selectedFile.name}</h4>
                <p>{formatFileSize(selectedFile.size)}</p>
              </div>

              <button
                type="button"
                className="remove-file-btn"
                onClick={removeFile}
                disabled={isUploading}
                aria-label="Remove selected file"
              >
                <X size={19} />
              </button>
            </div>
          )}

          <button
            type="button"
            className="start-upload-btn"
            disabled={!selectedFile || isUploading}
            onClick={handleUpload}
          >
            {isUploading ? (
              <>
                <LoaderCircle size={18} className="upload-spinner" />
                Analysing and Saving...
              </>
            ) : (
              <>
                <Upload size={18} />
                Upload and Analyse Paper
              </>
            )}
          </button>
        </section>

        <section className="upload-info-section">
          <div className="upload-info-heading">
            <h2>What Happens After Upload?</h2>
            <p>
              ResearchGraph will analyse your paper and help you explore
              its relationships with other research.
            </p>
          </div>

          <div className="upload-process-grid">
            <div className="upload-process-card">
              <div className="process-icon process-blue">
                <FileText size={23} />
              </div>
              <h3>1. Extract Content</h3>
              <p>
                Text and relevant information are extracted from your
                research paper.
              </p>
            </div>

            <div className="upload-process-card">
              <div className="process-icon process-green">
                <BrainCircuit size={23} />
              </div>
              <h3>2. AI Analysis</h3>
              <p>
                Groq AI identifies research problems, methodologies,
                findings, and limitations.
              </p>
            </div>

            <div className="upload-process-card">
              <div className="process-icon process-purple">
                <Network size={23} />
              </div>
              <h3>3. Discover Connections</h3>
              <p>
                The system identifies relationships between your
                uploaded research papers.
              </p>
            </div>

            <div className="upload-process-card">
              <div className="process-icon process-orange">
                <Lightbulb size={23} />
              </div>
              <h3>4. Explore Insights</h3>
              <p>
                Explore comparisons and potential research gaps
                supported by paper evidence.
              </p>
            </div>
          </div>
        </section>

        <div className="upload-note">
          <Info size={18} />
          <p>
            Uploaded papers are analysed by Groq AI and saved in your
            ResearchGraph library.
          </p>
        </div>
      </main>
    </div>
  );
}

export default UploadPaper;
