import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar';
import "../styles/Bookmarks.css";
import Story from '../components/Story';
import AddStory from '../components/AddStory';
import NavbarMobile from '../components/NavbarMobile';

const Bookmarks = (user, setUser) => {
  const [showStory, setShowStory] = useState(false);
  const [addStory, setAddStory] = useState(false);
  const bookmarks = [];
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 780);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 780);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      {isMobileView ? (
        <NavbarMobile setAddStory={setAddStory} user={user} setUser={setUser} />
      ) : (
        <Navbar setAddStory={setAddStory} user={user} setUser={setUser} />
      )}
      {showStory && (
        <Story setShowStory={setShowStory} />
      )}
      {addStory && (
        <AddStory setAddStory={setAddStory} />
      )}
      <div className='bookmarksCon'>
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
