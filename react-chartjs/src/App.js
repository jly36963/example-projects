// package imports
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
// components
import landing from './components/landing/landing';
import notfound from './components/not-found/not-found';
import introLineChart from './components/intro-line-chart/intro-line-chart';
import barChart from './components/bar-chart/bar-chart';
import barChartHorizontal from './components/bar-chart-h/bar-chart-h';
import barChartGrouped from './components/bar-chart-grouped/bar-chart-grouped';
import lineChart from './components/line-chart/line-chart';
import pieChart from './components/pie-chart/pie-chart';
import radarChart from './components/radar-chart/radar-chart';
import polarAreaChart from './components/polar-area-chart/polar-area-chart';
import doughnutChart from './components/doughnut-chart/doughnut-chart';
import mixedChart from './components/mixed-chart/mixed-chart';

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
            <Route exact path="/intro-line-chart" component={introLineChart} />
            <Route exact path="/bar-chart" component={barChart} />
            <Route exact path="/bar-chart-h" component={barChartHorizontal} />
            <Route
              exact
              path="/bar-chart-grouped"
              component={barChartGrouped}
            />
            <Route exact path="/line-chart" component={lineChart} />
            <Route exact path="/pie-chart" component={pieChart} />
            <Route exact path="/radar-chart" component={radarChart} />
            <Route exact path="/polar-area-chart" component={polarAreaChart} />
            <Route exact path="/doughnut-chart" component={doughnutChart} />
            <Route exact path="/mixed-chart" component={mixedChart} />
            <Route component={notfound} />
          </Switch>
        </BrowserRouter>
      </div>
    </div>
  );
};
export default App;
