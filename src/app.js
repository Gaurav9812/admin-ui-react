// import { ReactDOM } from "react-dom/client";
const ReactDOM = require("react-dom/client");
import Header from "./components/Header";
import Body from "./components/Body";

const root = ReactDOM.createRoot(document.getElementById("root"));

const App = () => {
  return (
    <div className="container">
      <Header />
      <Body />
    </div>
  );
};

root.render(<App />);
