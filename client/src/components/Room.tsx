import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import { Textarea } from "@/components/ui/textarea"
import axios from "axios";
import toast from "react-hot-toast";



export default function Room() {
  const [room, setRoom] = useState("");

  const [description , setDescription] = useState("");
  
  const socket = useSocket();
  const navigate = useNavigate();
  
  const user = useSelector((state: any) => state.user.user) || null;
  const email = user?.email
  

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
        // setRoom(result);
        // console.log(result)
        return result;
    };
    

    const handleJoinRoom = useCallback(
        (data : any) => {


          const {  room } = data;
          navigate(`/room/${room}`);
        },
        [navigate]
    );

    const createNewRoom = useCallback(
      
      async  (e : any) => {
        e.preventDefault();
        const newRoom = makeroom(10);
        setRoom(newRoom)
        console.log("email", email);
        console.log("room", room);




        if( newRoom !== ""  &&  email !== "" ) {
          localStorage.setItem("last-room", room);
          
          const room_code = newRoom
          try{
            const res = await axios.post("http://localhost:3000/api/v1/room" , { description, user , room_code } ,
            {
              withCredentials: true
            })

            toast.success("New Room Created")
            socket.emit("join-room", { email , newRoom });
             navigate(`/room/${newRoom}`);
          }

          catch(err){
            console.log(err)
            toast.error("Something went wrong")
          }
          
        } else {
          alert("Please enter a room name");
        }
      },
      [email, room, socket]
    );
    



    const handleSubmitForm = useCallback(
        (e : any) => {
          e.preventDefault();
          setEmail(user?.email);
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
    <div className="w-[400px]">
        
        



        <form onSubmit={handleSubmitForm}>
        {/* <label htmlFor="email">Email ID</label>
        <Input type="email"
          id="email"
          value={email}
          onChange={(e : any) => setEmail(e.target.value)}
          placeholder="Email" />
        <br />*/}
        <label htmlFor="room">Room Code</label>
        <Input
          type="text"
          id="room"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="Enter the room code"
        /> 
        <br />

        
        <Button>Join Room</Button>
      </form>

      <p className="text-center mt-2">Or</p>
      <div>
      <label htmlFor="room">Description</label>
        <Textarea
          
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write small description about room"
        /> 
        <br />
      </div>
      <Button onClick={createNewRoom} className="mt-4">Create New Room</Button>


    </div>
  )
}
