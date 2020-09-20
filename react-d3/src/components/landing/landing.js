import React from 'react'

const routes = [
  // { route: '/intro-html', text: 'intro (html)' },
  // { route: '/intro-svg', text: 'intro (svg)' },
  // { route: '/bar-chart-html', text: 'bar chart (html)' },
  // { route: '/bar-chart-svg', text: 'bar chart (svg)' },

  { route: '/bar-chart', text: 'bar chart' },
  { route: '/bar-chart-h', text: 'bar chart (h)' },
  { route: '/stacked-bar-chart', text: 'stacked bar chart' },
  { route: '/norm-stack-bar', text: 'norm stack bar' },
  { route: '/grouped-bar-chart', text: 'grouped bar chart' },
  { route: '/hist-kde', text: 'hist kde' },

  { route: '/area-chart', text: 'area chart' },
  { route: '/stacked-area-chart', text: 'stacked area chart' },
  { route: '/line-chart', text: 'line chart' },
  { route: '/multi-line', text: 'multi line' },

  { route: '/donut-chart', text: 'donut chart' },
  { route: '/pie-chart', text: 'pie chart' },
  
  { route: '/box-plot', text: 'box plot' },
  { route: '/violin-chart', text: 'violin chart' },
  { route: '/scatter-plot', text: 'scatter plot' },
  { route: '/joint-hex', text: 'joint hex' },
]

const Landing = ({ history }) => {
  return (
    <>
      {routes.map(r => (
        <div key={r.text}>
          <button onClick={() => { history.push(r.route) }}>
            {r.text}
          </button>
          <br/>
        </div>
      ))}
    </>
  );
};

export default Landing;