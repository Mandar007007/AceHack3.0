import './App.css'
import { io } from 'socket.io-client'
import ReactPlayer from 'react-player';
import Player from './components/Player';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
// import Board from './components/Board';
import { Navbar } from './components/Navbar';
import Login from './components/auth/Login';
import { Toaster } from 'react-hot-toast';
import Register from './components/auth/Register';

function App() {

  
  

  return (
    <>
      <Router>
        <Toaster/>
        <Navbar/>
        <div className='flex min-h-screen flex-col items-center mt-10'>
        <Routes>

        <Route path="/"  element={<Home/>} />
        <Route path="/room/:roomId"  element={ <Player/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>  }/>
        {/* <Route path="/board" element= {<Board/>}></Route> */}
        </Routes>

        </div>


      </Router>
     
      {/* <ReactPlayer url={"https://youtu.be/pGAp5rxv6II?si=iVYNYn4K63MnqS4M"} playing={true} controls={true} width="100%" height="100%" /> */}

      {/* <Player/> */}




    </>
  )
}

export default App
