import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Comment.css';

export default function Comment({ comment, parentId, comments, setComments }) {
  const { id: roadmapId } = useParams();
  const { user } = useAuth();
  const isAuthor = user && user.email === comment.author;
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);

  const addReply = (parentId, reply) => {
    const addTo = (list) => list.map(c => {
      if (c.id === parentId) {
        return { ...c, children: [...c.children, reply] };
      }
      return { ...c, children: addTo(c.children || []) };
    });
    setComments(addTo(comments));
  };

  const updateComments = (list, id, newText, deleteFlag=false) => {
    return list
      .map(c => {
        if (c.id === id) {
          if (deleteFlag) return null;
          return { ...c, text: newText };
        }
        const updatedChildren = updateComments(c.children || [], id, newText, deleteFlag);
        return { ...c, children: updatedChildren };
      })
      .filter(c => c !== null);
  };

  const handleReplySubmit = async (e) => {
  e.preventDefault();
  if (!replyText.trim()) return;

  const token = localStorage.getItem("token");

  try {
    console.log(comment.roadmap_id);
    await axios.post("http://localhost:5000/api/comments", {
      roadmapId, 
      content: replyText,
      parentCommentId: comment.id,   
    }, {
      headers: { Authorization: token }
    });

    setReplyText('');
    setShowReply(false);

    const commentRes = await axios.get(`http://localhost:5000/api/comments/${comment.roadmap_id}`);
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
    console.log(err.message);
    console.error("Failed to submit reply:", err.response?.data || err.message);
  }
};

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setComments(updateComments(comments, comment.id, editText, false));
    setIsEditing(false);
  };

  const handleDelete = () => {
    setComments(updateComments(comments, comment.id, '', true));
  };

  return (
    <div className="comment" style={{ marginLeft: parentId ? '20px' : '0' }}>
      <div className="comment-content">
        <p><strong>{comment.author}</strong></p>
        {isEditing ? (
          <form onSubmit={handleEditSubmit}>
            <textarea 
              value={editText}
              onChange={e => setEditText(e.target.value)}
              required maxLength={300}
            />
            <button type="submit">Save</button>
            <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
          </form>
        ) : (
          <p>{comment.text}</p>
        )}
      </div>
      <div className="comment-actions">
        <button onClick={() => setShowReply(!showReply)}>Reply</button>
        {isAuthor && <button onClick={() => setIsEditing(true)}>Edit</button>}
        {isAuthor && <button onClick={handleDelete}>Delete</button>}
      </div>
      {showReply && (
        <form className="reply-form" onSubmit={handleReplySubmit}>
          <textarea 
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            placeholder="Your reply..."
            required maxLength={300}
          />
          <button type="submit">Post Reply</button>
        </form>
      )}
      <div className="comment-children">
        {comment.children && comment.children.map(child => (
          <Comment 
            key={child.id}
            comment={child}
            parentId={comment.id}
            comments={comments}
            setComments={setComments}
          />
        ))}
      </div>
    </div>
  );
}