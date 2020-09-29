// ---------
// imports
// ---------

import React, { useState } from 'react';

// ---------
// todo functional component
// ---------

const Todo = ({ todo, index, completeTodo, removeTodo }) => {
  // jsx
  return (
    <div
      style={{ textDecoration: todo.isCompleted ? 'line-through' : '' }}
      className="todo"
    >
      {todo.text}
      <div>
        <button onClick={() => completeTodo(index)}>Complete</button>
        <button onClick={() => removeTodo(index)}>x</button>
      </div>
    </div>
  );
};

// ---------
// todoform functional component
// ---------

const TodoForm = ({ addTodo }) => {
  // hook: state, function to update state
  const [value, setValue] = useState('');
  // form submit function
  const handleSubmit = (e) => {
    e.preventDefault(); // prevent normal form functionality
    if (!value) return; // if no value, end function
    addTodo(value); // add todo function (destructured from props)
    setValue(''); // reset form value
  };
  // jsx
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="input"
        value={value}
        placeholder="Add Todo Item"
        onChange={(e) => setValue(e.target.value)}
      />
    </form>
  );
};

// ---------
// app functional component
// ---------

const App = () => {
  // hook: state, function to update state
  const [todos, setTodos] = useState([
    {
      text: 'Learn react',
      isCompleted: false,
    },
    {
      text: 'Learn express',
      isCompleted: false,
    },
    {
      text: 'Learn elasticsearch',
      isCompleted: false,
    },
  ]);
  // addTodo function
  const addTodo = (text) => {
    // create new array of todos using all previous + new one
    const newTodos = [...todos, { text, isCompleted: false }];
    // update state with new array
    setTodos(newTodos);
  };
  // completeTodo function
  const completeTodo = (index) => {
    // get current array of todos
    const newTodos = [...todos];
    // change attribute of selected todo
    newTodos[index].isCompleted = true;
    // update state with updated array
    setTodos(newTodos);
  };
  // removeTodo function
  const removeTodo = (index) => {
    // get current array of todos
    const newTodos = [...todos];
    // remove todo by index
    newTodos.splice(index, 1);
    // update state with updated array
    setTodos(newTodos);
  };

  return (
    <div className="app">
      <div className="todo-list">
        {todos.map((todo, index) => (
          <Todo
            key={index}
            index={index}
            todo={todo}
            completeTodo={completeTodo}
            removeTodo={removeTodo}
          />
        ))}
        <TodoForm addTodo={addTodo} />
      </div>
    </div>
  );
};

export default App;
