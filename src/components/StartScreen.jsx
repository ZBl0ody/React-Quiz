import React from "react";

const StartScreen = ({ numQuestions, dispatch }) => {
  return (
    <div className="start">
      <h2>welcome to The React Quiz?</h2>
      <h3>{numQuestions} questions to test your react mastery</h3>
      <button
        className="btn btn-ui"
        onClick={() => {
          dispatch({ type: "start" });
        }}
      >
        let's start
      </button>
    </div>
  );
};

export default StartScreen;
