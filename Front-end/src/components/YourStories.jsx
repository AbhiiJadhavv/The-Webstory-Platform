import React, { useEffect, useState } from 'react'
import "../styles/Stories.css";
import editIcon from "../assets/editIcon.png";
import axios from 'axios';

const YourStories = ({ user, setShowStory, setSelectedStory }) => {
  const [seeMore, setSeeMore] = useState(false);
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const fetchUserStories = async () => {
      if (user) {
        try {
          const response = await axios.get(`https://web-story-platform-by-abhishek.onrender.com/api/v1/story/stories/user/${user._id}`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });
          setStories(response.data.data);
        } catch (error) {
          console.error("Error fetching stories", error);
          // setError("Failed to load stories.");
        }
      }
    };

    fetchUserStories();
  }, [user]);

  const editBtnHandler = (e) => {
    e.stopPropagation();
  }

  const handleCardClick = (story) => {
    setSelectedStory(story);
    setShowStory(true);
  };

  const yourStories = stories;

  return (
    <div className='storiesCon'>
      <p className='topStoriesPara'>Your Stories</p>
      {
        !yourStories || yourStories.length === 0 ? (
          <p className='noStoriesPara'>No stories Available</p>
        ) : (
          <div className='stories'>
            {!seeMore
              ? (yourStories.slice(0, 4).map((story, index) => (
                <div className='homeStory' key={index} onClick={() => handleCardClick(story)} style={{ backgroundImage: `url("${story.media[0]?.url}")` }} >
                  <div className='homeStoryTopCon'></div>
                  <div className='homeStoryBottomCon'>
                    <p className='headingPara'>{story.media[0]?.heading}</p>
                    <p className='descriptionPara'>{story.media[0]?.description}</p>
                  </div>
                  {user && (<button className='editStoryBtn' onClick={editBtnHandler}><img src={editIcon} alt="edit" />Edit</button>)}
                </div>
              )))
              : (yourStories.map((story, index) => (
                <div className='homeStory' key={index} onClick={() => handleCardClick(story)} style={{ backgroundImage: `url("${story.media[0]?.url}")` }} >
                  <div className='homeStoryTopCon'></div>
                  <div className='homeStoryBottomCon'>
                    <p className='headingPara'>{story.media[0]?.heading}</p>
                    <p className='descriptionPara'>{story.media[0]?.description}</p>
                  </div>
                  {user && (<button className='editStoryBtn' onClick={editBtnHandler}><img src={editIcon} alt="edit" />Edit</button>)}
                </div>
              )))
            }
          </div>
        )
      }
      {yourStories.length > 4 && !seeMore && (
        <button onClick={() => setSeeMore(true)}>See more</button>
      )}
    </div>
  )
}

export default YourStories;