import React from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './containers/header'
import Footer from './containers/footer'
import Register from './containers/user/register'
import Login from './containers/user/login'
import Logout from './containers/user/logout'
import Home from './containers/home'
import Profile from './containers/user/profile'
import User from './containers/user/user';
import MyAdverts from './containers/adverts/myAdverts';
import AddAdvert from './containers/adverts/addAdvert';
import EditAdvert from './containers/adverts/editAdvert';
import ViewAdvert from './containers/adverts/viewAdvert';
//import Search from './containers/search'
//import Details from './containers/document/details'
import MyOrders from './containers/orders/myOrders';
import Basket from './containers/basket'
import {Routes, Route} from 'react-router-dom';
import RequireAuth from './helpers/require-data-auth';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Routes>
          <Route exact path="/" element={<RequireAuth child={Home} auth={false}/>}/>
          <Route exact path="/register" element={<Register/>}/>
          <Route exact path="/login" element={<Login />}/>
          <Route exact path="/logout" element={<Logout />} />
          <Route exact path="/profile" element={<RequireAuth child={Profile} auth={true} />} />
          <Route exact path="/user/:id" element={<RequireAuth child={User} auth={false} />} />
          {/*<Route exact path="/search" element={<Search />} />
          <Route exact path="/details/:id" element={<Details />} />*/}
          <Route exact path="/myAdverts" element={<RequireAuth child={MyAdverts} auth={true} />} />
          <Route exact path="/addAdvert" element={<RequireAuth child={AddAdvert} auth={true} />} />
          <Route exact path="/editAdvert/:id" element={<RequireAuth child={EditAdvert} auth={true} />} />
          <Route exact path="/advert/:id" element={<RequireAuth child={ViewAdvert} auth={false} />} />
          <Route exact path="/myOrders" element={<RequireAuth child={MyOrders} auth={true} />} />
          <Route exact path="/basket" element={<RequireAuth child={Basket} auth={false} />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App;
