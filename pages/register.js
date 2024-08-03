import React, { useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { registerUser } from "@/lib/authenticate";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await registerUser(username, password, confirmPassword);
      router.push("/login");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Card className="shadow" style={{ width: "400px" }}>
        <Card.Body>
          <h2 className="text-center">Register</h2>
          {error && <Alert variant="danger" className="mt-3">{error}</Alert>} 
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPassword" className="mt-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formConfirmPassword" className="mt-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" className="mt-4 w-100" type="submit">
              Register
            </Button>
          </Form>
          <p className="mt-3 text-center">
            <Link href="/login">Already have an account? Log in here.</Link>
          </p>
        </Card.Body>
      </Card>
    </div>
  );
}
