import React, { useState } from 'react'
import "../styles/Story.css";
import prevArrow from "../assets/prevArrow.png";
import nextArrow from "../assets/nextArrow.png";
import shareIcon from "../assets/shareIcon.png";
import closeIcon2 from "../assets/closeIcon2.png";
import likeActiveImg from "../assets/likeActiveImg.png";
import likeImg from "../assets/likeImg.png";
import bookmarkActiveImg from "../assets/bookmarkActiveImg.png";
import bookmarksImg from "../assets/bookmarksImg.png";
import downloadDoneImg from "../assets/downloadDoneImg.png";
import downloadImg from "../assets/downloadImg.png";
import axios from 'axios';
import { USER_API_END_POINT } from '../utils/constant';

const Story = ({ setShowStory, images, setShowLogin, user, selectedStory }) => {
  const [slideIndex, setSlideIndex] = useState(1);
  const [likedSlides, setLikedSlides] = useState(Array(images.length).fill(false));
  const [likeCounts, setLikeCounts] = useState(Array(images.length).fill(0));
  const [bookmarkedSlides, setBookmarkedSlides] = useState(Array(images.length).fill(false));
  const [downloadedSlides, setDownloadedSlides] = useState(Array(images.length).fill(false));
  const [showDownloadMessage, setShowDownloadMessage] = useState(Array(images.length).fill(false));
  const [showShareMessage, setShowShareMessage] = useState(Array(images.length).fill(false));

  const showSlides = (n) => {
    let newIndex = n > images.length ? 1 : n < 1 ? images.length : n;
    setSlideIndex(newIndex);
  };

  const plusSlides = (n) => {
    showSlides(slideIndex + n);
  };

  const currentSlide = (n) => {
    setSlideIndex(n);
  };

  const toggleLike = (index) => {
    if (!user) {
      setShowLogin(true);  // Show login if user is not logged in
      return;
    }
    setLikedSlides(prev => {
      const newLikedSlides = [...prev];
      const newCount = newLikedSlides[index] ? likeCounts[index] - 1 : likeCounts[index] + 1;
      newLikedSlides[index] = !newLikedSlides[index];
      setLikeCounts(prevCounts => {
        const newCounts = [...prevCounts];
        newCounts[index] = newCount;
        return newCounts;
      });
      return newLikedSlides;
    });
  };

  const toggleBookmark = async (index) => {
    if (!user) {
      setShowLogin(true); // Show login if the user is not logged in
      return;
    }

    const slideId = selectedStory.slides[index]._id;

    try {
      const response = await axios.put(
        `${USER_API_END_POINT}/bookmarks`,
        { slideId },
        {
          headers: {
            Authorization: `Bearer ${user.token}`, // Include user's token for authentication
          },
        }
      );

      // Update local state based on API response
      setBookmarkedSlides((prev) => {
        const newBookmarkedSlides = [...prev];
        newBookmarkedSlides[index] = !newBookmarkedSlides[index];
        return newBookmarkedSlides;
      });

      console.log(response.data.message);
    } catch (error) {
      console.error("Error toggling bookmark:", error.response?.data?.message || error.message);
    }
  };

  const handleDownload = (index) => {
    if (!user) {
      setShowLogin(true);  // Show login if user is not logged in
      return;
    }
    // Fetch the image as a blob
    fetch(images[index].src)
      .then(response => response.blob())
      .then(blob => {
        // Create a local URL for the image blob
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `slide-${index + 1}.jpg`; // Specify the download file name

        // Programmatically click the link to trigger the download
        document.body.appendChild(link);
        link.click();

        // Clean up the URL and remove the link element
        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url); // Release the blob URL after download
        }, 100);

        // Update the downloaded state
        setDownloadedSlides(prev => {
          const newDownloadedSlides = [...prev];
          if (!newDownloadedSlides[index]) {
            newDownloadedSlides[index] = true; // Change image only once
          }
          return newDownloadedSlides;
        });

        // Show the "Downloaded successfully" message
        setShowDownloadMessage(prev => {
          const newMessages = [...prev];
          newMessages[index] = true;
          return newMessages;
        });

        // Hide the message after 1 second
        setTimeout(() => {
          setShowDownloadMessage(prev => {
            const newMessages = [...prev];
            newMessages[index] = false;
            return newMessages;
          });
        }, 1000);
      })
      .catch(err => {
        console.error("Download failed", err);
      });
  };

  const handleShare = (index) => {
    const shareableLink = `${window.location.origin}/stories/${selectedStory._id}`;
    navigator.clipboard
      .writeText(shareableLink)
      .then(() => {
        console.log("Link copied to clipboard");
      })
      .catch(() => {
        console.log("Failed to copy link");
      });
    setShowShareMessage(prev => {
      const newMessages = [...prev];
      newMessages[index] = true; // Show message on each click
      return newMessages;
    });
    setTimeout(() => {
      setShowShareMessage(prev => {
        const newMessages = [...prev];
        newMessages[index] = false; // Hide message after 1 second
        return newMessages;
      });
    }, 1000);
  };

  return (
    <div className="storyCon">
      <a className="prev" onClick={() => plusSlides(-1)}><img src={prevArrow} alt="previous" /></a>

      {images.map((image, index) => (
        <div className={`story fade ${index + 1 === slideIndex ? 'active' : ''}`}
          key={index}
          style={{
            backgroundImage: `url(${image.src})`,
            backgroundPosition: 'center',
            backgroundSize: 'contain',
            display: index + 1 === slideIndex ? 'flex' : 'none'
          }}
        >
          {showShareMessage[index] && <div className="shareMessageCon"><p>Link copied to clipboard</p></div>}
          <div className='storyTopCon'>
            <div className='dotCon'>
              {images.map((_, index) => (
                <span
                  className={`dot ${index + 1 === slideIndex ? 'active' : ''}`}
                  key={index}
                  onClick={() => currentSlide(index + 1)}
                ></span>
              ))}
            </div>
            <div className='storyTopBtnCon'>
              <button onClick={() => setShowStory(false)}><img src={closeIcon2} alt="share" /></button>
              <button onClick={() => handleShare(index)}><img src={shareIcon} alt="share" /></button>
            </div>
          </div>
          <div className='storyBottomCon'>
            <div className='storyTextCon'>
              <p className='storyHeading'>{image.alt}</p>
              <p className='storyDescription'>{image.description}</p>
            </div>
            {showDownloadMessage[index] && <div className="downloadMessageCon"><p>Downloaded successfully</p></div>}
            <div className='storyBottomBtnCon'>
              <button onClick={() => toggleBookmark(index)}>
                <img src={bookmarkedSlides[index] ? bookmarkActiveImg : bookmarksImg} alt="bookmark" />
              </button>
              <button onClick={() => handleDownload(index)}>
                <img src={downloadedSlides[index] ? downloadDoneImg : downloadImg} alt="download" />
              </button>
              <div>
                <button onClick={() => toggleLike(index)}>
                  <img src={likedSlides[index] ? likeActiveImg : likeImg} alt="like" />
                </button>
                <span className='likeCount'>{likeCounts[index]}</span>
              </div>
            </div>
          </div>
        </div>
      ))}

      <a className="next" onClick={() => plusSlides(1)}><img src={nextArrow} alt="next" /></a>
    </div>
  );
};

export default Story;