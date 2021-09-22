import React from 'react';

const routes = [
  { route: '/usestate/count', text: 'usestate-count' },
  { route: '/usestate/todo', text: 'usestate-todo' },
  { route: '/useeffect/dom', text: 'useeffect-dom' },
  { route: '/useeffect/fetch', text: 'useffect-fetch' },
  { route: '/useeffect/cleanup', text: 'useeffect-cleanup' },
  { route: '/usereducer/counter', text: 'usereducer-counter' },
  { route: '/usecontext/user', text: 'usecontext-user' },
  { route: '/usecontext/todo', text: 'usecontext-todo' },
  { route: '/useref/graph', text: 'useref-graph' },
  { route: '/usememo/fib', text: 'usememo-fib' },
  { route: '/usecallback/counters', text: 'usecallback-counters' },
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

{
  /* 
<button onClick={() => {history.push('/usestate/count')}}>
  usestate-count
</button>
<button onClick={() => {history.push('/usestate/todo')}}>
  usestate-todo
</button>
<button onClick={() => {history.push('/useeffect/dom')}}>
  useeffect-dom
</button>
<button onClick={() => {history.push('/useeffect/fetch')}}>
  useffect-fetch
</button>
<button onClick={() => {history.push('/useeffect/cleanup')}}>
  useeffect-cleanup
</button>
<button onClick={() => {history.push('/usereducer/counter')}}>
  usereducer-counter
</button>
<button onClick={() => {history.push('/usecontext/user')}}>
  usecontext-user
</button>
<button onClick={() => {history.push('/usecontext/todo')}}>
  usecontext-todo
</button>
*/
}
