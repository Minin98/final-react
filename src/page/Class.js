import React, { useState, useEffect } from "react";
import "../css/Class.css";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import apiAxios from "../lib/apiAxios";
import { jwtDecode } from "jwt-decode";
import VideoWrite from "./VideoWrite";

export default function Class() {
    const [classInfo, setClassInfo] = useState({});
    const [chapters, setChapters] = useState([]);
    const [videos, setVideos] = useState({});
    const [isVideoWriteModalOpen, setVideoWriteModalOpen] = useState(false);
    const user = useSelector((state) => state.users.value);
    const { classNumber } = useParams();

    const decodeToken = user.token ? jwtDecode(user.token) : "";
    const grade =
        decodeToken.grade ||
        (decodeToken.roles === "강사" ? 1 : decodeToken.roles === "학생" ? 2 : 3);
    const isClassOwner = grade === 1 && decodeToken.sub === classInfo.uno;

    useEffect(() => {
        apiAxios
            .get(`/class/${classNumber}`)
            .then((res) => {
                setClassInfo(res.data.class);
                setChapters(res.data.chapter || []);
                setVideos(res.data.video || {});
            })
            .catch((err) => console.log(err));
    }, [classNumber]);

    const videoCount = (chapterNumber) => {
        return videos[String(chapterNumber)]
            ? videos[String(chapterNumber)].length
            : 0;
    };

    // "동영상 추가" 버튼 클릭 시 모달 열기
    const openVideoWriteModal = () => setVideoWriteModalOpen(true);
    
    // 모달에서 "등록" 버튼 클릭 시 실행될 함수
    const handleVideoWriteSubmit = (videoData) => {
        console.log("등록할 영상 데이터:", videoData);
        setVideoWriteModalOpen(false);  // 모달 닫기
    };
    

    return (
        <div className="class-view-container">
            <div className="class-header">
                <span className="class-category">{classInfo.category}</span>
                <h1 className="class-title">{classInfo.title}</h1>
                <p className="class-instructor">{classInfo.name} 강사</p>
                <p className="class-description">{classInfo.description}</p>
                <div className="class-rate">
                    <span>평점 : {classInfo.rate}</span>
                    <Link to={`/class/${classNumber}/rate`} className="review">
                        수강평 보기
                    </Link>
                </div>
                {isClassOwner && (
                    <div className="instructor-controls">
                        <button className="class-modify-button">강의 수정</button>
                        <button className="class-delete-button">강의 삭제</button>
                    </div>
                )}
                {grade === 2 && (
                    <button className="class-enroll-button">강의 수강하기</button>
                )}
            </div>

            <div className="class-menu">
                <Link to={`/class/${classNumber}`}>챕터 목록</Link>
                <Link to={`/class/${classNumber}/notice`}>공지사항</Link>
                <Link to={`/class/${classNumber}/qna`}>Q&A</Link>
                <Link to={`/class/${classNumber}/rate`}>수강평</Link>
            </div>

            <div className="chapter-list">
                {chapters.length === 0 ? (
                    <p>등록된 챕터가 없습니다.</p>
                ) : (
                    chapters.map((chapter) =>
                        chapter ? (
                            <div className="chapter" key={chapter.chapterNumber}>
                                <div className="chapter-header">
                                    <h3>{chapter?.chapterName || "제목 없음"}</h3>
                                    <p>{videoCount(chapter.chapterNumber)}개의 강의</p>
                                    {isClassOwner ? (
                                        <div className="instructor-actions">
                                            <button className="edit-chapter">챕터 수정</button>
                                            <button className="delete-chapter">챕터 삭제</button>
                                            <button className="quiz-manage">퀴즈 등록 및 삭제</button>
                                        </div>
                                    ) : (
                                        <button className="goto-quiz-btn">문제 풀기</button>
                                    )}
                                </div>
                                <div className="video-list">
                                    {videos[chapter.chapterNumber]?.length > 0 ? (
                                        videos[chapter.chapterNumber].map((video) => (
                                            <div className="video-item" key={video.videoNumber}>
                                                <span className="video-title">
                                                    {video.videoTitle || "영상 제목 없음"}
                                                </span>
                                                <span className="video-duration">
                                                    {video.videoDuration}
                                                </span>
                                                {isClassOwner ? (
                                                    <div className="instructor-video-controls">
                                                        <button className="edit-video">수정</button>
                                                        <button className="delete-video">삭제</button>
                                                    </div>
                                                ) : (
                                                    <a href={video.videoURL}>
                                                        <button className="watch-video-btn">
                                                            영상 보기
                                                        </button>
                                                    </a>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p>등록된 영상이 없습니다.</p>
                                    )}
                                    {isClassOwner && (
                                        <button className="add-video" onClick={openVideoWriteModal}>
                                            동영상 추가
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : null
                    )
                )}
                {isClassOwner && <button className="add-chapter">챕터 추가</button>}
            </div>

            {isVideoWriteModalOpen && (
                <VideoWrite onClose={() => setVideoWriteModalOpen(false)} onSubmit={handleVideoWriteSubmit} />
            )}
        </div>
    );
}
