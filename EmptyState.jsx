import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Briefcase, Users, FolderOpen, Search, Plus } from 'lucide-react';

/**
 * Reusable Empty State Component
 * Shows helpful messages when there's no content
 */
const EmptyState = ({
  icon: Icon = Sparkles,
  title,
  description,
  primaryAction,
  secondaryAction,
  illustration,
  variant = 'default',
}) => {
  const variants = {
    default: 'from-gray-100 to-gray-50',
    primary: 'from-blue-100 to-purple-100',
    success: 'from-green-100 to-emerald-50',
    info: 'from-blue-100 to-cyan-50',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center text-center py-16 px-6"
    >
      {/* Icon/Illustration */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        className={`w-24 h-24 mb-6 bg-gradient-to-br ${variants[variant]} rounded-full flex items-center justify-center shadow-lg`}
      >
        {illustration ? (
          <img src={illustration} alt="" className="w-16 h-16" />
        ) : (
          <Icon className="w-12 h-12 text-gray-600" strokeWidth={1.5} />
        )}
      </motion.div>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold text-gray-900 mb-3"
      >
        {title}
      </motion.h3>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-gray-600 mb-8 max-w-md leading-relaxed"
      >
        {description}
      </motion.p>

      {/* Actions */}
      {(primaryAction || secondaryAction) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap gap-3 justify-center"
        >
          {primaryAction && (
            <button
              onClick={primaryAction.onClick}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-full hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2"
            >
              {primaryAction.icon && <primaryAction.icon className="w-5 h-5" />}
              {primaryAction.label}
            </button>
          )}
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-full hover:border-gray-400 hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2"
            >
              {secondaryAction.icon && <secondaryAction.icon className="w-5 h-5" />}
              {secondaryAction.label}
            </button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

// Preset Empty States for common scenarios
export const FeedEmptyState = ({ onNavigate }) => (
  <EmptyState
    icon={Sparkles}
    title="Welcome to JobX! 👋"
    description="Your feed will light up with posts, jobs, and updates from your network. Start connecting with people to see their stories."
    variant="primary"
    primaryAction={{
      label: 'Find People',
      icon: Users,
      onClick: () => onNavigate('network'),
    }}
    secondaryAction={{
      label: 'Browse Jobs',
      icon: Briefcase,
      onClick: () => onNavigate('opportunities'),
    }}
  />
);

export const JobsEmptyState = ({ onNavigate }) => (
  <EmptyState
    icon={Search}
    title="No Jobs Found"
    description="We couldn't find any jobs matching your criteria. Try adjusting your filters or check back later for new opportunities."
    variant="info"
    primaryAction={{
      label: 'Clear Filters',
      onClick: () => window.location.reload(),
    }}
    secondaryAction={{
      label: 'Post a Job',
      icon: Plus,
      onClick: () => onNavigate('post-opportunity'),
    }}
  />
);

export const NetworkEmptyState = ({ onNavigate }) => (
  <EmptyState
    icon={Users}
    title="Build Your Network"
    description="Connect with professionals, share your work, and discover opportunities. Your network is your net worth!"
    variant="success"
    primaryAction={{
      label: 'Find People to Connect',
      icon: Search,
      onClick: () => {}, // Implement search
    }}
  />
);

export const ProjectsEmptyState = ({ onNavigate }) => (
  <EmptyState
    icon={FolderOpen}
    title="No Projects Yet"
    description="Showcase your work and stand out to potential employers. Add your first project to get started."
    variant="primary"
    primaryAction={{
      label: 'Add Project',
      icon: Plus,
      onClick: () => {}, // Implement add project
    }}
  />
);

export const ApplicationsEmptyState = ({ onNavigate }) => (
  <EmptyState
    icon={Briefcase}
    title="No Applications Yet"
    description="When you apply for jobs, you'll see them here. Start exploring opportunities and take the next step in your career."
    variant="info"
    primaryAction={{
      label: 'Find Jobs',
      icon: Search,
      onClick: () => onNavigate('opportunities'),
    }}
  />
);

export default EmptyState;
