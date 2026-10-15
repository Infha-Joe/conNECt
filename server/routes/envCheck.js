import express from 'express';
const router = express.Router();
router.get('/env-check', (req, res) => {
    res.json({
        EMAIL_HOST: process.env.EMAIL_HOST,
        NODE_ENV: process.env.NODE_ENV,
        NODE_ENV_RAW: JSON.stringify(process.env.NODE_ENV),
    });
});
export default router;
