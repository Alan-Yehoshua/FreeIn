import ReactDOM from 'react-dom/client'

import { Login } from './components/Pages/Login/Login'
import { HomePageEmployeer } from  './components/Pages/HomePageEmployeer/HomePageEmployeer'
import { ProfielFormE } from './components/Pages/HomePageEmployeer/CreateProfilePageE'
import { ProfielFormF } from './components/Pages/HomePageFreelancer/CreateProfilePageF'
import { HomePageFreelancer } from './components/Pages/HomePageFreelancer/HomePageFreelancer'
import { Error404 } from './components/Pages/Error4040'
import { App } from './App'

import { createBrowserRouter, RouterProvider} from 'react-router-dom'
import './index.css'

import { PostContextProvider } from './Context/PostContext'

const router = createBrowserRouter([
  {
  path: '/',
  element: <Login/>,
  errorElement: <Error404/>,
  },
  {
  path: '/PageEmployeer',
  element: <HomePageEmployeer/>,
  },
  {
    path: '/PageFreelancer',
    element: <HomePageFreelancer/>,
  },
  {
    path: '/CreateProfileE',
    element: <ProfielFormE/>
  },
  {
    path: '/CreateProfileF',
    element: <ProfielFormF/>
  },
  {
    path: '/Chat',
    element: <App/>
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <PostContextProvider>
    <RouterProvider router={router}/>
    </PostContextProvider>
  </>,
)
