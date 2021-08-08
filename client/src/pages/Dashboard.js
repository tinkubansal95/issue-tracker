import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import { LOGIN } from "../utils/mutations";
import Auth from "../utils/auth";

const Dashboard = () => {
  return (
    <div className="container">
      <div>
        <button class="ui right floated button">
          <Link to="addIssue">Add New Issue</Link>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
