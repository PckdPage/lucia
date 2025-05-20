import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "../ui/button";

import { useEffect, useState } from "react"; //to manage componenet state and side effect
import axios from "axios"; //to make http requests

import { useQueryClient } from "@tanstack/react-query"; //to manage server state and cache
import { toast } from "sonner"; // to display notifications

import { useNavigate } from "react-router-dom"; //programmatic navigation

import { useDispatch } from "react-redux"; //to flow actions to redux store, specifically clear selected todo
import { clearSelectedTodo } from "./../../store/todoSlice";

const DialogContentComp = ({
  data,
  label,
  setAddOpen,
}: {
  data: any;
  label: string;
  setAddOpen?: (open: boolean) => void; //component that takes function as props.
}) => {
  const queryClient = useQueryClient(); //to manage server state
  const navigate = useNavigate(); //for program navigation
  const dispatch = useDispatch(); //to dispatch action to redux store

  let defaultValues;
  data
    ? (defaultValues = {
        dueDate: data.dueDate,
        category: data.category,
        priority: data.priority,
        title: data.title,
        description: data.description,
      })
    : (defaultValues = {
        dueDate: "",
        category: "",
        priority: "",
        title: "",
        description: "",
      }); //set based on if data is provided, or else initialize to empty strings.


  console.log("defaultValueskraixa", defaultValues);
  const [submitFields, setSubmitFields] = useState({
    id: "",
    dueDate: "",
    category: "",
    priority: "",
    title: "",
    description: "",
  }); //variable initialized with empty string which will hold value from form input.
  useEffect(() => { //data change vayo ki run hunxa, if data xa vaye updates the field with the values
    if (data) {
      setSubmitFields({
        id: data.id,
        dueDate: data.dueDate,
        category: data.category,
        priority: data.priority,
        title: data.title,
        description: data.description,
      });
    }
  }, [data]);
  const handleDateSelect: any = (selectedDate: Date | null) => { //updates due date in submit field  when a date is selected
    if (selectedDate) {
      setSubmitFields((prevState) => ({
        ...prevState,
        dueDate: selectedDate.toISOString(),
      }));
    }
  };
  const handleInputChange = // high order function josle field linxa argument ma and returns function which handles changes in input field
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = e.target;
      setSubmitFields((prevState) => ({
        ...prevState,
        [field]: value,
      }));
    };
  const handleSelectChange = (field: string, value: string) => { //updates specified field in submit field when new value is selected from drom down.
    setSubmitFields((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const submitFunction = async () => { // handles form submission and checks if it is submit or edit
    try {
      if (label === "Submit") {// submit vaye euta post request add garxa using axios
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/postTodo`,
          submitFields,
          {
            withCredentials: true,
          }
        );
        // success vaye success toast dekhauxa invalidates todoData query to refresh data 
        toast.success("Todo Added");
        queryClient.invalidateQueries({ queryKey: ["todoData"] });
        dispatch(clearSelectedTodo());
        navigate("/");
        setAddOpen?.(false);
      } else { // edit vaye sends PUT req to update existing todo item using axios
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/putTodo`,
          submitFields,
          {
            withCredentials: true,
          }
        );
        toast.success("Todo Edited");
        queryClient.invalidateQueries({ queryKey: ["todoData"] });
        dispatch(clearSelectedTodo());
        navigate("/");
        setAddOpen?.(false);
      }
    } catch (error) {
      toast.error("Failed To Add Todo");
      console.error(error);
    }
  };

  const deleteFunction = async (id: any) => {// sends a delete req to remove etodo item with specific id
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/deleteTodo/${id}`,
        {
          withCredentials: true,
        }
      );
      toast.success("Todo Deleted");
      queryClient.invalidateQueries({ queryKey: ["todoData"] });
      dispatch(clearSelectedTodo());
      navigate("/");
      setAddOpen?.(false);
    } catch (error) {
      toast.error("Failed To Delete Todo");
      console.error(error);
    }
  };

  return (
    <div className="grid grid-cols-[1fr_50rem] gap-5">
      <div
        className={`${
          label === "Submit" ? "bg-sidebar" : null
        } flex flex-col gap-10`}
      >
        <Calendar
          mode="single" // only one date can be selected
          selected={
            submitFields.dueDate ? new Date(submitFields.dueDate) : undefined //converts date object natra remains undefined.
          }
          onSelect={handleDateSelect}
          disabled={(date) => date < new Date()} //disables past date
          className="rounded-md border p-10" 
        />
        <div className="flex flex-col gap-5">
          <div className="w-full flex justify-center flex-col gap-5">
            
            <label
              htmlFor="title"
              className="font-extrabold text-2xl self-center"
            >
              Category
            </label>
            <Input
              value={submitFields.category}
              onChange={handleInputChange("category")}
              placeholder="Category"
              className="font-bold w-[180px] self-center"
            ></Input>
          </div>
          <div className="w-full flex justify-center mb-10">
            <Select
              value={submitFields.priority}
              onValueChange={(value) => handleSelectChange("priority", value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="p-10 flex flex-col gap-8">
        <div className="flex justify-between">
          <label htmlFor="title" className="font-extrabold text-2xl">
            Title
          </label>
          <span>
            {/* <CountdownTimer dueDate={submitFields.dueDate} /> */}
            {new Date(submitFields.dueDate) > new Date() && (
              <CountdownTimer dueDate={submitFields.dueDate} />
            )}
          </span>
        </div>
        <Input
          value={submitFields.title}
          onChange={handleInputChange("title")}
          placeholder="Title"
          className="font-bold h-30"
        ></Input>
        <label htmlFor="description" className="font-extrabold text-2xl">
          Description
        </label>
        <Textarea
          value={submitFields.description}
          onChange={handleInputChange("description")}
          placeholder="Description"
          className="font-bold h-full"
        ></Textarea>
        <div className="mt-5 flex gap-2 justify-end">
          <Button onClick={submitFunction}>{label}</Button>
          {label === "Edit" ? (
            <Button
              className="bg-red-500"
              onClick={() => {
                deleteFunction(submitFields.id);
              }}
            >
              Delete
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
};//returns div which gives box layout of the whole dialog contents.
export default DialogContentComp;

function getTimeLeft(dueDate: string) {
  const now = new Date().getTime();
  const due = new Date(dueDate).getTime();
  const diff = due - now;

  return {
    total: diff,
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }; //calculate the time left until the due date
}

const CountdownTimer = ({ dueDate }: { dueDate: string }) => { //to show countdown 
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(dueDate)); //initialize state variable timeleft using get to calculate initial time left

  useEffect(() => { //set interval that updates tme left every second by calling get time left
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(dueDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [dueDate]);

  if (timeLeft.total <= 0) {
    return <span>🕒 Time's up!</span>;
  }

  return ( //time left xa vaye displays the remaining time.
    <span>
      {timeLeft.days}D {timeLeft.hours}H {timeLeft.minutes}M {timeLeft.seconds}s
    </span>
  );
};
//a react component for dialog for add edit and delete  details for todo where we use various hooks and libraries to manage state, handle side effect, communicate with backend api.