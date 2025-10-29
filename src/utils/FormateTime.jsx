const formatTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return (
    <div className="flex items-center gap-2">
      <span className="text-base">{hours}h</span>
      <span className="text-base">{mins}m</span>
    </div>
  );
};

export default formatTime;
