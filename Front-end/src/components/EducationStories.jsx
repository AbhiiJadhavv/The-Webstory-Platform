import React, { useState } from 'react'
import "../styles/Stories.css";

const EducationStories = ({ setShowStory, stories, setSelectedStory }) => {
  const [seeMore, setSeeMore] = useState(false);
  const educationStories = stories.filter((story) => story.category.toLowerCase() === 'education');

  const handleCardClick = (story) => {
    setSelectedStory(story);
    setShowStory(true);
  };

  return (
    <div className='storiesCon'>
      <p className='topStoriesPara'>Top Stories About Education</p>
      {
        !educationStories || educationStories.length === 0 ? (
          <p className='noStoriesPara'>No stories Available</p>
        ) : (
          <div className='stories'>
            {!seeMore
              ? (educationStories.slice(0, 4).map((story, index) => (
                <div className='homeStory' key={index} onClick={() => handleCardClick(story)} style={{ backgroundImage: `url("${story.slides[0]?.url}")` }} >
                  <div className='homeStoryTopCon'></div>
                  <div className='homeStoryBottomCon'>
                    <p className='headingPara'>{story.slides[0]?.heading}</p>
                    <p className='descriptionPara'>{story.slides[0]?.description}</p>
                  </div>
                </div>
              )))
              : (educationStories.map((story, index) => (
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
      {educationStories.length > 4 && !seeMore && (
        <button onClick={() => setSeeMore(true)}>See more</button>
      )}
    </div>
  )
}

export default EducationStories;