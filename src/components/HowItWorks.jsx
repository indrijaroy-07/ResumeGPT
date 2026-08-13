import { useState, useEffect, useRef } from 'react';
import { UploadCloud, Cpu, Trophy, ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Upload Resume',
    description: 'Upload your resume in PDF or DOCX format',
    icon: <UploadCloud className="w-8 h-8 text-primary" />,
    color: 'bg-primary/10',
  },
  {
    number: '02',
    title: 'AI Analysis',
    description: 'Our AI scans your resume for skills, keywords, ATS score, and improvements',
    icon: <Cpu className="w-8 h-8 text-purple-600" />,
    color: 'bg-purple-100',
  },
  {
    number: '03',
    title: 'Get Results',
    description: 'Receive score, suggestions, and detailed improvements instantly',
    icon: <Trophy className="w-8 h-8 text-blue-600" />,
    color: 'bg-blue-100',
  },
];

export default function HowItWorks() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className={`py-24 bg-gradient-to-b from-white to-slate-50/50 w-full transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Simple steps to analyze your resume using AI
          </p>
        </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div 
                key={index}
                style={{ transitionDelay: `${index * 200 + 300}ms` }}
                className={`relative group bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-700 ease-out ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                {/* Connection Arrow for Desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 translate-x-1/2 -translate-y-1/2 z-20">
                    <ArrowRight className="w-6 h-6 text-slate-300 group-hover:text-primary transition-colors" />
                  </div>
                )}

                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className={`p-5 rounded-2xl ${step.color} group-hover:scale-110 transition-transform duration-300`}>
                      {step.icon}
                    </div>
                    <span className="absolute -top-2 -right-2 bg-white text-slate-400 text-xs font-bold w-8 h-8 flex items-center justify-center rounded-full border border-slate-100 shadow-sm">
                      {step.number}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-slate-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
      </div>
    </section>
  );
}
