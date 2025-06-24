import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './RoadmapItem.css';

export default function RoadmapItem({ item }) {
  const [votes, setVotes] = useState(item.vote);
  const [upvoted, setUpvoted] = useState(item.hasUpvoted);

  const handleUpvote = async () => {
  if (upvoted) return;

  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      'http://localhost:5000/api/roadmaps/upvote',
      { roadMapId: item.id },
      {
        headers: {
          Authorization: token, 
        },
      }
    );

    console.log(response.data.message); 
    setVotes(votes + 1);
    setUpvoted(true);
  } catch (error) {
    if (error.response) {
      alert(error.response.data.error);
    } else {
      alert('Something went wrong');
    }
  }
};

  return (
    <div className="roadmap-item">
      <div className="item-header">
        <h3>{item.title}</h3>
        <span className={`status ${item.status.replace(' ', '').toLowerCase()}`}>
          {item.status}
        </span>
      </div>
      <p>{item.description}</p>
      <div className="item-footer">
        <button onClick={handleUpvote} disabled={upvoted}>
          Upvote ({votes})
        </button>
        <Link to={`/roadmap/${item.id}`} className="details-link">
          View Details
        </Link>
      </div>
    </div>
  );
}