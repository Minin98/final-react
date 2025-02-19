import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/UpdatePassword.css";

export default function UpdatePassword() {
  const newpwRef = useRef(null);
  const checkNewpwRef = useRef(null);
  const token = useSelector((state) => state.users.value.token);
  const navigator = useNavigate();
  const [newPw , setNewPw] = useState("");
  const [isMatch, setIsMatch] = useState(false);
  const [isCanUse, setIsCanUse] = useState(false);
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,15}$/;
  const [showPassword, setShowPassword] = useState(false);
  // const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{6,15}$/;

  // 입력 값이 변경될 때마다 두 비밀번호의 일치 여부를 검사
  const checkMatch = () => {
    const newpw = newpwRef.current.value;
    const checkNewpw = checkNewpwRef.current.value;
    // newpw가 빈 문자열이 아니면서 일치할 경우 true
    setIsMatch(newpw !== "" && newpw === checkNewpw);
  };

  const checkPassword = () => {
    const newpw = newpwRef.current.value;
    console.log("현재 입력된 비밀번호:", newpw);
    console.log("정규식 테스트 결과:", passwordRegex.test(newpw)); // 추가
    setNewPw(newpw);
    setIsCanUse(passwordRegex.test(newpw));
  };
  
  const togglePasswordVisibility = (event) => {
    const imgElement = event.target; // 클릭된 이미지 요소
    const parentElement = imgElement.closest(".input-block");
    const inputElement = parentElement?.querySelector("input");; // 형제 input 요소 찾기
    console.log(inputElement);
    if (inputElement) {
      inputElement.type = inputElement.type === "password" ? "text" : "password";
  
      // 아이콘 변경
      imgElement.src = inputElement.type === "password" 
        ? "/img/eye-closed.png" 
        : "/img/eye-opened.png";
    }
  };
  

  const updatepwhandle = () => {
    console.log(isCanUse);
    if(!isCanUse){
      alert("사용 가능한 비밀번호를 입력해주세요");
      return;
    }
    if(!isMatch){
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const newpw = newpwRef.current.value;
    const data = { newpassword: newpw };
      axios
        .post("http://localhost:9999/UpdatePassword", data, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          alert(res.data.msg);
          navigator("/mypage");
        })
        .catch((err) => {
          console.error(err);
          alert("비밀번호 변경 중 오류가 발생했습니다.");
        });
  };

  const cancelhandle = () => {
    if(window.confirm("정말 취소하시겠습니까?")){
      alert("비밀번호 변경 취소");
      navigator("/mypage");
    }
      
  };

  return (
    <div className="updatepw-container">
      <div className="updatepw">
        <h1>비밀번호 변경</h1>
        <ul>
          <li><span className="bold">안전한 비밀번호로 내정보를 보호</span>하세요</li>
          <li>다른 아이디/사이트에서 사용한 적 없는 비밀번호</li>
          <li>이전에 사용한 적 없는 비밀번호가 안전합니다.</li>
        </ul>
  
        <span className="pw">비밀번호 (영문, 숫자, 특수문자 포함 6~15자)</span>
            <div className="input-block">
              <input
                className="newpw"
                type={showPassword ? "text" : "password"}
                placeholder=""
                onChange={checkMatch}
                onBlur={checkPassword}
                ref={newpwRef}
              />
              <img
                  src="/img/eye-closed.png"
                  onClick={togglePasswordVisibility}
                  alt='비밀번호 숨김/보임'
                />
            </div>
        {
          isCanUse && (
            <span style={{ color: "#2e7d32" }} className="isMatch">안전한 비밀번호 입니다.</span>
          ) 
        }
  
        <span className="pw">비밀번호 확인</span>
        <div className="input-block">
          <input
            className="checkNewpw"
            type={showPassword ? "text" : "password"}
            placeholder=""
            onChange={checkMatch}
            ref={checkNewpwRef}
          />
           <img
              src="/img/eye-closed.png"
              onClick={togglePasswordVisibility}
              alt='비밀번호 숨김/보임'
            /> 
        </div>

        {
          isCanUse && ( 
            isMatch ? (
              <span style={{ color: "#2e7d32" }} className="isMatch">비밀번호가 일치합니다.</span>
            ) : (
              <span style={{ color: "#d32f2f" }} className="nonMatch">비밀번호가 일치하지 않습니다.</span>
            )
          ) 
        }
  
        {/* 버튼 영역을 묶어서 정렬 제어 */}
        <div className="btn-group">
          <button className="update-button" onClick={updatepwhandle}>
            변경하기
          </button>
          <button className="cancel-button" onClick={cancelhandle}>
            변경취소
          </button>
        </div>
      </div>
    </div>
  );
  
}