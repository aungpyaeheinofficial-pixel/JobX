import React, { useState, useRef } from 'react';
import { X, Upload, FileText, Check, AlertCircle } from 'lucide-react';

const ApplicationModal = ({ job, isOpen, onClose, onSubmit, userData }) => {
  const [formData, setFormData] = useState({
    fullName: userData?.name || '',
    email: userData?.email || '',
    phone: '',
    coverLetter: '',
    portfolio: '',
    yearsExperience: '',
    expectedSalary: '',
    availableFrom: '',
  });

  const [resume, setResume] = useState(null);
  const [resumeError, setResumeError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  const handleFile = (file) => {
    if (!file) return;

    setResumeError('');

    // Check file type (PDF, DOC, DOCX)
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!validTypes.includes(file.type)) {
      setResumeError('Please upload a PDF or Word document');
      return;
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setResumeError('File size must be less than 5MB');
      return;
    }

    setResume(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resume) {
      setResumeError('Please upload your resume');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const application = {
        id: Date.now(),
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        applicantData: formData,
        resume: {
          name: resume.name,
          size: resume.size,
          type: resume.type,
        },
        status: 'pending',
        appliedAt: new Date().toISOString(),
      };

      onSubmit(application);
      setSubmitSuccess(true);
      setIsSubmitting(false);

      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
        setSubmitSuccess(false);
        // Reset form
        setFormData({
          fullName: userData?.name || '',
          email: userData?.email || '',
          phone: '',
          coverLetter: '',
          portfolio: '',
          yearsExperience: '',
          expectedSalary: '',
          availableFrom: '',
        });
        setResume(null);
      }, 2000);
    }, 1500);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (submitSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center animate-in">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
          <p className="text-gray-600">
            Your application has been sent to {job.company}. You'll be notified when they review it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full my-8 animate-in">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">Apply for {job.title}</h2>
            <p className="text-gray-600">{job.company}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-violet-500 transition-colors"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-violet-500 transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-violet-500 transition-colors"
                  placeholder="09xxxxxxxxx"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience *
                </label>
                <input
                  type="number"
                  name="yearsExperience"
                  value={formData.yearsExperience}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-violet-500 transition-colors"
                  placeholder="3"
                />
              </div>
            </div>
          </div>

          {/* Resume Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resume/CV *
            </label>
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                resume
                  ? 'border-green-300 bg-green-50'
                  : resumeError
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 hover:border-violet-400 hover:bg-violet-50/30'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileSelect}
                className="hidden"
              />
              {resume ? (
                <div className="flex items-center justify-center gap-3">
                  <FileText className="w-8 h-8 text-green-600" />
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">{resume.name}</div>
                    <div className="text-sm text-gray-500">
                      {(resume.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setResume(null);
                    }}
                    className="p-2 hover:bg-white rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PDF, DOC, or DOCX (max 5MB)</p>
                </>
              )}
            </div>
            {resumeError && (
              <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                {resumeError}
              </div>
            )}
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Salary
              </label>
              <input
                type="text"
                name="expectedSalary"
                value={formData.expectedSalary}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-violet-500 transition-colors"
                placeholder="e.g., 1M - 1.5M MMK"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available From
              </label>
              <input
                type="date"
                name="availableFrom"
                value={formData.availableFrom}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-violet-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Portfolio/LinkedIn (Optional)
            </label>
            <input
              type="url"
              name="portfolio"
              value={formData.portfolio}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-violet-500 transition-colors"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Letter *
            </label>
            <textarea
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-violet-500 transition-colors resize-none"
              placeholder="Tell us why you're a great fit for this role..."
            />
            <p className="mt-2 text-xs text-gray-500">
              {formData.coverLetter.length} / 1000 characters
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !resume}
              className="flex-1 px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationModal;
