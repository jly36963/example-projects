// imports
import React, { useState, createContext, useContext, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';

// STORE

const initialState = {
  todos: [],
};
const Store = createContext(initialState);

// REDUCER METHODS

const addTodo = (state, todoText) => {
  const newTodo = {
    id: uuidv4(),
    text: todoText,
    completed: false,
  };
  return { ...state, todos: [...state.todos, newTodo] };
};
const removeTodo = (state, todoId) => {
  const remainingTodos = state.todos.filter((todo) => todo.id !== todoId);
  return { ...state, todos: remainingTodos };
};
const changeStatus = (state, todoId, completed) => {
  const todo = state.todos.find((todo) => todo.id === todoId);
  const todoIndex = state.todos.indexOf(todo);
  const updatedTodo = { ...todo, completed };
  const updatedTodos = [
    ...state.todos.slice(0, todoIndex),
    updatedTodo,
    ...state.todos.slice(todoIndex + 1),
  ];
  return { ...state, todos: updatedTodos };
};

// ----------
// ACTIONS
// ----------

const actionAddTodo = (todoText, dispatch) => {
  dispatch({
    type: 'ADD_TODO',
    todoText,
  });
};
const actionRemoveTodo = (todoId, dispatch) => {
  dispatch({
    type: 'REMOVE_TODO',
    todoId,
  });
};
const actionChangeStatus = (todoId, completed, dispatch) => {
  dispatch({
    type: 'EDIT_TODO_STATUS',
    todoId,
    completed,
  });
};

// ----------
// reducer
// ----------

const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return addTodo(state, action.todoText);
    case 'REMOVE_TODO':
      return removeTodo(state, action.todoId);
    case 'EDIT_TODO_STATUS':
      return changeStatus(state, action.todoId, action.completed);
    default:
      return state;
  }
};

// ----------
// provider
// ----------

const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <Store.Provider value={{ state, dispatch }}>{children}</Store.Provider>
  );
};

// ----------
// form component
// ----------

const TodoForm = () => {
  const { dispatch } = useContext(Store);
  // form hook
  const [formValue, setFormValue] = useState('');
  // on change
  const onChange = (e) => {
    setFormValue(e.target.value);
  };
  // on submit
  const onSubmit = (e) => {
    e.preventDefault();
    if (formValue.trim().length > 0) actionAddTodo(formValue, dispatch);
    setFormValue('');
  };
  // jsx
  return (
    <form onSubmit={onSubmit} className="todo-form">
      <input type="text" value={formValue} onChange={onChange} />
      <button type="submit">Add Todo</button>
    </form>
  );
};

// ----------
// list component
// ----------

const TodoList = () => {
  const { state, dispatch } = useContext(Store);
  const todoList = state.todos.map((todo) => (
    <Todo
      key={todo.id}
      todoId={todo.id}
      todoText={todo.text}
      completed={todo.completed}
      dispatch={dispatch}
    />
  ));
  return <div className="todo-list">{todoList}</div>;
};

// ----------
// todo component
// ----------

const Todo = (props) => {
  // destructure from props
  const { todoId, todoText, completed, dispatch } = props;

  // ----------
  // event functions
  // ----------

  // change status
  const changeStatus = (todoId, completed, dispatch) => {
    const newStatus = !completed;
    actionChangeStatus(todoId, newStatus, dispatch);
  };
  // remove todo
  const removeTodo = (todoId, dispatch) => {
    actionRemoveTodo(todoId, dispatch);
  };

  // ----------
  // style
  // ----------

  // const todoStyle = {};

  const todoStyle = {
    color: completed ? '#90a4ae' : '#01579b',
    textDecoration: (completed && 'line-through') || 'none',
  };

  // ----------
  // jsx
  // ----------

  return (
    <div className="todo">
      <span style={todoStyle}>{todoText}</span>
      <button onClick={() => changeStatus(todoId, completed, dispatch)}>
        change status
      </button>
      <button onClick={() => removeTodo(todoId, dispatch)}>remove</button>
    </div>
  );
};

// APP COMPONENT

const App = () => {
  return (
    <div className="App">
      <h1>Todo App</h1>
      <div>
        <TodoForm />
        <TodoList />
      </div>
    </div>
  );
};

const ConnectedApp = () => {
  return (
    <StoreProvider>
      <App />
    </StoreProvider>
  );
};

export default ConnectedApp;
