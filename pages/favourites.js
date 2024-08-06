import React from "react";
import { useAtom } from "jotai";
import { favouritesAtom } from "@/store";
import { useState, useEffect } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import ArtworkCard from "@/components/ArtworkCard";

export default function Favourites() {
  let [favouriteLists, setFavouriteLists] = useState([]);
  const [favourites, setFavourites] = useAtom(favouritesAtom)
  
  useEffect(() => {
    setFavouriteLists(favourites);
  }, []);

  if (!favourites) return null;

  return (
    <>
      {favouriteLists && favouriteLists.length > 0 ? (
        <Container>
          <Row>
            {favouriteLists.map((objectID) => (
              <Col lg={3} md={4} sm={6} xs={12} key={objectID}>
                <ArtworkCard objectID={objectID} />
              </Col>
            ))}
          </Row>
        </Container>
      ) : (
        <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title style={{ fontSize: "1.5rem", fontWeight: "600" }}>
                No Favourites Yet
              </Card.Title>
              <Card.Text style={{ fontSize: "1.2rem" }}>
                Browse and add some artwork to your favourites.
              </Card.Text>
            </Card.Body>
          </Card>
        </Container>
      )}
    </>
  );
}
