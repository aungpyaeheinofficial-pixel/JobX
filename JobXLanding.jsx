import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const JobXLanding = ({ onGetStarted }) => {
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const sectionRefs = useRef({});

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for fade-in animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1 }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const FeatureCard = ({ number, title, description }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        className="group cursor-default"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="article"
        aria-labelledby={`feature-${number}`}
      >
        <div
          className="text-6xl font-bold text-gray-200 mb-4 transition-all duration-500"
          style={{
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          }}
          aria-hidden="true"
        >
          {number}
        </div>
        <h3 id={`feature-${number}`} className="text-3xl font-semibold mb-4">{title}</h3>
        <p className="text-xl text-gray-500 leading-relaxed">{description}</p>
      </div>
    );
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Calculate parallax and fade effects
  const heroOpacity = Math.max(1 - scrollY / 600, 0);
  const heroTransform = scrollY * 0.5;

  return (
    <div className="min-h-screen bg-white text-black">
      <style>{`
        @keyframes subtleFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-section {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        .fade-in-section.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .focus-visible:focus {
          outline: 2px solid #000;
          outline-offset: 4px;
        }
      `}</style>

      {/* Very subtle gradient overlay with parallax */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute top-0 left-1/2 w-[800px] h-[800px] bg-violet-100 rounded-full blur-3xl opacity-20"
          style={{
            animation: 'subtleFloat 20s ease-in-out infinite',
            transform: `translate(-50%, ${scrollY * 0.3}px)`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="container mx-auto px-8 py-8" role="navigation" aria-label="Main navigation">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center" aria-hidden="true">
                <span className="text-white font-bold text-lg">J</span>
              </div>
              <span className="text-xl font-semibold">JobX</span>
            </div>
            <div className="hidden md:flex gap-12 text-gray-600">
              <button onClick={() => scrollToSection('methodology')} className="hover:text-black transition-colors focus-visible:focus">
                Methodology
              </button>
              <button onClick={() => scrollToSection('proof')} className="hover:text-black transition-colors focus-visible:focus">
                Case Studies
              </button>
              <button onClick={() => scrollToSection('cta')} className="hover:text-black transition-colors focus-visible:focus">
                Get Started
              </button>
            </div>
            <div className="flex items-center gap-6">
              <button
                onClick={onGetStarted}
                className="text-gray-600 hover:text-black transition-colors focus-visible:focus"
              >
                Log in
              </button>
              <button
                onClick={onGetStarted}
                className="px-6 py-2.5 bg-black text-white rounded-full hover:bg-gray-800 transition-all duration-300 focus-visible:focus"
              >
                Join Community
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section with parallax */}
        <section className="container mx-auto px-8 pt-32 pb-40" role="banner">
          <div
            className="max-w-5xl mx-auto text-center"
            style={{
              opacity: heroOpacity,
              transform: `translateY(${heroTransform}px)`,
            }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-full mb-12">
              <div className="w-2 h-2 bg-green-500 rounded-full" aria-label="Active community" />
              <span className="text-sm text-gray-600 uppercase tracking-wide">
                Myanmar's Builder Community
              </span>
            </div>

            <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold mb-12 leading-[0.95] tracking-tight">
              Build. Connect.
              <br />
              Get Hired.
            </h1>

            <p className="text-xl md:text-2xl text-gray-500 mb-6 max-w-3xl mx-auto leading-relaxed">
              Join Myanmar's community where builders learn together, create real projects, and get matched with opportunities.
            </p>
            <p className="text-xl md:text-2xl text-gray-500 mb-16 max-w-3xl mx-auto leading-relaxed">
              Your projects are your new resume.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={onGetStarted}
                className="group px-8 py-4 bg-black text-white rounded-full hover:bg-gray-800 transition-all duration-300 flex items-center gap-2 focus-visible:focus"
              >
                Join the Community
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <button
                onClick={() => scrollToSection('methodology')}
                className="px-8 py-4 bg-white border border-gray-200 rounded-full hover:border-gray-300 transition-all duration-300 focus-visible:focus"
              >
                How It Works
              </button>
            </div>
          </div>
        </section>

        {/* Value Proposition Section */}
        <section
          id="methodology"
          ref={(el) => (sectionRefs.current['methodology'] = el)}
          className={`container mx-auto px-8 py-40 fade-in-section ${visibleSections.has('methodology') ? 'visible' : ''}`}
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-20">
              <FeatureCard
                number="01"
                title="Learn & Connect"
                description="Join industry communities across Tech, Business, Construction, Design, and more. Share knowledge, ask questions, grow together."
              />
              <FeatureCard
                number="02"
                title="Build Projects"
                description="Create real projects that matter. Collaborate with others. Build your portfolio through action, not paper credentials."
              />
              <FeatureCard
                number="03"
                title="Get Jobs"
                description="Matched with paid work and roles based on what you've built, not what your resume says. Projects are your new CV."
              />
            </div>
          </div>
        </section>

        {/* Proof Section */}
        <section
          id="proof"
          ref={(el) => (sectionRefs.current['proof'] = el)}
          className={`container mx-auto px-8 py-40 fade-in-section ${visibleSections.has('proof') ? 'visible' : ''}`}
        >
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-16 mb-20">
              <div>
                <div className="text-6xl font-bold mb-2">500+</div>
                <div className="text-xl text-gray-500">Active Builders</div>
              </div>
              <div>
                <div className="text-6xl font-bold mb-2">120+</div>
                <div className="text-xl text-gray-500">Live Projects</div>
              </div>
              <div>
                <div className="text-6xl font-bold mb-2">50+</div>
                <div className="text-xl text-gray-500">Jobs</div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-16">
              <blockquote className="text-2xl md:text-3xl text-gray-600 mb-8 leading-relaxed">
                "JobX changed how I think about my career. Instead of sending CVs, I built a real app. Now companies come to me."
              </blockquote>
              <div>
                <div className="font-semibold text-lg mb-1">Aung Ko Ko</div>
                <div className="text-gray-500">Software Developer, Yangon</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          id="cta"
          ref={(el) => (sectionRefs.current['cta'] = el)}
          className={`container mx-auto px-8 py-40 fade-in-section ${visibleSections.has('cta') ? 'visible' : ''}`}
        >
          <div className="max-w-5xl mx-auto bg-black rounded-[48px] px-12 py-32 text-center text-white">
            <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Ready to start building
              <br />
              your future?
            </h2>

            <p className="text-xl md:text-2xl text-gray-400 mb-6 max-w-2xl mx-auto leading-relaxed">
              Join a community of builders creating real projects and getting real opportunities.
            </p>
            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              No more endless job applications. Build what matters.
            </p>

            <button
              onClick={onGetStarted}
              className="px-10 py-5 bg-white text-black rounded-full text-lg font-medium hover:bg-gray-100 transition-all duration-300 focus-visible:focus"
            >
              Join JobX Community
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-8 py-16 border-t border-gray-200" role="contentinfo">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center" aria-hidden="true">
                <span className="text-white font-bold text-lg">J</span>
              </div>
              <span className="text-xl font-semibold">JobX</span>
            </div>
            <nav className="flex gap-12 text-gray-600" aria-label="Footer navigation">
              <button onClick={() => scrollToSection('methodology')} className="hover:text-black transition-colors focus-visible:focus">
                About
              </button>
              <button onClick={() => scrollToSection('proof')} className="hover:text-black transition-colors focus-visible:focus">
                Community
              </button>
              <button onClick={() => scrollToSection('methodology')} className="hover:text-black transition-colors focus-visible:focus">
                Projects
              </button>
              <button onClick={() => scrollToSection('cta')} className="hover:text-black transition-colors focus-visible:focus">
                Contact
              </button>
            </nav>
          </div>
          <div className="text-center mt-12 text-gray-500">
            Built with purpose for Myanmar
          </div>
        </footer>
      </div>
    </div>
  );
};

export default JobXLanding;
