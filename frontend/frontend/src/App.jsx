import React from "react";
import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Products from "./Products";
import ProductDetails from "./ProductDetails";
import Register from "./Register";
import Menu from "./Menu";
import SignIn from './SignIn'


function App() {
    return (
        <>
            <Menu></Menu>
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetails />} />
            </Routes>
        </>
    );
}

export default App;
