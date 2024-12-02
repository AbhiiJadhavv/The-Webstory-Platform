import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Login from '../auth/Login';
import Register from '../auth/Register';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Filters from '../components/Filters';
import FoodStories from '../components/FoodStories';
import HealthStories from '../components/HealthStories';
import MovieStories from '../components/MovieStories';
import TravelStories from '../components/TravelStories';
import EducationStories from '../components/EducationStories';
import { useUser } from '../UserContext';
import YourStories from '../components/YourStories';
import Story from '../components/Story';
import AddStory from '../components/AddStory';
import axios from "axios";
import "../styles/HomePage.css";
import NavbarMobile from '../components/NavbarMobile';

const HomePage = () => {
    const { user, setUser } = useUser();
    const [showRegister, setShowRegister] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showStory, setShowStory] = useState(false);
    const [addStory, setAddStory] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [stories, setStories] = useState([]);
    const [selectedStory, setSelectedStory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 780);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                setLoading(true);
                const response = await axios.get("http://localhost:8000/api/v1/story/stories");
                console.log("API Response:", response.data);
                setStories(response.data.data);
            } catch (error) {
                console.error("Error fetching stories:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStories();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth <= 780);
        };
        window.addEventListener('resize', handleResize);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div>
            {isMobileView ? (
                <NavbarMobile setShowRegister={setShowRegister} setShowLogin={setShowLogin} setAddStory={setAddStory} />
            ) : (
                <Navbar setShowRegister={setShowRegister} setShowLogin={setShowLogin} setAddStory={setAddStory} />
            )}
            <Filters selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} />
            {loading && (
                <div className="loading">
                    <div className="dott"></div>
                    <span className="textt">
                        Loading Stories....
                    </span>
                </div>
            )}
            <>
                {selectedFilter === 'All' && (
                    <>
                        {user && (<YourStories user={user} setShowStory={setShowStory} setSelectedStory={setSelectedStory} />)}
                        <FoodStories setShowStory={setShowStory} stories={stories} setSelectedStory={setSelectedStory} />
                        <HealthStories setShowStory={setShowStory} stories={stories} setSelectedStory={setSelectedStory} />
                        <TravelStories setShowStory={setShowStory} stories={stories} setSelectedStory={setSelectedStory} />
                        <MovieStories setShowStory={setShowStory} stories={stories} setSelectedStory={setSelectedStory} />
                        <EducationStories setShowStory={setShowStory} stories={stories} setSelectedStory={setSelectedStory} />
                    </>
                )}
                {selectedFilter === 'Food' && <FoodStories setShowStory={setShowStory} stories={stories} setSelectedStory={setSelectedStory} />}
                {selectedFilter === 'Health' && <HealthStories setShowStory={setShowStory} stories={stories} setSelectedStory={setSelectedStory} />}
                {selectedFilter === 'Movies' && <MovieStories setShowStory={setShowStory} stories={stories} setSelectedStory={setSelectedStory} />}
                {selectedFilter === 'Travel' && <TravelStories setShowStory={setShowStory} stories={stories} setSelectedStory={setSelectedStory} />}
                {selectedFilter === 'Education' && <EducationStories setShowStory={setShowStory} stories={stories} setSelectedStory={setSelectedStory} />}
            </>
            {showStory && selectedStory && (
                <Story
                    setShowStory={setShowStory}
                    setShowLogin={setShowLogin}
                    selectedStory={selectedStory}
                    user={user}
                    images={selectedStory.media.map(media => ({
                        src: media.url,
                        alt: media.heading,
                        description: media.description,
                    }))}
                />
            )}
            {addStory && (
                <AddStory setAddStory={setAddStory}  isMobileView={isMobileView} />
            )}
            {showRegister && (
                <Register setShowRegister={setShowRegister} />
            )}
            {showLogin && (
                <Login setShowLogin={setShowLogin} setUser={setUser} />
            )}
            <ToastContainer position="top-right" />
        </div>
    )
}

export default HomePage;