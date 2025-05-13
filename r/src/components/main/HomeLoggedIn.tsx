import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Calendar from "../Calendar";

import DialogContentComp from "./DiaLogContentComp";

import { useSelector } from "react-redux";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function HomeLoggedIn() {
  const selectedTodo = useSelector((state: any) => state.todo.selectedTodo);

  console.log("yesyes", selectedTodo ? selectedTodo : "");

  const [filters, setFilters] = React.useState({
    // category: "Work",
    // priority: "Low",
  });
  const { data } = useQuery({
    queryKey: ["todoData", filters],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/getTodo`,
        {
          withCredentials: true,
          params: filters,
        }
      );
      return response.data;
    },
  });

  const sampleTodos = data?.Todo;
  return (
    <SidebarProvider
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
