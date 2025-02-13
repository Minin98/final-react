import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import apiAxios from "../lib/apiAxios";
import "../css/QNA.css";

export default function QNA({ setAskWriting }) {
  const [qnaBoard, setQnaBoard] = useState([]);
  const [comments, setComments] = useState({});
  const [addComment, setAddComment] = useState({});
  const { classNumber } = useParams();

  useEffect(() => {
    apiAxios
      .get(`/class/${classNumber}/qna`)
      .then((res) => {
        setQnaBoard(res.data.qnaBoard);
        setComments(res.data.comments || {});
        console.log("qnaBoard", res.data.qnaBoard);
        console.log("comments", res.data.comments);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [classNumber]);

  const formatDate = (dateTime) => {
    return dateTime.substring(0, 10);
  };

  // 답변 추가 버튼 클릭 시 입력창 표시
  const handleAddCommentClick = (askNumber) => {
    setAddComment((prev) => ({
      ...prev,
      [askNumber]: "",
    }));
  };

  // 답변 입력 시 상태 업데이트
  const handleAddCommentChange = (askNumber, value) => {
    setAddComment((prev) => ({
      ...prev,
      [askNumber]: value,
    }));
  };

  // 답변 등록 기능
  const handleAddCommentSubmit = (askNumber) => {
    if (!addComment[askNumber].trim()) {
      alert("답변을 입력해주세요.");
      return;
    }

    const params = {
      commentContent: addComment[askNumber],
      askNumber: askNumber,
    };

    apiAxios
      .post(`/class/${classNumber}/qna/comment`, params)
      .then((res) => {
        alert("답변이 성공적으로 등록되었습니다.");
        setAddComment((prev) => ({
          ...prev,
          [askNumber]: "",
        }));
        // 댓글 리스트를 다시 불러오기
        apiAxios.get(`/class/${classNumber}/qna`).then((res) => {
          setComments(res.data.comments || {});
        });
      })
      .catch((err) => {
        console.error(err);
        alert("답변 등록 중 오류가 발생했습니다.");
      });
  };


  return (
    <div className="qna-board">
      <h2 className="qna-board-title">
        궁금한 점을 자유롭게 질문하고,
        <br />
        다른 사람들의 질문에 답변을 통해 지식을 나눠보세요.
      </h2>
      <button className="qna-write-button" onClick={() => setAskWriting(true)}>질문하기</button>

      {qnaBoard.length > 0 ? (
        qnaBoard.map((qnaBoard, index) => (
          <div key={index} className="qna-card">
            <span className="qna-chapter">{qnaBoard.chapterName}</span>
            <p className="qna-title">{qnaBoard.askTitle}</p>
            <p className="qna-content">{qnaBoard.askContent}</p>
            <div className="qna-writer">
              <img
                src="/img/user.png"
                alt="User Icon"
                className="qna-writer-icon"
              />
              <p className="qna-writer-name">{qnaBoard.name}</p>
              <span className="qna-date">{formatDate(qnaBoard.askCreateTime)}</span>
              <div className="qna-comment-count-container">
                <img src="/img/comment.png" alt="Comment Icon" />
                <span className="qna-comment-count">{comments[qnaBoard.askNumber] ? comments[qnaBoard.askNumber].length : 0}</span>
              </div>
            </div>
            <div className="comments-section">
              {comments[qnaBoard.askNumber] && comments[qnaBoard.askNumber].length > 0 ? (
                comments[qnaBoard.askNumber].map((comment, idx) => (
                  <div key={idx} className="comment-card">
                    <div className="comment-header">
                      <div className="comment-user-icon">
                        <img src="/img/user.png" alt="User Icon" />
                        <span className="comment-user-name">{comment.name}</span>
                      </div>
                      <span className="comment-date">
                        {formatDate(comment.commentCreateTime)}
                      </span>
                    </div>
                    <p className="comment-content">{comment.commentContent}</p>
                  </div>
                ))
              ) : (
                <p className="no-comments">등록된 댓글이 없습니다.</p>
              )}
              {addComment[qnaBoard.askNumber] !== undefined ? (
              <div className="add-comment-container">
              <input
                type="text"
                placeholder="답변을 입력해주세요"
                value={addComment[qnaBoard.askNumber]}
                onChange={(e) => handleAddCommentChange(qnaBoard.askNumber, e.target.value)}
              />
              <button className="add-comment-submit-button" onClick={() => handleAddCommentSubmit(qnaBoard.askNumber)}>
                <img src="/img/add-comment-icon.png" alt="Submit Comment" />
              </button>
            </div>
          ) : (
            <button className="add-comment-button" onClick={() => handleAddCommentClick(qnaBoard.askNumber)}>답변 추가</button>
          )}
            </div>
          </div>
        ))
      ) : (
        <p className="no-qna-message">등록된 QnA가 없습니다.</p>
      )}

    </div>
  );
}
