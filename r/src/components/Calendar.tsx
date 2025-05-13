import React, { useState } from "react";
import { format, isSameDay, isSameMonth, addMonths, subMonths } from "date-fns";
import { getCalendarDays } from "../util/calendarUtils";

import { useDispatch, useSelector } from "react-redux";
import { setSelectedTodo } from "../store/todoSlice";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import DialogContentComp from "./main/DiaLogContentComp";


export default function Calendar({ todos }: any) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const days = getCalendarDays(currentDate);
  const dispatch = useDispatch();
  //   const getTodosForDate = (date: Date) =>
  //     todos?.filter((todo: any) => isSameDay(new Date(todo.date), date));
  const getTodosForDate = (date: Date) =>
    todos?.filter((todo: any) => {
      const todoDate = format(new Date(todo.dueDate), "yyyy-MM-dd");
      return isSameDay(new Date(todoDate), date);
    });

  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
    if (!isSameMonth(day, currentDate)) {
      setCurrentDate(day);
    }
  };
  const getReadableData = (string: string): string => {
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

  const [addOpen, setAddOpen] = React.useState(false);
  const selectedTodo = useSelector((state: any) => state.todo.selectedTodo);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-[#0a0a0a] rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-10">
        <button
          onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          className="cursor-pointer px-4 py-2 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
          aria-label="Previous month"
        >
          ←
        </button>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <button
          onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          className="cursor-pointer px-4 py-2 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
          aria-label="Next month"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day: any, idx: any) => {
          const isToday = isSameDay(day, new Date());
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isSelected = isSameDay(day, selectedDate);
          const dayTodos = getTodosForDate(day);

          return (
            <div
              key={idx}
              onClick={() => handleDateClick(day)}
              className={`relative p-3 rounded-lg cursor-pointer text-sm transition-all duration-200
                ${
                  isCurrentMonth
                    ? "text-gray-800 dark:text-gray-100"
                    : "text-gray-400 dark:text-gray-500"
                }
                ${
                  isToday
                    ? "bg-blue-50 dark:bg-blue-900/50 border border-blue-300 dark:border-blue-700"
                    : "border border-transparent"
                }
                ${
                  isSelected
                    ? "bg-blue-100 dark:bg-blue-800 shadow-md"
                    : "hover:bg-blue-50 dark:hover:bg-blue-900/30"
                }
                ${
                  dayTodos?.length > 0 ? "bg-blue-50 dark:bg-blue-900/30" : ""
                }`}
              role="button"
              aria-label={`Select ${format(day, "MMMM d, yyyy")}`}
            >
              <div className="text-center font-medium">{format(day, "d")}</div>
              {dayTodos?.length > 0 && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                  {/* <span className="inline-block w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full"></span> */}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Todos for {format(selectedDate, "PPP")}
        </h1>
        {getTodosForDate(selectedDate)?.length > 0 ? (
          <ul className="space-y-3">
            {getTodosForDate(selectedDate).map((todo: any) => (
              <li
                key={todo.id}
                className="items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                onClick={() => dispatch(setSelectedTodo(todo))}
              >
                <Dialog open={addOpen} onOpenChange={setAddOpen}>
                  <DialogTrigger className="w-full flex flex-col gap-3">
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
                          description: selectedTodo?.data.description,
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
        ) : (
          <p className="text-gray-500 dark:text-gray-400 italic">
            No todos for this day.
          </p>
        )}
      </div>
    </div>
  );
}
