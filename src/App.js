import './App.css';
import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import Login from './page/Login';
import Header from './components/Header';
import Footer from './components/Footer';
import Register from './page/Register';
import Main from './page/Main';
import KaKaoRedirect from './page/KaKaoRedirect';
import ClassList from './page/ClassList';
import KakaoRegister from './page/KakaoRegister';
import MypageInfo from './page/MypageInfo';
import UserUpdate from './page/UserUpdate';
import Mypage from './page/Mypage';
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
      {!hideHeaderFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;