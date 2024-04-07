import { useState } from "react";

import { Input } from "@/components/ui/input";
import axios from "axios";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [registerForm, setRegisterForm] = useState({
    name : "",
    email: "",
    password: "",
    contact : "",
  });

  const [otp, setOtp] = useState('') 
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  


  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const response = await axios.post("http://localhost:3000/api/v1/register"  , registerForm , 
      {
        withCredentials: true
      }
    
    );

    if(response.data){
        toast.success('OTP sent to your email')
        // console.log(response.data)
        navigate('/confirm-otp')

    }
    else{
        toast.error('Login Failed')
        dispatch({
            type: 'CLEAR_USER'
        })
    }

    



  };

  const handleOtpSubmit = async () => {
    const { email} = registerForm;
    const response = await axios.post("http://localhost:3000/api/v1/verify"  , { email, otp} , 
      {
        withCredentials: true
      }
    
    );

    if(response.data){
        toast.success('OTP verified')
        navigate('/login')

    }
    else{
        toast.error('OTP verification failed')
        dispatch({
            type: 'CLEAR_USER'
        })
    }
  }

    const handleChange = (e: any) => {
        setRegisterForm({
        ...registerForm,
        [e.target.name]: e.target.value,
        });
    };



  return (
    <div>
      <h1 className="text-3xl mb-10 text-center">Register</h1>

      
      <div>
        <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                id="name"
                placeholder="Kris Patel"
                name="name"
                onChange={handleChange}
                />
            </div>



          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="krishp759@gmail.com"
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

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="password">Contact Details</Label>
            <Input
              id="contact"
              placeholder="+91 6353879412"
              name="contact"
              onChange={handleChange}
            />
          </div>

          
        </div>
        <Button onClick={handleSubmit} className="mt-4">Send OTP</Button>

        <div className="flex flex-col space-y-1.5 mt-4">
            <Label htmlFor="otp">Enter OTP</Label>
            <Input
              id="otp"
              placeholder="123456"
              name="otp"
              onChange={(e) => setOtp(e.target.value)}
            />
        </div>
        <Button onClick={handleOtpSubmit} className="mt-4">Submit OTP</Button>

        <p className="text-sm mt-4">Already Registered?<Link to='/login' className="text-blue-400"> Login here </Link></p>
      </div>
    </div>
  );
}