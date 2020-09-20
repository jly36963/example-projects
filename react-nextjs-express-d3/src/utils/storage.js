// -------------
// localStorage
// -------------

const storage = {
  getItem: (key) => {
    if (localStorage) {
      const item = localStorage.getItem(key);
      if (item) {
        return JSON.parse(item);
      } else {
        return null;
      }
    }
  },
  setItem: (key, value) => {
    if (localStorage) return localStorage.setItem(key, JSON.stringify(value));
  },
  removeItem: (key) => {
    if (localStorage) return localStorage.removeItem(key);
  },
};

export default storage;
