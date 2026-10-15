import express from 'express';
const app = express();
app.get('/test', (req, res) => res.json({ url: process.env.CLIENT_URL }));
app.listen(5006, () => console.log('Listening 5006'));
