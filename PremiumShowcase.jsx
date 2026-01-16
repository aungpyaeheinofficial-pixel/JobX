import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Heart, Send, Download } from 'lucide-react';
import { useToast } from './ToastContext.jsx';
import {
  PremiumButton,
  PremiumCard,
  Skeleton,
  CardSkeleton,
  StaggerContainer,
  StaggerItem,
  IconButton,
  ScaleOnHover,
  PremiumBadge,
  LoadingDots,
  RevealOnScroll
} from './PremiumComponents.jsx';

/**
 * Premium Components Showcase
 * Demonstrates all Apple-style micro-interactions
 */
const PremiumShowcase = ({ onBack }) => {
  const { showSuccess, showError, showInfo, showWarning } = useToast();
  const [loading, setLoading] = useState(false);

  const handleLoadingDemo = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showSuccess('Loading complete!');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-5xl font-bold mb-3">Premium Components</h1>
          <p className="text-xl text-gray-600">Apple-style micro-interactions & animations</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-16 space-y-24">
        {/* Section 1: Buttons */}
        <RevealOnScroll>
          <div>
            <h2 className="text-3xl font-bold mb-8">Premium Buttons</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-600">Primary</h3>
                <PremiumButton
                  variant="primary"
                  onClick={() => showSuccess('Button clicked!')}
                  icon={Sparkles}
                >
                  Click Me
                </PremiumButton>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-600">Secondary</h3>
                <PremiumButton
                  variant="secondary"
                  onClick={() => showInfo('Secondary button clicked')}
                  icon={Heart}
                >
                  Like
                </PremiumButton>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-600">Ghost</h3>
                <PremiumButton
                  variant="ghost"
                  onClick={() => showWarning('Ghost button clicked')}
                  icon={Send}
                >
                  Send
                </PremiumButton>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* Section 2: Cards */}
        <RevealOnScroll>
          <div>
            <h2 className="text-3xl font-bold mb-8">Premium Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PremiumCard hoverable={true}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">Hover to Lift</h3>
                    <p className="text-gray-600">This card has smooth elevation on hover</p>
                    <div className="flex gap-2 mt-4">
                      <PremiumBadge variant="success">Active</PremiumBadge>
                      <PremiumBadge variant="primary">Premium</PremiumBadge>
                    </div>
                  </div>
                </div>
              </PremiumCard>

              <PremiumCard hoverable={true}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">Spring Physics</h3>
                    <p className="text-gray-600">Powered by framer-motion spring animations</p>
                    <div className="flex gap-2 mt-4">
                      <IconButton icon={Heart} label="Like" />
                      <IconButton icon={Send} label="Share" />
                      <IconButton icon={Download} label="Download" />
                    </div>
                  </div>
                </div>
              </PremiumCard>
            </div>
          </div>
        </RevealOnScroll>

        {/* Section 3: Loading States */}
        <RevealOnScroll>
          <div>
            <h2 className="text-3xl font-bold mb-8">Loading States</h2>
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border-2 border-gray-200 p-8">
                <h3 className="font-semibold mb-4">Skeleton Loaders</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CardSkeleton />
                  <CardSkeleton />
                </div>
              </div>

              <div className="bg-white rounded-3xl border-2 border-gray-200 p-8">
                <h3 className="font-semibold mb-4">Loading Indicators</h3>
                <div className="flex items-center gap-8">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Loading Dots</p>
                    <LoadingDots />
                  </div>
                  <PremiumButton onClick={handleLoadingDemo}>
                    {loading ? <LoadingDots /> : 'Trigger Loading'}
                  </PremiumButton>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* Section 4: Toast Notifications */}
        <RevealOnScroll>
          <div>
            <h2 className="text-3xl font-bold mb-8">Toast Notifications</h2>
            <div className="bg-white rounded-3xl border-2 border-gray-200 p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <PremiumButton
                  variant="primary"
                  onClick={() => showSuccess('Operation successful!')}
                >
                  Success
                </PremiumButton>
                <PremiumButton
                  variant="secondary"
                  onClick={() => showError('Something went wrong!')}
                >
                  Error
                </PremiumButton>
                <PremiumButton
                  variant="ghost"
                  onClick={() => showInfo('Here\'s some information')}
                >
                  Info
                </PremiumButton>
                <PremiumButton
                  variant="ghost"
                  onClick={() => showWarning('Please be careful')}
                >
                  Warning
                </PremiumButton>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* Section 5: Stagger Animation */}
        <RevealOnScroll>
          <div>
            <h2 className="text-3xl font-bold mb-8">Stagger Animations</h2>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <StaggerItem key={item}>
                  <PremiumCard hoverable={true}>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-white">{item}</span>
                      </div>
                      <h3 className="font-bold mb-2">Card {item}</h3>
                      <p className="text-gray-600 text-sm">Animates in sequence</p>
                    </div>
                  </PremiumCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </RevealOnScroll>

        {/* Section 6: Scale on Hover */}
        <RevealOnScroll>
          <div>
            <h2 className="text-3xl font-bold mb-8">Scale Effects</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {['Violet', 'Blue', 'Green', 'Rose'].map((color, i) => (
                <ScaleOnHover key={color} scale={1.05}>
                  <div className={`
                    h-48 rounded-3xl
                    bg-gradient-to-br
                    ${i === 0 ? 'from-violet-500 to-purple-500' : ''}
                    ${i === 1 ? 'from-blue-500 to-indigo-500' : ''}
                    ${i === 2 ? 'from-green-500 to-emerald-500' : ''}
                    ${i === 3 ? 'from-rose-500 to-pink-500' : ''}
                    flex items-center justify-center
                    text-white text-xl font-bold
                  `}>
                    {color}
                  </div>
                </ScaleOnHover>
              ))}
            </div>
          </div>
        </RevealOnScroll>

        {/* Section 7: Badges */}
        <RevealOnScroll>
          <div>
            <h2 className="text-3xl font-bold mb-8">Premium Badges</h2>
            <div className="bg-white rounded-3xl border-2 border-gray-200 p-8">
              <div className="flex flex-wrap gap-3">
                <PremiumBadge variant="default">Default</PremiumBadge>
                <PremiumBadge variant="success">Success</PremiumBadge>
                <PremiumBadge variant="warning">Warning</PremiumBadge>
                <PremiumBadge variant="error">Error</PremiumBadge>
                <PremiumBadge variant="primary">Primary</PremiumBadge>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* Bottom spacing */}
        <div className="h-24" />
      </div>
    </div>
  );
};

export default PremiumShowcase;
