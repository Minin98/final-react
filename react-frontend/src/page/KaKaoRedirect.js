import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { saveToken, saveState, selectRole } from '../store/KakaoSlice';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { saveInfo } from '../store/UsersSlice';
import apiAxios from '../lib/apiAxios';
export default function KaKaoRedirect() {
  const [params] = useSearchParams();
  const role = useSelector(selectRole);
  console.log("code:", params.get("code"));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log(role);
  useEffect(() => {
    apiAxios.get("/kakao/token", {
      params: {
        code: params.get("code"),
        role: role
      }
    }).then(res => {
      dispatch(saveInfo(res.data));
      const decodeToken = jwtDecode(res.data.token);
      console.log(decodeToken);
      navigate('/');
    }).catch(error => {
      console.error(error);
      navigate('/');
    })
  }, [])


  return <div>현재 카카오 로그인 중입니다....</div>;
}