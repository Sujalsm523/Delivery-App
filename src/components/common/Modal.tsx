import type { FC, ReactNode } from "react";
import FadeIn from "./FadeIn";
import FormCard from "../form/FormCard";

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
}

const Modal: FC<ModalProps> = ({ children, onClose }) => (
  <div
    className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"
    onClick={onClose}
    role="button"
    tabIndex={0}
    aria-label="Close modal"
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
        onClose();
      }
    }}
  >
    <div
      className="relative w-full max-w-lg"
      onClick={(e) => e.stopPropagation()}
    >
      <FadeIn>
        <FormCard className="border-cyan-500/50">
          {children}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
            aria-label="Close modal"
          >
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
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </FormCard>
      </FadeIn>
    </div>
  </div>
);

export default Modal;
