import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useAtom } from 'jotai';
import { searchHistoryAtom } from '@/store'; 
import { addToHistory } from "@/lib/userData";

export default function AdvancedSearch() {
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      searchQuery: "",
      searchBy: "title",
      geoLocation: "",
      medium: "",
      isHighlight: false,
      isOnView: false,
    },
  });

  const router = useRouter();

  async function submitForm(data) {
    let queryString = "";
    queryString += `${encodeURIComponent(data.searchBy)}=true`;
    queryString += data.geoLocation
      ? `&geoLocation=${encodeURIComponent(data.geoLocation)}`
      : "";
    queryString += data.medium
      ? `&medium=${encodeURIComponent(data.medium)}`
      : "";
    queryString += `&isOnView=${data.isOnView || false}`;
    queryString += `&isHighlight=${data.isHighlight || false}`;
    queryString += `&q=${encodeURIComponent(data.searchQuery)}`;

    const updatedHistory = await addToHistory(queryString);
    setSearchHistory(updatedHistory); // update atom

    router.push(`/artwork?${queryString}`);

    reset();
  }

  return (
    <Form className="mt-2" onSubmit={handleSubmit(submitForm)}>
      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label>Search Query</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              {...register("searchQuery", { required: true })}
              className={errors.searchQuery ? "is-invalid" : ""}
            />
            {errors.searchQuery && (
              <div className="invalid-feedback">Search query is required.</div>
            )}
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <Form.Label>Search By</Form.Label>
          <Form.Select {...register("searchBy")} className="mb-3">
            <option value="title">Title</option>
            <option value="tags">Tags</option>
            <option value="artistOrCulture">Artist or Culture</option>
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Geo Location</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              {...register("geoLocation")}
            />
            <Form.Text className="text-muted">
              Case Sensitive String (ie &quot;Europe&quot;, &quot;France&quot;,
              &quot;Paris&quot;, &quot;China&quot;, &quot;New York&quot;, etc.),
              with multiple values separated by the | operator
            </Form.Text>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Medium</Form.Label>
            <Form.Control type="text" placeholder="" {...register("medium")} />
            <Form.Text className="text-muted">
              Case Sensitive String (ie: &quot;Ceramics&quot;,
              &quot;Furniture&quot;, &quot;Paintings&quot;,
              &quot;Sculpture&quot;, &quot;Textiles&quot;, etc.), with multiple
              values separated by the | operator
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Check
            type="checkbox"
            label="Highlighted"
            {...register("isHighlight")}
          />
        </Col>
        <Col>
          <Form.Check
            type="checkbox"
            label="Currently on View"
            {...register("isOnView")}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <br />
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Col>
      </Row>
    </Form>
  );
}
