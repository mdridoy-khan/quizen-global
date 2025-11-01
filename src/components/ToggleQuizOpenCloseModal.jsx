import { useState } from "react";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import QuizOpenCloseModal from "../components/modals/QuizOpenCloseModal";

const ToggleQuizOpenCloseModal = ({ id, isActive: initialIsActive }) => {
  const [isActive, setIsActive] = useState(initialIsActive);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ message: "", endpoint: "" });

  const handleToggle = () => {
    // Determine the action (open or close) and set modal config
    const willBeActive = !isActive;
    const message = willBeActive
      ? "Are you sure you want to open this announcement?"
      : "Are you sure you want to close this announcement?";
    const endpoint = willBeActive
      ? `/anc/open-announcement/${id}/`
      : `/anc/close-announcement/${id}/`;

    setModalConfig({ message, endpoint });
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    setIsActive((prev) => !prev);
  };

  return (
    <>
      <div
        onClick={handleToggle}
        className={`w-16 h-6 flex items-center rounded-full cursor-pointer px-1 transition-colors duration-300 ${
          isActive
            ? "bg-gradient-to-r from-green-400 to-emerald-600"
            : "bg-gradient-to-r from-red-400 to-rose-600"
        }`}
      >
        <div
          className={`w-5 h-5 rounded-full flex items-center justify-center transform transition-transform duration-300 shadow-md ${
            isActive
              ? "bg-gradient-to-r from-green-400 to-emerald-600 translate-x-10"
              : "bg-gradient-to-r from-red-400 to-rose-600 translate-x-0"
          }`}
        >
          {isActive ? (
            <AiOutlineCheck className="text-white text-base" />
          ) : (
            <AiOutlineClose className="text-white text-base" />
          )}
        </div>
      </div>
      <QuizOpenCloseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message={modalConfig.message}
        onConfirm={handleConfirm}
        endpoint={modalConfig.endpoint}
        id={id}
      />
    </>
  );
};

export default ToggleQuizOpenCloseModal;
