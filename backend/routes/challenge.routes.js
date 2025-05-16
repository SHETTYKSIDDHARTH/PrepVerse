import express from 'express';
import {
  createChallenge,
  getChallenges,
  getChallengeById,
  completeChallenge,
  verifyChallenge,
  updateChallenge,
  deleteChallenge
} from '../controllers/Challenges.controllers.js';
import studentAuth from '../middlewares/studentAuth.js';

const challengeRouter = express.Router();

// Base routes
challengeRouter.route('/')
  .post(studentAuth, createChallenge)
  .get(studentAuth, getChallenges);

// Get challenge by ID
challengeRouter.route('/:id')
  .get(studentAuth, getChallengeById)
  .put(studentAuth, updateChallenge)
  .delete(studentAuth, deleteChallenge);

// Challenge action routes
challengeRouter.route('/:id/complete')
  .put(studentAuth, completeChallenge);

challengeRouter.route('/:id/verify')
  .put(studentAuth, verifyChallenge);

export default challengeRouter;