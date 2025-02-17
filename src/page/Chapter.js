import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import "../css/Chapter.css";
import apiAxios from "../lib/apiAxios";
import { jwtDecode } from "jwt-decode";
import VideoWrite from "./VideoWrite";
import QuizWrite from "./QuizWrite";
import QuizUpdate from "./QuizUpdate";

export default function Chapter({ isEnrolled }) {
    const [classInfo, setClassInfo] = useState({});
    const [chapters, setChapters] = useState([]);
    const [videos, setVideos] = useState({});
    const [isVideoWriteModalOpen, setVideoWriteModalOpen] = useState(false);
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [isChapterInsertMode, setIsChapterInsertMode] = useState(false);
    const [chapterNameInput, setChapterNameInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [isQuizWriteModalOpen, setQuizWriteModalOpen] = useState(false);
    const [isQuizUpdateModalOpen, setQuizUpdateModalOpen] = useState(false);
    const [selectedQuiz] = useState(null);

    const [isUpdatingChapter, setIsUpdatingChapter] = useState(null);
    const [updatedChapterName, setUpdatedChapterName] = useState("");

    const user = useSelector((state) => state.users.value);
    const { classNumber } = useParams();
    const navigate = useNavigate();

    const decodeToken = user.token ? jwtDecode(user.token) : "";
    const grade = decodeToken.grade || (decodeToken.roles === "강사" ? 1 : decodeToken.roles === "학생" ? 2 : 3);
    const isClassOwner = grade === 1 && decodeToken.sub === classInfo.uno;

    // 강의 정보 및 챕터, 영상 데이터 가져오기
    const fetchClassInfo = useCallback(() => {
        setLoading(true);
        apiAxios.get(`/class/${classNumber}`)
            .then((res) => {
                setClassInfo(res.data.class);
                setChapters(res.data.chapter || []);
                setVideos(res.data.video || {});
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, [classNumber]);

    useEffect(() => {
        fetchClassInfo();
    }, [fetchClassInfo]);

    // 초 단위의 시간을 hh:mm:ss 형식으로 변환
    const formatDuration = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return [h, m, s].map((unit) => String(unit).padStart(2, "0")).join(":");
    };

    // 챕터 내 비디오 개수 반환
    const getVideoCount = (chapterNumber) => {
        return videos[String(chapterNumber)] ? videos[String(chapterNumber)].length : 0;
    };

    // "영상 보기" 버튼 클릭 시 이동
    const handleWatchVideo = (videoNumber) => {
        navigate(`/video/${videoNumber}`);
    };

    // 챕터 추가 모드 ON/OFF
    const toggleChapterInsertMode = () => {
        setIsChapterInsertMode(!isChapterInsertMode);
        setChapterNameInput("");
    };

    // 챕터 등록
    const insertChapter = () => {
        if (!chapterNameInput.trim()) return;

        setLoading(true);
        apiAxios.post(`/chapter/insert/${classNumber}`, { chapterName: chapterNameInput }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.token}`
            }
        })
            .then(() => fetchClassInfo()) // 최신 챕터 목록 다시 불러오기
            .catch((err) => console.log("챕터 등록 실패:", err))
            .finally(() => {
                setLoading(false);
                toggleChapterInsertMode();
            });
    };

    // 챕터 수정 시작
    const startUpdateChapter = (chapter) => {
        setIsUpdatingChapter(chapter.chapterNumber);
        setUpdatedChapterName(chapter.chapterName);
    };

    // 챕터 수정 취소
    const cancelUpdateChapter = () => {
        setIsUpdatingChapter(null);
        setUpdatedChapterName("");
    };

    // 챕터 수정
    const saveChapterUpdate = (chapterNumber) => {
        if (!updatedChapterName.trim()) return;

        apiAxios.put(`/chapter/update/${chapterNumber}`, { chapterName: updatedChapterName }, {
            headers: { "Authorization": `Bearer ${user.token}` }
        })
            .then(() => {
                fetchClassInfo();
                setIsUpdatingChapter(null);
            })
            .catch((err) => console.error("챕터 수정 실패:", err));
    };

    // 챕터 삭제
    const deleteChapter = (chapter) => {
        const videoCount = getVideoCount(chapter.chapterNumber);
        const confirmationMessage = videoCount > 0
            ? `${videoCount}개의 영상과 퀴즈가 삭제됩니다. 삭제 하시겠습니까?`
            : "챕터를 삭제하시겠습니까?";

        if (!window.confirm(confirmationMessage)) return;

        setLoading(true);
        apiAxios.delete(`/chapter/delete/${chapter.chapterNumber}`, {
            headers: { "Authorization": `Bearer ${user.token}` }
        })
            .then(() => fetchClassInfo()) // 최신 챕터 목록 다시 불러오기
            .catch((err) => console.error("챕터 삭제 실패:", err))
            .finally(() => setLoading(false));
    };

    // 비디오 추가 모드 ON
    const openVideoWriteModal = (chapterNumber) => {
        setSelectedChapter(chapterNumber);
        setVideoWriteModalOpen(true);
    };

    // 퀴즈 모달 오픈
    const openQuizWriteModal = (chapterNumber) => {
        setSelectedChapter(chapterNumber);
        setQuizWriteModalOpen(true);
    };

    // 퀴즈 삭제
    const deleteQuiz = (chapterNumber) => {
        apiAxios.delete(`/quiz/${chapterNumber}`)
            .then((res) => {
                alert(res.data.msg);
                fetchClassInfo();
            })
            .catch((err) => {
                console.error("퀴즈 삭제 실패", err);
            });
    };

    return (
        <div className="chapter-list">
            {loading && <p className="loading-text">로딩 중...</p>}

            {!loading &&
                chapters.map((chapter) => (
                    <div className="chapter" key={chapter.chapterNumber}>
                        <div className="chapter-header">
                            {isUpdatingChapter === chapter.chapterNumber ? (
                                <div className="update-chapter-container">
                                    <input
                                        type="text"
                                        value={updatedChapterName}
                                        onChange={(e) => setUpdatedChapterName(e.target.value)}
                                    />
                                    <button className="update-chapter-btn" onClick={() => saveChapterUpdate(chapter.chapterNumber)}>확인</button>
                                    <button className="cancel-update-chapter-btn" onClick={cancelUpdateChapter}>취소</button>
                                </div>
                            ) : (
                                <>
                                    <h3 title={chapter?.chapterName}>{chapter?.chapterName || "제목 없음"}</h3>
                                    <div className="lecture-count-container">
                                        <p className="lecture-count">{getVideoCount(chapter.chapterNumber)}개의 강의</p>
                                    </div>

                                    {isClassOwner && !isUpdatingChapter && (
                                        <div className="instructor-actions">
                                            <button className="edit-chapter" onClick={() => startUpdateChapter(chapter)}>챕터 수정</button>
                                            <button className="delete-chapter" onClick={() => deleteChapter(chapter)} disabled={loading}>챕터 삭제</button>
                                            {chapter.quizCount > 0 ? (
                                                <>
                                                    <button className="quiz-manage" onClick={() => setQuizUpdateModalOpen(true)}>퀴즈 수정</button>
                                                    <button className="quiz-manage" onClick={() => deleteQuiz(chapter.chapterNumber)}>퀴즈 삭제</button>
                                                </>
                                            ) : (
                                                <button className="quiz-manage" onClick={() => openQuizWriteModal(chapter.chapterNumber)}>퀴즈 등록</button>
                                            )}
                                        </div>
                                    )}

                                    {grade === 2 && (
                                        <button className="start-quiz" onClick={() => navigate(`/quiz/${chapter.chapterNumber}`)}>퀴즈 풀기</button>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="video-list">
                            {videos[chapter.chapterNumber]?.map((video) => (
                                <div className="video-item" key={video.videoNumber}>
                                    <span className="video-title" title={video.videoTitle}>{video.videoTitle || "영상 제목 없음"}</span>
                                    <span className="video-duration">{formatDuration(video.videoDuration)}</span>

                                    {isClassOwner && !isUpdatingChapter ? (
                                        <div className="instructor-video-controls">
                                            <button className="edit-video" disabled={loading}>수정</button>
                                            <button className="delete-video" disabled={loading}>삭제</button>
                                        </div>
                                    ) : (grade === 2 && isEnrolled) ? (
                                        <button className="watch-video" onClick={() => handleWatchVideo(video.videoNumber)}>영상 보기</button>
                                    ) : null}
                                </div>
                            ))}
                            {isClassOwner && !isUpdatingChapter && (
                                <button className="add-video" onClick={() => openVideoWriteModal(chapter.chapterNumber)} disabled={loading}>동영상 추가</button>
                            )}
                        </div>
                    </div>
                ))}

            {isClassOwner && !isUpdatingChapter && (
                <>
                    {!isChapterInsertMode ? (
                        <button className="add-chapter" onClick={toggleChapterInsertMode} disabled={loading}>챕터 추가</button>
                    ) : (
                        <div className="add-chapter-input">
                            <input type="text" placeholder="챕터 제목 입력" value={chapterNameInput} onChange={(e) => setChapterNameInput(e.target.value)} />
                            <button onClick={insertChapter} className="confirm-add-chapter" disabled={loading}>등록</button>
                            <button onClick={toggleChapterInsertMode} className="cancel-add-chapter" disabled={loading}>취소</button>
                        </div>
                    )}
                </>
            )}

            {isVideoWriteModalOpen && <VideoWrite onClose={() => setVideoWriteModalOpen(false)} chapterNumber={selectedChapter} classNumber={classNumber} onVideoAdded={fetchClassInfo} />}
            {isQuizWriteModalOpen && <QuizWrite chapterNumber={selectedChapter} onClose={() => setQuizWriteModalOpen(false)} />}
            {isQuizUpdateModalOpen && <QuizUpdate chapterNumber={selectedChapter} quizData={selectedQuiz} onClose={() => setQuizUpdateModalOpen(false)} onQuizUpdated={fetchClassInfo} />}
        </div>
    );



}
