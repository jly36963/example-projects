// -------------
// localStorage
// -------------

const storage = {
  getItem: (key: string): string | null => {
    if (localStorage) {
      const item: string = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    }
  },
  setItem: (key: string, value: string): void => {
    if (localStorage) return localStorage.setItem(key, JSON.stringify(value));
  },
  removeItem: (key: string): void => {
    if (localStorage) return localStorage.removeItem(key);
  },
};

export default storage;
