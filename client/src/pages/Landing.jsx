import { Link } from "react-router-dom";
import { FiArrowRight, FiUsers, FiBriefcase, FiBookOpen, FiAward, FiMessageCircle, FiCalendar } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const Landing = () => {
  const { user } = useAuth();

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background font-sans text-ink flex flex-col overflow-x-hidden selection:bg-primary-light selection:text-primary-dark">
      
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="w-full bg-primary-dark text-white text-center py-2.5 text-sm font-medium tracking-wide z-30 relative shadow-sm">
        Welcome to conNECt. The ultimate campus network is now live.
      </div>

      {/* 2. NAVBAR */}
      <nav className="flex items-center justify-between px-6 lg:px-12 py-5 w-full max-w-[1400px] mx-auto z-20 bg-background/95 backdrop-blur-md sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl shadow-sm">
            C
          </div>
          <span className="font-display text-2xl font-bold tracking-tight text-primary-dark">
            con<span className="text-primary">NEC</span>t
          </span>
        </div>
        
        {/* Middle Links */}
        

        {/* Auth Buttons */}
        <div className="flex items-center gap-6">
          <button onClick={() => scrollToSection('about')} className="hidden lg:block font-bold text-sm tracking-wide text-ink-light hover:text-primary-dark transition-colors uppercase">
            About
          </button>
          {user ? (
            <Link to="/dashboard" className="font-bold text-sm text-white bg-primary hover:bg-primary-hover px-8 py-2.5 rounded-md shadow-sm transition-all uppercase tracking-wider">
              DASHBOARD
            </Link>
          ) : (
            <Link to="/login" className="font-bold text-sm text-white bg-primary hover:bg-primary-hover px-8 py-2.5 rounded-md shadow-sm transition-all uppercase tracking-wider">
              LOGIN
            </Link>
          )}
        </div>
      </nav>

      {/* 3. HERO SECTION */}
      <main className="w-full max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 pb-24 pt-10 lg:pt-0 relative z-10" style={{ minHeight: 'calc(100vh - 120px)' }}>
        
        {/* Subtle Background Accent */}
        <div className="absolute top-0 right-0 w-[60%] h-[100%] bg-primary-light/30 -z-10 rounded-bl-[300px]"></div>

        {/* Left Content (Slide in from Left) */}
        <div className="w-full lg:w-[45%] flex flex-col items-start text-left pt-10 lg:pt-0 opacity-0-init anim-slide-right">
          <div className="inline-block px-3 py-1 mb-6 rounded-full bg-primary-light text-primary text-xs font-bold tracking-widest uppercase">
            Student Portal
          </div>
          <h1 className="text-5xl lg:text-6xl xl:text-[68px] font-display font-bold text-primary-dark leading-[1.05] mb-6 tracking-tight">
            Connect your <br/>
            Academic and <br/>
            Professional Network
          </h1>
          <p className="text-lg lg:text-[20px] text-ink-light max-w-[550px] mb-10 leading-relaxed">
            conNECt is a self-service networking platform for students, faculty, and alumni to collaborate effortlessly.
          </p>
          
          <div className="flex flex-wrap items-center gap-6">
            <Link to={user ? "/dashboard" : "/register"} className="font-bold text-[15px] bg-primary text-white px-8 py-3.5 rounded-md shadow-md hover:bg-primary-hover hover:shadow-lg hover:-translate-y-0.5 transition-all uppercase tracking-wider">
              GET STARTED
            </Link>
            <button onClick={() => scrollToSection('features')} className="font-bold text-[15px] text-primary-dark px-2 py-3.5 hover:text-secondary transition-colors uppercase tracking-wider flex items-center gap-2">
              LEARN MORE <FiArrowRight />
            </button>
          </div>
        </div>

        {/* Right Collaboration Image (Slide in from Right) */}
        <div className="w-full lg:w-[55%] relative flex justify-end items-center mt-12 lg:mt-0 opacity-0-init anim-slide-left" style={{ animationDelay: '100ms' }}>
           <div className="relative w-full max-w-[700px] rounded-2xl overflow-hidden shadow-[0_20px_50px_-12px_rgba(23,59,58,0.15)] border border-border/50 bg-white">
              <img 
                 src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80" 
                 alt="College students collaborating on a project" 
                 className="w-full h-auto object-cover aspect-[4/3] lg:aspect-[3/2] block"
              />
              
              {/* Floating Mentorship Card */}
              <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-border max-w-[220px]">
                 <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded bg-primary-light text-primary flex items-center justify-center font-bold text-sm">
                       +
                    </div>
                    <div className="font-bold text-primary-dark text-sm">Mentorship</div>
                 </div>
                 <div className="text-xs text-ink-light leading-tight">
                    Connect with alumni and faculty for real-world guidance.
                 </div>
              </div>
           </div>
        </div>
      </main>

      {/* 4. FEATURES SECTION (LEARN MORE) */}
      <section id="features" className="w-full py-24 bg-white border-y border-border">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-primary-dark mb-4">
              Everything you need to connect, collaborate and grow.
            </h2>
            <p className="text-lg text-ink-light">
              A complete academic and professional ecosystem designed exclusively for our college community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: FiUsers, title: "CONNECT", desc: "Build meaningful connections with students, faculty and alumni across the college community." },
              { icon: FiAward, title: "MENTORSHIP", desc: "Connect students with faculty and alumni mentors for guidance, projects and professional development." },
              { icon: FiBriefcase, title: "PROJECT COLLABORATION", desc: "Create projects, find collaborators and work together through structured project and mentorship workflows." },
              { icon: FiBookOpen, title: "ACADEMIC COMMUNITY", desc: "Stay connected with academic activities, learning resources and your campus network." },
              { icon: FiMessageCircle, title: "HELP & KNOWLEDGE SHARING", desc: "Students can request help and other members can contribute their knowledge and experience." },
              { icon: FiAward, title: "ACHIEVEMENTS", desc: "Showcase your hackathons, coding competitions, paper presentations and professional milestones." }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-xl border border-border bg-background hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-primary-light text-primary flex items-center justify-center text-xl mb-6">
                  <feature.icon />
                </div>
                <h3 className="font-bold tracking-wide text-primary-dark mb-3 uppercase text-sm">{feature.title}</h3>
                <p className="text-ink-light leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section id="about" className="w-full py-24 bg-background">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-primary-dark">How conNECt Works</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-px bg-border -z-10"></div>
            
            {[
              { step: "01", title: "CREATE YOUR ACCOUNT", desc: "Register using your college identity and create your conNECt profile." },
              { step: "02", title: "BUILD YOUR NETWORK", desc: "Connect with students, faculty and alumni based on your interests and goals." },
              { step: "03", title: "COLLABORATE & GROW", desc: "Work on projects, find mentors, collaborate and share knowledge." }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-white border-4 border-background flex items-center justify-center shadow-sm mb-6 z-10">
                  <span className="font-display text-3xl font-bold text-primary-dark">{item.step}</span>
                </div>
                <h3 className="font-bold tracking-wide text-primary-dark mb-3 uppercase text-sm">{item.title}</h3>
                <p className="text-ink-light leading-relaxed max-w-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA */}
      <section className="w-full py-32 bg-white border-t border-border text-center px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-display font-bold text-primary-dark mb-6">
            Ready to connect with your campus?
          </h2>
          <p className="text-xl text-ink-light mb-10">
            Join conNECt and build meaningful academic and professional connections.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={user ? "/dashboard" : "/register"} className="w-full sm:w-auto font-bold text-[15px] bg-primary text-white px-10 py-4 rounded-md shadow-md hover:bg-primary-hover hover:-translate-y-0.5 transition-all uppercase tracking-wider">
              GET STARTED
            </Link>
            {!user && (
              <Link to="/login" className="w-full sm:w-auto font-bold text-[15px] text-primary-dark bg-white border border-border px-10 py-4 rounded-md hover:border-primary-dark hover:-translate-y-0.5 transition-all uppercase tracking-wider">
                LOGIN
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="w-full py-12 bg-primary-dark text-white text-center md:text-left">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
              <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white font-bold shadow-sm">C</div>
              <span className="font-display text-xl font-bold tracking-tight">conNECt</span>
            </div>
            <p className="text-white/60 text-sm">
              Integrated Digital Platform for Students, Faculty and Alumni
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm font-semibold tracking-wide text-white/80">
            <Link to="/network" className="hover:text-white transition-colors">Network</Link>
            <Link to="/mentorship" className="hover:text-white transition-colors">Mentorship</Link>
            <button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors">About</button>
            {!user && <Link to="/login" className="hover:text-white transition-colors">Login</Link>}
            {!user && <Link to="/register" className="hover:text-white transition-colors">Get Started</Link>}
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
