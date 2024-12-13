import React, { useState } from 'react';
import '../styles/AddStory.css';
import closeIcon from '../assets/closeIcon.png';
import { toast } from 'react-toastify';
import axios from "axios";
import { STORY_API_END_POINT } from '../utils/constant';

const AddStory = ({ setAddStory, isMobileView, user, fetchStories }) => {
  const [story, setStory] = useState([
    { id: 1, heading: '', description: '', imageUrl: '', category: '' },
    { id: 2, heading: '', description: '', imageUrl: '', category: '' },
    { id: 3, heading: '', description: '', imageUrl: '', category: '' }
  ]);

  const [activeStory, setActiveStory] = useState(1);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const categoryOptions = [
    { value: 'food', label: 'Food' },
    { value: 'health', label: 'Health and Fitness' },
    { value: 'travel', label: 'Travel' },
    { value: 'movies', label: 'Movies' },
    { value: 'education', label: 'Education' }
  ];

  const handleAddStory = () => {
    if (story.length < 6) {
      const currentCategory = story[activeStory - 1].category; // Get category from the active slide
      const newStory = {
        id: story.length + 1,
        heading: "",
        description: "",
        imageUrl: "",
        category: currentCategory, // Set the new slide's category to the current category
      };
      setStory([...story, newStory]);
      setActiveStory(newStory.id);
    }
  };

  const handleDeleteStory = (id) => {
    const updatedStory = story.filter((q) => q.id !== id);
    const reindexedStories = updatedStory.map((q, index) => ({
      ...q,
      id: index + 1,
    }));
    setStory(reindexedStories);
    setActiveStory(
      reindexedStories.length > 0
        ? Math.min(activeStory, reindexedStories.length)
        : 1
    );
  };


  const handleInputChange = (id, field, value) => {
    const updatedStories = story.map((s) => {
      if (field === "category") {
        // Update category for all slides when changing the category
        return { ...s, category: value };
      }
      // Otherwise, update only the specific slide
      return s.id === id ? { ...s, [field]: value } : s;
    });
    setStory(updatedStories);
  };


  const handlePrevious = () => {
    if (activeStory > 1) {
      setActiveStory(activeStory - 1);
    }
  };

  const handleNext = () => {
    if (activeStory < story.length) {
      setActiveStory(activeStory + 1);
    }
  };

  const handlePost = async () => {
    try {
      // Retrieve the token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No token found. Please log in.");
      }
  
      // Construct the payload
      const payload = {
        category: story[0].category,
        media: story.map(slide => ({
          heading: slide.heading,
          description: slide.description,
          url: slide.imageUrl,
        })),
        user: user._id,
      };
  
      console.log('Payload being sent:', payload);
  
      // Send the POST request using Axios
      const response = await axios.post(`${STORY_API_END_POINT}/stories`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      });
  
      // Log the response data and show success messages
      console.log(response.data);
      setSuccessMessage("Story posted successfully!");
      setErrorMessage("");
      setAddStory(false);
      toast.success("Story posted successfully!");
      fetchStories();
    } catch (error) {
      // Handle errors
      console.error('Error posting stories:', error);
  
      // Handle server error responses
      if (error.response) {
        setErrorMessage(`Error posting stories: ${error.response.status} - ${error.response.data.message || error.message}`);
      } else {
        setErrorMessage("Error posting stories: " + error.message);
      }
    }
  };
  
  return (
    <div className="addStoryCon">

      {
        isMobileView ? (
          <>
            <div className="addStoryMobile">

              <span className='closeAddStoryBtnMobile' onClick={() => setAddStory(false)}><img src={closeIcon} alt="close" /></span>

              <div className='addStoryHeadingMobile'><p>Add story to feed</p></div>

              {successMessage && <div className="success-message">{successMessage}</div>}
              {errorMessage && <div className="error-message">{errorMessage}</div>}

              <div className='addStoryMiddleCon'>
                <div className="addSlideConMobile">
                  {story.map((q, index) => (
                    <div
                      key={q.id}
                      className={`slideMobile ${q.id === activeStory ? 'active' : ''}`}
                      onClick={() => setActiveStory(q.id)}
                    >
                      Slide {q.id}
                      {index >= 3 && (
                        <button
                          className="slideDeleteBtnMobile"
                          onClick={(e) => { e.stopPropagation(); handleDeleteStory(q.id); }}
                        >
                          <img src={closeIcon} alt="delete" />
                        </button>
                      )}
                    </div>
                  ))}
                  {story.length < 6 && (
                    <button onClick={handleAddStory} className="slideMobile">
                      Add +
                    </button>
                  )}
                </div>
                <div className="storyInputsMobile">
                  {story[activeStory - 1] && (
                    <div>
                      <div className="storyInputMobile">
                        <label className='addStoryLabelMobile'>Heading:</label>
                        <input
                          type="text"
                          value={story[activeStory - 1].heading}
                          onChange={(e) => handleInputChange(activeStory, 'heading', e.target.value)}
                          placeholder="Your heading"
                          className='addStoryInputMobile'
                        />
                      </div>
                      <div className='storyInputMobile'>
                        <label className='addStoryLabelMobile'>Description:</label>
                        <textarea
                          type="textArea"
                          value={story[activeStory - 1].description}
                          onChange={(e) => handleInputChange(activeStory, 'description', e.target.value)}
                          placeholder="Your description"
                          className='addStoryInputMobile addStoryDesInputMobile'
                        />
                      </div>
                      <div className="storyInputMobile">
                        <label className='addStoryLabelMobile'>Image URL:</label>
                        <input
                          type="text"
                          value={story[activeStory - 1].imageUrl}
                          onChange={(e) => handleInputChange(activeStory, 'imageUrl', e.target.value)}
                          placeholder="Image URL"
                          className='addStoryInputMobile'
                        />
                      </div>
                      <div className='storyInputMobile'>
                        <label className='addStoryLabelMobile'>Category:</label>
                        <select
                          className='addStorySelectMobile'
                          value={story[activeStory - 1].category}
                          onChange={(e) => handleInputChange(activeStory, 'category', e.target.value)}
                        >
                          <option value="">Select a Category</option>
                          {categoryOptions.map((category) => (
                            <option className='selectOptions' key={category.value} value={category.value}>
                              {category.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="storyBtnConMobile">
                <div className="story-btn-submit">
                  <button className='btnMobile postStoryBtn' onClick={handlePost}>Post</button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="addStory">

              <span className='closeAddStoryBtn' onClick={() => setAddStory(false)}><img src={closeIcon} alt="close" /></span>

              {successMessage && <div className="success-message">{successMessage}</div>}
              {errorMessage && <div className="error-message">{errorMessage}</div>}

              <div className="addSlideCon">
                {story.map((q, index) => (
                  <div
                    key={q.id}
                    className={`slide ${q.id === activeStory ? 'active' : ''}`}
                    onClick={() => setActiveStory(q.id)}
                  >
                    Slide {q.id}
                    {index >= 3 && (
                      <button
                        className="slideDeleteBtn"
                        onClick={(e) => { e.stopPropagation(); handleDeleteStory(q.id); }}
                      >
                        <img src={closeIcon} alt="delete" />
                      </button>
                    )}
                  </div>
                ))}
                {story.length < 6 && (
                  <button onClick={handleAddStory} className="slide">
                    Add +
                  </button>
                )}
              </div>

              <div className="storyInputs">
                {story[activeStory - 1] && (
                  <div>
                    <div className="storyInput">
                      <label className='addStoryLabel'>Heading:</label>
                      <input
                        type="text"
                        value={story[activeStory - 1].heading}
                        onChange={(e) => handleInputChange(activeStory, 'heading', e.target.value)}
                        placeholder="Your heading"
                        className='addStoryInput'
                      />
                    </div>
                    <div className='storyInput'>
                      <label className='addStoryLabel'>Description:</label>
                      <textarea
                        type="textArea"
                        value={story[activeStory - 1].description}
                        onChange={(e) => handleInputChange(activeStory, 'description', e.target.value)}
                        placeholder="Your description"
                        className='addStoryInput addStoryDesInput'
                      />
                    </div>
                    <div className="storyInput">
                      <label className='addStoryLabel'>Image URL:</label>
                      <input
                        type="text"
                        value={story[activeStory - 1].imageUrl}
                        onChange={(e) => handleInputChange(activeStory, 'imageUrl', e.target.value)}
                        placeholder="Image URL"
                        className='addStoryInput'
                      />
                    </div>
                    <div className='storyInput'>
                      <label className='addStoryLabel'>Category:</label>
                      <select
                        className='addStorySelect'
                        value={story[activeStory - 1].category}
                        onChange={(e) => handleInputChange(activeStory, 'category', e.target.value)}
                      >
                        <option value="">Select a Category</option>
                        {categoryOptions.map((category) => (
                          <option className='selectOptions' key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="storyBtnCon">
                <div className="storyBtnControllerCon">
                  <button className='btn previousSlideBtn' onClick={handlePrevious}>Previous</button>
                  <button className='btn nextSlideBtn' onClick={handleNext}>Next</button>
                </div>
                <div className="story-btn-submit">
                  <button className='btn postStoryBtn' onClick={handlePost}>Post</button>
                </div>
              </div>
            </div>
          </>
        )
      }
    </div>
  );
};

export default AddStory;