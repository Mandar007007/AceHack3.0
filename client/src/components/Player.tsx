import React, { useEffect, useState, useRef } from "react";
// import * as io from "socket.io-client";
import ReactMarkdown from 'react-markdown';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import ReactPlayer from "react-player";
import { useSocket } from "../context/SocketProvider";
import { useParams } from "react-router-dom";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Board from "./Board";
import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import axios from "axios";

export default function Player() {
  const socket = useSocket();

  if (!socket) {
    return <div>Loading...</div>;
  }

  const room = useParams().roomId;

  const [data, setData] = useState("");

  const [subject, setSubject] = useState("");

  // const [room, setRoom] = useState("");

  const [url, setUrl] = useState("");

  const handleUrlSubmit = () => {
    localStorage.setItem("last-url", url);

    socket.emit("send-url", url, room);
  };

  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const controlsRef = useRef(null);

  const handlePlay = () => {
    socket.emit(
      "send-state",
      {
        playing: true,
        // rate: playbackRate,
        // time: playerRef.current.getCurrentTime(),
      },
      room
    );
  };

  
  const handlePlayPause = () => {
    // console.log("playpause");
    socket.emit("send-data", !state.playing, room);
  };

  const handlePause = () => {
    socket.emit(
      "send-state",
      {
        playing: false,
        // rate: playbackRate,
        // time: playerRef.current.getCurrentTime(),
      },
      room
    );
  };

  const [state, setState] = useState({
    playing: false,
    played: 0,
    seeking: false,
    muted: false,
    volume: 0.8,
    playbackRate: 1,
  });

  useEffect(() => {
    // const lastroom = localStorage.getItem("last-room");
    const localurl = localStorage.getItem("last-url");

    // if (lastroom) {
    //   setRoom(lastroom);
    //   socket.emit("join-room", lastroom);
    // }
    // if (!lastroom && room === "") {
    //   setRoom(newroom);
    //   socket.emit("join-room", newroom);
    // }
    if (localurl) {
      setUrl(localurl);
      setUrl(localurl);
    }
  }, []);

  const getNotes = async () => {
    console.log("getnotes");
    console.log(url , subject);
    const youtube_link = url;
    const res = await axios.post("http://127.0.0.1:5000/get_notes", { youtube_link, subject });

    if(res.data){
      setData(res.data);

      
      
    }

  };
  const notesHtml = data.split('\n').map((line, index) => {
    // Checking if the line starts with '*' to determine if it's a bullet point
    if (line.startsWith('*')) {
      return <li key={index}>{line.substring(1)}</li>; // Removing the '*' and creating a list item
    } else if (line.startsWith('**')) {
      return <h2 key={index}>{line.substring(2)}</h2>; // Removing the '**' and creating a heading
    } else if (line.startsWith('*')) {
      return <p key={index}>{line.substring(1)}</p>; // Removing the '*' and creating a paragraph
    } else {
      return <p key={index}>{line}</p>; // If not a special format, just creating a paragraph
    }

    
  });

  useEffect(() => {
    // localStorage.setItem("last-room", room);
    // localStorage.setItem("last-url", url);

    socket.on("recv-url", (url: any) => {
      // localStorage.setItem("last-url", url);
      console.log(`url is ${url}`);
      setUrl(url);
    });

    socket.on("recv-data", (data) => {
      // if (data === "play") {
      setState({ ...state, playing: !state.playing });
      console.log(state.playing);
      // }
    });

    socket.on("recv-state", (state) => {
      // console.log(state);
      if (state.playing === true) {
        setState({ ...state, playing: true });
      } else {
        setState({ ...state, playing: false });
      }
    });

    return () => {
      socket.off("recv-url");
      socket.off("recv-data");
      socket.off("recv-state");
    };
  });

  const handleDownloadPDF = () => {
    const input = document.getElementById('notes');

    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 0, 0);
        pdf.save('physics_notes.pdf');
      });
  }

  

  return (
    <div>
      <div className="fixed top-25 right-2 border border-white p-2 rounded-md">
        Invite Code :{" "}
        <span className="bg-white text-black rounded-sm p-1"> {room}</span>{" "}
      </div>

      <div className="flex justify-center items-center space-x-4">
        {/* <label htmlFor="url">URL</label> */}
        {/* <input
          type="text"
          id="url"
          name="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        ></input> */}

        <Input
          type="text"
          id="url"
          name="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter the URL"
        />

        <Button onClick={handleUrlSubmit} className="my-4">
          Go
        </Button>
      </div>

      <div className="mx-auto">
        <ReactPlayer
          url={url}
          playing={state.playing}
          controls={false}
          onPlay={handlePlay}
          onPause={handlePause}
          width="600px"
          height="400px"

        
        />
      </div>

      {/* <Board /> */}
      {/* <div className=" h-[400px] mt-10">
			<Tldraw />
		</div> */}

      <Drawer>
        <Button className="m-4">
          <DrawerTrigger>Open Drawing-Board</DrawerTrigger>
        </Button>

        <div className="flex justify-center items-center">
          <div className="flex flex-col  items-center">
            {/* <p>Having no time to watch? </p> */}
            <Button className="m-4 bg-pink-400" onClick={getNotes}>
              Get Auto-Generated Notes
            </Button>
          </div>

          <Select onValueChange={ e => setSubject(e)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Physics">Physics</SelectItem>
              <SelectItem value="Chemistry">Chemistry</SelectItem>
              <SelectItem value="Maths">Maths</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DrawerContent>
          <div className=" h-[600px] mt-10">
            <Tldraw />
          </div>
        </DrawerContent>
      </Drawer>



      {/* <p>{notesHtml}</p> */}
      <div className="max-w-[800px]" id="notes" dangerouslySetInnerHTML={{ __html: data }} />
 
      <Button onClick={handleDownloadPDF}>Download PDF</Button>
    </div>
  );
}