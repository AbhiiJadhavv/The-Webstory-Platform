import React, { useState } from 'react'
import "../styles/Stories.css";

const FoodStories = ({ setShowStory, stories, setSelectedStory }) => {
  const [seeMore, setSeeMore] = useState(false);
  const foodStories = stories.filter((story) => story.category.toLowerCase() === 'food');

  const handleCardClick = (story) => {
    setSelectedStory(story);
    setShowStory(true);
  };

  return (
    <div className='storiesCon'>
      <p className='topStoriesPara'>Top Stories About Food</p>
      {
        !foodStories || foodStories.length === 0 ? (
          <p className='noStoriesPara'>No stories Available</p>
        ) : (
          <div className='stories'>
            {!seeMore
              ? (foodStories.slice(0, 4).map((story, index) => (
                <div className='homeStory' key={index} onClick={() => handleCardClick(story)} style={{ backgroundImage: `url("${story.slides[0]?.url}")` }} >
                  <div className='homeStoryTopCon'></div>
                  <div className='homeStoryBottomCon'>
                    <p className='headingPara'>{story.slides[0]?.heading}</p>
                    <p className='descriptionPara'>{story.slides[0]?.description}</p>
                  </div>
                </div>
              )))
              : (foodStories.map((story, index) => (
                <div className='homeStory' key={index} onClick={() => handleCardClick(story)} style={{ backgroundImage: `url("${story.slides[0]?.url}")` }} >
                  <div className='homeStoryTopCon'></div>
                  <div className='homeStoryBottomCon'>
                    <p className='headingPara'>{story.slides[0]?.heading}</p>
                    <p className='descriptionPara'>{story.slides[0]?.description}</p>
                  </div>
                </div>
              )))
            }
          </div>
        )
      }
      {foodStories.length > 4 && !seeMore && (
        <button onClick={() => setSeeMore(true)}>See more</button>
      )}
    </div>
  )
}

export default FoodStories;