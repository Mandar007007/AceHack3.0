import './App.css'
import { io } from 'socket.io-client'
import ReactPlayer from 'react-player';
import Player from './components/Player';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Board from './components/Board';

function App() {

  
  

  return (
    <>
      <Router>
        <Routes>

        <Route path="/"  element={<Home/>} />
        <Route path="/room/:roomId"  element={ <Player/>} />
        <Route path="/board" element= {<Board/>}></Route>
        </Routes>




      </Router>
     
      {/* <ReactPlayer url={"https://youtu.be/pGAp5rxv6II?si=iVYNYn4K63MnqS4M"} playing={true} controls={true} width="100%" height="100%" /> */}

      {/* <Player/> */}




    </>
  )
}

export default App
