import asyncHandler from "express-async-handler";
import Event from "../models/Event.js";
import EventRegistration from "../models/EventRegistration.js";
import Notification from "../models/Notification.js";
import Club from "../models/Club.js";
import { emitToUser } from "../services/socket.service.js";

const populateOrganizer = "name role profilePhoto";

export const createEvent = asyncHandler(async (req, res) => {
  const { title, description, venue, eventDate, startTime, endTime, registrationDeadline, capacity, club, department, imageUrl } = req.body;

  if (!title || !eventDate) {
    res.status(400);
    throw new Error("Event title and date are required");
  }

  if (req.user.role === "student") {
    if (!club) {
      res.status(403);
      throw new Error("Students can only create events on behalf of a club they coordinate");
    }
    const clubDoc = await Club.findById(club);
    if (!clubDoc || clubDoc.coordinator.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("You must be the coordinator of this club to create its events");
    }
  }

  const event = await Event.create({
    organizer: req.user._id, club: club || null, department: department || null,
    title, description, venue, eventDate, startTime, endTime, registrationDeadline,
    capacity: capacity || 0, imageUrl,
  });

  await event.populate("organizer", populateOrganizer);
  res.status(201).json({ success: true, event });
});

export const getEvents = asyncHandler(async (req, res) => {
  const { from, to, search, club, department } = req.query;
  const filter = {};
  if (from || to) {
    filter.eventDate = {};
    if (from) filter.eventDate.$gte = new Date(from);
    if (to) filter.eventDate.$lte = new Date(to);
  }
  if (search) filter.title = { $regex: search, $options: "i" };
  if (club) filter.club = club;
  if (department) filter.department = department;

  const events = await Event.find(filter)
    .sort({ eventDate: 1 })
    .populate("organizer", populateOrganizer)
    .populate("club", "name logoUrl")
    .populate("department", "name code themeColor");

  res.status(200).json({ success: true, count: events.length, events });
});

export const getEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id)
    .populate("organizer", populateOrganizer)
    .populate("club", "name logoUrl")
    .populate("department", "name code themeColor");

  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  const registrationCount = await EventRegistration.countDocuments({ event: event._id });
  const myRegistration = await EventRegistration.findOne({ event: event._id, user: req.user._id });

  res.status(200).json({
    success: true, event, registrationCount,
    isRegistered: Boolean(myRegistration),
    myAttendanceStatus: myRegistration?.attendanceStatus || null,
  });
});

export const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }
  if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Only the organizer or an admin can update this event");
  }
  const editable = ["title", "description", "venue", "eventDate", "startTime", "endTime", "registrationDeadline", "capacity", "status", "imageUrl"];
  editable.forEach((field) => {
    if (req.body[field] !== undefined) event[field] = req.body[field];
  });
  await event.save();
  await event.populate("organizer", populateOrganizer);
  res.status(200).json({ success: true, event });
});

export const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }
  if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Only the organizer or an admin can delete this event");
  }
  await Promise.all([Event.findByIdAndDelete(event._id), EventRegistration.deleteMany({ event: event._id })]);
  res.status(200).json({ success: true, message: "Event deleted" });
});

export const registerForEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }
  if (event.registrationDeadline && new Date() > new Date(event.registrationDeadline)) {
    res.status(400);
    throw new Error("Registration deadline has passed");
  }
  if (event.capacity > 0) {
    const currentCount = await EventRegistration.countDocuments({ event: event._id });
    if (currentCount >= event.capacity) {
      res.status(400);
      throw new Error("Event has reached capacity");
    }
  }
  try {
    await EventRegistration.create({ event: event._id, user: req.user._id });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400);
      throw new Error("You are already registered for this event");
    }
    throw err;
  }

  const notification = await Notification.create({
    user: event.organizer,
    type: "event",
    title: "New event registration",
    message: `${req.user.name} registered for ${event.title}`,
    relatedId: event._id,
  });
  emitToUser(event.organizer.toString(), "notification:new", notification);

  res.status(200).json({ success: true, message: "Registered successfully" });
});

export const cancelRegistration = asyncHandler(async (req, res) => {
  await EventRegistration.findOneAndDelete({ event: req.params.id, user: req.user._id });
  res.status(200).json({ success: true, message: "Registration cancelled" });
});

export const getParticipants = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }
  if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Only the organizer or an admin can view participants");
  }
  const registrations = await EventRegistration.find({ event: event._id }).populate("user", populateOrganizer);
  res.status(200).json({ success: true, count: registrations.length, registrations });
});
