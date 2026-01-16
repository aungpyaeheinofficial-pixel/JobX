import React, { useState } from 'react';
import { ArrowLeft, Zap } from 'lucide-react';
import { ToastProvider, useToast } from './ToastNotification.jsx';
import Alert, { InlineAlert, BannerAlert } from './Alert.jsx';
import { FormInput, FormTextarea, FormSelect, useFormValidation, validators } from './FormValidation.jsx';
import ConfirmationModal, { DeleteConfirmationModal, LogoutConfirmationModal } from './ConfirmationModal.jsx';
import {
  LinearProgress,
  CircularProgress,
  StepProgress,
  DotsProgress,
  Spinner,
  LoadingOverlay,
  Skeleton,
} from './ProgressIndicator.jsx';
import { AnimatePresence } from 'framer-motion';

const FeedbackShowcaseContent = () => {
  const toast = useToast();
  const [showAlert, setShowAlert] = useState(true);
  const [showBanner, setShowBanner] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [linearProgress, setLinearProgress] = useState(45);
  const [circularProgress, setCircularProgress] = useState(65);
  const [currentStep, setCurrentStep] = useState(1);
  const [currentDot, setCurrentDot] = useState(0);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);

  const { values, errors, touched, handleChange, handleBlur, validateAll } = useFormValidation(
    {
      name: '',
      email: '',
      phone: '',
      message: '',
      category: '',
    },
    {
      name: [validators.required, validators.minLength(2)],
      email: [validators.required, validators.email],
      phone: validators.phoneNumber,
      message: [validators.required, validators.minLength(10), validators.maxLength(500)],
      category: validators.required,
    }
  );

  const steps = [
    { label: 'Personal Info', description: 'Basic details' },
    { label: 'Contact', description: 'How to reach you' },
    { label: 'Review', description: 'Confirm details' },
    { label: 'Complete', description: 'All done!' },
  ];

  const categoryOptions = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'support', label: 'Support' },
    { value: 'feedback', label: 'Feedback' },
    { value: 'bug', label: 'Bug Report' },
  ];

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (validateAll()) {
      toast.success('Form submitted successfully!');
    } else {
      toast.error('Please fix the errors in the form');
    }
  };

  const handleDeleteConfirm = () => {
    setIsModalLoading(true);
    setTimeout(() => {
      setIsModalLoading(false);
      setShowDeleteModal(false);
      toast.success('Item deleted successfully');
    }, 1500);
  };

  const handleLogoutConfirm = () => {
    setIsModalLoading(true);
    setTimeout(() => {
      setIsModalLoading(false);
      setShowLogoutModal(false);
      toast.info('You have been logged out');
    }, 1500);
  };

  const handleCustomModalConfirm = () => {
    setIsModalLoading(true);
    setTimeout(() => {
      setIsModalLoading(false);
      setShowCustomModal(false);
      toast.success('Action completed');
    }, 1500);
  };

  const simulateLoading = () => {
    setShowLoadingOverlay(true);
    setTimeout(() => {
      setShowLoadingOverlay(false);
      toast.success('Loading completed!');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.history.back()}
                className="hover:bg-gray-100 rounded-full p-2 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold">Feedback & Interactions Showcase</h1>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-violet-50 rounded-full">
              <Zap className="w-4 h-4 text-violet-600" />
              <span className="text-sm font-medium text-violet-700">All Components</span>
            </div>
          </div>
        </div>
      </header>

      {/* Banner Alert */}
      <AnimatePresence>
        {showBanner && (
          <BannerAlert
            type="info"
            message="New features available! Check out our updated feedback components."
            onClose={() => setShowBanner(false)}
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="space-y-12">
          {/* Toast Notifications Section */}
          <section>
            <h2 className="text-3xl font-bold mb-2">Toast Notifications</h2>
            <p className="text-gray-600 mb-6">
              Click the buttons to trigger different toast notifications
            </p>
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => toast.success('This is a success message!')}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
                >
                  Success
                </button>
                <button
                  onClick={() => toast.error('This is an error message!')}
                  className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
                >
                  Error
                </button>
                <button
                  onClick={() => toast.warning('This is a warning message!')}
                  className="px-6 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors font-medium"
                >
                  Warning
                </button>
                <button
                  onClick={() => toast.info('This is an info message!')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                >
                  Info
                </button>
              </div>
            </div>
          </section>

          {/* Alert Components Section */}
          <section>
            <h2 className="text-3xl font-bold mb-2">Alert Components</h2>
            <p className="text-gray-600 mb-6">Static alerts for displaying important information</p>
            <div className="space-y-4">
              <AnimatePresence>
                {showAlert && (
                  <Alert
                    type="success"
                    title="Payment Successful"
                    message="Your payment has been processed successfully. You will receive a confirmation email shortly."
                    onClose={() => setShowAlert(false)}
                  />
                )}
              </AnimatePresence>
              <Alert
                type="error"
                title="Error Occurred"
                message="Something went wrong while processing your request. Please try again."
                closable={false}
              />
              <Alert
                type="warning"
                title="Action Required"
                message="Your profile is incomplete. Complete your profile to unlock all features."
                action={true}
                actionLabel="Complete Profile"
                onAction={() => toast.info('Redirecting to profile...')}
              />
              <Alert
                type="info"
                title="New Update Available"
                message="A new version of the app is available. Update now to get the latest features."
                closable={false}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InlineAlert type="success" message="Changes saved successfully" />
                <InlineAlert type="error" message="Failed to upload file" />
                <InlineAlert type="warning" message="Storage limit reached" />
                <InlineAlert type="info" message="Maintenance scheduled for tonight" />
              </div>
            </div>
          </section>

          {/* Form Validation Section */}
          <section>
            <h2 className="text-3xl font-bold mb-2">Form Validation</h2>
            <p className="text-gray-600 mb-6">
              Form inputs with inline validation and error messages
            </p>
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Full Name"
                    name="name"
                    placeholder="Enter your full name"
                    value={values.name}
                    error={errors.name}
                    touched={touched.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    showSuccess
                  />
                  <FormInput
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={values.email}
                    error={errors.email}
                    touched={touched.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    showSuccess
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Phone Number"
                    name="phone"
                    placeholder="09XXXXXXXXX"
                    value={values.phone}
                    error={errors.phone}
                    touched={touched.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText="Enter your Myanmar phone number"
                  />
                  <FormSelect
                    label="Category"
                    name="category"
                    value={values.category}
                    error={errors.category}
                    touched={touched.category}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    options={categoryOptions}
                    required
                  />
                </div>

                <FormTextarea
                  label="Message"
                  name="message"
                  placeholder="Tell us what you think..."
                  value={values.message}
                  error={errors.message}
                  touched={touched.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={5}
                  maxLength={500}
                  required
                />

                <button
                  type="submit"
                  className="px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-all font-semibold"
                >
                  Submit Form
                </button>
              </form>
            </div>
          </section>

          {/* Confirmation Modals Section */}
          <section>
            <h2 className="text-3xl font-bold mb-2">Confirmation Modals</h2>
            <p className="text-gray-600 mb-6">
              Modals for confirming critical actions like delete or logout
            </p>
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
                >
                  Delete Item
                </button>
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="px-6 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors font-medium"
                >
                  Logout
                </button>
                <button
                  onClick={() => setShowCustomModal(true)}
                  className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
                >
                  Custom Modal
                </button>
              </div>
            </div>
          </section>

          {/* Progress Indicators Section */}
          <section>
            <h2 className="text-3xl font-bold mb-2">Progress Indicators</h2>
            <p className="text-gray-600 mb-6">
              Various progress indicators for different use cases
            </p>
            <div className="space-y-8">
              {/* Linear Progress */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <h3 className="text-xl font-bold mb-4">Linear Progress</h3>
                <LinearProgress progress={linearProgress} />
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => setLinearProgress(Math.max(0, linearProgress - 10))}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    -10%
                  </button>
                  <button
                    onClick={() => setLinearProgress(Math.min(100, linearProgress + 10))}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                  >
                    +10%
                  </button>
                </div>
              </div>

              {/* Circular Progress */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <h3 className="text-xl font-bold mb-6">Circular Progress</h3>
                <div className="flex justify-center">
                  <CircularProgress progress={circularProgress} />
                </div>
                <div className="flex gap-4 mt-6 justify-center">
                  <button
                    onClick={() => setCircularProgress(Math.max(0, circularProgress - 10))}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    -10%
                  </button>
                  <button
                    onClick={() => setCircularProgress(Math.min(100, circularProgress + 10))}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                  >
                    +10%
                  </button>
                </div>
              </div>

              {/* Step Progress */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <h3 className="text-xl font-bold mb-6">Multi-Step Progress</h3>
                <StepProgress steps={steps} currentStep={currentStep} onStepClick={setCurrentStep} />
                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                    className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                    disabled={currentStep === steps.length - 1}
                    className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>

              {/* Dots Progress */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <h3 className="text-xl font-bold mb-6">Dots Progress</h3>
                <DotsProgress total={5} current={currentDot} onDotClick={setCurrentDot} />
                <div className="flex gap-4 mt-6 justify-center">
                  <button
                    onClick={() => setCurrentDot(Math.max(0, currentDot - 1))}
                    disabled={currentDot === 0}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentDot(Math.min(4, currentDot + 1))}
                    disabled={currentDot === 4}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>

              {/* Spinners and Skeletons */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <h3 className="text-xl font-bold mb-6">Spinners & Skeletons</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold mb-3">Spinners</h4>
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col items-center gap-2">
                        <Spinner size="sm" />
                        <span className="text-xs text-gray-500">Small</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <Spinner size="md" />
                        <span className="text-xs text-gray-500">Medium</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <Spinner size="lg" />
                        <span className="text-xs text-gray-500">Large</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <Spinner size="xl" />
                        <span className="text-xs text-gray-500">Extra Large</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-3">Skeleton Loaders</h4>
                    <div className="space-y-3">
                      <Skeleton height="40px" />
                      <Skeleton width="80%" height="20px" />
                      <Skeleton width="60%" height="20px" />
                    </div>
                  </div>

                  <button
                    onClick={simulateLoading}
                    className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
                  >
                    Show Loading Overlay
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Modals */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        itemName="Project Alpha"
        isLoading={isModalLoading}
      />

      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
        isLoading={isModalLoading}
      />

      <ConfirmationModal
        isOpen={showCustomModal}
        onClose={() => setShowCustomModal(false)}
        onConfirm={handleCustomModalConfirm}
        title="Confirm Action"
        message="Are you sure you want to proceed with this action? This will update your settings."
        confirmText="Yes, Continue"
        cancelText="Cancel"
        variant="default"
        isLoading={isModalLoading}
      />

      <LoadingOverlay show={showLoadingOverlay} message="Processing your request..." />
    </div>
  );
};

const FeedbackShowcase = () => {
  return (
    <ToastProvider>
      <FeedbackShowcaseContent />
    </ToastProvider>
  );
};

export default FeedbackShowcase;
