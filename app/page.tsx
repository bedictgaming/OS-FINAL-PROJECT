import React from 'react';

// Define the interface for a single project item (Kept for structure)
interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  link: string;
  // image: string; // Removed as we are using placeholders now
  openInNewTab: boolean;
}

// Define Skill Item Interface (Kept for completeness)
interface SkillItem {
  id: number;
  title: string;
  description: string;
  icon: string; // Changed from React.ReactNode to string (emoji)
}

// --- CONFIGURATION ---
const NAME = "BENEDICT MEQUIABAS"; 
const BACKGROUND_COLOR = "bg-white"; 
const TEXT_COLOR = "text-gray-900"; 
const BORDER_COLOR = "border-gray-900";
const ACCENT_COLOR_CLASS = "text-gray-900"; 
const QUICK_LINK_BG = "bg-gray-100";
const HOVER_BG = "hover:bg-gray-200";

// Helper component to apply the retro sketchy border style
const RetroBox = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    // Apply a thick border (border-4) and a faux shadow effect (border-b-8 border-r-8) 
    // to mimic the lifted, sketched look from the image.
    <div className={`p-4 border-4 ${BORDER_COLOR} border-b-8 border-r-8 ${className}`}>
        {children}
    </div>
);


// Stylized SVG/Illustration Placeholder to replace the photo
const RetroIllustration = () => (
    <div className={`w-full h-full p-4 border-4 ${BORDER_COLOR} bg-white flex flex-col items-center justify-center`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="w-48 h-48 lg:w-64 lg:h-64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="1" y1="18" x2="23" y2="18"></line>
            <line x1="6" y1="22" x2="18" y2="22"></line>
            <line x1="10" y1="12" x2="14" y2="12"></line>
            <line x1="12" y1="10" x2="12" y2="14"></line>
            <circle cx="12" cy="8" r="1"></circle>
        </svg>
        <p className="mt-4 text-xl font-bold">Web Dev Sketch</p>
    </div>
);

// Main Component
const App = () => {
    
  const portfolioItems: PortfolioItem[] = [
    {
      id: 2,
      title: "FCFS Scheduler Simulator",
      description:
        "A simulator for the First-Come, First-Served (FCFS) CPU scheduling algorithm, visualizing process execution.",
      link: "/projects/fcfs",
      openInNewTab: true,
    },
    {
      id: 3,
      title: "E-Commerce Shop",
      description:
        "A simple e-commerce site mock-up featuring product browsing, search, cart, and secure checkout process.",
      link: "https://mastering-react-and-api-integration.vercel.app/",
      openInNewTab: true,
    },
  ];

  const quickLinks = [
    { title: "Home", href: "#home" },
    // Replaced 'Blog' with a generic link for now
    { title: "Projects", href: "#portfolio" },
    { title: "About", href: "#about" },
    { title: "Contact", href: "#contact" },
  ];

  return (
    <main id="home" className={`min-h-screen ${BACKGROUND_COLOR} ${TEXT_COLOR} font-mono`}>
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        
        {/* Top Bar / Navigation (Retro Bordered) */}
        <nav className={`flex items-center justify-between py-4 px-4 border-4 ${BORDER_COLOR} mb-12`}>
          {/* Logo/Name */}
          <div className="flex items-center">
            <span className="font-extrabold text-xl tracking-wider">
              {NAME.split(' ')[0]}
            </span>
          </div>
          <div className="flex space-x-4 md:space-x-8">
            {quickLinks.map(link => (
                <a key={link.title} href={link.href} className="text-sm font-semibold hover:underline">
                    {link.title}
                </a>
            ))}
          </div>
        </nav>

        {/* Hero Section (Matches image style) */}
        <section className="py-10 mb-12 flex flex-col-reverse lg:flex-row items-center justify-between relative">
          
          {/* Text Content (Left Side - Aligned to match the image) */}
          <div className="lg:w-3/5 mb-10 lg:mb-0">
            <h1 className="text-6xl md:text-8xl font-extrabold leading-none mb-4">
              Hello.
            </h1>
            <h2 className="text-6xl md:text-8xl font-extrabold leading-none mb-4">
              I'm {NAME.split(' ')[0]}.
            </h2>
            <p className="text-lg text-gray-700 mb-6 max-w-xl border-t border-b border-gray-400 py-3">
              Hey, I'm a free Webflow template with a retro look, made by Mackenzie Child.
              {/* Using original text structure but replacing the content: */}
             I'm **Benedict Mequiabas**, a Web Developer passionate about creating innovative and visually engaging digital experiences.
            </p>
            
            <a href="#portfolio" className={`inline-block mt-8`}>
                <RetroBox className="bg-gray-900 text-white hover:bg-black/90 transition-all cursor-pointer border-0">
                    <span className="font-bold tracking-wider">
                        CHECK OUT MY PROJECTS
                    </span>
                </RetroBox>
            </a>

          </div>

          {/* Illustration (Right Side) - Styled to look like the reference image */}
          <div className="lg:w-2/5 flex justify-center lg:justify-end h-[300px] w-full lg:h-[450px] lg:w-[450px] mb-10 lg:mb-0">
            <RetroIllustration />
          </div>
        </section>

        {/* Quick Links Section (New section based on reference image) */}
        <section className="my-16">
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {quickLinks.map(link => (
                    <a key={link.title} href={link.href} className="block">
                        <RetroBox className={`${QUICK_LINK_BG} ${HOVER_BG} cursor-pointer p-3 flex justify-between items-center transition-all`}>
                            <span className="font-semibold text-sm">{link.title}</span>
                            <span className="text-lg">&rarr;</span>
                        </RetroBox>
                    </a>
                ))}
            </div>
        </section>


        {/* Portfolio Section (2-column grid - Updated with retro style) */}
        <section id="portfolio" className="my-16 pt-10 border-t-4 border-gray-900">
          <div className="mb-12">
            <h3 className="text-4xl md:text-5xl font-extrabold tracking-tight">PROJECTS</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {portfolioItems.map((project) => (
                <div key={project.id}>
                    <RetroBox className="bg-white">
                        {/* Image Placeholder area based on the reference image */}
                        <div className={`w-full h-40 bg-gray-100 border-2 ${BORDER_COLOR} mb-4 flex items-center justify-center`}>
                            <span className="text-xs text-gray-600">Project Image Placeholder</span>
                        </div>
                        
                        <div className="p-2">
                            <h4 className="text-2xl font-bold mb-2 leading-tight">
                                {project.title}
                            </h4>
                            <p className="text-sm text-gray-700 mb-4">
                                {project.description}
                            </p>
                            <a
                                href={project.link}
                                className={`inline-block`}
                                target={project.openInNewTab ? "_blank" : "_self"}
                                rel={project.openInNewTab ? "noopener noreferrer" : ""}
                            >
                                <RetroBox className="bg-gray-900 text-white hover:bg-black/80 transition-all cursor-pointer border-0 py-2 px-3">
                                    <span className="font-bold text-xs tracking-wide">
                                        VIEW PROJECT
                                    </span>
                                </RetroBox>
                            </a>
                        </div>
                    </RetroBox>
                </div>
            ))}
          </div>
        </section>

        <hr className="border-t-4 border-gray-900 my-16" />

        {/* ABOUT ME Section (Minimalist Style) */}
        <section id="about" className="my-16"> 
          <h2 className="text-xl font-bold mb-4">ABOUT ME</h2>
          <h3 className="text-4xl md:text-5xl font-extrabold mb-6 max-w-4xl">
              I AM AVAILABLE FOR <span className="underline decoration-wavy decoration-4 underline-offset-8">WEB DEV PROJECTS</span>
          </h3>
          <p className="text-lg text-gray-700 leading-relaxed max-w-4xl">
           Hi, I'm Benedict Mequiabas, a Web Developer specializing in Front-end Development. I transform client visions into engaging and functional digital realities. My expertise lies in building fast, scalable, and responsive user interfaces with a strong emphasis on UI/UX principles. I'm dedicated to ensuring that every project not only meets technical requirements but also provides an intuitive and delightful experience for the end-user.
          </p>
        </section>

        <hr className="border-t-4 border-gray-900 my-16" />

        {/* Contact Section (Retro Box Style) */}
        <section
          id="contact"
          className="my-16"
        >
            <h3 className="text-4xl md:text-5xl font-extrabold mb-6">
                CONNECT WITH ME
            </h3>
            
            <RetroBox className="max-w-xl mx-auto bg-gray-100">
                <form className="space-y-6">
                    <input
                        type="email"
                        placeholder="Email"
                        className={`w-full p-3 border-2 ${BORDER_COLOR} bg-white placeholder-gray-500 focus:outline-none`}
                    />
                    <textarea
                        placeholder="Message"
                        rows={5}
                        className={`w-full p-3 border-2 ${BORDER_COLOR} bg-white placeholder-gray-500 focus:outline-none`}
                    />
                    <button
                        type="submit"
                        className={`w-full`}
                    >
                        <RetroBox className="bg-gray-900 text-white hover:bg-black/90 transition-all cursor-pointer border-0 py-3">
                            <span className="text-lg font-bold">
                                Stay Connected
                            </span>
                        </RetroBox>
                    </button>
                </form>
            </RetroBox>
        </section>
      </div>

      {/* Footer (Simplified) */}
      <footer className={`border-t-4 ${BORDER_COLOR} py-6 text-center text-sm bg-gray-100`}>
        <p className="text-gray-700">
          &copy; {new Date().getFullYear()} **{NAME}**. All rights
          reserved.
        </p>
      </footer>
    </main>
  );
}

export default App;