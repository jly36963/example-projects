// package imports
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
// components
import landing from './components/landing/landing';
import count from './components/usestate/count/count';
import todo from './components/usestate/todo/todo';
import dom from './components/useeffect/dom/dom';
import fetch from './components/useeffect/fetch/fetch';
import cleanup from './components/useeffect/cleanup/cleanup';
import counter2 from './components/usereducer/counter/counter';
import user2 from './components/usecontext/user/user';
import todo2 from './components/usecontext/todo/todo';
import graph from './components/useref/graph/graph';
import fib from './components/usememo/fib/fib';
import counters from './components/usecallback/counters/counters';
import notfound from './components/not-found';

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  fontSize: '32px',
};

const childStyle = {
  textAlign: 'center',
  minHeight: '100px',
  minWidth: '400px',
  fontSize: '32px',
  border: '1px solid #ddd',
  borderRadius: '3px',
  padding: '20px',
  margin: 'auto',
};

// component
const App = () => {
  // jsx
  return (
    <div style={containerStyle}>
      <div style={childStyle}>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={landing} />
            <Route exact path="/usestate/count" component={count} />
            <Route exact path="/usestate/todo" component={todo} />
            <Route exact path="/useeffect/dom" component={dom} />
            <Route exact path="/useeffect/fetch" component={fetch} />
            <Route exact path="/useeffect/cleanup" component={cleanup} />
            <Route exact path="/usereducer/counter" component={counter2} />
            <Route exact path="/usecontext/user" component={user2} />
            <Route exact path="/usecontext/todo" component={todo2} />
            <Route exact path="/useref/graph" component={graph} />
            <Route exact path="/usememo/fib" component={fib} />
            <Route exact path="/usecallback/counters" component={counters} />
            <Route component={notfound} />
          </Switch>
        </BrowserRouter>
      </div>
    </div>
  );
};
export default App;
