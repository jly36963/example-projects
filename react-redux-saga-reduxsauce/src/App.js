// react imports
import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
// component imports
import Landing from "./pages/landing";
// redux imports
import store from "./redux/store";
// asset imports
import "./App.css";

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Landing} />
          </Switch>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
