import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import Auth from "../utils/auth";
import { ADD_USER } from "../utils/mutations";

function Signup(props) {
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [addUser] = useMutation(ADD_USER);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const mutationResponse = await addUser({
      variables: {
        email: formState.email,
        password: formState.password,
        firstName: formState.firstName,
        lastName: formState.lastName,
      },
    });
    const token = mutationResponse.data.addUser.token;
    Auth.login(token);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  return (
    <div class="list-group">
      #each posts as |post|
        <div class="p-2">
          <a href={{link}} class="list-group-item list-group-item-action">
            <div class="d-flex w-100 justify-content-between">
              <h4 class="mb-1">{{post.title}}</h4>
              <small class="text-muted">Posted by
                post.user.username
                on
                post.publishedAt</small>
            </div>
            <p class="mb-1">post.content</p>
          </a>
        </div>
      /each
    </div>
  );
}

export default Signup;
