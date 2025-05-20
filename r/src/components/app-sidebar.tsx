import * as React from "react";

import { useDispatch, useSelector } from "react-redux";
import { setSelectedTodo } from "../store/todoSlice";

import {
  Plus,
  Moon,
} from "lucide-react";

import { NavUser } from "@/components/nav-user";
import { Label } from "@/components/ui/label";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "./ui/button";
import DialogContentComp from "./main/DiaLogContentComp";

import { useQueryClient } from "@tanstack/react-query";

//sample data aaile lai
const normalData = { 
  user: {
    name: "User",
    email: "m@example.com",
    avatar: "/lucia_p.png",
  },
  navMain: [
    
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const dispatch = useDispatch(); //to dispatch actions to redux
  //eta
  const [activeItem, setActiveItem] = React.useState(normalData.navMain[0]); //to trach active nav items
  const { setOpen } = useSidebar(); //setopen is obtained from hook to control sidebar openstate
 
  const [darkMode, setDarkMode] = React.useState(() => { //initialized to track if dark mode is enabled then checks storage for prev stored values.
    const storedDarkMode = localStorage.getItem("darkMode"); 
    return storedDarkMode === "true";
  });

  React.useEffect(() => { //effect hook updates based on state and stores value in local storage
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  const [filters, setFilters] = React.useState({
    // priority: "Low",
  });

  const { data } = useQuery({ //usequery hook is used to fetch todo data from server
    queryKey: ["todoData", filters],
    queryFn: async () => {
      const response = await axios.get( //get req to backend api to retrieve todo items
        `${import.meta.env.VITE_BACKEND_URL}/api/getTodo`, //env variable for backend url
        {
          withCredentials: true,
          params: filters,
        }
      );
      return response.data;
    },
  });
  console.log(data);

  const getReadableData = (string: string): string => { 
    //takes date string as input and formats into readabel format using tolocalstring which specifies time zone and date and time
    const date = new Date(string);
    const formattedDate = date.toLocaleString("en-US", {
      timeZone: "Asia/Kathmandu",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return formattedDate;
  };

  const [addOpen, setAddOpen] = React.useState(false); //initialized to manage state of dialog for adding or editing todo

  type Todo = {
    id: string;
    title: string;
    category: string;
    description: string;
    dueDate: string;
    priority: string;
    addedDate: string;
    userId: string;
  };
  //to track which cat of todo is expanded in sidebar actively
  const [openCategory, setOpenCategory] = React.useState<string | null>(null); 

  //var created by reducing fetched data array by category 
  //key is cat and valye is array of todo in that category
  const groupedTodos = (data?.Todo || []).reduce((acc: any, todo: any) => {
    if (!acc[todo.category]) {
      acc[todo.category] = [];
    }
    acc[todo.category].push(todo);
    return acc;
  }, {} as Record<string, Todo[]>);

  const selectedTodo = useSelector((state: any) => state.todo.selectedTodo); //is retrieved from redux store

  return (
    <Sidebar  // two sidebar one of use profile and nav item and another one for displaying todo categoryies
      collapsible="icon"
      className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
      {...props}
    >
      <Sidebar
        collapsible="none"
        className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <a
                href="#"
                className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
              >
                <img
                  src="/lucia_p.png"
                  alt="company-logo"
                  className="object-cover w-full h-full"
                />
              </a>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser
            user={{
              name: data?.username,
              email: data?.email,
              avatar: data?.profilePic,
            }}
          />
        </SidebarFooter>
      </Sidebar>

      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between p-2">
            <div className="text-foreground text-base font-medium">
              {/* {activeItem?.title} */}TODO'S
            </div>
            <Label className="flex items-center gap-2 text-sm">
              <span>
                <Moon></Moon>
              </span>
              <Switch
                checked={darkMode}
                onCheckedChange={(checked) => setDarkMode(!!checked)}
                className="shadow-none"
              />
            </Label>
          </div>
          {/* <SidebarInput placeholder="Type to search..." /> */}
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger>
              <Button className="w-full" onClick={() => setOpen(true)}>
                <Plus />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent>
              <div className="">
                <DialogContentComp
                  data={null}
                  label="Submit"
                  setAddOpen={setAddOpen}
                />
              </div>
            </DialogContent>
          </Dialog>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="px-0">
            <SidebarGroupContent>
              <div className="space-y-4">
                {Object.entries(groupedTodos).map(([category, todos]) => {
                  const typedTodos = todos as Todo[];
                  return (
                    <div key={category} className="border rounded-lg">
                      <button
                        onClick={() =>
                          setOpenCategory(
                            openCategory === category ? null : category
                          )
                        }
                        className="w-full text-left p-4 font-bold bg-gray-100  dark:bg-black"
                      >
                        {category} ({typedTodos.length})
                      </button>

                      {openCategory === category && (
                        <ul className="p-4 space-y-2 bg-white dark:bg-[#0a0a0a0a]">
                          {typedTodos.map((todo: any) => (
                            <li
                              key={todo.id}
                              className="p-3 border rounded-md shadow-sm bg-gray-50 dark:bg-gray-700"
                              // onClick={() => dispatch(setSelectedTodo(todo))}
                            >
                              <Dialog open={addOpen} onOpenChange={setAddOpen}>
                                <DialogTrigger className="w-full flex flex-col gap-3" onClick={() => dispatch(setSelectedTodo(todo))}>

                                  <div className="flex">
                                    {todo.priority === "High" ? (
                                      <span className="flex items-center bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                                        HIGH
                                      </span>
                                    ) : todo.priority === "Medium" ? (
                                      <span className="flex items-center bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                                        MEDIUM
                                      </span>
                                    ) : (
                                      <span className="flex items-center bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                                        LOW
                                      </span>
                                    )}

                                    <span className="ml-auto text-xs w-auto">
                                      {getReadableData(todo.dueDate)}
                                    </span>
                                  </div>
                                  <span className="font-extrabold line-clamp-1 w-full whitespace-break-spaces text-left">
                                    {todo.title}
                                  </span>
                                  <span className="line-clamp-2 w-[260px] text-xs whitespace-break-spaces text-left">
                                    {todo.description}
                                  </span>
                                </DialogTrigger>
                                <DialogContent>
                                  <div className="">
                                    <DialogContentComp
                                      data={{
                                        id: selectedTodo?.data.id,
                                        dueDate: selectedTodo?.data.dueDate,
                                        category: selectedTodo?.data.category,
                                        priority: selectedTodo?.data.priority,
                                        title: selectedTodo?.data.title,
                                        description:
                                          selectedTodo?.data.description,
                                      }}
                                      label="Edit"
                                      setAddOpen={setAddOpen}
                                    />
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  );
}
