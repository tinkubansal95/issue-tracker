import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { ADD_ISSUE } from "../utils/mutations";
import { useQuery } from "@apollo/client";
import { QUERY_USERS } from "../utils/queries";

function AddIssue(props) {
  const { data } = useQuery(QUERY_USERS);
  let users = [];

  if (data) {
    users = data.users;
  }
  const [formState, setFormState] = useState({
    title: "",
    description: "",
    status: "New",
    assignedTo: "you",
  });

  const [errMessage, setErrMessage] = useState("");
  const [addIssue, { error }] = useMutation(ADD_ISSUE);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
    console.log(users);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (formState.title.trim() === "") {
      setErrMessage("Title is required!");
      return;
    }
    if (formState.description.trim() === "") {
      setErrMessage("Description is required!");
      return;
    }
    try {
      const mutationResponse = await addIssue({
        variables: {
          title: formState.title,
          description: formState.description,
          status: formState.status,
          assignedTo: formState.assignedTo,
        },
      });
      window.location.assign("/");
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div class="container pt-3 contact" id="addIssue">
      <div class="row justify-content-center ">
        <div class="col-md-8">
          <h1 class="text-center">Add New Issue</h1>
        </div>
      </div>
      <div class="row justify-content-center align-items-center">
        <div class="col-lg-12 p-2 px-2">
          <form onSubmit={handleFormSubmit}>
            <div class="form-group px-5 p-3">
              <label for="title" class="mb-2">
                <h4>Title of the Issue:</h4>
              </label>
              <input
                type="text"
                class="form-control "
                name="title"
                onChange={handleInputChange}
              />
            </div>
            <div class="form-group px-5 p-3">
              <label for="description" class="mb-2">
                <h4>Description:</h4>
              </label>
              <input
                type="text"
                class="form-control "
                name="description"
                onChange={handleInputChange}
              />
            </div>
            <div class="form-group px-5 p-3">
              <label for="status" class="mb-2">
                <h4>Status:</h4>
              </label>
              <select
                class="form-select"
                aria-label="Default select example"
                name="status"
                onChange={handleInputChange}
              >
                <option defaultValue value="New">
                  New
                </option>
                <option value="In Process">In Process</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
            <div class="form-group px-5 p-3">
              <label for="assignedTo" class="mb-2">
                <h4>Assigned To:</h4>
              </label>
              <select
                class="form-select"
                aria-label="Default select"
                name="assignedTo"
                onChange={handleInputChange}
              >
                <option>You</option>
                {users ? (
                  users.map((user) => (
                    <option value={user._id}>{user.name}</option>
                  ))
                ) : (
                  <option></option>
                )}
              </select>
            </div>
            <h5 class="mt-2 mx-5">{errMessage}</h5>
            {error ? <h5 class="pt-2 mx-5">You are not logged in!</h5> : null}
            <div class="text-center">
              <button
                type="submit"
                class="btn btn-primary m-3 btn-lg"
                id="contactButton"
              >
                <h5>Submit</h5>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddIssue;
