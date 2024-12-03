import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Bookmarks from './pages/Bookmarks'
import NotFound from './pages/NotFound'
import { UserProvider } from './UserContext';

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/bookmarks',
    element: <Bookmarks />
  },
  {
    path: '*',
    element: <NotFound />
  }
])

function App() {

  return (
    <>
      <UserProvider>
        <RouterProvider router={appRouter} />
      </UserProvider>
    </>
  )
}

export default App;