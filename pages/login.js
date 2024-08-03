import { useAtom } from "jotai";
import { favouritesAtom, searchHistoryAtom } from "../store";
import { getFavourites, getHistory } from "../lib/userData";
import { useRouter } from "next/router";
import { Button, Form, Container, Card, Alert } from "react-bootstrap"; 
import { useState } from "react";
import { authenticateUser } from "@/lib/authenticate";
import Link from "next/link";

const Login = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  const router = useRouter();

  const updateAtoms = async () => {
    setFavouritesList(await getFavourites());
    setSearchHistory(await getHistory());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await authenticateUser(user, password);
      await updateAtoms();
      router.push("/favourites");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Card className="shadow" style={{ width: "400px" }}>
        <Card.Body>
          <h2 className="text-center">Login</h2>
          {error && <Alert variant="danger" className="mt-3">{error}</Alert>} 
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicUsername" className="mt-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                placeholder="Enter username"
                required
                value={user}
                onChange={(e) => setUser(e.target.value)} 
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword" className="mt-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
              />
            </Form.Group>
            <Button variant="primary" className="mt-4 w-100" type="submit">
              Login
            </Button>
          </Form>
          <p className="mt-3 text-center">
            <Link href="/register">Don't have an account? Register here.</Link>
          </p>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
