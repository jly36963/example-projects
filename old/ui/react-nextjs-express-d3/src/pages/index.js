import React from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { Button } from '@material-ui/core';
import FlexContainer from '../components/flex-container';
import PaddedPaper from '../components/padded-paper';

// routes
const routes = [
  { url: '/charts/bar-chart', text: 'bar chart' },
  { url: '/charts/bar-chart-h', text: 'bar chart (h)' },
  { url: '/charts/stacked-bar-chart', text: 'stacked bar chart' },
  { url: '/charts/norm-stack-bar-chart', text: 'norm stack bar chart' },
  { url: '/charts/grouped-bar-chart', text: 'grouped bar chart' },
  { url: '/charts/hist-kde-chart', text: 'hist kde chart' },

  { url: '/charts/area-chart', text: 'area chart' },
  { url: '/charts/stacked-area-chart', text: 'stacked area chart' },
  { url: '/charts/line-chart', text: 'line chart' },
  { url: '/charts/multi-line-chart', text: 'multi line chart' },

  { url: '/charts/donut-chart', text: 'donut chart' },
  { url: '/charts/pie-chart', text: 'pie chart' },

  { url: '/charts/box-plot', text: 'box plot' },
  { url: '/charts/violin-chart', text: 'violin chart' },
  { url: '/charts/scatter-plot', text: 'scatter plot' },
  { url: '/charts/joint-hex-plot', text: 'joint hex plot' },
];

// styles

const Landing = () => {
  return (
    <FlexContainer>
      <PaddedPaper elevation={3}>
        {routes.map((route) => (
          <Link href={route.url} key={route.text}>
            <Button
              variant="text" // contained, outlined, text (text if this prop isn't provided)
              color="default" // primary, secondary, default (default if this prop isn't provided)
              component="button" // button, span
              onClick={() => {
                Router.push(route.url);
              }}
            >
              {route.text}
            </Button>
          </Link>
        ))}
      </PaddedPaper>
    </FlexContainer>
  );
};

export default Landing;
