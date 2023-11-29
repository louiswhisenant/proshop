import { apiSlice } from './apiSlice';
import { ORDERS_URL, PAYPAL_URL } from '../constants';

const ordersApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		createOrder: builder.mutation({
			query: (order) => ({
				url: ORDERS_URL,
				method: 'POST',
				body: { ...order },
			}),
			keepUnusedDataFor: 5,
		}),
		getUserOrders: builder.query({
			query: (productId) => ({
				url: `${ORDERS_URL}`,
			}),
			keepUnusedDataFor: 5,
		}),
		getOrderById: builder.query({
			query: (orderId) => ({
				url: `${ORDERS_URL}/${orderId}`,
			}),
			keepUnusedDataFor: 5,
		}),
		payOrder: builder.mutation({
			query: (orderId, details) => ({
				url: `${ORDERS_URL}/${orderId}/pay`,
				method: 'PUT',
				body: { ...details },
			}),
		}),
		getPayPalClientId: builder.query({
			query: () => ({
				url: `${PAYPAL_URL}`,
			}),
			keepUnusedDataFor: 5,
		}),
	}),
});

export const {
	useCreateOrderMutation,
	useGetUserOrdersQuery,
	useGetOrderByIdQuery,
	usePayOrderMutation,
	useGetPayPalClientIdQuery,
} = ordersApiSlice;
