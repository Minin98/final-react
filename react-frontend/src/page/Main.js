import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import "../css/Main.css";

export default function Main() {
  const user = useSelector((state) => state.users.value);
  const [latestClasses, setLatestClasses] = useState([]);
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

  return (
    <>
      <div className="header-space"></div>
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 오른쪽 사이드바 */}
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

            <div className="qa-section">
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
