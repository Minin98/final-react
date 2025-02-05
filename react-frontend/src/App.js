import './App.css';
import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import Login from './page/Login';
import Header from './components/Header';
import Register from './page/Register';
import Main from './page/Main';
import KaKaoRedirect from './page/KaKaoRedirect';
import ClassList from './page/ClassList';
import KakaoRegister from './page/KakaoRegister';
import MypageInfo from './page/MypageInfo';
import UserUpdate from './page/UserUpdate';
import Mypage from './page/Mypage';
<<<<<<< HEAD
import Class from './page/Class';

function Layout() {
  const location = useLocation();
  const hideHeaderFooter = location.pathname === '/login';

  return (
    <>
      {!hideHeaderFooter && <Header />}
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/login' element={<Login />} />
        <Route path='/kakao/login/oauth' element={<KaKaoRedirect />} />
        <Route path='/kakaoRegister' element={<KakaoRegister />} />
        <Route path='/register' element={<Register />} />
        <Route path='/classList' element={<ClassList />} />
        <Route path='/mypage' element={<Mypage />} />
        <Route path='/mypage/userinfo' element={<MypageInfo />} />
        <Route path='/mypage/updateinfo' element={<UserUpdate />} />
        <Route path='/class/:classNumber' element={<Class />} />
      </Routes>
      {!hideHeaderFooter && <footer />}
    </>
  );
}
=======
>>>>>>> af3d680eab0ac82d632127d5f954a6916b20bf1f

function App() {
  return (
    <Router>
<<<<<<< HEAD
      <Layout />
    </Router>
=======
    <Header/>
    <Routes>
      <Route path='/' element={<Main/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/kakao/login/oauth' element={<KaKaoRedirect/>} />
      <Route path='/kakaoRegister' element={<KakaoRegister/>} />
      <Route path='/register' element={<Register/>}/>
      <Route path='/classList' element={<ClassList/>}/>
      <Route path='/mypage' element={<Mypage/>}/>
      <Route path='/mypage/userinfo' element={<MypageInfo/>}/>
      <Route path='/mypage/updateinfo' element={<UserUpdate/>}/>
    </Routes>
   </Router>
>>>>>>> af3d680eab0ac82d632127d5f954a6916b20bf1f
  );
}

export default App;