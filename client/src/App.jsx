import './App.css';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Home from './pages/Home/Home';
import Report from "./pages/Report/Report";
import Navbar from "./components/navbar/Navbar"; // Import Navbar
import Sidebar from "./components/sidebar/Sidebar"; // Import Sidebar
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute"; // Import Protected Route
import History from './pages/History/History';
import ReportReview from './components/reportReview/ReportReview';
import Databases from './pages/databases/Databases.jsx'
function AppWrapper() {
    const location = useLocation();
    
    // Define where the sidebar should be hidden
    const isAuthPage = location.pathname === "/login" || location.pathname === "/register";
    const isHomePage = location.pathname === "/";

    return (
        <div className="app-container">
            {/* Show Navbar if it's NOT a login or register page */}
            {!isAuthPage && <Navbar />}

            {/* Show Sidebar only on pages that need it (e.g., Report) */}
            {!isAuthPage && !isHomePage && <Sidebar />}

            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Home />} />
                
                {/* Protected Report Page */}
                <Route 
                    path="/report"  
                    element={
                        <ProtectedRoute>
                            <Report />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/history"  
                    element={
                        <ProtectedRoute>
                            <History />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/review-report"  
                    element={
                        <ProtectedRoute>
                            <ReportReview />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/databases"  
                    element={
                        <ProtectedRoute>
                            <Databases />
                        </ProtectedRoute>
                    } 
                />
            </Routes>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppWrapper />
        </BrowserRouter>
    );
}

export default App;
