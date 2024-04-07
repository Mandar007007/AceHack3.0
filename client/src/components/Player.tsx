import React, { useEffect, useState , useRef} from "react";
// import * as io from "socket.io-client";
import ReactPlayer from "react-player";
import { useSocket } from "../context/SocketProvider";
import { useParams } from "react-router-dom";
import { Stream } from "stream";

const RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
const RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate;

export default function Player( ) {
  const socket = useSocket();

  if (!socket) {
    return <div>Loading...</div>; 
  }

  const room = useParams().roomId;

  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isCalling, setIsCalling] = useState(false);
  const [peerConnection, setPeerConnection] = useState(null);


  // const [room, setRoom] = useState("");

  const [url, setUrl] = useState("");

  
  const handleUrlSubmit = () => {
    localStorage.setItem("last-url" , url);

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


  useEffect(() => {

    // localStorage.setItem("last-room", room);
		// localStorage.setItem("last-url", url);
    // Handle incoming stream from other users
    socket.on("user:joined", ({ email,id }) => {
    
      handleUserJoined(id);
    });

    socket.on("recv-url", (url: any) => {
    
		  // localStorage.setItem("last-url", url);
      console.log( `url is ${url}`)
      setUrl(url);
    });

    socket.on("recv-data", data => {
			// if (data === "play") {
				setState({ ...state, playing: !state.playing });
        console.log(state.playing);
			// }
		});


    socket.on("recv-state", state => {
      // console.log(state);
			if (state.playing === true) {
				setState({ ...state, playing: true  });
				
			} else {
				setState({ ...state, playing: false });
			}
		});

  } );

  const handleUserJoined = (id) => {
    // Create a peer connection with the remote user
    const peerConnection = new RTCPeerConnection();
    
    // Add local stream to peer connection
    localStream.getTracks().forEach((track) => peerConnection.addTrack(track, localStream));

    // Set up event handlers for peer connection
    peerConnection.ontrack = handleTrackEvent;
    peerConnection.onicecandidate = handleICECandidateEvent;

    // Create offer and set local description
    peerConnection.createOffer()
    .then((offer) => {
      
      return peerConnection.setLocalDescription(offer);
    })
    .then(() => {
      // Send offer to the remote user
      socket.emit("offer", { id, offer: peerConnection.localDescription });
    })
    .catch((error) => {
      alert(1)
      console.error("Error creating offer:", error);
    });

    // Handle incoming ice candidates from the remote user
    socket.on("ice-candidate", ({ id, candidate }) => {
      if (id === socket.id) return; // Ignore ice candidates from self
      peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    });
};
  useEffect(()=>{
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    }).then(Stream => {
      setLocalStream(Stream);
      localVideoRef.current.srcObject = Stream
      
    })
  })
    return () => {
      socket.off("recv-url");
      socket.off("recv-data");
      socket.off("recv-state");
    }; 



  return (
    <div>
      <h1>Your room is {room}</h1>


      <div>
        <label htmlFor="url">URL</label>
        <input
          type="text"
          id="url"
          name="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        ></input>
        <button onClick={handleUrlSubmit}>Submit</button>
      </div>

      <div>
        <ReactPlayer
          url={url}
          playing={state.playing}
          controls={false}

          onPlay={handlePlay}
          onPause={handlePause}
          width="500px"
          height="300px"
        />
      </div>
      <div className="videoDiv">
    <video id="localVideo" ref={localVideoRef} style={{"height":100,"width":100}}autoPlay></video>
    <video id="remoteVideo" ref={remoteVideoRef} autoPlay></video>
      </div>
    </div>
  );
}
