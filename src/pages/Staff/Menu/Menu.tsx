import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Table,
} from "react-bootstrap";

interface FoodItem {
  id: number;
  name: string;
  price: string;
  category: string;
  available: boolean;
}

function Menu() {
  const [foods] = useState<FoodItem[]>([
    {
      id: 1,
      name: "Chicken Biryani",
      price: "$12",
      category: "Rice",
      available: true,
    },
    {
      id: 2,
      name: "Zinger Burger",
      price: "$8",
      category: "Fast Food",
      available: false,
    },
  ]);

  return (
    <Container fluid>
      <h2 className="mb-4">Today's Menu Management</h2>

      <Row>
        <Col lg={4}>
          <Card className="shadow border-0">
            <Card.Body>
              <h4>Add Food Item</h4>

              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Food Name</Form.Label>
                  <Form.Control placeholder="Chicken Karahi" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>

                  <Form.Select>
                    <option>Main Course</option>
                    <option>Fast Food</option>
                    <option>Dessert</option>
                    <option>Drink</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control placeholder="$15" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control as="textarea" rows={3} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Upload Image</Form.Label>
                  <Form.Control type="file" />
                </Form.Group>

                <Button variant="warning" className="w-100">
                  Add Food
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <Card className="shadow border-0">
            <Card.Body>
              <h4 className="mb-4">Today's Food List</h4>

              <Table striped hover responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {foods.map((food) => (
                    <tr key={food.id}>
                      <td>{food.id}</td>
                      <td>{food.name}</td>
                      <td>{food.category}</td>
                      <td>{food.price}</td>
                      <td>
                        {food.available ? (
                          <Badge bg="success">Available</Badge>
                        ) : (
                          <Badge bg="danger">Sold Out</Badge>
                        )}
                      </td>

                      <td>
                        <Button
                          variant="primary"
                          size="sm"
                          className="me-2"
                        >
                          Edit
                        </Button>

                        <Button variant="danger" size="sm">
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Menu;