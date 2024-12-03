import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { createStory, getAllStories, getUserStories, toggleBookmark, getUserBookmarkStories, likeSlide } from '../controllers/story.controller.js';

const router = express.Router();

// Get all stories
router.get('/stories', getAllStories); 

// Create a new story
router.post('/stories', isAuthenticated, createStory);

// Get stories of the authenticated user
router.get('/stories/user/:userId',  getUserStories);


// Get bookmarked stories of the authenticated user
router.get('/stories/bookmarked', isAuthenticated, getUserBookmarkStories); 

// Add a route for this function
router.post('/like-slide', likeSlide);

export default router;