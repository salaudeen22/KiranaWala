import { Routes, Route } from "react-router";
import HomeScreen from "./screen/HomeScreen";
const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
      </Routes>
    </>
  );
};

export default App;
