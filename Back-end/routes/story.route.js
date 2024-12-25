import express from 'express';
import isAuthenticated from '../auth/isAuthenticated.js';
import { createStory, getAllStories, getUserStories, getUserBookmarkStories, likeSlide, updateStory, toggleBookmark } from '../controllers/story.controller.js';

const router = express.Router();

// Get all stories
router.get('/stories', getAllStories); 

// Create a new story
router.post('/stories', isAuthenticated, createStory);

// Get stories of the authenticated user
router.get('/stories/user/:userId',  getUserStories);

// Update story route
router.put('/stories/:storyId', isAuthenticated, updateStory);

// Toggle bookmark route
router.put("/bookmarks", isAuthenticated, toggleBookmark);

// Get bookmarked stories of the authenticated user
router.get('/stories/bookmarked', isAuthenticated, getUserBookmarkStories); 

// Add a route for this function
router.post('/like-slide', likeSlide);

export default router;