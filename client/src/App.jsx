/*eslint-disable react/prop-types */
import { AuthProvider } from "./shared/context/AuthContext.jsx";
import ProtectedRoute from "./users/pages/ProtectedRoute.jsx";
import UpdatePlace from "./places/pages/UpdatePlace.jsx";
import UserPlaces from "./places/pages/UserPlaces.jsx";
import AppLayout from "./AppLayout.jsx";
import NewPlace from "./places/pages/NewPlace.jsx";
import Users from "./users/pages/Users.jsx";
import Auth from "./users/pages/Auth.jsx";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

const App = () => {
  return (
    <>
      <AuthProvider>
        <Router>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" exact element={<Users />} />
              <Route path="/:userId/places" element={<UserPlaces />} />
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/places/new"
                element={
                  <ProtectedRoute>
                    <NewPlace />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/places/:placeId"
                element={
                  <ProtectedRoute>
                    <UpdatePlace />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
};

export default App;
