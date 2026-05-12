import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import appRouter from './router/AppRouter';

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={appRouter} />
    </AuthProvider>
  );
}

export default App;