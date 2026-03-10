import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { loginUser, registerUser, logout, fetchMe, updateProfile, clearError } from '../store/authSlice';

/**
 * Convenience hook that surfaces auth state and actions.
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, loading, error, initialized } = useSelector((s) => s.auth);

  return {
    user,
    token,
    loading,
    error,
    initialized,
    isLoggedIn: !!token,
    login:          useCallback((data)   => dispatch(loginUser(data)),      [dispatch]),
    register:       useCallback((data)   => dispatch(registerUser(data)),   [dispatch]),
    logout:         useCallback(()       => dispatch(logout()),             [dispatch]),
    refreshMe:      useCallback(()       => dispatch(fetchMe()),            [dispatch]),
    saveProfile:    useCallback((data)   => dispatch(updateProfile(data)),  [dispatch]),
    clearError:     useCallback(()       => dispatch(clearError()),         [dispatch]),
  };
};