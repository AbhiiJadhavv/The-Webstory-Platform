import React, { useEffect, useState } from 'react'
import "../styles/Stories.css";
import editIcon from "../assets/editIcon.png";

const YourStories = ({ user, setShowStory, setSelectedStory, fetchUserStories, userStories }) => {
  const [seeMore, setSeeMore] = useState(false);

  useEffect(() => {
    fetchUserStories();
  }, [user]);

  const editBtnHandler = (e) => {
    e.stopPropagation();
  }

  const handleCardClick = (story) => {
    setSelectedStory(story);
    setShowStory(true);
  };

  const yourStories = userStories;

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
                <div className='homeStory' key={index} onClick={() => handleCardClick(story)} style={{ backgroundImage: `url("${story.slides[0]?.url}")` }} >
                  <div className='homeStoryTopCon'></div>
                  <div className='homeStoryBottomCon'>
                    <p className='headingPara'>{story.slides[0]?.heading}</p>
                    <p className='descriptionPara'>{story.slides[0]?.description}</p>
                  </div>
                  {user && (<button className='editStoryBtn' onClick={editBtnHandler}><img src={editIcon} alt="edit" />Edit</button>)}
                </div>
              )))
              : (yourStories.map((story, index) => (
                <div className='homeStory' key={index} onClick={() => handleCardClick(story)} style={{ backgroundImage: `url("${story.slides[0]?.url}")` }} >
                  <div className='homeStoryTopCon'></div>
                  <div className='homeStoryBottomCon'>
                    <p className='headingPara'>{story.slides[0]?.heading}</p>
                    <p className='descriptionPara'>{story.slides[0]?.description}</p>
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
