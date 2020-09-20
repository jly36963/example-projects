// -------------
// imports
// -------------

import React, { useState, createContext, useContext } from 'react';

// -------------
// store
// -------------

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
};
const Store = createContext(initialState);

// -------------
// form
// -------------

const InfoForm = () => {
  const { info, setInfo } = useContext(Store);
  const initialFormValues = info;
  const [formValues, setFormValues] = useState(initialFormValues);
  const onChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };
  const onSubmit = (e) => {
    e.preventDefault();
    /* validation step here */
    setInfo(formValues);
    setFormValues(initialFormValues);
  };

  // jsx
  return (
    <form onSubmit={onSubmit} className="todo-form">
      <input type="text" name="firstName" value={formValues.firstName} onChange={onChange} />
      <input type="text" name="lastName" value={formValues.lastName} onChange={onChange} />
      <input type="text" name="email" value={formValues.email} onChange={onChange} />
      <button type="submit">Update Info</button>
    </form>
  );
}

// -------------
// showinfo
// -------------

const ShowInfo = () => {
  const { info } = useContext(Store);
  return (
    <div className="my-info">
      <p>First Name: {info.firstName}</p>
      <p>Last Name: {info.lastName}</p>
      <p>Email: {info.email}</p>
    </div>
  )
}

// -------------
// app
// -------------

const App = () => {
  return (
    <div className="App">
      <h1>Todo App</h1>
      <div>
        <InfoForm />
        <ShowInfo />
      </div>
    </div>
  )
}

// -------------
// provider
// -------------

const StoreProvider = ({ children }) => {
  const [info, setInfo] = useState(initialState);
  return (
    <Store.Provider value={{ info, setInfo }}>
      {children}
    </Store.Provider>
  )
}

const ConnectedApp = () => {
  return (
    <StoreProvider>
      <App />
    </StoreProvider>
  )
}

export default ConnectedApp;

// // INDEX

// const app = (
//   <StoreProvider>
//     <App />
//   </StoreProvider>
// );
// ReactDOM.render(app, document.getElementById('root'));