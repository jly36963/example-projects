// package imports
import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
// components
import landing from "./components/landing/landing";
import notFound from './components/not-found/not-found';

import introHtml from './components/intro-html/intro-html';
import introSvg from './components/intro-svg/intro-svg';
import barChartHtml from './components/bar-chart-html/bar-chart-html';
import barChartSvg from './components/bar-chart-svg/bar-chart-svg';

import barChart from './components/bar-chart/bar-chart';
import barChartH from './components/bar-chart-h/bar-chart-h';
import stackedBarChart from './components/stacked-bar-chart/stacked-bar-chart';
import normStackBar from './components/norm-stack-bar/norm-stack-bar';
import groupedBarChart from './components/grouped-bar-chart/grouped-bar-chart';
import histKde from './components/hist-kde/hist-kde';

import areaChart from './components/area-chart/area-chart';
import stackedAreaChart from './components/stacked-area-chart/stacked-area-chart';
import lineChart from './components/line-chart/line-chart';
import multiLine from './components/multi-line/multi-line';

import donutChart from './components/donut-chart/donut-chart';
import pieChart from './components/pie-chart/pie-chart';

import boxPlot from './components/box-plot/box-plot';
import violinChart from './components/violin-chart/violin-chart';
import scatterPlot from './components/scatter-plot/scatter-plot';
import jointHex from './components/joint-hex/joint-hex';





// style
const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  fontSize: '32px',
}

const childStyle = {
  textAlign: 'center',
  minHeight: '100px',
  minWidth: '400px',
  fontSize: '32px',
  border: '1px solid #ddd',
  borderRadius: '3px',
  padding: '20px',
  margin: 'auto',
}

// component
const App = () => {
  // jsx
  return (
    <div style={containerStyle}>
      <div style={childStyle}>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={landing} />
            <Route exact path="/intro-html" component={introHtml} />
            <Route exact path="/intro-html-2" component={introSvg} />
            <Route exact path="/bar-chart-html" component={barChartHtml} />
            <Route exact path="/bar-chart-svg" component={barChartSvg} />

            <Route exact path="/bar-chart" component={barChart} />
            <Route exact path="/bar-chart-h" component={barChartH} />
            <Route exact path="/stacked-bar-chart" component={stackedBarChart} />
            <Route exact path="/norm-stack-bar" component={normStackBar} />
            <Route exact path="/grouped-bar-chart" component={groupedBarChart} />
            <Route exact path="/hist-kde" component={histKde} />
            
            <Route exact path="/area-chart" component={areaChart} />
            <Route exact path="/stacked-area-chart" component={stackedAreaChart} />
            <Route exact path="/line-chart" component={lineChart} />
            <Route exact path="/multi-line" component={multiLine} />
            
            <Route exact path="/donut-chart" component={donutChart} />
            <Route exact path="/pie-chart" component={pieChart} />

            <Route exact path="/box-plot" component={boxPlot} />
            <Route exact path="/violin-chart" component={violinChart} />
            <Route exact path="/scatter-plot" component={scatterPlot} />
            <Route exact path="/joint-hex" component={jointHex} />            

            <Route component={notFound} />
          </Switch>
        </BrowserRouter>
      </div>
    </div>

  );
};
export default App;
