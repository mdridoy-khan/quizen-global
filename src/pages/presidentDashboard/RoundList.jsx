import { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { GoQuestion } from "react-icons/go";
import { HiOutlineBookOpen } from "react-icons/hi2";
import { IoCalendarOutline, IoClose, IoTimeOutline } from "react-icons/io5";
import { LuCirclePlus } from "react-icons/lu";
import { TbListDetails } from "react-icons/tb";
import { Link, useParams } from "react-router-dom";
import API from "../../api/API";
import QuizCard from "../../components/QuizCard";
import RoundQualifyList from "../../components/RoundQualifyList";
import { formatDate } from "../../utils/FormateDate";
import { formatDateTime } from "../../utils/FormateDateTime";
import formatTime from "../../utils/FormateTime";
import SingleRoundDetails from "./SingleRoundDetails";

const RoundList = () => {
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [announcement, setAnnouncement] = useState(null);
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [selectedRoundId, setSelectedRoundId] = useState(null);
  const [topicSubject, setTopicSubject] = useState(null);
  const [modalRoundId, setModalRoundId] = useState(null);
  const [quizCreationData, setQuizCreationData] = useState(null);
  const [selectedNextRound, setSelectedNextRound] = useState(null);

  console.log("rounds", rounds);

  // Fetch announcement details
  useEffect(() => {
    const fetchAnnouncement = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await API.get(
          `/anc/single-announcement-details/${id}/`
        );
        setAnnouncement(response?.data?.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncement();
  }, [id]);

  // Fetch rounds
  useEffect(() => {
    const fetchRounds = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await API.get(`/anc/announcement-round-list/${id}/`);
        setRounds(response.data.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRounds();
  }, [id]);

  const handleOpenModal = (roundID) => {
    setModalRoundId(roundID);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalRoundId(null);
  };

  const handleParticipate = (roundId, nextRoundQualifier, topicSubject) => {
    setSelectedRoundId((prev) => (prev === roundId ? null : roundId));
    setSelectedNextRound(nextRoundQualifier);
    setTopicSubject((prev) => (prev === topicSubject ? null : topicSubject));
  };

  const openModal = (roundId, annId) => {
    setQuizCreationData({ roundId, annId });
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setQuizCreationData(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-3">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-base font-semibold text-gray-700">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red500 font-bold">
        Error loading data!
      </div>
    );
  }
  return (
    <div>
      {/* Round step list */}
      <div className="mb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl md:text-2xl 2xl:text-3xl text-black font-semibold">
            ROUND'S LIST
          </h2>
          <Link
            to={`/president/round-creation-form/${id}`}
            className="inline-flex items-center text-sm font-bold bg-primary py-2 px-4 rounded gap-2 text-white"
          >
            CREATE ROUND <LuCirclePlus size={18} color="#ffffff" />
          </Link>
        </div>

        <h3 className="text-base font-bold mb-4">ANNOUNCEMENT INFORMATION</h3>
        <div className="w-full sm:max-w-3xl">
          {announcement && (
            <QuizCard
              layout="horizontal"
              image={announcement.announcement_event_image}
              title={announcement.announcement_name}
              startDate={formatDate(announcement.registration_start_date)}
              endDate={formatDate(announcement.registration_end_date)}
              rounds={announcement.round_number}
              duration={announcement.total_days}
              registrationText={announcement.is_reg_open}
              showCashPrize={announcement.is_pricemoney}
              showCertificate={announcement.is_certificate}
              termsLink="/terms-and-conditions"
              organizer={announcement.organizer_name}
            />
          )}
        </div>

        <h3 className="text-lg lg:text-xl xl:text-2xl font-bold mt-16 mb-4">
          TOTAL ROUND {rounds.length}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 relative">
          {rounds.map((round, index) => (
            <div key={round.id}>
              <div className="bg-[#E5F0FF] shadow rounded-xl p-4">
                <button
                  onClick={() => handleOpenModal(round.id)}
                  className="w-full flex justify-end mb-4"
                >
                  <FiEdit
                    size={20}
                    className="transition hover:text-indigo-500"
                  />
                </button>
                <div className="flex items-center justify-between gap-4 flex-col sm:flex-row mb-4">
                  <p className="text-lg font-semibold text-black">
                    {round.round_name}
                  </p>
                  <h4 className="text-xs py-1 px-2 rounded-full bg-indigo-200 text-indigo-500 font-semibold">
                    Round {index + 1}
                  </h4>
                </div>
                <ul className="flex flex-col space-y-1 text-sm font-medium">
                  <li className="flex items-center gap-2">
                    <IoCalendarOutline size={18} />
                    {formatDateTime(round.quiz_start_date)} to{" "}
                    {formatDateTime(round.quiz_end_date)}
                  </li>
                  <li className="flex items-center gap-1">
                    <IoTimeOutline size={20} />
                    Duration: {formatTime(round.duration)}
                  </li>
                  <li className="flex items-center gap-1">
                    <GoQuestion size={18} />
                    Total Questions: {round.total_questions}
                  </li>
                  <li className="flex items-center gap-1">
                    <HiOutlineBookOpen size={18} />
                    Subject: {round.topic_subject}
                  </li>
                </ul>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <button
                    className="self-start flex items-center justify-center gap-2 transition bg-secondary hover:bg-primary rounded-lg py-2 px-2 xl:px-3 text-white text-[12px]  font-semibold"
                    onClick={() =>
                      handleParticipate(
                        round.id,
                        round.next_round_qualifier,
                        round.topic_subject
                      )
                    }
                  >
                    VIEW PARTICIPANT{" "}
                    <TbListDetails className="text-base xl:text-lg 2xl:text-xl" />
                  </button>
                  <div className="relative group">
                    <button
                      onClick={() =>
                        openModal(round.id, id || round.announcement)
                      }
                      disabled={round.is_created_quiz}
                      className={`self-start flex items-center justify-center gap-2 transition rounded-lg py-2 px-2 xl:px-3 text-white text-[12px] font-semibold 
                      ${
                        round.is_created_quiz
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-secondary hover:bg-primary"
                      }`}
                    >
                      CREATE QUIZ{" "}
                      <LuCirclePlus className="text-base xl:text-lg 2xl:text-xl" />
                    </button>

                    {round.is_created_quiz && (
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-[11px] font-medium bg-black text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        1 Question set submitted
                      </span>
                    )}
                  </div>

                  {/* <button
                    onClick={() =>
                      openModal(round.id, id || round.announcement)
                    }
                    disabled={!round.is_created_quiz}
                    className="self-start flex items-center justify-center gap-2 transition bg-secondary hover:bg-primary rounded-lg py-2 px-1 text-white text-[12px]  font-semibold"
                  >
                    CREATE QUIZ{" "}
                    <LuCirclePlus className="text-base xl:text-lg 2xl:text-xl" />
                  </button> */}
                </div>
              </div>
            </div>
          ))}
        </div>
        {selectedRoundId && selectedNextRound && topicSubject && (
          <div className="mt-10">
            <RoundQualifyList
              roundId={selectedRoundId}
              nextRoundQualifier={selectedNextRound}
              topicSubject={topicSubject}
            />
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black600 bg-opacity-50">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-scrollbar]:hidden">
            <SingleRoundDetails
              onClose={handleCloseModal}
              roundID={modalRoundId}
              id={id}
              isCreatedQuiz={
                rounds.find((r) => r.id === modalRoundId)?.is_created_quiz
              }
            />
          </div>
        </div>
      )}

      {/* Question making alert modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black600 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 relative">
            <div className="flex items-center justify-end">
              <button
                onClick={closeModal}
                className="text-gray500 hover:text-gray700 transition-colors mb-2"
              >
                <IoClose size={24} />
              </button>
            </div>

            <h2 className="text-2xl font-semibold text-gray800 mb-6 text-center">
              Choose a method to create your quiz
            </h2>

            <div className="flex flex-col gap-4">
              <Link
                to={`/president/create-quiz/ai/${quizCreationData?.roundId}/${quizCreationData?.annId}`}
                className="w-full text-base font-semibold flex items-center justify-center py-3 bg-secondary text-white rounded-lg hover:bg-primary transition-colors focus:outline-none"
                onClick={closeModal}
              >
                AI
              </Link>
              <Link
                to={`/president/create-quiz/shared/${quizCreationData?.roundId}/${quizCreationData?.annId}`}
                className="w-full text-base font-semibold flex items-center justify-center py-3 bg-secondary text-white rounded-lg hover:bg-primary transition-colors focus:outline-none"
                onClick={closeModal}
              >
                Shared Question
              </Link>
              <Link
                to={`/president/create-quiz/mix/${quizCreationData?.roundId}/${quizCreationData?.annId}`}
                className="w-full text-base font-semibold flex items-center justify-center py-3 bg-secondary text-white rounded-lg hover:bg-primary transition-colors focus:outline-none"
                onClick={closeModal}
              >
                Mix
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoundList;
