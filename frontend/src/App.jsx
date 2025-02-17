import HomeScreen from "./screen/HomeScreen";
import Login from "./screen/auth/Login";
import SignUp from "./screen/auth/SignUp";

import { Routes, Route } from "react-router";

const App = () => {
  return (
   

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/" element={<HomeScreen />} />
      </Routes>

  );
};

export default App;
