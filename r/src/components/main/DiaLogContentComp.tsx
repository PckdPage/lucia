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

import { useEffect, useState } from "react";
import axios from "axios";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { clearSelectedTodo } from "./../../store/todoSlice";

const DialogContentComp = ({
  data,
  label,
  setAddOpen,
}: {
  data: any;
  label: string;
  setAddOpen?: (open: boolean) => void;
}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      });

  console.log("defaultValueskraixa", defaultValues);
  const [submitFields, setSubmitFields] = useState({
    id: "",
    dueDate: "",
    category: "",
    priority: "",
    title: "",
    description: "",
  });
  useEffect(() => {
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
  const handleDateSelect: any = (selectedDate: Date | null) => {
    if (selectedDate) {
      setSubmitFields((prevState) => ({
        ...prevState,
        dueDate: selectedDate.toISOString(),
      }));
    }
  };
  const handleInputChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = e.target;
      setSubmitFields((prevState) => ({
        ...prevState,
        [field]: value,
      }));
    };
  const handleSelectChange = (field: string, value: string) => {
    setSubmitFields((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const submitFunction = async () => {
    try {
      if (label === "Submit") {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/postTodo`,
          submitFields,
          {
            withCredentials: true,
          }
        );
        toast.success("Todo Added");
        queryClient.invalidateQueries({ queryKey: ["todoData"] });
        dispatch(clearSelectedTodo());
        navigate("/");
        setAddOpen?.(false);
      } else {
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

  const deleteFunction = async (id: any) => {
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
          mode="single"
          selected={
            submitFields.dueDate ? new Date(submitFields.dueDate) : undefined
          }
          onSelect={handleDateSelect}
          disabled={(date) => date < new Date()}
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
};
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
  };
}

const CountdownTimer = ({ dueDate }: { dueDate: string }) => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(dueDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(dueDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [dueDate]);

  if (timeLeft.total <= 0) {
    return <span>🕒 Time's up!</span>;
  }

  return (
    <span>
      {timeLeft.days}D {timeLeft.hours}H {timeLeft.minutes}M {timeLeft.seconds}s
    </span>
  );
};
