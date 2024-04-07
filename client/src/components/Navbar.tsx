"use client";

import * as React from "react";
import axios from "axios";
import { cn } from "@/lib/utils";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
// import { useSelector } from "react-redux"

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Study Rooms",
    href: "/room",
    description: "",
  },

  {
    title: "Previous Rooms",
    href: "/myrooms",
    description: " ",
  },
];

export function Navbar() {

  const user = useSelector((state: any) => state.user.user) || null;
  const dispatch = useDispatch()
  const navigate = useNavigate()


  const handleLogout = async ()=>{

    const response = await axios.post("http://localhost:3000/api/v1/logout" ,
    {
      withCredentials: true
    });

    if(response.data){
      toast.success('Logged out successfully')
      // console.log(response.data)

      dispatch({
          type: 'CLEAR_USER',
      })
      navigate('/')

    }
  }

  return (
    <div className="border-b p-2 shadow-md flex justify-around items-center">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link className="flex justify-center items-center" to="/">
              <img src="/logo.png" alt="" className="h-14" />
              <h1 className="text-2xl font-bold ml-2">GyaanGanga</h1>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Explore</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                {components.map((component) => (
                  <ListItem
                    key={component.title}
                    title={component.title}
                    href={component.href}
                    className={""}
                  >
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/about">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                About Us
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      {user ? (
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>{user.name}</MenubarTrigger>
            <MenubarContent>
             
              <MenubarItem>{user.email}</MenubarItem>
              
              <MenubarItem onClick={handleLogout} ><span className="text-red-400">Logout</span></MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      ) : (
        ""
      )}
      {!user && (
        <Button className="ml-auto">
          <Link to="/login">Login</Link>
        </Button>
      )}
    </div>
  );
}

const ListItem = React.forwardRef(
  (
    {
      className,
      title,
      children,
      href,
      ...rest
    }: {
      className: string;
      title: string;
      children: React.ReactNode;
      href: string;
    },
    ref
  ) => {
    return (
      <li>
        <Link
          to={href}
          ref={ref as React.LegacyRef<HTMLAnchorElement>}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...rest}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </li>
    );
  }
);
ListItem.displayName = "ListItem";
