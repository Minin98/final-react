import React, { useState } from "react";
import "../css/VideoWrite.css";
import apiAxios from "../lib/apiAxios";

export default function VideoWrite({ onClose, chapterNumber, onVideoAdded }) {
    const [title, setTitle] = useState("");  // 사용자가 입력하는 영상 제목
    const [videoId, setVideoId] = useState("");  // 사용자가 입력하는 유튜브 영상 ID
    const [loading, setLoading] = useState(false);

    // 입력 값 변경 핸들러
    const handleChangeTitle = (e) => setTitle(e.target.value);
    const handleChangeVideoId = (e) => setVideoId(e.target.value);

    // "등록" 버튼 클릭 시 실행
    const handleSubmit = async () => {
        if (!title.trim() || !videoId.trim()) {
            alert("동영상 제목과 ID를 입력해주세요.");
            return;
        }

        setLoading(true);

        try {
            const response = await apiAxios.post("/video/insert", {
                videoTitle: title,  // 강사가 입력한 제목을 그대로 저장
                videoId,
                chapterNumber
            });

            if (response.data.code === 1) {
                alert("영상이 성공적으로 등록되었습니다.");
                onVideoAdded(); // 부모 컴포넌트에서 목록 갱신
                onClose(); // 모달 닫기
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("영상 등록 실패:", error);
            alert("영상 등록 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="video-write-modal">
            <div className="video-write-container">
                <h2>동영상 강의 등록</h2>
                <input
                    type="text"
                    placeholder="동영상 제목을 입력 해주세요."
                    value={title}
                    onChange={handleChangeTitle}
                />
                <input
                    type="text"
                    placeholder="유튜브 영상 ID를 입력 해주세요. (반드시 유튜브 ID여야 합니다.)"
                    value={videoId}
                    onChange={handleChangeVideoId}
                />
                <div className="video-write-buttons">
                    <button onClick={handleSubmit} className="submit-btn" disabled={loading}>
                        {loading ? "등록 중..." : "등록"}
                    </button>
                    <button onClick={onClose} className="cancel-btn" disabled={loading}>
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
}
