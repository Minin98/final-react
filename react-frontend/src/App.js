import './App.css';
import { Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import Login from './page/Login';
import Header from './components/Header';
import Register from './page/Register';
import Main from './page/Main';
import KaKaoRedirect from './page/KaKaoRedirect';
import ClassList from './page/ClassList';
import KakaoRegister from './page/KakaoRegister';

function App() {
  return (
    <Router>
    <Header/>
    <Routes>
      <Route path='/' element={<Main/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/kakao/login/oauth' element={<KaKaoRedirect/>} />
      <Route path='/kakaoRegister' element={<KakaoRegister/>} />
      <Route path='/register' element={<Register/>}/>
      <Route path='/classList' element={<ClassList/>}/>
    </Routes>
   </Router>
  );
}

export default App;
