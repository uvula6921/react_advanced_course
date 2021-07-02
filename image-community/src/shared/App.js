import React from "react";
import "./App.css";
import { BrowserRouter, Route } from "react-router-dom";
import PostList from "../pages/PostList";

const App = (props) => {
  return (
    <>
      <BrowserRouter>
        <Route path="/" exact component={PostList} />
      </BrowserRouter>
    </>
  );
};

export default App;
