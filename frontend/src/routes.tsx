import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import BookSearch from "./components/BookSearch";
import SearchResult from "./components/SearchResult";
import LoginRegister from "./views/LoginRegister"

const AppRoutes: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<BookSearch />}/>
      <Route path="/:id" element={<SearchResult />}/>
      <Route path="/login-register" element={<LoginRegister />}/>
    </Routes>
  </Router>

)

export default AppRoutes
