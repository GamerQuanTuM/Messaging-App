import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import Register from "./pages/Register"
import Login from "./pages/Login"
import Home from "./pages/Home";
import useAuthStore from "./store/Auth";


export default function App() {
  const { currentUser } = useAuthStore()
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route
            index
            element={currentUser ? <Home /> : <Login />}
          />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}