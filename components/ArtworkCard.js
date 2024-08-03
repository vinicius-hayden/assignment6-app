import { Card, Button } from 'react-bootstrap';
import Link from 'next/link';
import useSWR from 'swr';
import Error from 'next/error';

export default function ArtworkCard({ objectID }) {
  const { data, error } = useSWR(
    `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`
  );

  if (error) {
    return <Error statusCode={404} />;

  } else {
    
    if (!data || data.length === 0) {
      return null;
    } else if (data.message === "Not a valid object") {
      return null;
    } else {
      return (
        <Card style={{ width: "18rem" }}>
          {data.primaryImageSmall ? (
            <Card.Img
              className="card-image"
              variant="top"
              src={data.primaryImageSmall}
              height={"250px"}
            />
          ) : (
            <Card.Img
              className="card-image"
              variant="top"
              src="https://via.placeholder.com/375x375.png?text=[+Not+Available+]"
            />
          )}
          <Card.Body>
            {data.title ? (
              <Card.Title className="card-title">{data.title}</Card.Title>
            ) : (
              <Card.Title className="card-title">N/A</Card.Title>
            )}
            <Card.Text>
              {data.objectDate ? (
                <p className="card-date">{data.objectDate}</p>
              ) : (
                <p>N/A</p>
              )}
              {data.classification ? <p>{data.classification}</p> : <p>N/A</p>}
              {data.medium ? <p>{data.medium}</p> : <p>N/A</p>}
            </Card.Text>
            <Link href={`/artwork/${objectID}`} passHref legacyBehavior>
              <Button variant="primary">View {objectID}</Button>
            </Link>
          </Card.Body>
        </Card>
      );
    }
  }
}
