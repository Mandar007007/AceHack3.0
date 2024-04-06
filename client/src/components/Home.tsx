import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";


export default function Home() {
    const [email, setEmail] = useState("");
    const [room, setRoom] = useState("");

    const socket = useSocket();
    const navigate = useNavigate();

    if(!socket) {
        return <div>Loading...</div>
    }


    socket.on("connect", () => {
        console.log("Connected to server");
      } );


    const makeroom = (length: any) => {
        length = 10;
        var result = "";
        var characters =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        console.log(result);
        setRoom(result);
    };
    

    const handleJoinRoom = useCallback(
        (data : any) => {
          const {  room } = data;
          navigate(`/room/${room}`);
        },
        [navigate]
      );
    



    const handleSubmitForm = useCallback(
        (e : any) => {
          e.preventDefault();

          console.log("email", email);
          console.log("room", room);
          if( room !== ""  &&  email !== "" ) {
            localStorage.setItem("last-room", room);
            socket.emit("join-room", { email , room });
            navigate(`/room/${room}`);
          } else {
            alert("Please enter a room name");
          }
        },
        [email, room, socket]
      );
    

      useEffect(() => {
        socket.on("join-room", handleJoinRoom);
        return () => {
          socket.off("join-room", handleJoinRoom);
        };
      }, [socket, handleJoinRoom]);
    




  return (
    <div>
        
        <h1>This is home page</h1>



        <form onSubmit={handleSubmitForm}>
        <label htmlFor="email">Email ID</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label htmlFor="room">Room ID</label>
        <input
          type="text"
          id="room"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <br />

        
        <button>Join</button>
      </form>
      <button onClick={makeroom}>Create Room</button>


    </div>
  )
}
