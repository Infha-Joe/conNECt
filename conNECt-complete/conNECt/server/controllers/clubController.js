import asyncHandler from "express-async-handler";
import Club from "../models/Club.js";
import ClubMembership from "../models/ClubMembership.js";

const populateCoordinator = "name role profilePhoto department";

export const createClub = asyncHandler(async (req, res) => {
  const { name, description, logoUrl, coordinator } = req.body;
  if (!name || !coordinator) {
    res.status(400);
    throw new Error("Club name and coordinator are required");
  }
  const club = await Club.create({ name, description, logoUrl, coordinator });
  await club.populate("coordinator", populateCoordinator);
  res.status(201).json({ success: true, club });
});

export const getClubs = asyncHandler(async (req, res) => {
  const clubs = await Club.find().sort({ name: 1 }).populate("coordinator", populateCoordinator);
  const clubsWithCounts = await Promise.all(
    clubs.map(async (club) => {
      const memberCount = await ClubMembership.countDocuments({ club: club._id });
      return { ...club.toObject(), memberCount };
    })
  );
  res.status(200).json({ success: true, count: clubs.length, clubs: clubsWithCounts });
});

export const getClub = asyncHandler(async (req, res) => {
  const club = await Club.findById(req.params.id).populate("coordinator", populateCoordinator);
  if (!club) {
    res.status(404);
    throw new Error("Club not found");
  }
  const memberships = await ClubMembership.find({ club: club._id }).populate("user", populateCoordinator);
  res.status(200).json({
    success: true,
    club,
    members: memberships.map((m) => m.user),
    memberCount: memberships.length,
  });
});

export const updateClub = asyncHandler(async (req, res) => {
  const club = await Club.findById(req.params.id);
  if (!club) {
    res.status(404);
    throw new Error("Club not found");
  }
  const isCoordinator = club.coordinator.toString() === req.user._id.toString();
  if (!isCoordinator && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Only the club coordinator or an admin can update this club");
  }
  const { name, description, logoUrl, coordinator } = req.body;
  if (name) club.name = name;
  if (description !== undefined) club.description = description;
  if (logoUrl !== undefined) club.logoUrl = logoUrl;
  if (coordinator && req.user.role === "admin") club.coordinator = coordinator;
  await club.save();
  await club.populate("coordinator", populateCoordinator);
  res.status(200).json({ success: true, club });
});

export const deleteClub = asyncHandler(async (req, res) => {
  const club = await Club.findById(req.params.id);
  if (!club) {
    res.status(404);
    throw new Error("Club not found");
  }
  await Promise.all([Club.findByIdAndDelete(club._id), ClubMembership.deleteMany({ club: club._id })]);
  res.status(200).json({ success: true, message: "Club deleted" });
});

export const joinClub = asyncHandler(async (req, res) => {
  const club = await Club.findById(req.params.id);
  if (!club) {
    res.status(404);
    throw new Error("Club not found");
  }
  try {
    await ClubMembership.create({ club: club._id, user: req.user._id });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400);
      throw new Error("You are already a member of this club");
    }
    throw err;
  }
  res.status(200).json({ success: true, message: "Joined club successfully" });
});

export const leaveClub = asyncHandler(async (req, res) => {
  await ClubMembership.findOneAndDelete({ club: req.params.id, user: req.user._id });
  res.status(200).json({ success: true, message: "Left club successfully" });
});
