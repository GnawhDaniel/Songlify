import 'bootstrap/dist/css/bootstrap.css';
import Search from "@components/Search"
import SongsPage from '@components/SongsPage';
import Test from '@components/Test';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'


function App() {

  return (
    <>
        <Router>
          <Routes>
            <Route path="/" element={<Search/>}></Route>
            <Route path="/playlist/:id" element={<SongsPage/>}></Route>
            <Route path="/test2" element={<Test/>}></Route>
          </Routes>
        </Router>
    </>
  );
}


export default App;