import './App.css'
import Player from './components/Player';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// import Board from './components/Board';
import { Navbar } from './components/Navbar';
import Login from './components/auth/Login';
import toast, { Toaster } from 'react-hot-toast';
import Register from './components/auth/Register';
import Home from './components/Home';
import Room from './components/Room';
import axios  from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import MyRooms from './components/MyRooms';
function App() {

  const dispatch = useDispatch();
 


  const loadUser = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/v1/loaduser", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      // console.log(data)

      if (data.user) {
        dispatch({ type: "SET_USER", payload: data.user });
        // toggleLogin();
        
      } else {
        dispatch({ type: "CLEAR_USER" });
      }
    } catch (err) {
      console.log(err)
    }
  }


  useEffect(()=>{

    loadUser();
  },[])

  
  

  return (
    <div className='font-secondary'>
      <Router>
        <Toaster/>
        <Navbar/>
        <div className='flex min-h-screen flex-col items-center mt-10'>
        <Routes>

        <Route path="/"  element={<Home/>} />
        <Route path="/room"  element={<Room/>} />

        <Route path="/room/:roomId"  element={ <Player/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>  }/>
        <Route path="/myrooms" element={<MyRooms/>  }/>
        
        {/* <Route path="/board" element= {<Board/>}></Route> */}
        </Routes>

        </div>


      </Router>
     
      {/* <ReactPlayer url={"https://youtu.be/pGAp5rxv6II?si=iVYNYn4K63MnqS4M"} playing={true} controls={true} width="100%" height="100%" /> */}

      {/* <Player/> */}




    </div>
  )
}

export default App
