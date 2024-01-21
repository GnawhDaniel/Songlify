import 'bootstrap/dist/css/bootstrap.css';
import Search from "@components/Search"
import SongsPage from '@components/SongsPage';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'


function App() {

  return (
    <>
        <Router>
          <Routes>
            <Route path="/" element={<Search/>}></Route>
            <Route path="/playlist/:id" element={<SongsPage/>}></Route>
          </Routes>
        </Router>
    </>
  );
}


export default App;