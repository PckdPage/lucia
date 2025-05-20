import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";//ui component to separate elements
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Calendar from "../Calendar";


import { useSelector } from "react-redux"; //to access redux store state
import React from "react"; //for building component
import { useQuery } from "@tanstack/react-query"; //to fetch data from the server
import axios from "axios"; //to make http request

export default function HomeLoggedIn() { //functionla component exported as default of module
  const selectedTodo = useSelector((state: any) => state.todo.selectedTodo);// retrieved from redux store using useselector to access currently selected todo

  const [filters] = React.useState({// hold any filter that will be applied to todo
  });
  const { data } = useQuery({ //usequery hook to fetch todo data from server
    queryKey: ["todoData", filters], //unique identifier
    queryFn: async () => { //get req to backend api to retrieve todo items
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/getTodo`,
        {
          withCredentials: true,
          params: filters,
        }
      );
      return response.data;//fetched todo items
    },
  });

  const sampleTodos = data?.Todo; // variable is assigned to todo property from fetched data. holds list of todo items received from server
  return (
    <SidebarProvider //sidebar layout with custom css
      style={
        {
          "--sidebar-width": "350px",
        } as React.CSSProperties
      }
    >
      <AppSidebar /> 
      <SidebarInset>
        <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          
        </header>
        
        <div className="aspect-video h-12 w-full rounded-lg">
          <div className="flex">
            
          </div>
          <Calendar todos={sampleTodos} />
        </div>
        {/* )}
        </div> */}
      </SidebarInset>
    </SidebarProvider>
  );
}
