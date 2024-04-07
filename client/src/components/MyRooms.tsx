import React from 'react'
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Link } from 'react-router-dom';

export default function MyRooms() {

    useEffect(()=>{
        fetchMyRooms();
    },[])

  
    const [ rooms , setRooms] = useState<any[]>([]);

     const user = useSelector((state: any) => state.user.user) || null;


 
    const fetchMyRooms = async ()=>{

      // console.log(user_id)
        try {
            const {data} = await axios.get("http://localhost:3000/api/v1/rooms" ,

            {
              withCredentials : true
            }
             );
      
            console.log(data)
            setRooms(data.rooms)
          } catch (err) {
            console.log(err)
          }
    }
      
      
  return (
    <div>

        <h1>Previous Study Rooms</h1>


        <Table className="w-[800px] shadow-md ">
        <TableHead>
          
        </TableHead>
        <TableBody>
            <TableRow className="text-lg font-semibold">
                <TableCell >Room Code</TableCell>
                <TableCell>Room Description</TableCell>
                <TableCell ></TableCell>
            </TableRow>
          
            {rooms.map((room, i) => (
              
                room.ownerId == user?._id && (
                  <TableRow>
                  <TableCell>{room.room_code}</TableCell>
                  <TableCell>{room.description}</TableCell>
                  <TableCell><Link to="/room"><Button>Join</Button></Link></TableCell>

                  </TableRow>


                  
                )
              
          
          ))}
        </TableBody>
      </Table>

      



    </div>
  )
}
