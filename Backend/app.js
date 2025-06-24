const cors = require('cors');
const express = require('express');
const userRoutes = require('./route/user');
const roadmapRoutes = require('./route/roadmap'); 
const roadmapcomments = require('./route/comment');

const app = express();
const PORT =5000;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});


app.get('/', (req, res) => {
    res.send("server is running!");
});


app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true             
}));

app.use('/user', userRoutes);
app.use('/api', roadmapRoutes);
app.use('/api/comments', roadmapcomments);


