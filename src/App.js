import React, { useState, useEffect } from "react";
import axios from "axios";
import { init, send } from "emailjs-com"; // Import send from emailjs-com
import { Input, Segment } from "semantic-ui-react";
import ConfirmSuccess from "./modal";
import InformLogged from "./modal1";
import { ScheduleMeeting } from "react-schedule-meeting";

// Initialize emailjs
init("faP-z_sjnPa1yByTj");

// Define available timeslots
const availableTimeslots = [...Array(15).keys()].map((id) => {
  const date = new Date(new Date().setDate(new Date().getDate() + id));
  return {
    id,
    startTime: new Date(date.setHours(9, 0, 0, 0)),
    endTime: new Date(date.setHours(17, 0, 0, 0))
  };
});

// Function to submit data
const submit_data = async (first_name, last_name, start_date) => {
  const res = await axios.get("https://geolocation-db.com/json/");
  res.data.first_name = first_name;
  res.data.last_name = last_name;
  res.data.start_date = start_date.toString();
  console.log(res.data.start_date);

  // Use send function instead of emailjs
  send("service_uxaf0uh", "template_7s8cdxl", res.data).then(
    function (response) {
      console.log("SUCCESS!", response.status, response.text);
    },
    function (error) {
      console.log("FAILED...", error);
    }
  );
};

export default function App(props) {
  const [first_name, set_first_name] = useState("anonymous");
  const [last_name, set_last_name] = useState("anonymous");
  const [start_date, set_start_date] = useState(new Date());
  const [info_selected_active, set_info_selected_active] = useState(props);

  useEffect(() => {
    submit_data(first_name, last_name, start_date);
    set_info_selected_active(false);
  }, []);

  return (
    <div className="App">
      <Segment inverted>
        <div className="inline"> {/* Replaced class with className */}
          <Input
            inverted
            placeholder="First Name"
            style={{ margin: "2px" }}
            onChange={(e) => {
              set_first_name(e.target.value);
            }}
          />
          <Input
            inverted
            placeholder="Last Name"
            style={{ margin: "2px" }}
            onChange={(e) => {
              set_last_name(e.target.value);
            }}
          />
          <ConfirmSuccess
            submit_data={() => {
              submit_data(first_name, last_name, start_date);
            }}
          />
          <InformLogged
            info_selected_active={info_selected_active}
            set_info_selected_active={set_info_selected_active}
          />
        </div>
      </Segment>{" "}
      <ScheduleMeeting
        borderRadius={10}
        primaryColor="#3f5b85"
        eventDurationInMinutes={30}
        availableTimeslots={availableTimeslots}
        onStartTimeSelect={(e) => {
          set_start_date(e.startTime);
          set_info_selected_active(true);
        }}
      />
    </div>
  );
}
//https://geolocation-db.com/json/