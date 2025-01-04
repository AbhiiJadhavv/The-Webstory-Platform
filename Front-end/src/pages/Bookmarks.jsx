import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import "../styles/Bookmarks.css";
import Story from '../components/Story';
import AddStory from '../components/AddStory';
import NavbarMobile from '../components/NavbarMobile';
import axios from 'axios';
import { STORY_API_END_POINT } from '../utils/constant';

const Bookmarks = ({ user, setUser }) => {
  const [showStory, setShowStory] = useState(false);
  const [addStory, setAddStory] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
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

  useEffect(() => {
    if (user && user._id) {
      console.log(user._id);
      const fetchBookmarks = async () => {
        try {
          const response = await axios.get(`${STORY_API_END_POINT}/bookmarks/${user._id}`);
          setBookmarks(response.data.bookmarks);
        } catch (error) {
          console.error("Error fetching bookmarks:", error);
        }
      };

      fetchBookmarks();
    }
  }, [user]);

  return (
    <>
      {isMobileView ? (
        <NavbarMobile setAddStory={setAddStory} user={user} setUser={setUser} />
      ) : (
        <Navbar setAddStory={setAddStory} user={user} setUser={setUser} />
      )}
      {showStory && <Story setShowStory={setShowStory} />}
      {addStory && <AddStory setAddStory={setAddStory} />}
      <div className='bookmarksCon'>
        <p className='yourBookmarksPara'>Your Bookmarks</p>
        {!bookmarks || bookmarks.length === 0 ? (
          <p className='noBookmarksPara'>No Bookmarks Available</p>
        ) : (
          <div className='bookmarks'>
            {bookmarks.map((bookmark) => (
              <div className='homeStory' key={bookmark._id} style={{ backgroundImage: `url("${bookmark.url}")` }} >
              <div className='homeStoryTopCon'></div>
              <div className='homeStoryBottomCon'>
                <p className='headingPara'>{bookmark.heading}</p>
                <p className='descriptionPara'>{bookmark.description}</p>
              </div>
            </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Bookmarks;
