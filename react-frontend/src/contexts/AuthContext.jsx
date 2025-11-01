import { createContext, useContext, useReducer, useEffect } from 'react';

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  language: 'hi'
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_LANGUAGE':
      return {
        ...state,
        language: action.payload
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const user = localStorage.getItem('kisanSetuUser');
    const language = localStorage.getItem('kisanSetuLanguage') || 'hi';
    
    if (user) {
      dispatch({ type: 'LOGIN', payload: JSON.parse(user) });
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
    
    dispatch({ type: 'SET_LANGUAGE', payload: language });
  }, []);

  const login = (userData) => {
    localStorage.setItem('kisanSetuUser', JSON.stringify(userData));
    dispatch({ type: 'LOGIN', payload: userData });
  };

  const logout = () => {
    localStorage.removeItem('kisanSetuUser');
    dispatch({ type: 'LOGOUT' });
  };

  const setLanguage = (lang) => {
    localStorage.setItem('kisanSetuLanguage', lang);
    dispatch({ type: 'SET_LANGUAGE', payload: lang });
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      logout,
      setLanguage
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};