import { useState,useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Comment from "../components/Comment";
import axios from 'axios';
import "./RoadmapDetail.css";

export default function RoadmapDetail() {
  const { id } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
  const fetchRoadmapAndComments = async () => {
    try {
      const token = localStorage.getItem("token"); 

      const res = await axios.get(`http://localhost:5000/api/roadmaps/${id}`, {
        headers: { Authorization: token },
      });
      setRoadmap(res.data);

      const commentRes = await axios.get(`http://localhost:5000/api/comments/${id}`,{
        headers: { Authorization: token },
      });
      const flatComments = commentRes.data;

      const buildTree = (flat) => {
        const map = {};
        const roots = [];

        flat.forEach(c => {
          map[c.id] = { ...c, text: c.content, children: [] };
        });

        flat.forEach(c => {
          if (c.parent_comment_id) {
            map[c.parent_comment_id]?.children.push(map[c.id]);
          } else {
            roots.push(map[c.id]);
          }
        });

        return roots;
      };

      setComments(buildTree(flatComments));
    } catch (err) {
      console.error("Failed to fetch data:", err);
      navigate("/notFound");
    } finally {
      setLoading(false);
    }
  };

  fetchRoadmapAndComments();
}, [id]);

  const handleAddComment = async (e) => {
  e.preventDefault();
  if (!newComment.trim()) return;

  try {
    const token = localStorage.getItem("token");

    await axios.post("http://localhost:5000/api/comments", {
      roadmapId: id,
      content: newComment,
      parentCommentId: null,
    }, {
      headers: { Authorization: token }
    });

    setNewComment('');
    const commentRes = await axios.get(`http://localhost:5000/api/comments/${id}`);
    const flatComments = commentRes.data;

    const buildTree = (flat) => {
      const map = {};
      const roots = [];

      flat.forEach(c => {
        map[c.id] = { ...c, text: c.content, children: [] };
      });

      flat.forEach(c => {
        if (c.parent_comment_id) {
          map[c.parent_comment_id]?.children.push(map[c.id]);
        } else {
          roots.push(map[c.id]);
        }
      });

      return roots;
    };

    setComments(buildTree(flatComments));

  } catch (err) {
    console.error("Failed to post comment:", err.response?.data || err.message);
  }
};

  return (
  <div className="roadmap-detail-page">
    <h2>Roadmap Item #{id}</h2>

    {loading ? (
      <p>Loading...</p>
    ) : roadmap ? (
      <div className="roadmap-info">
        <h3>{roadmap.title}</h3>
        <p>{roadmap.description}</p>
        <p><strong>Status:</strong> {roadmap.status}</p>
        <p><strong>Votes:</strong> {roadmap.vote}</p>
      </div>
    ) : (
      <p>Roadmap not found.</p>
    )}

    <div className="comments-section">
      <h3>Comments</h3>
      {comments.map(c => (
        <Comment key={c.id} comment={c} parentId={null} comments={comments} setComments={setComments} />
      ))}
      <form className="add-comment-form" onClick={handleAddComment}>
        <textarea
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          maxLength={300}
          required
        />
        <button type="submit">Post Comment</button>
      </form>
    </div>
  </div>
);

}
