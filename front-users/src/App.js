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
//import Search from './containers/search'
//import Details from './containers/document/details'
import Basket from './containers/basket'
import Payment from './containers/payment'
import Result from './containers/result'
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
          <Route exact path="/profile" element={<Profile />} />
          {/*<Route exact path="/search" element={<Search />} />
          <Route exact path="/details/:id" element={<Details />} />*/}
          <Route exact path="/basket" element={<Basket />} />
          <Route exact path="/payment" element={<RequireAuth child={Payment} auth={true} />}/>
          <Route exact path="/result" element={<RequireAuth child={Result} auth={true} />}/>
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App;
