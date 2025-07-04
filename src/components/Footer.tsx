import type { FC } from "react";

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

export default Footer;
