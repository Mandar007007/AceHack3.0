import { useState } from "react";

import { Input } from "@/components/ui/input";
import axios from "axios";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state : any) => state.user.user);

  const isAuthenticated = useSelector((state : any) => state.user.isAuthenticated) || false;
  


  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const response = await axios.post("http://localhost:8000/api/v1/login"  , loginForm , 
      {
        withCredentials: true
      }
    
    );
    console.log(response)
    if(response.data){
        toast.success('Login Successfull')
        // console.log(response.data)

        dispatch({
            type: 'SET_USER',
            payload: response.data.user
        })

        // console.log(response.data)
        // console.log(user)
        // console.log(isAuthenticated)
        navigate('/')

    }
    else{
        toast.error('Login Failed')
        dispatch({
            type: 'CLEAR_USER'
        })
    }

    



  };

    const handleChange = (e: any) => {
        setLoginForm({
        ...loginForm,
        [e.target.name]: e.target.value,
        });
    };



  return (
    <div>
      <h1 className="text-3xl mb-10 text-center">Login</h1>

      
      <div>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="example@email.com"
              name="email"
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="********"
              name="password"
              type="password"
              onChange={handleChange}
            />
          </div>
        </div>
        <Button onClick={handleSubmit} className="mt-4">Login</Button>
        <p className="text-sm mt-4">New User ?<Link to='/register' className="text-blue-400"> Register here </Link></p>
      </div>
    </div>
  );
}