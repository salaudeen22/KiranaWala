import { Routes, Route } from "react-router-dom";
import Dashboard from "./screen/Dashboard";
import HomeScreen from "./screen/HomeScreen";
import Inventory from "./screen/Inventory";
import Profile from "./screen/Profile";
import Sales from "./screen/Sales";
import Login from "./screen/auth/Login";
import SignUp from "./screen/auth/SignUp";
import UserManagement from "./screen/UserManagement";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signUp" element={<SignUp />} />
      <Route path="/home" element={<HomeScreen />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="sales" element={<Sales />} />
        <Route path="usermanagment" element={<UserManagement/>}/>
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};

export default App;
