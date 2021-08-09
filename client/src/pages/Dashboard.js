import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import { LOGIN } from "../utils/mutations";
import Auth from "../utils/auth";
import { useQuery } from "@apollo/client";
import { QUERY_TEAMS } from "../utils/queries";
import moment from "moment";

const Dashboard = () => {
  const [status, setStatus] = useState("All");
  const { data } = useQuery(QUERY_TEAMS);
  let team;
  let issues;
  if (data) {
    team = data.team;
    issues = team.issues;
  }
  function handleInputChange(event) {
    const { name, value } = event.target;
    if (name === "btnradio") {
      setStatus(value);
    }
    console.log(
      moment.parseZone("2021-08-08T22:08:01.531+00:00").format("D/MM/YYYY")
    );
  }
  function renderComponent(issue) {
    if (issue.status === status || status === "All") {
      return (
        <div class="p-2" key={issue._id}>
          <a href="{{link}}" class="list-group-item list-group-item-action">
            <div class="d-flex w-100 justify-content-between">
              <h4 class="mb-1 title">{issue.title}</h4>
              <small class="text-muted">
                <span class="badge badge-info author">
                  Lodged by {issue.author.name}
                </span>
                <span class="badge badge-info status">
                  Status {issue.status}
                </span>
                <span class="badge badge-info lodgedDate">
                  Lodged on{" "}
                  {moment.parseZone(parseInt(issue.day)).format("D/MM/YYYY")}
                </span>
                <span class="badge badge-info assignedTo">
                  Assigned to {issue.assignedTo.name}
                </span>
              </small>
            </div>
            <p class="mb-1 description">{issue.description}</p>
          </a>
        </div>
      );
    }
  }

  return (
    <div class="container" id="basicContainer">
      <div class="text-center dashboardToggle">
        <div
          class="btn-group"
          role="group"
          aria-label="Basic radio toggle button group"
        >
          <input
            type="radio"
            class="btn-check"
            name="btnradio"
            value="New"
            id="btnradio1"
            onClick={handleInputChange}
          />
          <label
            class="btn btn-outline-success btn-lg dashboardButton"
            for="btnradio1"
          >
            New
          </label>

          <input
            type="radio"
            class="btn-check"
            name="btnradio"
            id="btnradio2"
            value="In Progress"
            onClick={handleInputChange}
          />
          <label
            class="btn btn-outline-success btn-lg dashboardButton"
            for="btnradio2"
          >
            In Progress
          </label>
          <input
            type="radio"
            class="btn-check"
            name="btnradio"
            id="btnradio3"
            value="Resolved"
            onClick={handleInputChange}
          />
          <label
            class="btn btn-outline-success btn-lg dashboardButton"
            for="btnradio3"
          >
            Resolved
          </label>
          <input
            type="radio"
            class="btn-check"
            name="btnradio"
            id="btnradio4"
            value="All"
            onClick={handleInputChange}
          />
          <label
            class="btn btn-outline-success btn-lg dashboardButton"
            for="btnradio4"
          >
            All
          </label>
        </div>
      </div>
      <br />
      <div class="list-group">
        {issues ? (
          issues.map((issue) => renderComponent(issue))
        ) : (
          <div>
            <h2>No Issue Lodged</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
