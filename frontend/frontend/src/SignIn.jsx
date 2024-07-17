import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import React from "react";
import { useState, useRef, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import AuthContext from "./context/AuthProvider";
import axios from "./api/axios";
import useAuth from "./hooks/useAuth";

function SignIn() {
    const LOGIN_URL = "/login";
    const { setAuth } = useAuth()
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState(true);
    const [succes, setSuccess] = useState(false);
    const navigate = useNavigate();
    const location = useLocation()
    const from = location.state?.from?.pathname || "/"


    useEffect(() => {
        if (email && password) {
            setError(false);
        } else {
            setError(true);
        }
    }, [password, email]);

    async function submitHandler(event) {
        event.preventDefault();

        try {
            const response = await axios.post(
                LOGIN_URL,
                JSON.stringify({
                    email: email,
                    password: password,
                }),
                {
                    headers: { "Content-Type": "application/json" }
                }
            );

            console.log(JSON.stringify(response?.data));

            if (response.status == 201) {
                const accessToken = response?.data?.accessToken;
                const user = response?.data?.user;

                setAuth({ user, password, accessToken });
                console.error("Login successful")
                setPassword("");
                setEmail("");
                navigate(from, {replace: true});
                    
            }else{
                console.error("Error during login:")
            }
        } catch (error) {
            console.error("Error during signing in:", error);
        }
    }

    return (
        <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="Enter email"
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="on"
                />
                <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                />
            </Form.Group>
            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    );
}

export default SignIn;
