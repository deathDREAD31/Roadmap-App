import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import RoadmapItem from "../components/RoadmapItem";
import "./Roadmap.css";
import { useEffect } from "react";

export default function Roadmap() {
  const [items, setItems] = useState([]);
  const [filterCat, setFilterCat] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortByVotes, setSortByVotes] = useState(true);

  const token = localStorage.getItem("token");


  useEffect(() => {
  const fetchRoadMaps = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/roadmaps", {
        headers: {
          Authorization: token
        }
      });
      setItems(res.data);
      console.log(res.data);
    } catch (err) {
      console.error("Failed to fetch roadmaps:", err.response?.data || err.message);
    }
  };
  fetchRoadMaps();
}, []);

  const filtered = items.filter(
    (item) =>
      (filterCat === "All" || item.type === filterCat) &&
      (filterStatus === "All" || item.status === filterStatus)
  );

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const sorted = [...filtered].sort((a, b) =>
    sortByVotes ? b.vote - a.vote : a.id - b.id
  );

  return (
    <div className="roadmap-page">
      <h2>Roadmap</h2>
      <div className="filters">
        <label>
          Category:
          <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
            <option>All</option>
            <option>FEATURE</option>
            <option>GOAL</option>
            <option>MILESTONE</option>
          </select>
        </label>
        <label>
          Status:
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option>All</option>
            <option>Interested</option>
            <option>In Progress</option>
            <option>completed</option>
          </select>
        </label>
        <button className="sort-by-votes" onClick={() => setSortByVotes(!sortByVotes)}>
          Sort by Votes: {sortByVotes ? 'ON' : 'OFF'}
        </button>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="item-list">
        {sorted.map((item) => (
          <RoadmapItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
