import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import "../css/Chapter.css";
import apiAxios from "../lib/apiAxios";
import { jwtDecode } from "jwt-decode";
import VideoWrite from "./VideoWrite";

export default function Chapter({ isEnrolled }) { 
    const [classInfo, setClassInfo] = useState({});
    const [chapters, setChapters] = useState([]);
    const [videos, setVideos] = useState({});
    const [isVideoWriteModalOpen, setVideoWriteModalOpen] = useState(false);
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [isChapterInsertMode, setIsChapterInsertMode] = useState(false);
    const [chapterNameInput, setChapterNameInput] = useState("");
    const [loading, setLoading] = useState(false);

    const user = useSelector((state) => state.users.value);
    const { classNumber } = useParams();  // 🔹 강의 번호 가져오기
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

    // 비디오 추가 모드 ON
    const openVideoWriteModal = (chapterNumber) => {
        setSelectedChapter(chapterNumber);
        setVideoWriteModalOpen(true);
    };

    return (
        <div className="chapter-list">
            {loading && <p className="loading-text">로딩 중...</p>}

            {!loading && chapters.map((chapter) => (
                <div className="chapter" key={chapter.chapterNumber}>
                    <div className="chapter-header">
                        <h3>{chapter?.chapterName || "제목 없음"}</h3>
                        <p>{getVideoCount(chapter.chapterNumber)}개의 강의</p>
                        {isClassOwner && (
                            <div className="instructor-actions">
                                <button className="edit-chapter" disabled={loading}>챕터 수정</button>
                                <button className="delete-chapter" disabled={loading}>챕터 삭제</button>
                                <button className="quiz-manage" disabled={loading}>퀴즈 등록 및 삭제</button>
                            </div>
                        )}
                    </div>
                    <div className="video-list">
                        {videos[chapter.chapterNumber]?.map((video) => (
                            <div className="video-item" key={video.videoNumber}>
                                <span className="video-title">{video.videoTitle || "영상 제목 없음"}</span>
                                <span className="video-duration">{formatDuration(video.videoDuration)}</span>
                                
                                {isClassOwner ? (
                                    <div className="instructor-video-controls">
                                        <button className="edit-video" disabled={loading}>수정</button>
                                        <button className="delete-video" disabled={loading}>삭제</button>
                                    </div>
                                ) : (grade === 2 && isEnrolled) ? ( 
                                    <button className="watch-video" onClick={() => handleWatchVideo(video.videoNumber)}>
                                        영상 보기
                                    </button>
                                ) : null}
                            </div>
                        ))}
                        {isClassOwner && (
                            <button className="add-video" onClick={() => openVideoWriteModal(chapter.chapterNumber)} disabled={loading}>
                                동영상 추가
                            </button>
                        )}
                    </div>
                </div>
            ))}

            {isClassOwner && (
                <>
                    {!isChapterInsertMode ? (
                        <button className="add-chapter" onClick={toggleChapterInsertMode} disabled={loading}>
                            챕터 추가
                        </button>
                    ) : (
                        <div className="add-chapter-input">
                            <input type="text" placeholder="챕터 제목 입력" value={chapterNameInput} onChange={(e) => setChapterNameInput(e.target.value)} />
                            <button onClick={insertChapter} className="confirm-add-chapter" disabled={loading}>
                                등록
                            </button>
                            <button onClick={toggleChapterInsertMode} className="cancel-add-chapter" disabled={loading}>
                                취소
                            </button>
                        </div>
                    )}
                </>
            )}

            {isVideoWriteModalOpen && <VideoWrite onClose={() => setVideoWriteModalOpen(false)} chapterNumber={selectedChapter} classNumber={classNumber} onVideoAdded={fetchClassInfo} />}
        </div>
    );
}
