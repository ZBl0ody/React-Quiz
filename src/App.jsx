import React, { useEffect, useReducer, useState } from "react";
import Header from "./components/Header";
import MainPage from "./components/MainPage";
import Loader from "./components/Loader";
import Error from "./components/Error";
import StartScreen from "./components/StartScreen";
import Question from "./components/Question";
import NextButton from "./components/NextButton";
import Progress from "./components/Progress";
import FinishScreen from "./components/FinishScreen";
import Timer from "./components/Timer";

const URL = "http://localhost:8000/questions";
const SECS_PER_QUESTIONS = 30;
const initilaState = {
  questions: [],
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataRecevied":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFaild":
      return { ...state, status: "error" };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTIONS,
      };
    case "next":
      return { ...state, index: state.index++, answer: null };
    case "restart":
      return {
        ...initilaState,
        questions: state.questions,
        highscore: state.highscore,
        status: "ready",
      };
    case "finish":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "newAnswer":
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? (state.points += question.points)
            : state.points,
      };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };

    default:
      throw new Error("action unkonwn");
  }
}

const App = () => {
  const [
    { questions, status, index, answer, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initilaState);
  const numQuestions = questions.length;
  const totlaPoints = questions.reduce((prv, cur) => (prv += cur.points), 0);

  useEffect(() => {
    async function getQuestions() {
      try {
        const res = await fetch(URL);
        const data = await res.json();
        dispatch({ type: "dataRecevied", payload: data });
      } catch (error) {
        console.log(error.message);
        dispatch({ type: "dataFaild" });
      }
    }
    getQuestions();
  }, []);

  return (
    <div className="app">
      <Header />
      <MainPage>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              numQuestions={numQuestions}
              index={index}
              points={points}
              totlaPoints={totlaPoints}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <footer>
              <NextButton
                numQuestions={numQuestions}
                index={index}
                dispatch={dispatch}
                answer={answer}
              />
              <Timer secondsRemaining={secondsRemaining} dispatch={dispatch} />
            </footer>
          </>
        )}

        {status == "finished" && (
          <FinishScreen
            totlaPoints={totlaPoints}
            points={points}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </MainPage>
    </div>
  );
};

export default App;
