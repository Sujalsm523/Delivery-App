import React, { type FC } from "react";
import Header from "../components/Header";
// import Footer from "../components/Header";
import FadeIn from "../components/ui/FadeIn";
import HeroSection from "../components/sections/HeroSection";
import StatsSection from "../components/sections/StatsSection";
import { features, howItWorksSteps, testimonials } from "../data/Landingpage";
import { useAuth } from "../hooks/Auth";

// --- UI COMPONENTS ---

// 1. Animated Fade-In Element

// 2. Animated Route Network Background (Updated for Light Theme)
// const RouteNetworkCanvas: FC = () => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     let points: { x: number; y: number }[] = [];
//     let movingDots: { from: number; to: number; progress: number }[] = [];
//     const pointCount = 30;
//     const dotCount = 15;

//     const resizeCanvas = () => {
//       canvas.width = window.innerWidth;
//       canvas.height = document.documentElement.scrollHeight;
//     };

//     const createNetwork = () => {
//       points = [];
//       for (let i = 0; i < pointCount; i++) {
//         points.push({
//           x: Math.random() * canvas.width,
//           y: Math.random() * canvas.height,
//         });
//       }
//       movingDots = [];
//       for (let i = 0; i < dotCount; i++) {
//         const from = Math.floor(Math.random() * pointCount);
//         let to = Math.floor(Math.random() * pointCount);
//         while (to === from) {
//           to = Math.floor(Math.random() * pointCount);
//         }
//         movingDots.push({ from, to, progress: Math.random() });
//       }
//     };

//     const animate = () => {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);

//       points.forEach((p1) => {
//         points.forEach((p2) => {
//           const distance = Math.sqrt(
//             Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)
//           );
//           if (distance < 250) {
//             ctx.beginPath();
//             ctx.moveTo(p1.x, p1.y);
//             ctx.lineTo(p2.x, p2.y);
//             ctx.strokeStyle = "rgba(203, 213, 225, 0.4)"; // Lighter slate color for light bg
//             ctx.stroke();
//           }
//         });
//       });

//       points.forEach((p) => {
//         ctx.beginPath();
//         ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
//         ctx.fillStyle = "rgba(56, 189, 248, 0.5)"; // Light blue
//         ctx.fill();
//       });

//       movingDots.forEach((dot) => {
//         dot.progress += 0.002;
//         if (dot.progress >= 1) {
//           dot.progress = 0;
//           dot.from = Math.floor(Math.random() * pointCount);
//           dot.to = Math.floor(Math.random() * pointCount);
//         }
//         const fromPoint = points[dot.from];
//         const toPoint = points[dot.to];
//         const x = fromPoint.x + (toPoint.x - fromPoint.x) * dot.progress;
//         const y = fromPoint.y + (toPoint.y - fromPoint.y) * dot.progress;

//         ctx.beginPath();
//         ctx.arc(x, y, 4, 0, Math.PI * 2);
//         ctx.fillStyle = "#10b981"; // Emerald green
//         ctx.fill();
//       });

//       requestAnimationFrame(animate);
//     };

//     window.addEventListener("resize", resizeCanvas);
//     resizeCanvas();
//     createNetwork();
//     animate();

//     return () => window.removeEventListener("resize", resizeCanvas);
//   }, []);

//   return (
//     <canvas
//       ref={canvasRef}
//       className="fixed top-0 left-0 w-full h-full z-0 opacity-50"
//     />
//   );
// };

// --- DATA & SVG Icons ---

const Icons = {
  route: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12a10 10 0 1 0 20 0 10 10 0 1 0-20 0" />
      <path d="M12 18a6 6 0 1 0 0-12 6 6 0 1 0 0 12z" />
      <path d="M12 12v6" />
      <path d="M12 6V3" />
      <path d="M12 21v-3" />
      <path d="M18 12h3" />
      <path d="M3 12h3" />
    </svg>
  ),
  community: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  tracking: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  rewards: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.685a.5.5 0 0 0-.6 0l-3.58 2.685a.5.5 0 0 1-.81-.47L9.523 12.89l-5.3-4.12a.5.5 0 0 1 .292-.864l8.345-1.213a.5.5 0 0 0 .472-.334l3.737-7.62a.5.5 0 0 1 .882 0l3.737 7.62a.5.5 0 0 0 .472.334l8.345 1.213a.5.5 0 0 1 .292.864l-5.3 4.12z" />
    </svg>
  ),
  carbon: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="M12 12c-3 3-6-3-6-3s3-6 6-3zm0 0c3-3 6 3 6 3s-3 6-6 3z" />
    </svg>
  ),
  scheduling: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 22h14" />
      <path d="M5 2h14" />
      <path d="M17 2v20" />
      <path d="M7 2v20" />
      <path d="M12 2v4" />
      <path d="M12 22v-4" />
      <path d="M12 8v8" />
    </svg>
  ),
};

const Footer: FC = () => {
  return (
    <footer className="relative bg-slate-900 border-t border-slate-200 pt-16 pb-8 px-6 text-white">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <svg
                width="28"
                height="28"
                viewBox="0 0 136 118"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M110.16 88.08L68.22 118L25.84 88.08L0 73.13L25.84 59.25L51.68 73.13V44.38L25.84 30.5L0 15.63L25.84 0L68.22 30.5L110.16 0L136 15.63L110.16 30.5L84.32 44.38V73.13L110.16 59.25L136 73.13L110.16 88.08Z"
                  fill="#38bdf8"
                />
              </svg>
              <span className="font-bold text-xl text-white">
                Sustainable Delivery
              </span>
            </div>
            <p className="text-slate-400 max-w-md">
              Our mission is to create a more sustainable future by connecting
              communities and reducing the environmental impact of last-mile
              delivery.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <a
                href="#how-it-works"
                className="text-slate-400 hover:text-sky-400 transition"
              >
                How It Works
              </a>
              <a
                href="#features"
                className="text-slate-400 hover:text-sky-400 transition"
              >
                Features
              </a>
              <a
                href="#testimonials"
                className="text-slate-400 hover:text-sky-400 transition"
              >
                Community
              </a>
            </nav>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-slate-400 hover:text-sky-400 transition"
                aria-label="Twitter"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-sky-400 transition"
                aria-label="Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0 1.442c-3.116 0-3.472.011-4.694.068-2.61.12-3.864 1.37-3.984 3.984-.056 1.222-.067 1.578-.067 4.694s.011 3.472.067 4.694c.12 2.61 1.37 3.864 3.984 3.984 1.222.056 1.578.067 4.694.067s3.472-.011 4.694-.067c2.61-.12 3.864-1.37 3.984-3.984.056-1.222.067-1.578.067-4.694s-.011-3.472-.067-4.694c-.12-2.61-1.37-3.864-3.984-3.984C15.472 3.614 15.116 3.605 12 3.605z" />
                  <path d="M12 6.865a5.135 5.135 0 1 0 0 10.27 5.135 5.135 0 0 0 0-10.27zm0 8.797a3.662 3.662 0 1 1 0-7.324 3.662 3.662 0 0 1 0 7.324zM16.965 6.402a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-sky-400 transition"
                aria-label="LinkedIn"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-600 pt-8 mt-8 text-center text-slate-500 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Sustainable Delivery. All Rights
            Reserved. Made with ♥ for the Planet.
          </p>
        </div>
      </div>
    </footer>
  );
};

interface HomePageProps {
  setCurrentPage: (page: string) => void;
}
// --- MAIN APP COMPONENT ---
const HomePage: React.FC<HomePageProps> = ({ setCurrentPage }) => {
  const handleLaunchApp = () => alert("Launching the main application...");
  // const { user, userProfile, loading } = useAuth();
  const handleGoToDashboard = () => {
    // if (userProfile?.role === "volunteer") setCurrentPage("volunteerDashboard");
    // if (userProfile?.role === "recipient") setCurrentPage("recipientDashboard");
    // if (userProfile?.role === "storeAssociate")
    //   setCurrentPage("storeAssociateDashboard")
    setCurrentPage("login");
  };

  const styles = `
      body { font-family: 'Inter', sans-serif; background-color: #f1f5f9; color: #334155; scroll-behavior: smooth; }
    `;

  return (
    <div className="min-h-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-green-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-green-300 rounded-full blur-lg animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-blue-300 rounded-full blur-md animate-pulse delay-500"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-white via-blue-100 to-green-100 bg-clip-text text-transparent">
            Sustainable Last-Mile Delivery
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Revolutionizing delivery through community power, cutting-edge technology, and environmental responsibility
          </p>
          
          {loading ? (
            <div className="inline-flex items-center space-x-2 text-blue-200">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              <span className="text-lg">Loading your personalized experience...</span>
            </div>
          ) : user && !user.isAnonymous ? (
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 inline-block">
                <p className="text-2xl font-semibold text-blue-100 mb-4">
                  Welcome back, {userProfile?.role}! 🎉
                </p>
                <Button 
                  onClick={handleGoToDashboard}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Access Your Dashboard →
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={() => setCurrentPage("login")}
                className="bg-blue text-blue-900 hover:bg-blue-50 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Sign In to Continue
              </Button>
              <Button
                onClick={() => setCurrentPage("register")}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Join Our Community 🚀
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-6 transform group-hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <div className="text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

        {/* --- WHY CHOOSE US / FEATURES SECTION --- */}
        <section id="features" className="py-20 sm:py-32 px-6 bg-slate-50">
          <div className="container mx-auto">
            <FadeIn>
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                  Why Choose Our Platform?
                </h2>
                <p className="text-lg text-slate-600 mt-4">
                  Built on a foundation of technology, sustainability, and
                  community.
                </p>
              </div>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <FadeIn
                  key={index}
                  delay={150 * index}
                  className="p-8 bg-white border border-slate-200 rounded-2xl text-center shadow-sm"
                >
                  <div className="mb-6 inline-block bg-sky-100 p-4 rounded-full text-sky-600">
                    {Icons[feature.icon as keyof typeof Icons]}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* --- TESTIMONIALS SECTION --- */}
        <section id="testimonials" className="py-20 sm:py-32 px-6 bg-white">
          <div className="container mx-auto">
            <FadeIn>
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                  Powered by People Like You
                </h2>
                <p className="text-lg text-slate-600 mt-4">
                  Real stories from the heart of our community.
                </p>
              </div>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <FadeIn
                  key={index}
                  delay={150 * index}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-8 flex flex-col items-center text-center"
                >
                  <div className="text-5xl mb-4">{testimonial.avatar}</div>
                  <p className="text-slate-600 mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="mt-auto border-t border-slate-200 pt-4 w-full">
                    <h4 className="font-bold text-slate-800">
                      {testimonial.name}
                    </h4>
                    <p className="text-sky-600 text-sm">{testimonial.role}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* --- CTA Section --- */}
        <section className="py-20 sm:py-32 text-center px-6 bg-gradient-to-br from-sky-100 via-white to-green-100">
          <div className="container mx-auto">
            <FadeIn>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
                Ready to Transform Delivery?
              </h2>
              <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                Join thousands of community members already making a positive
                impact.
              </p>
              <button
                onClick={handleLaunchApp}
                className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-lg px-10 py-4 rounded-xl transition shadow-lg shadow-sky-500/20"
              >
                Start Your Journey Today 🚀
              </button>
            </FadeIn>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
