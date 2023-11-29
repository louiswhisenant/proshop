import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';

// @desc Create order
// @route POST /api/orders
// @access Private
const createOrder = asyncHandler(async (req, res) => {
	const {
		cartItems,
		shippingAddress,
		paymentMethod,
		itemsPrice,
		taxPrice,
		shippingPrice,
		totalPrice,
	} = req.body;

	if (cartItems && cartItems.length === 0) {
		res.status(400);
		throw new Error('No order items');
	} else {
		const order = new Order({
			orderItems: cartItems.map((item) => ({
				...item,
				product: item._id,
				_id: undefined,
			})),
			user: req.user._id,
			shippingAddress,
			paymentMethod,
			itemsPrice,
			taxPrice,
			shippingPrice,
			totalPrice,
		});

		const createdOrder = await order.save();

		res.status(201).json(createdOrder);
	}
});

// @desc Get user orders
// @route GET /api/orders/myorders
// @access Private
const getUserOrders = asyncHandler(async (req, res) => {
	const orders = await Order.find({ user: req.user.id });

	res.status(200).json(orders);
});

// @desc Get order by ID
// @route GET /api/orders/:id
// @access Private
const getOrderById = asyncHandler(async (req, res) => {
	const order = await Order.findById(req.params.id).populate(
		'user',
		'name email'
	);

	if (order) {
		res.status(200).json(order);
	} else {
		res.status(404);
		throw new Error('Order not found');
	}
});

// @desc Update order to paid
// @route PUT /api/orders/:id/pay
// @access Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
	const order = await Order.findById(req.params.id);

	if (order) {
		order.isPaid = true;
		order.paidAt = Date.now();
		order.paymentResult = {
			id: req.body.id,
			status: req.body.status,
			update_time: req.body.update_time,
			email_address: req.body.payer.email_address,
		};

		const updatedOrder = await order.save();

		res.status(200).json(updatedOrder);
	} else {
		res.status(404);
		throw new Error('Order not found');
	}
});

// @desc Update order to delivered
// @route PUT /api/orders/:id/deliver
// @access Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
	res.send('update order to delivered');
});

// @desc Get all orders
// @route GET /api/orders
// @access Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
	res.send('get all orders');
});

export {
	createOrder,
	getUserOrders,
	getOrderById,
	updateOrderToPaid,
	updateOrderToDelivered,
	getAllOrders,
};
