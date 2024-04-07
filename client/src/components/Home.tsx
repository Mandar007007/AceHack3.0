import React from 'react'

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
        let result = "";
        const characters =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
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

        <div className='flex flex-col space-y-10 justify-center items-center'>
          <img src="hero2.png" alt="" className='h-[320px] rounded-xl' />

          <div className='text-center'>
            <h1 className='text-4xl'>GyaanGanga</h1>
            <p className='text-md mt-3'>Learn Together, Thrive Together!</p>
          </div>

        
        </div>
    </div>
  )
}
