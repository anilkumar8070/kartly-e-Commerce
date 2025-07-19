// src/components/Header.js

import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import logo from '../assets/logo.png'; // <-- IMPORT THE LOGO

const Header = () => {
    const navigate = useNavigate();
    const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
    const { userInfo } = authState;

    const { state: cartState } = useContext(CartContext);
    const { cartItems } = cartState;

    const logoutHandler = () => {
        authDispatch({ type: 'USER_LOGOUT' });
        navigate('/login');
    };

    return (
        <header>
            <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
                <Container>
                    {/* --- MODIFIED BRAND/LOGO SECTION --- */}
                    <LinkContainer to='/'>
                        <Navbar.Brand>
                            <img
                                src={logo}
                                height="40"
                                className="d-inline-block align-top"
                                alt="Kartly logo"
                            />
                        </Navbar.Brand>
                    </LinkContainer>
                    
                    <Navbar.Toggle aria-controls='basic-navbar-nav' />
                    <Navbar.Collapse id='basic-navbar-nav'>
                        <Nav className='ms-auto'>
                            <LinkContainer to='/cart'>
                                <Nav.Link>
                                    <i className='fas fa-shopping-cart'></i> Cart
                                    {cartItems.length > 0 && (
                                        <span className='badge bg-light text-dark ms-1'>
                                            {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                                        </span>
                                    )}
                                </Nav.Link>
                            </LinkContainer>
                            {userInfo ? (
                                <NavDropdown title={userInfo.name} id='username'>
                                    <LinkContainer to='/profile'>
                                        <NavDropdown.Item>Profile</NavDropdown.Item>
                                    </LinkContainer>
                                    <NavDropdown.Item onClick={logoutHandler}>
                                        Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <LinkContainer to='/login'>
                                    <Nav.Link>
                                        <i className='fas fa-user'></i> Sign In
                                    </Nav.Link>
                                </LinkContainer>
                            )}

                            {userInfo && userInfo.isSeller && (
                                <NavDropdown title='Seller' id='seller-menu'>
                                    <LinkContainer to='/seller/productlist'>
                                        <NavDropdown.Item>Products</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to='/seller/orders'>
                                        <NavDropdown.Item>Orders</NavDropdown.Item>
                                    </LinkContainer>
                                </NavDropdown>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
};

export default Header;