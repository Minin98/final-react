import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveInfo } from '../store/UsersSlice';
import { jwtDecode } from 'jwt-decode';
import apiAxios from '../lib/apiAxios';
import '../css/Login.css';
import KakaoLogin from '../components/KakaoLogin';
import { saveRole } from '../store/KakaoSlice';

export default function Login() {
  const id = useRef(null);
  const pwd = useRef(null);
  const [role, setRole] = useState("student");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginHandler = () => {
    const data = {
      id : id.current.value,
      passwd : pwd.current.value
    }
    apiAxios.post('/users/login', data)
    .then(res => {
      console.log(res.data);
      //로그인 성공하면 Home으로 이동
      //redux에 로그인 정보 저장
      if(res.data.flag){
        dispatch(saveInfo(res.data));
        const decodeToken = jwtDecode(res.data.token);
        console.log(decodeToken);
        navigate('/');
      }else{
        //실패하면 경고창 출력
        alert('아이디와 비밀번호를 확인하세요');
      }

    }).catch(err => {
      console.log(err);
    });
  }
  // role을 저장하는 함수
  const roleHandler = (selectedRole) => {
    setRole(selectedRole);  // role 상태 업데이트
    dispatch(saveRole(selectedRole));  // Redux store에 role 저장
  };
  // 컴포넌트가 처음 렌더링될 때 role 값 설정 (예: 'student' 또는 'teacher')
  useEffect(() => {
    dispatch(saveRole(role)); 
  }, [role, dispatch]);
  return (
    <div className="login_container" >
      <div className="login_logo_container" >
        <h1 className='login_title'>환영합니다!</h1>
      </div>
      <div className="login_form_container">
      <p className='login_desc'><span style={{fontWeight: 'bold'}}>로그인</span>하여<br/> 다양한 서비스를 즐겨보세요.</p>
      <div className="role-switch">
          <button
            className={`role-btn ${role === "student" ? "active" : ""}`}
            onClick={() => roleHandler("student")}
          >
            수강생
          </button>
          <button
            className={`role-btn ${role === "teacher" ? "active" : ""}`}
            onClick={() => roleHandler("teacher")}
          >
            강사
          </button>
        </div>
      <div className="login-form">
        <input type="text" ref={id} placeholder="아이디를 입력해주세요" />
        <input type="password" ref={pwd} placeholder="비밀번호를 입력해주세요" />
        <a href="#" className='find_pwd'>비밀번호를 잊으셨나요?</a>
        <button type="button" className='login_btn' onClick={loginHandler}>로그인</button> 
        <button type="button" className='register_btn' onClick={() => navigate('/register')}>회원가입</button>
        <KakaoLogin />
        </div>
      </div>
    </div>

  );
}