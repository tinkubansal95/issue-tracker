import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import Auth from "../utils/auth";
import { useQuery } from "@apollo/client";
import { QUERY_TEAMS, QUERY_USERS } from "../utils/queries";

import moment from "moment";
import { Button, Modal } from "react-bootstrap";
import { UPDATE_STATUS, UPDATE_ASSIGNEDTO } from "../utils/mutations";

const Dashboard = () => {
  const user = useQuery(QUERY_USERS);
  let users = [];

  if (user.data) {
    users = user.data.users;
  }
  const [updateStatus, { error }] = useMutation(UPDATE_STATUS);
  const [updateAssignedTo, { error1 }] = useMutation(UPDATE_ASSIGNEDTO);
  const [statusNew, setStatusNew] = useState("New");
  const [assignedToNew, setAssignedToNew] = useState();
  const [currentId, setCurrentID] = useState();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  function handleShow(id) {
    setCurrentID(id);
    setShow(true);
  }
  // assigned To modal
  const [showAssignedTo, setShowAssignedTo] = useState(false);
  const handleCloseAssignedTo = () => setShowAssignedTo(false);
  function handleShowAssignedTo(issue) {
    setCurrentID(issue._id);
    setAssignedToNew(issue.assignedTo);
    setShowAssignedTo(true);
  }
  const [status, setStatus] = useState("All");
  const { data } = useQuery(QUERY_TEAMS);
  if (!Auth.loggedIn()) {
    return (
      <div class="d-flex justify-content-center headingDashboard">
        <h2>You need to login first!</h2>
      </div>
    );
  }
  let team;
  let issues;
  if (data) {
    team = data.team;
    issues = team.issues;
  }
  function getColor(status) {
    if (status === "New") return "#ffcccc";
    if (status === "In Progress") return "#a0e7e5";
    else return "#b4f8c8";
  }
  function handleInputChange(event) {
    const { name, value } = event.target;
    if (name === "btnradio") {
      setStatus(value);
    }
    if (name === "statusNew") {
      setStatusNew(value);
    }
    if (name === "assignedToNew") {
      setAssignedToNew(value);
    }
  }
  async function updateIssueStatus() {
    const mutationResponse = await updateStatus({
      variables: {
        _id: currentId,
        status: statusNew,
      },
    });
    window.location.assign("/dashboard");
  }
  async function updateAssignedToUser() {
    const mutationResponse = await updateAssignedTo({
      variables: {
        _id: currentId,
        assignedTo: assignedToNew,
      },
    });
    window.location.assign("/dashboard");
  }
  function renderComponent(issue) {
    //setCurrentID(issue._id);
    if (issue.status === status || status === "All") {
      return (
        <div class="p-2  issues" key={issue._id}>
          <a
            href="#"
            class="list-group-item list-group-item-action"
            style={{ backgroundColor: getColor(issue.status) }}
          >
            <div class="d-flex w-100 justify-content-between row">
              <div class="col-lg-4">
                <h4 class="mb-1 title">{issue.title}</h4>
              </div>
              <div class="col-lg-8 d-flex flex-row-reverse issueDetails">
                <small class="text-muted">
                  <span class="badge badge-info author">
                    Lodged by {issue.author.name}
                  </span>
                  <span
                    class="badge badge-info status"
                    onClick={() => handleShow(issue._id)}
                  >
                    Status {issue.status}
                  </span>
                  <Modal show={show} onHide={handleClose} centered>
                    <Modal.Header closeButton>
                      <Modal.Title>Change Status</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <div class="form-group px-5 p-3">
                        <label for="status" class="mb-2 statusModal">
                          <h4>Status:</h4>
                        </label>
                        <select
                          class="form-select"
                          aria-label="Default select example"
                          name="statusNew"
                          onChange={handleInputChange}
                        >
                          <option defaultValue value="New">
                            New
                          </option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </div>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={handleClose}>
                        Close
                      </Button>
                      <Button variant="primary" onClick={updateIssueStatus}>
                        Save Changes
                      </Button>
                    </Modal.Footer>
                  </Modal>
                  <span class="badge badge-info lodgedDate">
                    Lodged on{" "}
                    {moment.parseZone(parseInt(issue.day)).format("D/MM/YYYY")}
                  </span>

                  <span
                    class="badge badge-info assignedTo"
                    onClick={() => handleShowAssignedTo(issue)}
                  >
                    Assigned to {issue.assignedTo.name}
                  </span>
                  <Modal
                    show={showAssignedTo}
                    onHide={handleCloseAssignedTo}
                    centered
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Assign To:</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <div class="form-group px-5 p-3">
                        <label for="status" class="mb-2 statusModal">
                          <h4>Team members:</h4>
                        </label>
                        <select
                          class="form-select"
                          aria-label="Default select example"
                          name="assignedToNew"
                          onChange={handleInputChange}
                        >
                          {users ? (
                            users.map((userAsign) => (
                              <option value={userAsign._id}>
                                {userAsign.name}
                              </option>
                            ))
                          ) : (
                            <option value={issue.assignedTo}>
                              {issue.assignedTo}
                            </option>
                          )}
                        </select>
                      </div>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button
                        variant="secondary"
                        onClick={handleCloseAssignedTo}
                      >
                        Close
                      </Button>
                      <Button variant="primary" onClick={updateAssignedToUser}>
                        Save Changes
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </small>
              </div>
            </div>
            <p class="mb-1 description">{issue.description}</p>
          </a>
        </div>
      );
    }
  }

  return (
    <div class="container pt-3" id="basicContainer">
      <div class="text-center pb-2 shopName">
        {team ? (
          <h3>
            {team.name} ({team.code})
          </h3>
        ) : (
          <h1>Your Team</h1>
        )}
      </div>
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
