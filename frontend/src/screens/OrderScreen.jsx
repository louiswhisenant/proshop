import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
	useGetOrderByIdQuery,
	usePayOrderMutation,
	useGetPayPalClientIdQuery,
} from '../slices/ordersApiSlice';

import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';

import { addDecimals } from '../utils/cartUtils';

import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';

import {
	Row,
	Col,
	ListGroup,
	Image,
	Form,
	Button,
	Card,
} from 'react-bootstrap';

const OrderScreen = () => {
	const { id: orderId } = useParams();

	const {
		data: order,
		refetch,
		isLoading: orderDetailsLoading,
		error: orderDetailsError,
	} = useGetOrderByIdQuery(orderId);

	const [payOrder, { isLoading: payOrderLoading }] = usePayOrderMutation();

	const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

	const {
		data: paypal,
		isLoading: paypalLoading,
		error: paypalError,
	} = useGetPayPalClientIdQuery();

	const { userInfo } = useSelector((state) => state.auth);

	useEffect(() => {
		if (!paypalError && !paypalLoading && paypal.clientId) {
			const loadPayPalScript = async () => {
				paypalDispatch({
					type: 'resetOptions',
					value: {
						'client-id': paypal.clientId,
						currency: 'USD',
					},
				});
				paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
			};

			if (order && !order.isPaid) {
				if (!window.paypal) {
					loadPayPalScript();
				}
			}
		}
	}, [order, paypal, paypalDispatch, paypalError, paypalLoading]);

	return orderDetailsLoading ? (
		<Loader />
	) : orderDetailsError ? (
		<Message variant='danger'>{orderDetailsError.message}</Message>
	) : (
		<>
			<h1>Order {orderId}</h1>
			<Row>
				<Col md={8}>
					<ListGroup variant='flush'>
						<ListGroup.Item>
							<h2>Shipping</h2>
							<p>
								<strong>Name: </strong> {order.user.name}
							</p>
							<p>
								<strong>Email: </strong> {order.user.email}
							</p>
							<p>
								<strong>Address: </strong>{' '}
								{order.shippingAddress.address},{' '}
								{order.shippingAddress.city}{' '}
								{order.shippingAddress.postalCode}{' '}
								{order.shippingAddress.country}
							</p>

							<Message
								variant={
									order.isDelivered ? 'success' : 'warning'
								}>
								{order.isDelivered
									? `Order Delivered on ${order.deliveredAt}`
									: 'Not Delivered'}
							</Message>
						</ListGroup.Item>

						<ListGroup.Item>
							<h2>Payment Method</h2>
							<p>
								<strong>Method: </strong> {order.paymentMethod}
							</p>

							<Message
								variant={order.isPaid ? 'success' : 'warning'}>
								{order.isPaid
									? `Order Paid on ${order.paidAt}`
									: 'Not Paid'}
							</Message>
						</ListGroup.Item>

						<ListGroup.Item>
							<h2>Order Items</h2>
							{order.orderItems.map(
								(
									{ image, name, qty, price, product },
									index
								) => (
									<ListGroup.Item key={index}>
										<Row>
											<Col md={2}>
												<Image
													src={image}
													alt={name}
													fluid
													rounded
												/>
											</Col>
											<Col>
												<Link
													to={`/product/${product}`}>
													{name}
												</Link>
											</Col>
											<Col md={4}>
												{qty} x ${price} = $
												{addDecimals(qty * price)}
											</Col>
										</Row>
									</ListGroup.Item>
								)
							)}
						</ListGroup.Item>
					</ListGroup>
				</Col>

				<Col md={4}>
					<Card>
						<ListGroup variant='flush'>
							<ListGroup.Item>
								<h2>Order Summary</h2>
							</ListGroup.Item>

							<ListGroup.Item>
								<Row>
									<Col>Subtotal: </Col>
									<Col>${order.itemsPrice}</Col>
								</Row>
								<Row>
									<Col>Shipping: </Col>
									<Col>${order.shippingPrice}</Col>
								</Row>
								<Row>
									<Col>Tax: </Col>
									<Col>${order.taxPrice}</Col>
								</Row>
								<Row>
									<Col>Total: </Col>
									<Col>
										<strong>${order.totalPrice}</strong>
									</Col>
								</Row>
							</ListGroup.Item>

							{/* PAY ORDER PLACEHOLDER */}
							{/* MARK AS DELIVERED PLACEHOLDER */}
						</ListGroup>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default OrderScreen;
