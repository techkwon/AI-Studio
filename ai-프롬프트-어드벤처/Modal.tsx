import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void; // For the primary action (e.g., Confirm)
  onDismiss?: () => void; // Optional: For the secondary close action (e.g., 'X' button)
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onDismiss, title, children }) => {
  if (!isOpen) return null;

  const handleDismissClick = onDismiss || onClose;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 z-50 transition-opacity duration-300 ease-in-out">
      <div className="bg-neutral-800/30 backdrop-blur-xl rounded-lg shadow-2xl p-5 sm:p-6 w-full max-w-md transform transition-all duration-300 ease-in-out scale-95 animate-modalPopIn">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">{title}</h2>
          <button
            onClick={handleDismissClick}
            className="text-gray-300 hover:text-white text-4xl sm:text-5xl font-light leading-none"
            aria-label="닫기"
          >
            &times;
          </button>
        </div>
        <div className="text-gray-200 space-y-2 sm:space-y-3 max-h-[60vh] overflow-y-auto pr-2 text-base sm:text-lg">
            {children}
        </div>
        <div className="mt-5 sm:mt-6 text-right">
          <button
            onClick={onClose}
            className="bg-white/5 backdrop-blur-md border-2 border-pink-500 text-pink-300 hover:bg-pink-500 hover:text-white font-semibold py-2 px-5 sm:px-6 rounded-lg shadow-lg hover:shadow-xl hover:shadow-pink-500/30 transform hover:scale-105 transition-all duration-300 ease-in-out text-base sm:text-lg"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;