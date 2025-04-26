import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FailAlertProps {
  message: string;
  onClose?: () => void; // Optional callback for closing the alert
}

export const FailAlert: React.FC<FailAlertProps> = ({ message, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false); // Trigger exit animation
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false); // Trigger exit animation
    if (onClose) onClose(); // Call the onClose callback
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-4 right-4 flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg"
          role="alert"
          initial={{ x: 300, opacity: 0 }} // Start off-screen to the right
          animate={{ x: 0, opacity: 1 }} // Slide into view
          exit={{ x: 300, opacity: 0 }} // Slide out of view
          transition={{ duration: 0.5 }} // Animation duration
        >
          {/* Icon */}
          <div className="flex items-center justify-center w-6 h-6 bg-red-500 text-white rounded-full mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v4a1 1 0 102 0V7zm-1 8a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {/* Message */}
          <div className="flex-1">
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">{message}</span>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="text-red-700 hover:text-red-900 ml-4 focus:outline-none"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
