import { createContext, useContext, useReducer, useEffect } from 'react';

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  language: 'hi',
  preferences: {},
  sessionData: {}
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
        preferences: action.payload.preferences || {},
        sessionData: action.payload.sessionData || {}
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        preferences: {},
        sessionData: {}
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload }
      };
    case 'UPDATE_SESSION':
      return {
        ...state,
        sessionData: { ...state.sessionData, ...action.payload }
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

// Storage utilities for better data management
const storage = {
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify({
        data: value,
        timestamp: Date.now(),
        version: '1.0'
      }));
    } catch (error) {
      console.warn('Storage set failed:', error);
    }
  },
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      const parsed = JSON.parse(item);
      return parsed.data;
    } catch (error) {
      console.warn('Storage get failed:', error);
      return null;
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Storage remove failed:', error);
    }
  },
  clear: () => {
    try {
      const keys = ['kisanSetuUser', 'kisanSetuPreferences', 'kisanSetuSession', 'kisanSetuCart'];
      keys.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.warn('Storage clear failed:', error);
    }
  }
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize from storage on app start
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const user = storage.get('kisanSetuUser');
        const preferences = storage.get('kisanSetuPreferences') || {};
        const sessionData = storage.get('kisanSetuSession') || {};
        const language = storage.get('kisanSetuLanguage') || 'hi';
        
        if (user && user.access_token) {
          // Validate token expiry if available
          const tokenExpiry = user.token_expiry;
          if (tokenExpiry && Date.now() > tokenExpiry) {
            storage.clear();
            dispatch({ type: 'SET_LOADING', payload: false });
            return;
          }
          
          dispatch({ 
            type: 'LOGIN', 
            payload: { user, preferences, sessionData } 
          });
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
        
        dispatch({ type: 'SET_LANGUAGE', payload: language });
      } catch (error) {
        console.error('Auth initialization failed:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    
    initializeAuth();
  }, []);

  // Auto-save user data changes
  useEffect(() => {
    if (state.user && state.isAuthenticated) {
      storage.set('kisanSetuUser', state.user);
    }
  }, [state.user]);

  useEffect(() => {
    if (Object.keys(state.preferences).length > 0) {
      storage.set('kisanSetuPreferences', state.preferences);
    }
  }, [state.preferences]);

  useEffect(() => {
    if (Object.keys(state.sessionData).length > 0) {
      storage.set('kisanSetuSession', state.sessionData);
    }
  }, [state.sessionData]);

  const login = (userData, rememberMe = true) => {
    const enhancedUser = {
      ...userData,
      login_time: Date.now(),
      last_activity: Date.now(),
      token_expiry: rememberMe ? Date.now() + (30 * 24 * 60 * 60 * 1000) : Date.now() + (24 * 60 * 60 * 1000) // 30 days or 1 day
    };
    
    const defaultPreferences = {
      theme: 'light',
      notifications: true,
      language: state.language,
      dashboard_layout: 'default'
    };
    
    const sessionData = {
      login_method: 'form',
      device_info: navigator.userAgent,
      ip_address: 'unknown'
    };
    
    dispatch({ 
      type: 'LOGIN', 
      payload: { 
        user: enhancedUser, 
        preferences: defaultPreferences, 
        sessionData 
      } 
    });
  };

  const logout = () => {
    storage.clear();
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (updates) => {
    dispatch({ type: 'UPDATE_USER', payload: updates });
  };

  const updatePreferences = (prefs) => {
    dispatch({ type: 'UPDATE_PREFERENCES', payload: prefs });
  };

  const updateSession = (data) => {
    dispatch({ type: 'UPDATE_SESSION', payload: data });
  };

  const setLanguage = (lang) => {
    storage.set('kisanSetuLanguage', lang);
    dispatch({ type: 'SET_LANGUAGE', payload: lang });
    updatePreferences({ language: lang });
  };

  // Update last activity timestamp
  const updateActivity = () => {
    if (state.user) {
      updateUser({ last_activity: Date.now() });
    }
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      logout,
      updateUser,
      updatePreferences,
      updateSession,
      setLanguage,
      updateActivity
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

// Activity tracker hook
export const useActivityTracker = () => {
  const { updateActivity } = useAuth();
  
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    let timeout;
    
    const handleActivity = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        updateActivity();
      }, 30000); // Update every 30 seconds of activity
    };
    
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });
    
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      clearTimeout(timeout);
    };
  }, [updateActivity]);
};