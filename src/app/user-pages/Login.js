import React from "react";
import { Link } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { useContext } from "react";
import { UserContext } from "../App";
import { login } from "../api/auth";

export default function Login() {
  const { setUser } = useContext(UserContext);
  const username = React.useRef();
  const password = React.useRef();

  return (
    <div>
      <div className="d-flex align-items-center auth px-0">
        <div className="row w-100 mx-0">
          <div className="col-lg-4 mx-auto">
            <div className="auth-form-light text-left py-5 px-4 px-sm-5">
              <div className="brand-logo">
                <img
                  src={require("../../assets/images/logo.svg").default}
                  alt="logo"
                />
              </div>
              <h4>Hello! let's get started</h4>
              <h6 className="font-weight-light">Sign in to continue.</h6>
              <Form className="pt-3">
                <Form.Group className="d-flex search-field">
                  <Form.Control
                    type="text"
                    placeholder="Username"
                    size="lg"
                    className="h-auto"
                    ref={username}
                  />
                </Form.Group>
                <Form.Group className="d-flex search-field">
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    size="lg"
                    className="h-auto"
                    ref={password}
                  />
                </Form.Group>
                <div className="mt-3">
                  <Button
                    className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                    onClick={() => {
                      const usernameValue = username.current.value;
                      const passwordValue = password.current.value;
                      login(usernameValue, passwordValue)
                      .then((res) => {
                        localStorage.setItem('token', res.token);
                        setUser({ loggedIn: true, user: res.user});
                      })
                      .catch(console.log);
                        
                    }}
                  >
                    SIGN IN
                  </Button>
                </div>
                <div className="my-2 d-flex justify-content-between align-items-center float-right">
                  <Link
                    to="/auth/forgot-password"
                    className="auth-link text-black"
                  >
                    Forgot password?
                  </Link>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
