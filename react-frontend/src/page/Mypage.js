import { Link } from "react-router-dom";
import "../css/mypage.css";
import { useSelector } from "react-redux";


export default function Mypage() {
  return (
    <div className="mypage">
      <div className="userinfo">
        <Link to="/mypage/userinfo">회원정보</Link>
      </div>
      <div className="classinfo">
        <Link to="/mypage/classinfo">내 수강정보 확인</Link>
      </div>
    </div>
  );
}

