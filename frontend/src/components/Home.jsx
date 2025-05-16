import React, { useState, useEffect } from 'react';
import { ChevronRight, Users, BookOpen, Briefcase, GraduationCap, LineChart, Clock, ArrowRight, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const handleStudent = () => {
    navigate('/student-login');
  };
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="bg-black text-white overflow-hidden">
      {/* Modern Grid Background */}
      <div className="grid-background fixed inset-0 w-full h-full z-0 opacity-100"></div>
      
      {/* Interactive Gradient Background that follows mouse position */}
      <div 
        className="fixed inset-0 z-0 opacity-30"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(239, 68, 68, 0.15), transparent 60%)`
        }}
      ></div>
      
      {/* Subtle animated gradients */}
      <div className="fixed top-0 left-0 w-full h-full z-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-3xl animate-pulse" 
             style={{animationDelay: '2s', animationDuration: '8s'}}></div>
        <div className="absolute top-3/4 right-1/3 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
             style={{animationDelay: '1s', animationDuration: '10s'}}></div>
      </div>

      {/* Hero Section with Animated Gradient */}
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-6 z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6 inline-block">
              <span className="relative inline-flex">
                <span className="absolute inset-x-0 bottom-0 border-b-2 border-red-400"></span>
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold relative z-10 pb-2">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-500">Prep</span>
                  <span>Verse</span>
                </h1>
              </span>
            </div>
            
            <p className="text-xl md:text-2xl mb-10 text-gray-300 max-w-2xl mx-auto">
              Bridging the gap between alumni, students, and placement opportunities with AI-powered preparation.
            </p>
            
            <button 
              onClick={handleStudent}
              className="group px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full text-white font-medium hover:shadow-lg hover:shadow-red-500/30 transition duration-300 ease-in-out flex items-center mx-auto"
            >
              Get Started 
              <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-0 right-0 flex justify-center">
          <div className="animate-bounce">
            <ChevronDown className="h-10 w-10 text-red-400" />
          </div>
        </div>
      </div>

      {/* Features Section with Cards */}
      <div className="py-24 relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="text-red-400 text-sm uppercase tracking-widest font-semibold">Our Platform</span>
            <h2 className="text-4xl lg:text-5xl font-bold mt-3 mb-4">
              How <span className="text-red-400">PrepVerse</span> Works
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-red-400 to-red-500 mx-auto"></div>
            <p className="text-gray-300 mt-6 max-w-2xl mx-auto text-lg">
              A comprehensive platform that connects students, alumni, and the Training & Placement Cell
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Users className="h-12 w-12 text-red-400" />}
              title="Alumni Connection"
              description="Connect with alumni who can share insights, post job opportunities, and mentor students through blogs and direct interactions."
            />
            <FeatureCard 
              icon={<Briefcase className="h-12 w-12 text-red-400" />}
              title="Job Opportunities"
              description="Access curated job postings from both alumni and Training & Placement Cell with detailed job descriptions and application details."
            />
            <FeatureCard 
              icon={<BookOpen className="h-12 w-12 text-red-400" />}
              title="AI-Powered Quizzes"
              description="Get personalized quiz preparation based on your resume, ensuring you're ready for your dream job interviews."
            />
          </div>
        </div>
      </div>

      {/* Journey Timeline Section */}
      <div className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <span className="text-red-400 text-sm uppercase tracking-widest font-semibold">Step By Step</span>
            <h2 className="text-4xl lg:text-5xl font-bold mt-3 mb-4">Your Journey on PrepVerse</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-red-400 to-red-500 mx-auto"></div>
            <p className="text-gray-300 mt-6 max-w-2xl mx-auto text-lg">
              Follow these simple steps to make the most of our platform
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gradient-to-b from-red-400/30 via-red-400 to-red-400/30"></div>
            
            <div className="timeline-container">
              <TimelineItem 
                number="01"
                title="Sign Up"
                description="Create your account as a student or alumni and get verified by admin"
                position="left"
              />
              <TimelineItem 
                number="02"
                title="Complete Profile"
                description="Upload your resume, add skills, and academic information"
                position="right"
              />
              <TimelineItem 
                number="03"
                title="Prepare With AI"
                description="Take personalized quizzes generated from your resume content"
                position="left"
              />
              <TimelineItem 
                number="04"
                title="Connect & Apply"
                description="Engage with alumni blogs and apply for job opportunities"
                position="right"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stakeholders Section */}
      <div className="py-24 relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="text-red-400 text-sm uppercase tracking-widest font-semibold">For Everyone</span>
            <h2 className="text-4xl lg:text-5xl font-bold mt-3 mb-4">
              Who Benefits from <span className="text-red-400">PrepVerse</span>?
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-red-400 to-red-500 mx-auto"></div>
            <p className="text-gray-300 mt-6 max-w-2xl mx-auto text-lg">
              Our platform serves multiple stakeholders in the academic ecosystem
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StakeholderCard 
              icon={<GraduationCap className="h-12 w-12 text-red-400" />}
              title="Students"
              description="Access job opportunities, improve skills with personalized quizzes, and connect with alumni mentors."
            />
            <StakeholderCard 
              icon={<Users className="h-12 w-12 text-red-400" />}
              title="Alumni"
              description="Give back to your alma mater by sharing knowledge, posting job openings, and mentoring students."
            />
            <StakeholderCard 
              icon={<LineChart className="h-12 w-12 text-red-400" />}
              title="T&P Cell"
              description="Track placement statistics, post job opportunities, and monitor student progress efficiently."
            />
          </div>
        </div>
      </div>

      {/* Latest Updates Section */}
      <div className="py-24 relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="text-red-400 text-sm uppercase tracking-widest font-semibold">Latest Updates</span>
            <h2 className="text-4xl lg:text-5xl font-bold mt-3 mb-4">
              Latest From Our <span className="text-red-400">Alumni</span>
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-red-400 to-red-500 mx-auto"></div>
            <p className="text-gray-300 mt-6 max-w-2xl mx-auto text-lg">
              Insights and opportunities shared by our network
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <BlogCard 
              title="How I Landed My Dream Job at Google"
              excerpt="Tips and strategies that helped me secure a position at one of the top tech companies in the world."
              author="Ravi Kumar"
              date="Apr 24, 2025"
              company="Google"
            />
            <BlogCard 
              title="5 Skills Every Computer Science Graduate Needs"
              excerpt="Based on my industry experience, these are the most valuable skills students should focus on developing."
              author="Priya Singh"
              date="Apr 20, 2025"
              company="Microsoft"
            />
            <BlogCard 
              title="Job Opening: Junior Developer at TechCorp"
              excerpt="We're looking for talented graduates to join our development team. Apply now for this exciting opportunity."
              author="Ajay Patel"
              date="Apr 18, 2025"
              company="TechCorp"
              isJob={true}
            />
          </div>
          
          <div className="mt-12 text-center">
            <button 
              className="group px-8 py-3 rounded-full border border-red-400 text-red-400 font-medium hover:bg-red-400/10 transition duration-300 ease-in-out flex items-center mx-auto" 
              onClick={handleStudent}
            >
              View All Posts 
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-24 relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <StatCard number="500+" label="Students" />
              <StatCard number="200+" label="Alumni" />
              <StatCard number="150+" label="Job Postings" />
              <StatCard number="85%" label="Placement Rate" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Section */}
      <footer className="relative bg-black text-white">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-red-400 to-transparent"></div>
        <div className="container mx-auto px-6 py-12 flex flex-col items-center text-center">
          <h3 className="font-bold text-2xl mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-500">Prep</span>Verse
          </h3>
          <p className="text-gray-400 max-w-md mb-8">
            Your bridge to career success. Connect with alumni, find opportunities, and prepare for your future with AI-powered tools.
          </p>
          <p className="text-sm text-gray-500 mb-2">MADE WITH ❤️ SHETTY</p>
          <p className="text-sm text-gray-500">© 2025 PrepVerse. All rights reserved.</p>
        </div>
      </footer>

      {/* CSS for the grid background - injected into the component */}
      <style jsx>{`
        .grid-background {
          --gap: 5em;
          --line: 1px;
          --color: rgba(255, 255, 255, 0.1);
          background-image: linear-gradient(
              -90deg,
              transparent calc(var(--gap) - var(--line)),
              var(--color) calc(var(--gap) - var(--line) + 1px),
              var(--color) var(--gap)
            ),
            linear-gradient(
              0deg,
              transparent calc(var(--gap) - var(--line)),
              var(--color) calc(var(--gap) - var(--line) + 1px),
              var(--color) var(--gap)
            );
          background-size: var(--gap) var(--gap);
        }
        
        @keyframes floatGradient {
          0% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(3%, 3%);
          }
          100% {
            transform: translate(0, 0);
          }
        }
      `}</style>
    </div>
  );
}

// Modern Feature Card with Hover Effects
const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="group relative bg-gray-900/40 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 hover:border-red-400 transition duration-300 overflow-hidden">
      {/* Subtle glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-red-500/0 group-hover:from-red-500/10 group-hover:to-transparent transition-all duration-300 rounded-2xl"></div>
      
      <div className="relative z-10">
        <div className="bg-gray-800/50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-gray-800 transition duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-400 transition duration-300">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  );
};

// Timeline Item Component
const TimelineItem = ({ number, title, description, position }) => {
  return (
    <div className={`flex items-center mb-12 ${position === 'right' ? 'flex-row' : 'flex-row-reverse'}`}>
      <div className={`w-1/2 ${position === 'right' ? 'pr-16 text-right' : 'pl-16'}`}>
        <div className="mb-2">
          <span className="text-red-400 font-bold">{number}</span>
          <h3 className="text-xl font-bold text-white inline-block ml-2">{title}</h3>
        </div>
        <p className="text-gray-400">{description}</p>
      </div>
      
      <div className="relative">
        <div className="absolute w-5 h-5 bg-red-400 rounded-full z-10"></div>
        <div className="absolute w-10 h-10 bg-red-400/30 rounded-full animate-ping"></div>
      </div>
      
      <div className="w-1/2"></div>
    </div>
  );
};

// Stakeholder Card Component
const StakeholderCard = ({ icon, title, description }) => {
  return (
    <div className="group relative bg-gray-900/40 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 hover:border-red-400 transition duration-300 overflow-hidden">
      {/* Background glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-red-500/0 group-hover:from-red-500/10 group-hover:to-transparent transition-all duration-300 rounded-2xl"></div>
      
      <div className="relative z-10">
        <div className="bg-gray-800/50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-gray-800 transition duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-400 transition duration-300">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  );
};

// Modern Blog Card with Hover Effects
const BlogCard = ({ title, excerpt, author, date, company, isJob = false }) => {
  return (
    <div className="group relative bg-gray-900/40 backdrop-blur-sm p-6 rounded-2xl border border-gray-800 hover:border-red-400 transition duration-300 overflow-hidden">
      {/* Subtle glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-red-500/0 group-hover:from-red-500/5 group-hover:to-transparent transition-all duration-300 rounded-2xl"></div>
      
      <div className="relative z-10">
        {isJob && (
          <div className="bg-red-400 text-black text-xs font-bold uppercase px-3 py-1 rounded-full mb-4 inline-block">
            Job Opening
          </div>
        )}
        <h3 className="text-lg font-bold text-white mb-3 group-hover:text-red-400 transition duration-300">{title}</h3>
        <p className="text-gray-400 mb-6">{excerpt}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center text-gray-300 border border-gray-700">
              {author.charAt(0)}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{author}</p>
              <p className="text-xs text-gray-500">{company}</p>
            </div>
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="h-3 w-3 mr-1" />
            {date}
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ number, label }) => {
  return (
    <div className="text-center bg-gray-900/40 backdrop-blur-sm p-6 rounded-2xl border border-gray-800 hover:border-red-400 transition duration-300">
      <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-500 mb-2">{number}</div>
      <div className="text-gray-300 uppercase tracking-wider text-sm">{label}</div>
    </div>
  );
};

export default Home;