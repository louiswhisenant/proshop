import { useState } from 'react';
import { useSelector } from 'react-redux';

import {
	Badge,
	Navbar,
	Nav,
	Container,
	Dropdown,
	Image,
	Row,
	Col,
} from 'react-bootstrap';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import logo from '../assets/logo.png';

const Header = () => {
	const { cartItems } = useSelector((state) => state.cart);
	const [visible, setVisible] = useState(false);

	return (
		<header>
			<Navbar bg='dark' variant='dark' expand='md' collapseOnSelect>
				<Container>
					<LinkContainer to='/'>
						<Navbar.Brand>
							<img src={logo} alt='Proshop Logo' />
							Proshop
						</Navbar.Brand>
					</LinkContainer>

					<Navbar.Toggle aria-controls='basic-navbar-nav' />

					<Navbar.Collapse id='basic-navbar-nav'>
						<Nav className='ms-auto'>
							<LinkContainer to='/cart'>
								<Nav.Link>
									<Dropdown
										align='end'
										onMouseEnter={() => {
											setVisible(true);
										}}
										onMouseLeave={() => {
											setVisible(false);
										}}
										show={visible && 'true'}>
										<FaShoppingCart />
										Cart{' '}
										{cartItems.length > 0 && (
											<Badge
												pill
												bg='primary'
												style={{
													marginLeft: '5px',
												}}>
												{cartItems.reduce(
													(a, c) => a + c.qty,
													0
												)}
											</Badge>
										)}
										<Dropdown.Menu
											className={visible && 'show'}>
											{cartItems.map((item) => (
												<Dropdown.Item key={item._id}>
													<Row>
														<Col md={4}>
															<Image
																thumbnail
																src={item.image}
																xs={1}
															/>
														</Col>
													</Row>
													<Row>
														<Col
															md={10}
															className='product-title mt-1'>
															{item.name}
														</Col>
														<Col
															md={2}
															className='mt-1'>
															<strong>
																{item.qty}
															</strong>
														</Col>
													</Row>
												</Dropdown.Item>
											))}
										</Dropdown.Menu>
									</Dropdown>
								</Nav.Link>
							</LinkContainer>

							<LinkContainer to='/login'>
								<Nav.Link>
									<FaUser /> Sign In
								</Nav.Link>
							</LinkContainer>
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</header>
	);
};

export default Header;
