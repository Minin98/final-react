import React, { useState } from "react";
import "../css/ClassInsert.css";
 
export default function ClassInsert({ onClose }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [thumbnail, setThumbnail] = useState(null);
    const [dragging, setDragging] = useState(false);

    // 썸네일 업로드 핸들러
    const handleThumbnailUpload = (file) => {
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnail(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // 드래그 앤 드롭 관련 핸들러
    const handleDragOver = (event) => {
        event.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => {
        setDragging(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setDragging(false);
        const file = event.dataTransfer.files[0];
        handleThumbnailUpload(file);
    };

    // 썸네일 취소 핸들러
    const handleThumbnailRemove = () => {
        setThumbnail(null);
    };

    return (
        <div className="class-insert-backdrop">
            <div className="class-insert-container">
                {/* 헤더: 강의 등록 + 카테고리 선택 */}
                <div className="class-insert-header">
                    <p className="class-insert-title">강의 등록</p>
                    <select
                        className="class-insert-category-select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="" disabled>카테고리 선택</option>
                        <option value="Java">Java</option>
                        <option value="Python">Python</option>
                        <option value="C">C</option>
                        <option value="C++">C++</option>
                        <option value="C#">C#</option>
                        <option value="JavaScript">JavaScript</option>
                        <option value="TypeScript">TypeScript</option>
                        <option value="Kotlin">Kotlin</option>
                        <option value="Swift">Swift</option>
                        <option value="Go">Go</option>
                        <option value="Rust">Rust</option>
                        <option value="Ruby">Ruby</option>
                        <option value="PHP">PHP</option>
                        <option value="HTML/CSS">HTML/CSS</option>

                    </select>
                </div>

                <div className="class-insert-form">
                    {/* 강의 제목 입력 */}
                    <input
                        type="text"
                        className="class-insert-input"
                        placeholder="강의 제목을 입력해주세요."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    {/* 강의 소개 입력 */}
                    <textarea
                        className="class-insert-textarea"
                        placeholder="강의 소개를 입력해주세요."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    {/* 썸네일 업로드 영역 */}
                    <div className="class-insert-thumbnail-wrapper">
                        <span className="class-insert-thumbnail-label">썸네일 업로드</span>
                        <button className="remove-thumbnail-btn" onClick={handleThumbnailRemove}>
                            취소
                        </button>
                    </div>

                    {/* 드래그 & 드롭 썸네일 업로드 */}
                    <div
                        className={`class-insert-thumbnail ${dragging ? "dragging" : ""}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        {thumbnail ? (
                            <div className="thumbnail-preview">
                                <img src={thumbnail} alt="썸네일 미리보기" />
                            </div>
                        ) : (
                            <p className="thumbnail-plus">+</p>
                        )}
                    </div>

                    {/* 안내 문구 */}
                    <ul className="thumbnail-guide">
                        <li>이곳에 강의 썸네일을 드래그하여 업로드 하세요.</li>
                        <li>비율 : 300 × 200</li>
                        <li>용량이 큰 파일은 업로드되지 않을 수 있습니다.</li>
                    </ul>
                </div>

                {/* 버튼 그룹 */}
                <div className="class-insert-button-group">
                    <button className="class-insert-cancel" onClick={onClose}>취소</button>
                    <button className="class-insert-submit" disabled={!category}>등록</button> {/* ✅ 카테고리 선택 안하면 등록 불가 */}
                </div>
            </div>
        </div>
    );
}
