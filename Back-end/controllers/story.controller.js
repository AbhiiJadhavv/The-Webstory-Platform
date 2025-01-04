import { User } from '../models/user.model.js';
import { Story } from '../models/story.model.js';


// Create Story
export const createStory = async (req, res) => {
  try {
    console.log('Received payload:', req.body);

    const { category, slides, user } = req.body;

    if (!category || !slides || !Array.isArray(slides) || slides.length === 0 || !user) {
      return res.status(400).json({ error: 'Invalid input data. Ensure all required fields are provided.' });
    }

    for (const item of slides) {
      if (!item.heading || !item.description || !item.url) {
        return res.status(400).json({ error: 'Each slides item must include heading, description, and URL.' });
      }
    }

    const newStory = new Story({
      user,
      category,
      slides,
    });

    const savedStory = await newStory.save();

    res.status(201).json({
      message: 'Story created successfully.',
      story: savedStory,
    });
  } catch (error) {
    console.error('Error creating story:', error);
    res.status(500).json({ message: 'Server error. Please try again later.', error: error.message });
  }
};


// Update Story
export const updateStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const { category, slides } = req.body;

    if (!category || !slides || !Array.isArray(slides) || slides.length === 0) {
      return res.status(400).json({ error: 'Invalid input data. Ensure all required fields are provided.' });
    }

    for (const slide of slides) {
      if (!slide.heading || !slide.description || !slide.url) {
        return res.status(400).json({ error: 'Each slide must include a heading, description, and URL.' });
      }
    }

    const updatedStory = await Story.findByIdAndUpdate(
      storyId,
      { category, slides },
      { new: true, runValidators: true } // Return the updated story and validate the input.
    );

    if (!updatedStory) {
      return res.status(404).json({ error: 'Story not found.' });
    }

    res.status(200).json({
      message: 'Story updated successfully.',
      story: updatedStory,
    });
  } catch (error) {
    console.error('Error updating story:', error);
    res.status(500).json({ message: 'Server error. Please try again later.', error: error.message });
  }
};


// All Stories
export const getAllStories = async (req, res) => {
  try {
    const stories = await Story.find()
      .populate('user', 'username')
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: stories.length,
      data: stories,
    });
  } catch (error) {
    console.error('Error fetching stories:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// User Stories
export const getUserStories = async (req, res) => {
  try {
    
    const userId = req.params.userId || req.user._id; 

    const stories = await Story.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('user', 'username'); 

    res.status(200).json({
      count: stories.length,
      data: stories,
    });
  } catch (error) {
    console.error('Error fetching user stories:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// In your story controller file
export const likeSlide = async (req, res) => {
  const { storyId, slideIndex } = req.body; // Expecting storyId and slideIndex in the request body

  try {
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // Check if the slide index is valid
    if (slideIndex < 0 || slideIndex >= story.media.length) {
      return res.status(400).json({ message: 'Invalid slide index' });
    }

    // Increment the likes for the specified slide
    story.media[slideIndex].likes += 1;
    await story.save();

    res.status(200).json({ message: 'Slide liked successfully', story });
  } catch (error) {
    console.error('Error liking slide:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Get user bookmark stories
export const getUserBookmarkSlides = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate('bookmarks');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({
      count: user.bookmarks.length,
      bookmarks: user.bookmarks,
    });
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const getBookmarkedSlides = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }

        const user = await User.findById(userId).populate({
            path: 'bookmarks',
            select: 'heading description url likes', // Select specific fields
        });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({ 
            message: "Bookmarked slides fetched successfully.",
            bookmarks: user.bookmarks,
        });
    } catch (error) {
        console.error("Error fetching bookmarked slides:", error);
        res.status(500).json({ message: "Server error. Please try again later.", error: error.message });
    }
};
