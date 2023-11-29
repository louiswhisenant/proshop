import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useLogoutMutation } from '../slices/usersApiSlice';
import { removeCredentials } from '../slices/authSlice';

import { Badge, Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import logo from '../assets/logo.png';

const Header = () => {
	const { cartItems } = useSelector((state) => state.cart);
	const { userInfo } = useSelector((state) => state.auth);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [logout] = useLogoutMutation();

	const logoutHandler = async () => {
		try {
			await logout().unwrap();
			dispatch(removeCredentials());
			navigate('login');
		} catch (error) {
			console.log(error);
		}
	};

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
									{/* @TODO create a sidebar that shows on large+ screens showing cart and options. */}
									<FaShoppingCart /> Cart{' '}
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
								</Nav.Link>
							</LinkContainer>

							{userInfo ? (
								<NavDropdown
									title={userInfo.name}
									id='username'>
									<LinkContainer to='/profile'>
										<NavDropdown.Item>
											Profile
										</NavDropdown.Item>
									</LinkContainer>
									<NavDropdown.Item onClick={logoutHandler}>
										Logout
									</NavDropdown.Item>
								</NavDropdown>
							) : (
								<LinkContainer to='/login'>
									<Nav.Link>
										<FaUser /> Sign In
									</Nav.Link>
								</LinkContainer>
							)}
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</header>
	);
};

export default Header;
