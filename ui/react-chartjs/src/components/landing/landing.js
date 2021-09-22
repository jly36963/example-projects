import React from 'react';

const routes = [
  { route: '/intro-line-chart', text: 'line chart' },
  { route: '/bar-chart', text: 'bar chart' },
  { route: '/bar-chart-h', text: 'bar chart (horizontal)' },
  { route: '/bar-chart-grouped', text: 'bar chart (grouped)' },
  { route: '/line-chart', text: 'line chart' },
  { route: '/pie-chart', text: 'pie chart' },
  { route: '/radar-chart', text: 'radar chart' },
  { route: '/polar-area-chart', text: 'polar area chart' },
  { route: '/doughnut-chart', text: 'doughnut chart' },
  { route: '/mixed-chart', text: 'mixed chart' },
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
