// import Challenge from '../models/Challenge.models.js';
import Student from '../models/Student.models.js';

export const createChallenge = async (req, res) => {
  try {
    const { title, description, assignedTo, deadline, category, points } = req.body;
    const createdBy = req.user._id;

    const student = await Student.findById(createdBy);
    if (!student.studyBuddy || student.studyBuddy.toString() !== assignedTo) {
      return res.status(400).json({ success: false, message: 'You can only challenge your study buddy' });
    }

    if (new Date(deadline) <= new Date()) {
      return res.status(400).json({ success: false, message: 'Deadline must be in the future' });
    }

    const challenge = await Challenge.create({
      title,
      description,
      createdBy,
      assignedTo,
      deadline,
      category,
      points
    });

    res.status(201).json({ success: true, data: challenge });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getChallenges = async (req, res) => {
  try {
    const studentId = req.user._id;
    
    const challenges = await Challenge.find({
      $or: [{ createdBy: studentId }, { assignedTo: studentId }]
    })
    .populate('createdBy', 'fullname usn')
    .populate('assignedTo', 'fullname usn')
    .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: challenges });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getChallengeById = async (req, res) => {
  try {
    const challengeId = req.params.id;
    const studentId = req.user._id;

    const challenge = await Challenge.findById(challengeId)
      .populate('createdBy', 'fullname usn')
      .populate('assignedTo', 'fullname usn');
    
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }

    if (challenge.createdBy._id.toString() !== studentId.toString() && 
        challenge.assignedTo._id.toString() !== studentId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this challenge' });
    }

    res.status(200).json({ success: true, data: challenge });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const completeChallenge = async (req, res) => {
  try {
    const { proofLinks } = req.body;
    const challengeId = req.params.id;
    const studentId = req.user._id;

    const challenge = await Challenge.findById(challengeId);
    
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }

    if (challenge.assignedTo.toString() !== studentId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to complete this challenge' });
    }

    if (challenge.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Challenge is already completed or failed' });
    }

    if (!proofLinks || proofLinks.length === 0) {
      return res.status(400).json({ success: false, message: 'Proof links are required' });
    }

    challenge.status = 'completed';
    challenge.proofLinks = proofLinks;
    challenge.completedAt = new Date();

    await challenge.save();

    res.status(200).json({ success: true, data: challenge });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyChallenge = async (req, res) => {
  try {
    const { feedback } = req.body;
    const challengeId = req.params.id;
    const studentId = req.user._id;

    const challenge = await Challenge.findById(challengeId);
    
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }

    if (challenge.createdBy.toString() !== studentId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to verify this challenge' });
    }

    if (challenge.status !== 'completed') {
      return res.status(400).json({ success: false, message: 'Challenge is not completed yet' });
    }

    // Logic to award points could be implemented here

    challenge.feedback = feedback;
    await challenge.save();

    res.status(200).json({ success: true, data: challenge });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateChallenge = async (req, res) => {
  try {
    const { title, description, deadline } = req.body;
    const challengeId = req.params.id;
    const studentId = req.user._id;

    const challenge = await Challenge.findById(challengeId);
    
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }

    if (challenge.createdBy.toString() !== studentId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this challenge' });
    }

    if (challenge.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Cannot update completed or failed challenge' });
    }

    if (title) challenge.title = title;
    if (description) challenge.description = description;
    if (deadline) {
      if (new Date(deadline) <= new Date()) {
        return res.status(400).json({ success: false, message: 'Deadline must be in the future' });
      }
      challenge.deadline = deadline;
    }

    await challenge.save();

    res.status(200).json({ success: true, data: challenge });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteChallenge = async (req, res) => {
  try {
    const challengeId = req.params.id;
    const studentId = req.user._id;

    const challenge = await Challenge.findById(challengeId);
    
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }

    if (challenge.createdBy.toString() !== studentId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this challenge' });
    }

    await Challenge.findByIdAndDelete(challengeId);

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};