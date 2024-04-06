import React from 'react'
import io from "socket.io-client";
import {useRef,useEffect} from "react"

const Room = () => {
    const userVideo = useRef()
    const partnerVideo = useRef()
    const peerRef =  useRef()
    const socketRef = useRef()
    const otherUser = useRef()
    const userStream = useRef()

    useEffect(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true})
        userVideo.current.srcObject = stream;
        userStream.current = stream

        socketRef.current = io.connect("/");
        socketRef.current.emit("join room",props.match.params.roomId)

        socketRef.current.on("other user",userId => {
            callUser(userId)
            otherUser.current = userId
        })

        socketRef.current.on("user joined",userId => {
            otherUser.current = userId;
        })

        socketRef.current.on("offer",handleReceiveCall)

        socketRef.current.on("answer",handleAnswer)

        socketRef.current.on("ice-candidate",handleNewICECandidateMsg)
    },[])

    function callUser(userId){
        peerRef.current = createPeer(userId)
        userStream.current.getTracks().forEach(track => peerRef.current.addTrack(track,userStream.current))

    }

    function createPeer(userId){
        const peer = new RTCPeerConnection({
            iceServers:[
                {
                    urls:"stun:stun.stunprotocol,org"
                },
                {
                    urls:"turn:numb.viagenie.ca",
                    credential:'muazkh',
                    username:'webrtc@live.com'
                }
            ]
        })
        peer.onicecandidate = handleICECandidateEvent;
        peer.ontrack = handleTrackEvent;
        peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userId);

        return peer;
    }

    function handleNegotiationNeededEvent(userId){
        peerRef.current.createOffer().then(offer => {
            return peerRef.current.setLocalDescription(offer)
        }).then(() => {
            const payload = {
                target: userId,
                caller: socketRef.current.id,
                sdp:peerRef.current.LocalDescription
            }
            socketRef.current.emit("offer",payload)
        }).catch(e => console.log(e));
    }

    

  return (
    <div>
      <video autoPlay ref={userVideo}></video>
      <video autoPlay ref={partnerVideo}></video>
    </div>
  )
}

export default Room
