import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  token: null,
  tokenExpirationDate: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "login":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        tokenExpirationDate: action.payload.expiry,
      };

    case "logout":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        token: null,
        tokenExpirationDate: null,
      };
    default:
      return state;
  }
};

const AuthProvider = ({ children }) => {
  const [{ user, isAuthenticated, token, tokenExpirationDate }, dispatch] =
    useReducer(reducer, initialState);

  //LOGIN
  const login = useCallback((user, token, expiry) => {
    const expirationDate =
      expiry || new Date(new Date().getTime() + 1000 * 60 * 60);

    dispatch({
      type: "login",
      payload: { user, token, expiry: expirationDate },
    });

    // Store in localStorage
    localStorage.setItem(
      "userData",
      JSON.stringify({
        user: user,
        token: token,
        expiry: expirationDate.toISOString(),
      })
    );
  }, []);

  //LOGOUT
  const logout = useCallback(() => {
    dispatch({ type: "logout" });
    //remove from localStorage
    localStorage.removeItem("userData");
  }, []);

  //RETRIEVE STORED TOKEN ON APP LOAD
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiry) > new Date()
    ) {
      login(storedData.user, storedData.token, new Date(storedData.expiry));
    }
  }, [login]);

  // AUTO LOGOUT WHEN TOKEN EXPIRES
  useEffect(() => {
    let logoutTimer;
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("AuthContext was used outside AuthProvider");
  return context;
};

export { AuthProvider, useAuth };
