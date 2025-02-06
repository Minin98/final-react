import React, { useState } from "react";
import "../css/VideoWrite.css";

export default function VideoWrite({ onClose, onSubmit }) {
    const [title, setTitle] = useState("");
    const [videoUrl, setVideoUrl] = useState("");

    // 입력 값 변경 핸들러
    const handleChangeTitle = (e) => setTitle(e.target.value);
    const handleChangeVideoUrl = (e) => setVideoUrl(e.target.value);

    // "등록" 버튼 클릭 시 실행
    const handleSubmit = () => {
        if (!title.trim() || !videoUrl.trim()) {
            alert("동영상 제목과 URL을 입력해주세요.");
            return;
        }

        onSubmit({ title, videoUrl });  // 상위 컴포넌트에 데이터 전달
        onClose();  // 모달 닫기
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
                    placeholder="동영상 URL을 입력 해주세요. (반드시 유튜브 링크여야 합니다.)"
                    value={videoUrl}
                    onChange={handleChangeVideoUrl}
                />
                <div className="video-write-buttons">
                    <button onClick={handleSubmit} className="submit-btn">등록</button>
                    <button onClick={onClose} className="cancel-btn">취소</button>
                </div>
            </div>
        </div>
    );
}
