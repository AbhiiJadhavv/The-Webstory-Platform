import React from 'react'
import "../styles/Filters.css";

const Filters = ({ selectedFilter, setSelectedFilter }) => {
    const handleFilterClick = (filter) => {
        setSelectedFilter(filter);
    };

    return (
        <div className='filtersCon'>
            <div className='filters'>
                <div className={`all filter ${selectedFilter === 'All' ? 'active' : ''}`} onClick={() => handleFilterClick('All')}>
                    <p>All</p>
                </div>
                <div className={`food filter ${selectedFilter === 'Food' ? 'active' : ''}`} onClick={() => handleFilterClick('Food')}>
                    <p>Food</p>
                </div>
                <div className={`health filter ${selectedFilter === 'Health' ? 'active' : ''}`} onClick={() => handleFilterClick('Health')}>
                    <p>Health</p><p>and</p><p>Fitness</p>
                </div>
                <div className={`travel filter ${selectedFilter === 'Travel' ? 'active' : ''}`} onClick={() => handleFilterClick('Travel')}>
                    <p>Travel</p>
                </div>
                <div className={`movies filter ${selectedFilter === 'Movies' ? 'active' : ''}`} onClick={() => handleFilterClick('Movies')}>
                    <p>Movies</p>
                </div>
                <div className={`education filter ${selectedFilter === 'Education' ? 'active' : ''}`} onClick={() => handleFilterClick('Education')}>
                    <p>Education</p>
                </div>
            </div>
        </div>
    )
}

export default Filters;