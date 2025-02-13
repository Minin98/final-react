import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";  // useParams 추가
import apiAxios from "../lib/apiAxios";
import "../css/Quiz.css";

export default function Quiz({ onClose }) {
    const { chapterNumber } = useParams(); // ✅ URL에서 chapterNumber 가져오기
    const [quizzes, setQuizzes] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    console.log("현재 챕터 번호:", chapterNumber); // ✅ 값 확인

    // 퀴즈 데이터 가져오기
    useEffect(() => {
        if (!chapterNumber) return; // chapterNumber가 없을 경우 요청하지 않음

        apiAxios.get(`/quiz/list/${chapterNumber}`)
            .then((res) => setQuizzes(res.data.quizList))
            .catch((err) => console.error(err));
    }, [chapterNumber]);

    // 정답 선택 처리
    const handleAnswer = (answer) => {
        setSelectedAnswer(answer);
        setShowExplanation(true);

        const isCorrect = quizzes[currentIndex]?.answer === answer;
        if (isCorrect) setCorrectCount(prev => prev + 1);
    };

    // 다음 문제로 이동
    const handleNext = () => {
        if (currentIndex < quizzes.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelectedAnswer(null);
            setShowExplanation(false);
        } else {
            setIsFinished(true); // 마지막 문제 후 퀴즈 종료 화면으로 이동
        }
    };

    return (
        <div className="quiz-container">
            {!isFinished ? (
                quizzes.length > 0 && (
                    <div className="quiz-content">
                        <h3>퀴즈 진행률 : {currentIndex + 1} / {quizzes.length}</h3>
                        <h2>{currentIndex + 1}. {quizzes[currentIndex].question}</h2>

                        <div className="quiz-options">
                            <button 
                                className={`quiz-button ${selectedAnswer === "O" ? "selected" : ""}`} 
                                onClick={() => handleAnswer("O")}
                                disabled={showExplanation}
                            >O</button>
                            <button 
                                className={`quiz-button ${selectedAnswer === "X" ? "selected" : ""}`} 
                                onClick={() => handleAnswer("X")}
                                disabled={showExplanation}
                            >X</button>
                        </div>

                        {showExplanation && (
                            <div className="quiz-explanation">
                                <p><strong>정답: {quizzes[currentIndex].answer}</strong></p>
                                <p>{quizzes[currentIndex].description}</p>
                            </div>
                        )}

                        <div className="quiz-buttons">
                            <button onClick={handleNext} disabled={!showExplanation}>
                                {currentIndex < quizzes.length - 1 ? "다음" : "결과 보기"}
                            </button>
                        </div>
                    </div>
                )
            ) : (
                // 퀴즈 종료 화면
                <div className="quiz-result">
                    <h2>퀴즈 종료</h2>
                    <p>정답률: {((correctCount / quizzes.length) * 100).toFixed(2)}%</p>
                    <button onClick={onClose}>닫기</button>
                </div>
            )}
        </div>
    );
}
