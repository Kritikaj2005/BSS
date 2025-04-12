import React from 'react'
import Home from './pages/Home'
import { BrowserRouter, Routes,Route } from 'react-router-dom'
//import Nav from './components/Nav'

function App() {
  return (
    <BrowserRouter>

    <Routes>
        <Route path="/" element={<Home/>}/>
        {/* <Route path="/search" element={<Search/>}/> */}
        {/*<Route path="/playlist" element={<Playlist/>}/>*/}
        {/*<Route path="/liked" element={<Liked/>}/>*/}
    </Routes>    
        </BrowserRouter>
  )
}

export default App
