import { useParams, Link } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Card, Button } from 'react-bootstrap'; 
import products from '../products';
import Rating from '../components/Rating';

const ProductScreen = () => {
    const { id: productId } = useParams();
    const {_id, name, image, description, brand, category, price, countInStock, rating, numReviews } = products.find((p) => p._id === productId);

  return (
    <>
        <Link className="btn btn-light my-3" to='/'>
            Go Back
        </Link>

        <Row>
            <Col md={5}>
                <Link to='/'><p>{category}</p></Link>
                <Image src={image} alt={name} fluid />
            </Col>
            <Col md={4}>
                <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <h3>{name}</h3>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Rating value={rating} text={`${numReviews} reviews`} />
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <strong>Maunfacturer:</strong> {brand}
                    </ListGroup.Item>        
                    <ListGroup.Item>
                        <strong>Description:</strong> {description}
                    </ListGroup.Item>
                </ListGroup>
            </Col>
            <Col md={3}>
                <Card>
                    <ListGroup>
                        <ListGroup.Item>
                            <Row>
                                <Col>Price:</Col>
                                <Col><strong>${price}</strong></Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Status:</Col>
                                <Col><strong>{countInStock > 0 ? 'In Stock' : 'Out of Stock'}</strong></Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Button className="btn-block" type='button' disabled={ countInStock === 0 }>Add to Cart</Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    </>
  )
}

export default ProductScreen