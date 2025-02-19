import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import CaptainSignup from "./pages/CaptainSignup"
import CaptainLogin from "./pages/CaptainLogin"
import UserLogin from "./pages/UserLogin"
import UserSignup from "./pages/UserSignup"
import Start from "./pages/Start"
import UserProtectWrapper from "./pages/UserProtectedWrapper"
import UserLogout from "./pages/UserLogout"
import CaptainProtectWrapper from "./pages/CaptainProtectWrapper"
import CaptainHome from "./pages/CaptainHome"

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/captain-signup" element={<CaptainSignup />} />
        <Route path="/captain-login" element={<CaptainLogin />} />
        <Route path="/home" element={
          <UserProtectWrapper>
            <Start />
          </UserProtectWrapper>
        } />
        <Route path='/user/logout'element={
          <UserProtectWrapper>
            <UserLogout />
          </UserProtectWrapper>
        } />
        <Route path='/captain-home' element={
          <CaptainProtectWrapper>
            <CaptainHome />
          </CaptainProtectWrapper>

        } />

      </Routes>
    </div>
  )
}

export default App





