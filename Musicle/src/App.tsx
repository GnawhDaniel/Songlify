import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Search from "@components/Search"
import './App.css';

function App() {

  // const [token, setToken] = useState('');

  // useEffect(() => {

  //   async function getToken() {
  //     const response = await fetch('http://localhost:5000/auth/token');
  //     const json = await response.json();
  //     console.log(json);
  //     setToken(json.access_token);
  //   }

  //   getToken();

  // }, []);

  return (
    <>
        <h1>SonGuess</h1>
        <Search/>
        {/* <WebPlayback token={token} /> */}
    </>
  );
}


export default App;