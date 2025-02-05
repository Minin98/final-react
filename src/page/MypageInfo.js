import { React, useEffect, useState } from "react";
import "../css/mypageinfo.css"; // 스타일을 별도 파일로 분리
import { useSelector } from "react-redux";
import axios from "axios";
import defaultImg from "../img/defaultImg.png";
import { Link, useNavigate } from "react-router-dom";

export default function MypageInfo() {
  const [profileImage, setProfileImage] = useState(""); // 현재 프로필 이미지
  const [selectedFile, setSelectedFile] = useState(null); // 선택한 파일
  const [isUploadEnabled, setIsUploadEnabled] = useState(false); // 업로드 버튼 활성화 여부
  const token = useSelector((state) => state.users.value.token);
  const [userInfo, setUserInfo] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      console.error("토큰이 없습니다.");
      return;
    }

    // 사용자 정보 가져오기
    axios
      .post(
        "http://localhost:9999/MypageInfo",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setUserInfo(res.data);
      })
      .catch((err) => console.error("요청 에러:", err));

    // 프로필 이미지 가져오기
    axios
      .post(
        "http://localhost:9999/ProfileImage",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        console.log("서버 응답:", res.data);
        setProfileImage(res.data.profileImageBase64);
      })
      .catch((err) => console.error("요청 에러:", err));
  }, []);

  // 파일 선택 시 미리보기 표시
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setIsUploadEnabled(true); // 업로드 버튼 활성화

      // 파일 미리보기 설정
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 파일 업로드 요청
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("업로드할 파일을 선택하세요.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("user", JSON.stringify(userInfo)); // JSON 데이터 포함

    try {
      const response = await axios.post(
        "http://localhost:9999/UpdateUserProfile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      axios
      .post(
        "http://localhost:9999/ProfileImage",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setProfileImage(res.data.profileImageBase64);
      })
      setIsUploadEnabled(false); // 업로드 후 버튼 비활성화
      alert("프로필 사진이 변경되었습니다.");
    } catch (error) {
      console.error("파일 업로드 에러:", error);
      alert("파일 업로드에 실패했습니다.");
    }
  };

  return (
    <div className="mypage-container">
      <div className="profile-section">
        {/* 프로필 이미지 클릭 시 파일 선택 창 열기 */}
        <label htmlFor="fileInput">
          <img
            src={profileImage || defaultImg}
            alt="프로필 이미지"
            className="profile-image"
            style={{ cursor: "pointer" }}
          />
        </label>

        {/* 파일 업로드 input (숨김) */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="fileInput"
        />
        {/* 프로필 사진 변경 버튼 */}
        <button
          className="profile-button"
          onClick={handleUpload}
          disabled={!isUploadEnabled}>
          {isUploadEnabled ? "이미지 업로드 하기" : "이미지 클릭시 파일 선택"}
        </button>

        <h3>
          {userInfo.nickname} {userInfo.grade === 1 ? "강사" : "수강생"}님
        </h3>
      </div>

      <div className="info-section">
        <h2>마이페이지</h2>
        <div className="info-item">
          <span>아이디</span>
          <span>{userInfo.uno}</span>
        </div>
        <div className="info-item">
          <span>이름</span>
          <span>{userInfo.name}</span>
        </div>
        <div className="info-item">
          <span>닉네임</span>
          <span>{userInfo.nickname}</span>
        </div>
        <div className="info-item">
          <span>이메일</span>
          <span>{userInfo.email}</span>
        </div>
        <div className="info-item">
          <span>전화번호</span>
          <span>{userInfo.phone}</span>
        </div>
        <button className="edit-button" onClick={() => navigate("/mypage/updateinfo")}>
          회원정보 수정
        </button>
        <button className="logout-button">회원 탈퇴</button>
      </div>
    </div>
  );
}
