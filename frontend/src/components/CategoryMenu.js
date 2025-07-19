// src/components/CategoryMenu.js

import React, { useState } from 'react';
import { Button, Offcanvas, ListGroup } from 'react-bootstrap';

const CategoryMenu = ({ categories, selectedCategory, setSelectedCategory }) => {
    // State to manage the mobile slide-out menu
    const [showOffcanvas, setShowOffcanvas] = useState(false);

    const handleClose = () => setShowOffcanvas(false);
    const handleShow = () => setShowOffcanvas(true);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        handleClose(); // Close the offcanvas menu after a selection is made
    };

    return (
        <>
            {/* --- MOBILE VIEW: "Browse Categories" Button --- */}
            <div className="d-lg-none mb-3"> {/* This is hidden on large screens and up */}
                <Button variant="outline-secondary" onClick={handleShow} className="w-100">
                    <i className="fas fa-list-ul"></i> Browse Categories
                </Button>
            </div>

            {/* --- DESKTOP VIEW: Horizontal Scrolling Bar --- */}
            <div className="category-bar d-none d-lg-block"> {/* This is hidden on screens smaller than large */}
                <span
                    className={`category-link ${selectedCategory === '' ? 'active' : ''}`}
                    onClick={() => handleCategoryClick('')}
                >
                    All Products
                </span>
                {categories.map((category) => (
                    <span
                        key={category}
                        className={`category-link ${selectedCategory === category ? 'active' : ''}`}
                        onClick={() => handleCategoryClick(category)}
                    >
                        {category}
                    </span>
                ))}
            </div>


            {/* --- MOBILE SLIDE-OUT MENU (Offcanvas) --- */}
            <Offcanvas show={showOffcanvas} onHide={handleClose} placement="start">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Categories</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <ListGroup variant="flush">
                        <ListGroup.Item
                            action
                            active={selectedCategory === ''}
                            onClick={() => handleCategoryClick('')}
                        >
                            All Products
                        </ListGroup.Item>
                        {categories.map((category) => (
                            <ListGroup.Item
                                key={category}
                                action
                                active={selectedCategory === category}
                                onClick={() => handleCategoryClick(category)}
                            >
                                {category}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};

export default CategoryMenu;