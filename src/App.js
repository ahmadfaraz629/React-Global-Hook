import React, { useEffect } from "react";
import "./styles.css";

import { useGlobalHook, setState, getState } from "/src/reduxHook";

const Consumer1 = () => {
  const [mode] = useGlobalHook("name");
  return <div className={`is-dark-${mode}`}>Consumer1 - {`${mode}`}</div>;
};

const Consumer2 = () => {
  const [mode] = useGlobalHook("name");
  return <div className={`is-dark-${mode}`}>Consumer2 - {`${mode}`}</div>;
};
let renderCount = 0;
const Configurator = () => {
  const [mode, setMode] = useGlobalHook("name", 1);
  console.log("Conf Reload " + renderCount);

  useEffect(() => {
    // Updating the state by using the setState function
    setTimeout(() => {
      setState("name", 10);
      console.log("NewValue", getState("name"));
    }, 5000);
  }, []);

  return (
    <>
      <button
        onClick={() => {
          setMode(mode + 1);
        }}
      >
        Increment
      </button>
      <div>Configurator - {JSON.stringify(mode)}</div>
      {mode < 15 && <Consumer1 />}
      {mode < 15 && <Consumer2 />}
      {/* <div>{renderCount++}</div> */}
    </>
  );
};

export default function App() {
  return (
    <div className="App">
      <Configurator />
    </div>
  );
}
