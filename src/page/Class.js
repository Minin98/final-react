import React, { useState, useEffect, useCallback } from "react";
import "../css/Class.css";
import { useSelector } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";
import apiAxios from "../lib/apiAxios";
import { jwtDecode } from "jwt-decode";
import ClassUpdate from "./ClassUpdate";
import VideoWrite from "./VideoWrite";

export default function Class() {
    const navigate = useNavigate();
    const [classInfo, setClassInfo] = useState({});
    const [chapters, setChapters] = useState([]);
    const [videos, setVideos] = useState({});
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [isVideoWriteModalOpen, setVideoWriteModalOpen] = useState(false);
    const [isChapterInsertMode, setIsChapterInsertMode] = useState(false);
    const [chapterNameInput, setChapterNameInput] = useState("");
    const [loading, setLoading] = useState(false);

    const user = useSelector((state) => state.users.value);
    const { classNumber } = useParams();

    const decodeToken = user.token ? jwtDecode(user.token) : "";
    const grade = decodeToken.grade || (decodeToken.roles === "강사" ? 1 : decodeToken.roles === "학생" ? 2 : 3);
    const isClassOwner = grade === 1 && decodeToken.sub === classInfo.uno;

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

    const updateHandler = () => {
        fetchClassInfo();
        navigate(`/class/${classNumber}`);
    };

    useEffect(() => {
        fetchClassInfo();
    }, [fetchClassInfo]);

    // 챕터 내 비디오 개수 반환
    const getVideoCount = (chapterNumber) => {
        return videos[String(chapterNumber)] ? videos[String(chapterNumber)].length : 0;
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

    // 비디오 추가 모드 ON
    const openVideoWriteModal = () => {
        setVideoWriteModalOpen(true);
    };

    // 강의 삭제
    const deleteClass = () => {
        apiAxios.delete(`/class/${classNumber}`, {
            headers: { "Authorization": `Bearer ${user.token}` }
        })
        .then(res => {
            alert(res.data.msg);
            if (res.data.code === 1) {
                navigate('/classList');
            }
        })
        .catch(err => console.log(err));
    };

    return (
        <div className="class-view-container">
            {loading && <p className="loading-text">로딩 중...</p>}

            <div className="class-header">
                <span className="class-category">{classInfo.category}</span>
                <h1 className="class-title">{classInfo.title}</h1>
                <p className="class-instructor">{classInfo.name} 강사</p>
                <p className="class-description">{classInfo.description}</p>
                <div className="class-rate">
                    <span>평점 : {classInfo.rate}</span>
                    <Link to={`/class/${classNumber}/rate`} className="review">수강평 보기</Link>
                </div>
                {isClassOwner && (
                    <div className="instructor-controls">
                        <button className="class-modify-button" onClick={() => setShowUpdateModal(true)}>강의 수정</button>
                        <button className="class-delete-button" onClick={deleteClass}>강의 삭제</button>
                    </div>
                )}
                {grade === 2 && <button className="class-enroll-button">강의 수강하기</button>}
            </div>

            <div className="class-menu">
                <Link to={`/class/${classNumber}`}>챕터 목록</Link>
                <Link to={`/class/${classNumber}/notice`}>공지사항</Link>
                <Link to={`/class/${classNumber}/qna`}>Q&A</Link>
                <Link to={`/class/${classNumber}/rate`}>수강평</Link>
            </div>

            <div className="chapter-list">
                {chapters.map((chapter) => (
                    <div className="chapter" key={chapter.chapterNumber}>
                        <div className="chapter-header">
                            <h3>{chapter?.chapterName || "제목 없음"}</h3>
                            <p>{getVideoCount(chapter.chapterNumber)}개의 강의</p>
                            {isClassOwner && (
                                <div className="instructor-actions">
                                    <button className="edit-chapter">챕터 수정</button>
                                    <button className="delete-chapter">챕터 삭제</button>
                                    <button className="quiz-manage">퀴즈 등록 및 삭제</button>
                                </div>
                            )}
                        </div>
                        <div className="video-list">
                            {videos[chapter.chapterNumber]?.map((video) => (
                                <div className="video-item" key={video.videoNumber}>
                                    <span className="video-title">{video.videoTitle || "영상 제목 없음"}</span>
                                    <span className="video-duration">{video.videoDuration}</span>
                                    {isClassOwner && (
                                        <div className="instructor-video-controls">
                                            <button className="edit-video">수정</button>
                                            <button className="delete-video">삭제</button>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {isClassOwner && (
                                <button className="add-video" onClick={openVideoWriteModal}>동영상 추가</button>
                            )}
                        </div>
                    </div>
                ))}
                {isClassOwner && (
                    <>
                        {!isChapterInsertMode ? (
                            <button className="add-chapter" onClick={toggleChapterInsertMode}>챕터 추가</button>
                        ) : (
                            <div className="add-chapter-input">
                                <input type="text" placeholder="챕터 제목 입력" value={chapterNameInput} onChange={(e) => setChapterNameInput(e.target.value)} />
                                <button onClick={insertChapter} className="confirm-add-chapter">등록</button>
                                <button onClick={toggleChapterInsertMode} className="cancel-add-chapter">취소</button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {showUpdateModal && <ClassUpdate classInfo={classInfo} onClose={() => setShowUpdateModal(false)} onClassUpdated={updateHandler} />}
            {isVideoWriteModalOpen && <VideoWrite onClose={() => setVideoWriteModalOpen(false)} />}
        </div>
    );
}
