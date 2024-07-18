import React from "react";
const FinishScreen = ({ points, totlaPoints, highscore, dispatch }) => {
  const percentage = (points / totlaPoints) * 100;

  let emoji;
  if (percentage === 100) emoji = "🥇";
  if (percentage >= 80 && percentage < 100) emoji = "🎉";
  if (percentage >= 50 && percentage < 8) emoji = "😊";
  if (percentage >= 0 && percentage < 50) emoji = "🤔";
  if (percentage === 0) emoji = "🤦‍♂️";

  return (
    <>
      <p className="result">
        <span>{emoji}</span>
        you scored <strong>{points}</strong> out of {totlaPoints} (
        {Math.ceil(percentage)})%
      </p>
      <p className="highscore">
        (Highscore: {highscore} points){emoji}
      </p>
      <button
        className="btn btn-ui"
        onClick={() => {
          dispatch({ type: "restart" });
        }}
      >
        Restart
      </button>
    </>
  );
};

export default FinishScreen;
