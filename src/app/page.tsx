"use client";
import { format, parse } from "date-fns";
import Image from "next/image";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./CalendarStyles.css";

// this typing is coming from React-Calendar which is causing me issues with typescript
type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const Home = () => {
  const today = new Date();
  // const tomorrow = addDays(today, 1);

  // attempted to to an array of dates for the Calendar input but was having trouble with styling, for now i just left it as one day selected
  const [date, setDate] = useState<Value>(today);
  const [time, setTime] = useState<string>("");
  // I assume that provider & service will be passed in as a prop from a previous, for not I just set it
  const provider = "Ash Brown";
  const service = "Laser";

  console.log("value", date);
  console.log("time", time);

  const onChange = (nextValue: Value) => {
    setDate(nextValue);
  };

  const makeAppointment = async () => {
    const data = {
      provider,
      service,
      dateTime: parse(time, "h:mm a", today),
    };
    console.log("body", JSON.stringify(data));

    // i didn't have time to work on the backend, but this would be the function to make a call to the backend
    const response = await fetch("/appointment", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    });

    const resp = await response.json();
  };

  return (
    <div className="w-[500px] border-4 flex flex-col space-y-5">
      <div
        id="header"
        className="bg-purple-50 flex justify-center items-center h-100 py-6"
      >
        <div className="w-100">
          <Image
            src="/static/rewaxationlogo.jpeg"
            width={300}
            height={500}
            alt="Header Image"
          />
        </div>
      </div>

      <main id="calendar" className="px-5 flex flex-col space-y-5">
        <p className="font-bold">Select a Time </p>
        <div className="px-5 flex flex-col justify-center items-center w-full">
          <div id="calendar-input">
            <Calendar
              defaultValue={date}
              onChange={onChange}
              tileClassName={({ date, view }) => {
                if (Array.isArray(date)) {
                  return date?.some(
                    (d) => d?.toDateString() === date.toDateString()
                  )
                    ? "highlight"
                    : null;
                }
                if (view === "month") {
                  if (date.getDay() === 0 || date.getDay() === 6) {
                    return "weekend-no-hilight";
                  }
                }
              }}
            />
          </div>
        </div>

        <div id="provider" className="flex flex-row items-center">
          <p className="font-bold mr-4"> Selected Provider </p>
          <div className="flex flex-row items-center space-x-1">
            <img
              src="https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"
              alt="Avatar"
              className="h-8 w-8 rounded-full"
            />
            <p>{provider}</p>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          {/* TODO fix the date, to reflect chosen, because the ValuePiece typing, its causing issues */}
          <p>{format(today, "PPPP")}</p>
          <div className="flex-row space-x-4">
            {/* // TODO: change the color when button is actively selected */}
            <button
              className="outline outline-gray-200 hover:bg-purple-200 hover:outline-purple-200 py-2 px-4 rounded"
              value="4:30pm"
              onClick={(e) => setTime(e.currentTarget.value)}
            >
              4:30pm
            </button>
            <button
              className="outline outline-gray-200 hover:bg-purple-200 hover:outline-purple-200 py-2 px-4 rounded"
              value="5:30pm"
              onClick={(e) => setTime(e.currentTarget.value)}
            >
              5:30pm
            </button>
          </div>
        </div>
      </main>
      <footer className="w-full flex justify-end p-5">
        <button
          disabled={time == ""}
          className="bg-gray-100 enabled:hover:bg-blue-500 py-2 px-4 rounded"
          onClick={makeAppointment}
        >
          Next
        </button>
      </footer>
    </div>
  );
};

export default Home;
