import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/VideoPage.css";
import apiAxios from "../lib/apiAxios";

const VideoPage = () => {
    const { videoNumber } = useParams();
    const navigate = useNavigate();
    const [videoInfo, setVideoInfo] = useState(null);
    const [prevVideoId, setPrevVideoId] = useState(null);
    const [nextVideoId, setNextVideoId] = useState(null);
    const [classTitle, setClassTitle] = useState(""); // 강의 제목
    const [chapterTitle, setChapterTitle] = useState(""); // 챕터 제목
    const [classNumber, setClassNumber] = useState(null); // 강의 번호

    useEffect(() => {
        apiAxios.get(`/video/${videoNumber}`)
            .then((response) => {
                console.log("API 응답 데이터:", response.data); // ✅ 응답 데이터 확인
    
                if (response.data.code === 1) {
                    const videoData = response.data.video;
                    setVideoInfo(videoData);
                    setPrevVideoId(response.data.prevVideoId ?? null);
                    setNextVideoId(response.data.nextVideoId ?? null);
                    
                    // ✅ 강의 제목과 챕터 제목을 API 응답의 최상위에서 가져옴
                    setClassTitle(response.data.classTitle ?? "강의 정보 없음");
                    setChapterTitle(response.data.chapterTitle ?? "챕터 정보 없음");
                    setClassNumber(videoData.classNumber);
                    console.log("강의 제목:", response.data.classTitle);
                } else {
                    console.error("API 응답 오류:", response.data.message);
                }
            })
            .catch((error) => {
                console.error("영상 정보를 불러오는 데 실패했습니다.", error);
            });
    }, [videoNumber]);
    
    

    if (!videoInfo) {
        return <div className="video-loading">영상 정보를 불러올 수 없습니다.</div>;
    }

    return (
        <div className="video-fullscreen-container">
            {/* 상단 네비게이션 바 */}
            <div className="video-header">
                <button className="back-button" onClick={() => navigate(`/class/${classNumber}`)}>←</button>
                <div className="video-info">
                    <span>{classTitle}</span>
                    <span> | </span>
                    <span>{chapterTitle}</span>
                    <span> | </span>
                    <span>{videoInfo.videoTitle}</span>
                </div>
            </div>

            {/* 유튜브 영상 */}
            <div className="video-iframe-container">
                <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${videoInfo.videoId}`}
                    title={videoInfo.videoTitle}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>

            {/* 네비게이션 버튼 */}
            <div className="video-navigation">
                <span 
                    className="nav-button prev"
                    onClick={prevVideoId ? () => navigate(`/video/${prevVideoId}`) : undefined}
                    style={{ opacity: prevVideoId ? 1 : 0.3 }}
                >
                    ← 이전 영상
                </span>

                <span 
                    className="nav-button next"
                    onClick={nextVideoId ? () => navigate(`/video/${nextVideoId}`) : undefined}
                    style={{ opacity: nextVideoId ? 1 : 0.3 }}
                >
                    다음 영상 →
                </span>
            </div>
        </div>
    );
};

export default VideoPage;
