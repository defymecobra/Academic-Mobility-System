import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Home from "./Pages/Home";
import LoginSignup from "./Pages/LoginSignup";
import Program from "./Pages/Program";
import Profile from "./Pages/Profile";
import Footer from './Components/Footer/Footer'
import Programs from './Pages/Programs'
import ApplicationForm from "./Pages/ApplicationForm";
import './App.css';
import UpdateProfile from "./Components/UpdateProfile/UpdateProfile";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className="content">
          <Navbar />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path="/programs" element={<Programs />} />
            <Route path='/login' element={<LoginSignup />} />
            <Route path='program' element={<Program />}>
              <Route path=':programId' element={<Program />} />
            </Route>
            <Route path='app-form' element={<ApplicationForm />}>
              <Route path=':programId' element={<Program />} />
            </Route>
            <Route path="/profile" element={<Profile />} />
            <Route path="/updateprofile" element={<UpdateProfile />} />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
