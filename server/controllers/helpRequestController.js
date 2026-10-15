import asyncHandler from 'express-async-handler';
import HelpRequest from '../models/HelpRequest.js';
import Notification from '../models/Notification.js';

export const createHelpRequest = asyncHandler(async (req, res) => {
  const { title, description, category, tags, urgency, requiredSkills } = req.body;
  const helpRequest = await HelpRequest.create({
    requester: req.user._id,
    title, description, category, tags, urgency, requiredSkills
  });
  await helpRequest.populate('requester', 'name profilePhoto role');
  res.status(201).json({ success: true, helpRequest });
});

export const getHelpRequests = asyncHandler(async (req, res) => {
  const { category, status, urgency, tag } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (status) filter.status = status;
  if (urgency) filter.urgency = urgency;
  if (tag) filter.tags = tag;
  const helpRequests = await HelpRequest.find(filter)
    .populate('requester', 'name profilePhoto role department')
    .populate('acceptedHelper', 'name profilePhoto')
    .sort('-createdAt');
  res.status(200).json({ success: true, count: helpRequests.length, helpRequests });
});

export const getMyHelpRequests = asyncHandler(async (req, res) => {
  const helpRequests = await HelpRequest.find({ requester: req.user._id })
    .populate('acceptedHelper', 'name profilePhoto')
    .sort('-createdAt');
  res.status(200).json({ success: true, helpRequests });
});

export const getMyContributions = asyncHandler(async (req, res) => {
  const helpRequests = await HelpRequest.find({ 
    $or: [
      { acceptedHelper: req.user._id },
      { 'offers.helper': req.user._id }
    ]
  }).populate('requester', 'name profilePhoto');

  const offers = helpRequests.map(hr => {
    const userOffer = hr.offers.find(o => o.helper.toString() === req.user._id.toString());
    const status = (hr.acceptedHelper && hr.acceptedHelper.toString() === req.user._id.toString()) 
      ? 'accepted' 
      : (userOffer ? userOffer.status : 'pending');

    return {
      _id: userOffer ? userOffer._id : hr._id,
      status: status,
      helpRequest: hr
    };
  });

  res.status(200).json({ success: true, helpRequests: offers });
});

export const offerHelp = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;
  const helpRequest = await HelpRequest.findById(id);
  if (!helpRequest) { res.status(404); throw new Error('Help request not found'); }
  if (helpRequest.requester.toString() === req.user._id.toString()) {
    res.status(400); throw new Error('Cannot offer help to your own request');
  }
  const alreadyOffered = helpRequest.offers.find(offer => offer.helper.toString() === req.user._id.toString());
  if (alreadyOffered) { res.status(400); throw new Error('You already offered help'); }
  helpRequest.offers.push({ helper: req.user._id, message });
  await helpRequest.save();
  await Notification.create({
    user: helpRequest.requester, type: 'help_request', title: 'New Help Offer',
    message: `${req.user.name} offered to help with "${helpRequest.title}"`, relatedId: helpRequest._id,
  });
  const updatedRequest = await HelpRequest.findById(id).populate('offers.helper', 'name profilePhoto');
  res.status(200).json({ success: true, helpRequest: updatedRequest });
});

export const acceptOffer = asyncHandler(async (req, res) => {
  const { offerId } = req.params;
  const { helperId } = req.body;
  const helpRequest = await HelpRequest.findOne({ 'offers._id': offerId });
  if (!helpRequest) { res.status(404); throw new Error('Offer not found'); }
  if (helpRequest.requester.toString() !== req.user._id.toString()) {
    res.status(403); throw new Error('Only the requester can accept offers');
  }
  helpRequest.status = 'in_progress';
  helpRequest.acceptedHelper = helperId;
  const offer = helpRequest.offers.id(offerId);
  if (offer) { offer.status = 'accepted'; }
  await helpRequest.save();
  await Notification.create({
    user: helperId, type: 'help_request', title: 'Help Offer Accepted',
    message: `${req.user.name} accepted your offer to help with "${helpRequest.title}"`, relatedId: helpRequest._id,
  });
  const updatedRequest = await HelpRequest.findById(helpRequest._id).populate('acceptedHelper', 'name profilePhoto');
  res.status(200).json({ success: true, helpRequest: updatedRequest });
});

export const markHelpCompleted = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const helpRequest = await HelpRequest.findById(id);
  if (!helpRequest) { res.status(404); throw new Error('Help request not found'); }
  if (helpRequest.acceptedHelper.toString() !== req.user._id.toString()) {
    res.status(403); throw new Error('Only the accepted helper can mark as completed');
  }
  helpRequest.status = 'pending_confirmation';
  await helpRequest.save();
  await Notification.create({
    user: helpRequest.requester, type: 'help_request', title: 'Help Completed?',
    message: `${req.user.name} marked their help as completed. Please confirm.`, relatedId: helpRequest._id,
  });
  res.status(200).json({ success: true, helpRequest });
});

export const confirmCompletion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { success } = req.body;
  const helpRequest = await HelpRequest.findById(id);
  if (!helpRequest) { res.status(404); throw new Error('Help request not found'); }
  if (helpRequest.requester.toString() !== req.user._id.toString()) {
    res.status(403); throw new Error('Only the requester can confirm completion');
  }
  if (helpRequest.status !== 'pending_confirmation') {
    res.status(400); throw new Error('Request is not pending confirmation');
  }
  
  if (success) {
    helpRequest.status = 'completed';
    helpRequest.completionConfirmed = true;
    
    await Notification.create({
      user: helpRequest.acceptedHelper, type: 'help_request', title: 'Help Confirmed',
      message: `${req.user.name} confirmed your help was successful!`, relatedId: helpRequest._id,
    });
    
    await helpRequest.save();
    
    const completedCount = await HelpRequest.countDocuments({
      acceptedHelper: helpRequest.acceptedHelper,
      status: 'completed',
      completionConfirmed: true
    });
    
    
  } else {
    helpRequest.status = 'in_progress';
    await Notification.create({
      user: helpRequest.acceptedHelper, type: 'help_request', title: 'Help Not Confirmed',
      message: `${req.user.name} indicated the issue is not resolved yet.`, relatedId: helpRequest._id,
    });
    await helpRequest.save();
  }
  
  const updatedRequest = await HelpRequest.findById(id).populate('acceptedHelper', 'name profilePhoto');
  res.status(200).json({ success: true, helpRequest: updatedRequest });
});
