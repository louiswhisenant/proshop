import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { clearCart } from '../slices/cartSlice';

import { addDecimals } from '../utils/cartUtils';

import Loader from '../components/Loader';
import Message from '../components/Message';

import { toast } from 'react-toastify';
import CheckoutSteps from '../components/CheckoutSteps';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';

const PlaceOrderScreen = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const cart = useSelector((state) => state.cart);
	const {
		shippingAddress,
		paymentMethod,
		cartItems,
		itemsPrice,
		shippingPrice,
		taxPrice,
		totalPrice,
	} = cart;

	const [createOrder, { isLoading, error }] = useCreateOrderMutation();

	useEffect(() => {
		if (!shippingAddress) {
			navigate('/shipping');
		} else if (!paymentMethod) {
			navigate('/payment');
		}
	}, [shippingAddress, paymentMethod, navigate]);

	const orderHandler = async () => {
		try {
			const res = await createOrder({
				cartItems,
				shippingAddress,
				paymentMethod,
				itemsPrice,
				shippingPrice,
				taxPrice,
				totalPrice,
			}).unwrap();

			dispatch(clearCart());
			navigate(`/order/${res._id}`);
		} catch (error) {
			toast.error(error);
		}
	};

	return (
		<>
			<CheckoutSteps step1 step2 step3 step4 />
			<Row>
				<Col med={8}>
					<ListGroup variant='flush'>
						<ListGroup.Item>
							<h2>Shipping</h2>
							<p>
								<strong>Address: </strong>
								{shippingAddress.address},{' '}
								{shippingAddress.city}{' '}
								{shippingAddress.postalCode}{' '}
								{shippingAddress.country}
							</p>
						</ListGroup.Item>

						<ListGroup.Item>
							<h2>Payment Method</h2>
							<p>
								<strong>Method of Payment: </strong>
								{paymentMethod}
							</p>
						</ListGroup.Item>

						<ListGroup.Item>
							<h2>Order Items</h2>
							{cartItems.length === 0 ? (
								<Message>Your cart is empty</Message>
							) : (
								<ListGroup variant='flush'>
									{cartItems.map(
										(
											{ image, name, _id, qty, price },
											index
										) => (
											<ListGroup.Item key={index}>
												<Row>
													<Col med={1}>
														<Image
															src={image}
															alt={name}
															fluid
															rounded
														/>
													</Col>
													<Col>
														<Link
															to={`/product/${_id}`}>
															{name}
														</Link>
													</Col>
													<Col med={4}>
														{qty} x ${price} = $
														{addDecimals(
															qty * price
														)}
													</Col>
												</Row>
											</ListGroup.Item>
										)
									)}
								</ListGroup>
							)}
						</ListGroup.Item>
					</ListGroup>
				</Col>

				<Col med={4}>
					<Card>
						<ListGroup variant='flush'>
							<ListGroup.Item>
								<h2>Order Summary</h2>
							</ListGroup.Item>

							<ListGroup.Item>
								<Row>
									<Col>Subtotal: </Col>
									<Col>${itemsPrice}</Col>
								</Row>
							</ListGroup.Item>

							<ListGroup.Item>
								<Row>
									<Col>Shipping: </Col>
									<Col>${shippingPrice}</Col>
								</Row>
							</ListGroup.Item>

							<ListGroup.Item>
								<Row>
									<Col>Tax: </Col>
									<Col>${taxPrice}</Col>
								</Row>
							</ListGroup.Item>

							<ListGroup.Item>
								<Row>
									<Col>Total: </Col>
									<Col>
										<strong>${totalPrice}</strong>
									</Col>
								</Row>
							</ListGroup.Item>

							{error && (
								<ListGroup.Item>
									<Message variant='danger'>{error}</Message>
								</ListGroup.Item>
							)}

							<ListGroup.Item>
								<Button
									type='button'
									className='btn-block'
									disabled={cartItems.length === 0}
									onClick={orderHandler}>
									Place Order
								</Button>
								{isLoading && <Loader />}
							</ListGroup.Item>
						</ListGroup>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default PlaceOrderScreen;
