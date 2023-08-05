import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export function LockScreen() {
  // check if query param is present
  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get("token");
  // Take Email as input
  if (!token)
    return (
      <div>
        <div className="content-wrapper d-flex align-items-center auth h-100">
          <div className="row w-100 align-items-center">
            <div className="col-lg-4 mx-auto">
              <div className="auth-form-transparent text-left p-5 text-center">
                <div className="brand-logo">
                  <img
                    src={require("../../assets/images/logo.svg").default}
                    alt="logo"
                  />
                </div>
                <h4 className="mb-5">Enter your email address!</h4>
                <form className="">
                  <div className="form-group">
                    <input
                      type="email"
                      className="form-control text-center"
                      placeholder="Email"
                    />
                  </div>
                  <div className="mt-5">
                    <Button className="btn btn-block btn-success btn-lg font-weight-medium">
                      Request Password Reset
                    </Button>
                  </div>
                  <div className="mt-3 text-center">
                    <Link to="/auth/login" className="auth-link text-white">
                      Sign in using a different account
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  else
  return (
    <div>
      <div className="content-wrapper d-flex align-items-center auth h-100">
        <div className="row w-100 align-items-center">
          <div className="col-lg-4 mx-auto">
            <div className="auth-form-transparent text-left p-5 text-center">
              <div className="brand-logo">
                <img
                  src={require("../../assets/images/logo.svg").default}
                  alt="logo"
                />
              </div>
              <h4 className="mb-5">Add new password!</h4>
              <form className="">
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control text-center"
                    placeholder="Password"
                  />{" "}
                  <br />
                  <input
                    type="password"
                    className="form-control text-center"
                    placeholder="Confirm Password"
                  />
                </div>
                <div className="mt-5">
                  <Button
                    className="btn btn-block btn-success btn-lg font-weight-medium"
                    to="/dashboard"
                  >
                    Update
                  </Button>
                </div>
                <div className="mt-3 text-center">
                  <Link to="/auth/login" className="auth-link text-white">
                    Sign in using a different account
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LockScreen;
