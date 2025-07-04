import type { FC } from "react";

const Header: FC<{ handleGoToDashboard: () => void }> = ({
  handleGoToDashboard,
}) => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
    <div className="container mx-auto px-6 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <svg
          width="28"
          height="28"
          viewBox="0 0 136 118"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M110.16 88.08L68.22 118L25.84 88.08L0 73.13L25.84 59.25L51.68 73.13V44.38L25.84 30.5L0 15.63L25.84 0L68.22 30.5L110.16 0L136 15.63L110.16 30.5L84.32 44.38V73.13L110.16 59.25L136 73.13L110.16 88.08Z"
            fill="#0284c7"
          />
        </svg>
        <span className="font-bold text-xl text-slate-800">
          Sustainable Delivery
        </span>
      </div>
      <nav className="hidden md:flex items-center space-x-8">
        <a
          href="#how-it-works"
          className="text-slate-600 hover:text-slate-900 font-medium transition"
        >
          How It Works
        </a>
        <a
          href="#features"
          className="text-slate-600 hover:text-slate-900 font-medium transition"
        >
          Features
        </a>
        <a
          href="#testimonials"
          className="text-slate-600 hover:text-slate-900 font-medium transition"
        >
          Community
        </a>
      </nav>
      <button
        onClick={handleGoToDashboard}
        className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-5 py-2 rounded-lg transition shadow-md shadow-sky-500/20"
      >
        Launch App
      </button>
    </div>
  </header>
);

export default Header;
