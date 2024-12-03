import React, { useState } from 'react'
import Navbar from '../components/Navbar';
import "../styles/Bookmarks.css";
import homeIcon from "../assets/homeIcon.png";
import Story from '../components/Story';
import { useNavigate } from 'react-router-dom';
import AddStory from '../components/AddStory';

const Bookmarks = (user, setUser) => {
  const [showStory, setShowStory] = useState(false);
  const [addStory, setAddStory] = useState(false);
  const bookmarks = [];
  const navigate = useNavigate();

  return (
    <>
      <Navbar user={user} setUser={setUser} setAddStory={setAddStory} />
      {showStory && (
        <Story setShowStory={setShowStory} />
      )}
      {addStory && (
        <AddStory setAddStory={setAddStory} />
      )}
      <div className='bookmarksCon'>
        <button onClick={() => navigate("/")} className='homeBtn'><img src={homeIcon} alt="home" /></button>
        <p className='yourBookmarksPara'>Your Bookmarks</p>
        {
          !bookmarks || bookmarks.length === 0 ? (
            <p className='noBookmarksPara'>No Bookmarks Available</p>
          ) : (
            <div className='bookmarks'>
              {/* {bookmarks.map((index) => (
                <HomeStory key={index} setShowStory={setShowStory} />
              ))} */}
            </div>
          )
        }
      </div>
    </>
  )
}

export default Bookmarks;
