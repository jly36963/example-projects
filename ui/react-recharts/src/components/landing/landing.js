import React from 'react';

const routes = [
  { route: '/simple-line-chart', text: 'simple line chart' },
  { route: '/simple-area-chart', text: 'simple area chart' },
  { route: '/stacked-area-chart', text: 'stacked area chart' },
  { route: '/simple-bar-chart', text: 'simple bar chart' },
  { route: '/simple-scatter-chart', text: 'simple scatter chart' },
  { route: '/three-scatter-chart', text: 'three scatter chart' },
  { route: '/pie-chart', text: 'pie chart' },
  { route: '/donut-chart', text: 'donut chart' },
];

const Landing = ({ history }) => {
  return (
    <>
      {routes.map((r) => (
        <div key={r.text}>
          <button
            onClick={() => {
              history.push(r.route);
            }}
          >
            {r.text}
          </button>
          <br />
        </div>
      ))}
    </>
  );
};

export default Landing;
