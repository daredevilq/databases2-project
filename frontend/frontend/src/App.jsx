import React from "react";
import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Products from "./Products";
import ProductDetails from "./ProductDetails";
import Register from "./Register";
import Menu from "./Menu";
import SignIn from "./SignIn";
import RequireAuth from "./RequireAuth";
import MyAccount from "./MyAccount";
import Unauthorized from "./Unauthorized";
import CONFIG from "./config";

function App() {
    return (
        <>
            <Menu></Menu>
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/unauthorized" element={<Unauthorized />}></Route>

                <Route
                    element={
                        <RequireAuth
                            allowedRoles={[
                                CONFIG.ROLES.ADMIN,
                                CONFIG.ROLES.CUSTOMER,
                            ]}
                        />
                    }
                >
                    <Route path="/my-account" element={<MyAccount />}></Route>
                </Route>
            </Routes>
        </>
    );
}

export default App;
