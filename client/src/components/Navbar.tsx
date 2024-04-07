"use client"

import * as React from "react"


import { cn } from "@/lib/utils"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import { useSelector } from "react-redux"
// import { useSelector } from "react-redux"


const components: { title: string; href: string; description: string }[] = [
  {
    title: "Create Study Rooms",
    href: "/create-room",
    description:
      " ",
  },


  
]

export function Navbar() {

  const user = useSelector((state : any) => state.user.user) || null;
  
 

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
          <Link to="/about"  >
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              About Us
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
      {user? <Button className="ml-auto " variant={"outline"}>{user.name}</Button> : ""}
      { !user    &&
        <Button className="ml-auto"><Link to="/login">Login</Link></Button>
      }

    </div>
  )

}

const ListItem = React.forwardRef(
  ({ className, title, children, href, ...rest }: { className: string; title: string; children: React.ReactNode; href: string; }, ref) => {
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