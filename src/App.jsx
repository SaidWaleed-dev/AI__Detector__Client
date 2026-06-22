import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './presentation/routes';
import { useAuthStore } from './application/store/useAuthStore';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { init } = useAuthStore();

  useEffect(() => {
    init(); // Initialize auth state on app load
  }, [init]);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </>
  );
}

export default App;
