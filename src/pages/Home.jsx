import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Clock, Plus } from 'lucide-react';
import Navbar from '../components/Navbar';
import HowItWorks from '../components/HowItWorks';

const faqs = [
  {
    question: "How does the AI resume analyzer work?",
    answer: "Our AI scans your resume and compares it against job descriptions using natural language processing to give you a match score and improvement suggestions."
  },
  {
    question: "Is my resume data stored or shared?",
    answer: "No. Your resume is analyzed in real time and never stored on our servers or shared with third parties."
  },
  {
    question: "What file formats are supported?",
    answer: "We support PDF and DOCX formats. Make sure your file is under 5MB."
  },
  {
    question: "Is this tool free to use?",
    answer: "Yes, basic analysis is completely free. Premium features are available on paid plans."
  },
  {
    question: "How accurate is the analysis?",
    answer: "Our model is trained on thousands of job descriptions and resumes, giving highly relevant feedback — though we recommend using it as a guide, not a guarantee."
  },
  {
    question: "Can I analyze multiple resumes?",
    answer: "Yes, you can upload and analyze as many resumes as you need."
  }
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center px-4 sm:px-6 lg:px-8 pb-24">
        
        {/* Hero Section */}
        <div className="max-w-3xl space-y-8 mt-20 sm:mt-32 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary-dark text-sm font-medium">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            Now analyzing resumes with advanced AI
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
            Elevate Your Career with <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark">AI Resume Analyzer</span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Upload your resume and get instant, actionable feedback. Match your skills against job descriptions and land your dream job faster.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              to="/signup" 
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-primary text-white font-medium hover:bg-primary-dark transition-all shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5"
            >
              Get Started for Free
            </Link>
            <Link 
              to="/signin" 
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-slate-700 font-medium hover:bg-slate-50 border border-slate-200 transition-all hover:-translate-y-0.5"
            >
              Log In
            </Link>
          </div>
        </div>

        {/* How It Works Section */}
        <HowItWorks />

        {/* Feature Badges */}
        <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl w-full border-t border-slate-200 pt-12 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 bg-green-100 text-green-600 rounded-2xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-900">100% Secure</h3>
            <p className="text-sm text-slate-500">Your data is encrypted and never shared.</p>
          </div>
          
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-900">AI Powered</h3>
            <p className="text-sm text-slate-500">Industry-leading analysis algorithms.</p>
          </div>
          
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-900">Instant Results</h3>
            <p className="text-sm text-slate-500">Get your feedback in under 10 seconds.</p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-32 w-full max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
            <p className="text-slate-600 mt-4 text-lg">Got questions? We've got answers.</p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300 hover:border-slate-300 shadow-sm"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 flex items-center justify-between bg-white text-left focus:outline-none"
                >
                  <span className="font-semibold text-slate-900 pr-4">{faq.question}</span>
                  <Plus 
                    className={`w-5 h-5 text-slate-500 transition-transform duration-300 shrink-0 ${openFaq === index ? 'rotate-45' : ''}`}
                  />
                </button>
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${openFaq === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-slate-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center border-t border-slate-200 pt-10">
            <p className="text-slate-600 mb-6">Still have questions?</p>
            <button className="px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-colors border border-slate-200 shadow-sm hover:-translate-y-0.5">
              Contact Us
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
