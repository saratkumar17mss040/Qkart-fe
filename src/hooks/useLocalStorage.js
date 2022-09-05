import * as React from "react";

function useLocalStorageState(
  key,
  defaultValue = "",
  { serialize = JSON.stringify, deserialize = JSON.parse } = {}
) {
  const [state, setState] = React.useState(() => {
    console.log(key);
    const valueInLocalStorage = window.localStorage.getItem(key);
    console.log(valueInLocalStorage);
    if (typeof valueInLocalStorage === "string") {
      return valueInLocalStorage;
    } else if (valueInLocalStorage) {
      return deserialize(valueInLocalStorage);
    }
    return typeof defaultValue === "function" ? defaultValue() : defaultValue;
  });

  return [state, setState];
}

export { useLocalStorageState };
