import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";

import {CitiesProvider} from "./contexts/CityContexts"
import { AuthProvider } from "./contexts/fakeAuthContext";
import ProtectedRoute from "./pages/ProtectedRoute";

import CitiesList from "./components/CitiesList";
import CountryList from "./components/CountryList";
import City from "./components/City";
import Form from "./components/Form";
import SpinnerFullPage from "./components/SpinnerFullPage";

// import HomePage from "./pages/HomePage";
// import PageNotFound from "./pages/PageNotFound";
// import Pricing from "./pages/Pricing";
// import Product from "./pages/Product";
// import AppLayout from "./pages/AppLayout";
// import Login from "./pages/Login";

const HomePage = lazy(()=>import("./pages/Homepage"))
const PageNotFound = lazy(()=>import("./pages/PageNotFound"))
const Pricing = lazy(()=>import("./pages/Pricing"))
const Product = lazy(()=>import("./pages/Product"))
const AppLayout = lazy(()=>import("./pages/AppLayout"))
const Login = lazy(()=>import("./pages/Login"))



function App() {


  return (
    <AuthProvider>
    <CitiesProvider>
    <div>
      <BrowserRouter>
      <Suspense fallback={<SpinnerFullPage/>}>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="product" element={<Product />} />
          <Route path="app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route index element={<Navigate replace to="cities"/>} />

            <Route path="cities" element={<CitiesList />} />

            <Route path="cities/:id" element={<City />} />

            <Route path="countries" element={<CountryList  />} />

            <Route path="form" element={<Form/>} />
          </Route>

          <Route path="login" element={<Login />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
    </CitiesProvider>
    </AuthProvider>
  );
}

export default App;
