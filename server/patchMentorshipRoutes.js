import fs from 'fs';

let code = fs.readFileSync('server/routes/mentorshipRoutes.js', 'utf8');
if(!code.includes("getMyClasses")) {
    code = code.replace(/import \{([\s\S]*?)createClass,/m, 'import {$1getMyClasses,\n  createClass,');
    code = code.replace(/router\.get\("\/:id\/classes", getClasses\);/, 'router.get("/user/classes", getMyClasses);\nrouter.get("/:id/classes", getClasses);');
    fs.writeFileSync('server/routes/mentorshipRoutes.js', code);
    console.log("Routes patched.");
}

let controllerCode = fs.readFileSync('server/controllers/mentorshipController.js', 'utf8');
if(!controllerCode.includes("getMyClasses")) {
    controllerCode += `
// @desc    Get all classes for current user
// @route   GET /api/mentorship/user/classes
// @access  Private
export const getMyClasses = asyncHandler(async (req, res) => {
  const query = {
    $or: [
      { mentor: req.user._id },
      { mentee: req.user._id },
      { groupMembers: req.user._id }
    ]
  };
  const mentorships = await Mentorship.find(query).select('_id');
  const mentorshipIds = mentorships.map(m => m._id);

  const classes = await MentorshipClass.find({ mentorship: { $in: mentorshipIds } })
    .populate("mentor", "name profilePhoto")
    .populate("mentorship", "title")
    .sort("scheduledAt");

  res.json(classes);
});
`;
    fs.writeFileSync('server/controllers/mentorshipController.js', controllerCode);
    console.log("Controller patched.");
}
