import React, { useState } from 'react'
import "../styles/Stories.css";

const HealthStories = ({ setShowStory, stories, setSelectedStory }) => {
  const [seeMore, setSeeMore] = useState(false);
  const healthStories = stories.filter((story) => story.category.toLowerCase() === 'health');

  const handleCardClick = (story) => {
    setSelectedStory(story);
    setShowStory(true);
  };

  return (
    <div className='storiesCon'>
      <p className='topStoriesPara'>Top Stories About Health and Fitness</p>
      {
        !healthStories || healthStories.length === 0 ? (
          <p className='noStoriesPara'>No stories Available</p>
        ) : (
          <div className='stories'>
            {!seeMore
              ? (healthStories.slice(0, 4).map((story, index) => (
                <div className='homeStory' key={index} onClick={() => handleCardClick(story)} style={{ backgroundImage: `url("${story.media[0]?.url}")` }} >
                  <div className='homeStoryTopCon'></div>
                  <div className='homeStoryBottomCon'>
                    <p className='headingPara'>{story.media[0]?.heading}</p>
                    <p className='descriptionPara'>{story.media[0]?.description}</p>
                  </div>
                </div>
              )))
              : (healthStories.map((story, index) => (
                <div className='homeStory' key={index} onClick={() => handleCardClick(story)} style={{ backgroundImage: `url("${story.media[0]?.url}")` }} >
                  <div className='homeStoryTopCon'></div>
                  <div className='homeStoryBottomCon'>
                    <p className='headingPara'>{story.media[0]?.heading}</p>
                    <p className='descriptionPara'>{story.media[0]?.description}</p>
                  </div>
                </div>
              )))
            }
          </div>
        )
      }
      {healthStories.length > 4 && !seeMore && (
        <button onClick={() => setSeeMore(true)}>See more</button>
      )}
    </div>
  )
}

export default HealthStories;