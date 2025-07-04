import type { FC } from "react";
import FadeIn from "../ui/FadeIn";

const HeroSection: FC<{ handleGoToDashboard: () => void }> = ({
  handleGoToDashboard,
}) => (
  <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden px-6">
    {/* Blurred Background Layer */}
    <div className="absolute inset-0 z-10">
      <div
        className="w-full h-full bg-cover bg-center filter blur-md "
        style={{
          backgroundImage: `url('/bg.png')`, // replace with actual path
        }}
      ></div>
    </div>

    {/* Foreground Content */}
    <div className="relative z-10 max-w-4xl mx-auto">
      <FadeIn>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-800 leading-tight mb-6">
          Smarter Delivery. <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-green-500">
            Greener Planet.
          </span>
        </h1>
      </FadeIn>
      <FadeIn delay={200}>
        <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-10">
          Join a hyperlocal delivery network that rewards you for helping
          neighbors, reducing carbon emissions, and strengthening local bonds.
        </p>
      </FadeIn>
      <FadeIn
        delay={400}
        className="flex flex-col sm:flex-row justify-center items-center gap-4"
      >
        <button
          onClick={handleGoToDashboard}
          className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white font-bold text-lg px-10 py-4 rounded-xl transition shadow-lg shadow-sky-500/20"
        >
          Start Delivering
        </button>
        <a
          href="#how-it-works"
          className="w-full sm:w-auto text-slate-700 font-semibold px-10 py-4 rounded-xl hover:bg-slate-100 transition"
        >
          Learn More
        </a>
      </FadeIn>
    </div>
  </section>
);

export default HeroSection;
