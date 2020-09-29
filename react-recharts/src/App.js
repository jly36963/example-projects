// package imports
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// components
import landing from './components/landing/landing';
import notFound from './components/not-found/not-found';

// import lineChart from './components/line-chart/line-chart';
// import donutChart from './components/donut-chart/donut-chart';
// import pieChart from './components/pie-chart/pie-chart';

import simpleLineChart from './components/simple-line-chart/simple-line-chart';
import simpleAreaChart from './components/simple-area-chart/simple-area-chart';
import stackedAreaChart from './components/stacked-area-chart/stacked-area-chart';
import simpleBarChart from './components/simple-bar-chart/simple-bar-chart';
import simpleScatterChart from './components/simple-scatter-chart/simple-scatter-chart';
import threeScatterChart from './components/three-scatter-chart/three-scatter-chart';
import pieChart from './components/pie-chart/pie-chart';
import donutChart from './components/donut-chart/donut-chart';

// style
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

            <Route
              exact
              path="/simple-line-chart"
              component={simpleLineChart}
            />
            <Route
              exact
              path="/simple-area-chart"
              component={simpleAreaChart}
            />
            <Route
              exact
              path="/stacked-area-chart"
              component={stackedAreaChart}
            />
            <Route exact path="/simple-bar-chart" component={simpleBarChart} />
            <Route
              exact
              path="/simple-scatter-chart"
              component={simpleScatterChart}
            />
            <Route
              exact
              path="/three-scatter-chart"
              component={threeScatterChart}
            />
            <Route exact path="/pie-chart" component={pieChart} />
            <Route exact path="/donut-chart" component={donutChart} />

            <Route component={notFound} />
          </Switch>
        </BrowserRouter>
      </div>
    </div>
  );
};
export default App;
