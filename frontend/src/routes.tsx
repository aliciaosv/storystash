import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import BookSearch from "./components/BookSearch";
import SearchResult from "./components/SearchResult";
import HomePage from "./views/HomePage"
import UserPage from "./views/UserPage";

const AppRoutes: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/userpage" element={<UserPage />} />
      <Route path="/booksearch" element={<BookSearch />}/>
      <Route path="/:id" element={<SearchResult />} />
    </Routes>
  </Router>
);

export default AppRoutes;
