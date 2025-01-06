import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import "../styles/Bookmarks.css";
import Story from '../components/Story';
import AddStory from '../components/AddStory';
import NavbarMobile from '../components/NavbarMobile';
import axios from 'axios';
import { STORY_API_END_POINT } from '../utils/constant';
import { useUser } from '../UserContext';

const Bookmarks = () => {
  const { user, setUser } = useUser();
  const [showStory, setShowStory] = useState(false);
  const [addStory, setAddStory] = useState(false);
  const [bookmarkIds, setBookmarkIds] = useState([]);
  const [slides, setSlides] = useState([]);
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

  // Fetch bookmark IDs
  useEffect(() => {
    if (user && user._id) {
      const fetchBookmarks = async () => {
        try {
          const response = await axios.get(`${STORY_API_END_POINT}/bookmarks/${user._id}`);
          setBookmarkIds(response.data.bookmarks);
          console.log(response.data.bookmarks);
        } catch (error) {
          console.error("Error fetching bookmarks:", error);
        }
      };

      fetchBookmarks();
    }
  }, [user]);

  // Fetch slide details using bookmark IDs
  useEffect(() => {
    if (bookmarkIds.length > 0) {
      const fetchSlides = async () => {
        try {
          const response = await axios.post(`${STORY_API_END_POINT}/slides/details`, {
            slideIds: bookmarkIds,
          });
          setSlides(response.data.slides);
          console.log(response.data.slides);          
        } catch (error) {
          console.error("Error fetching slide details:", error);
        }
      };

      fetchSlides();
    }
  }, [bookmarkIds]);

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
        {!slides || slides.length === 0 ? (
          <p className='noBookmarksPara'>No Bookmarks Available</p>
        ) : (
          <div className='bookmarks'>
            {slides.map((slide) => (
              <div
                className='homeStory'
                key={slide._id}
                style={{ backgroundImage: `url("${slide.url}")` }}
              >
                <div className='homeStoryTopCon'></div>
                <div className='homeStoryBottomCon'>
                  <p className='headingPara'>{slide.heading}</p>
                  <p className='descriptionPara'>{slide.description}</p>
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
