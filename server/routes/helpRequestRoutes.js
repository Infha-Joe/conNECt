import express from 'express';
import {
  createHelpRequest,
  getHelpRequests,
  getMyHelpRequests,
  getMyContributions,
  offerHelp,
  acceptOffer,
  markHelpCompleted,
  confirmCompletion
} from '../controllers/helpRequestController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, restrictTo("student", "teacher", "admin"));

router.route('/')
  .get(getHelpRequests)
  .post(createHelpRequest);

router.get('/me', getMyHelpRequests);
router.get('/contributions', getMyContributions);

router.post('/:id/offer', offerHelp);
router.put('/offer/:offerId/accept', acceptOffer);
router.put('/:id/complete', markHelpCompleted);
router.put('/:id/confirm', confirmCompletion);

export default router;

