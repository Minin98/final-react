import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../css/Main.css";

export default function Main() {
  const user = useSelector((state) => state.users.value);
  const [latestClasses, setLatestClasses] = useState([]);

  const navigate = useNavigate();
  let nickname = "guest";

  useEffect(() => {
    fetch("http://localhost:9999/")
      .then((res) => res.json())
      .then((data) => {
        setLatestClasses(data.latestClasses);
      })
      .catch((err) => console.log(err));
  }, []);

  // JWT 토큰 디코딩
  if (user.token) {
    const decodeToken = jwtDecode(user.token);

    const grade = decodeToken.roles === "강사" ? 1 : decodeToken.roles === "학생" ? 2 : 3;
    const role = grade === 1 ? "강사" : grade === 2 ? "수강생" : "회원";

    nickname = `${role} ${decodeToken.nickname}`;
  }
<<<<<<< HEAD

  // 강의 클릭 시 해당 강의 페이지로 이동
  const handleClassClick = (classNumber) => {
    navigate(`/class/${classNumber}`);
  }
=======
>>>>>>> af3d680eab0ac82d632127d5f954a6916b20bf1f

  return (
    <>
      <div className="header-space"></div>
<<<<<<< HEAD
      <div className="main-background">
        <div className="main-container">
          <div className="left">

            {/* 메인 배너 */}
            <div className="main-banner">{/* 
              <img src="/img/background.png" alt="banner" className="banner-img" /> */}
              <span className="banner-title"><strong>Learnify</strong>는 <br /><strong>Learn</strong>(학습)과 <strong>-ify</strong>(변화시키다)를 결합한 단어입니다.</span>
              <span className="banner-content">이는 학습을 보다 쉽게, 실력을 효과적으로 변화시킬 수 있다는 의미를 담고 있으며,<br />
                다양한 학습 자원을 통해, 학습의 즐거움과 성취감을 제공합니다. <br />
                Learnify와 함께 스마트한 학습 여정을 시작하세요!</span>

              <button
                className="banner-button"
                onClick={() => (window.location.href = "/classList")}
              >
                강의 목록 바로가기 &gt;
              </button>
            </div>

            {/* 최신 강의 */}

            <div className="latest-classes">
              <h2 className="lc-title">최신 강의</h2>
              <div className="lc-cards">
                {latestClasses.map((classItem) => (
                  <div className="lc-card" key={classItem.classNumber} onClick={() => handleClassClick(classItem.classNumber)} style={{ cursor: "pointer" }}>
                    <div className="lc-thumbnail">
                      <img src={classItem.thumbnail || "placeholder.jpg"} alt={classItem.title} className="lc-thumbnail-image" />
                    </div>
                    <div className="lc-details">
                      <span className="lc-category">{classItem.category}</span>
                      <h3 className="lc-title">{classItem.title}</h3>
                      <p className="lc-instructor">{classItem.name}</p>
                      <p className="lc-date">{classItem.createTime.substring(0, 10)}</p>
=======
      <div className="main-container">
        <div className="main-content">
          <div className="left">
            {/* 메인 배너 */}
            <div className="main-banner">
              <img src="/img/banner.png" alt="banner" className="banner-img" />
              <button
                className="banner-button"
                onClick={() => (window.location.href = "/classList")}
              >
                강의 목록 바로가기 &gt;
              </button>
            </div>

            {/* 최신 강의 */}
            <div className="latest-classes">
              <h2 className="section-title">최신 강의</h2>
              <div className="cards">
                {latestClasses.map((classList) => (
                  <div className="card" key={classList.classNumber}>
                    <div className="info">
                      <span className="category">{classList.category}</span>
                      <div className="thumbnail"></div>
                      <p className="title">{classList.title}</p>
                      <p className="instructor">{classList.name} 강사</p>
                      <p className="date">{classList?.createTime ? classList.createTime.substring(0, 10) : "날짜 없음"}</p>
>>>>>>> af3d680eab0ac82d632127d5f954a6916b20bf1f
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 오른쪽 사이드바 */}
<<<<<<< HEAD

=======
>>>>>>> af3d680eab0ac82d632127d5f954a6916b20bf1f
          <div className="sidebar">
            <div className="profile">
              <div className="profile-pic"></div>
              <p className="profile-name">
                {nickname} 님, <br />
                어서오세요! 🔥
              </p>
            </div>

            <div className="progress-section">
              <h3 className="sidebar-title">학습 진행률</h3>
              <div className="progress-box"></div>
            </div>

            <div className="ongoing-classes">
              <h3 className="sidebar-title">수강 중인 강의</h3>
              {[1, 2, 3].map((item) => (
                <div className="sidebar-item" key={item}>
                  <p className="sidebar-question">
                    이 문제 어떻게 푸는 게 좋을까요?
                  </p>
                  <p className="sidebar-date">2025.01.21</p>
                </div>
              ))}
            </div>

<<<<<<< HEAD
            <div className="qna-section">
=======
            <div className="qa-section">
>>>>>>> af3d680eab0ac82d632127d5f954a6916b20bf1f
              <h3 className="sidebar-title">Q&A</h3>
              {[1, 2, 3].map((item) => (
                <div className="sidebar-item" key={item}>
                  <p className="sidebar-question">
                    이 문제 어떻게 푸는 게 좋을까요?
                  </p>
                  <p className="sidebar-date">2025.01.21</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
