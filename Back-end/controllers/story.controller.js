import { User } from '../models/user.model.js';
import { Story } from '../models/story.model.js';


// New Story
export const createStory = async (req, res) => {
  try {
    console.log('Received payload:', req.body); // Debugging line

    // Ensure that req.user is populated correctly by the authentication middleware
    const userId = req.user ? req.user._id : null;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized. User not authenticated.' });
    }

    const { category, heading, description, media } = req.body; 

    // Create new story object
    const newStory = new Story({
      user: userId,
      category,
      heading,
      description,
      media, // Ensure media is a string or array depending on the model setup
    });

    // Save the story to the database
    await newStory.save();

    res.status(201).json({
      message: 'Story created successfully.',
      story: newStory,
    });
  } catch (error) {
    console.error('Error creating story:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
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
// User Stories
export const getUserStories = async (req, res) => {
  try {
    // Get userId from request parameters, or use the authenticated user's ID
    const userId = req.params.userId || req.user._id; // Use req.params.userId if provided, otherwise use req.user._id

    // Fetch stories for the specified user ID
    const stories = await Story.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('user', 'username'); // Populate user to get username if needed

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



// Toggle bookmark
export const toggleBookmark = async (req, res) => {
  try {
    const { storyId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isBookmarked = user.bookmarks.includes(storyId);

    if (isBookmarked) {
      user.bookmarks = user.bookmarks.filter(id => id.toString() !== storyId);
    } else {
      user.bookmarks.push(storyId);
    }

    await user.save();

    const updatedUser = await User.findById(userId).populate('bookmarks');

    res.status(200).json({
      message: isBookmarked ? 'Bookmark removed.' : 'Story bookmarked.',
      bookmarks: updatedUser.bookmarks,
    });
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user bookmark stories
export const getUserBookmarkStories = async (req, res) => {
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