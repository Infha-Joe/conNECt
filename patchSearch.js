import fs from 'fs';
let content = fs.readFileSync('server/controllers/postController.js', 'utf8');

content = content.replace(
  `export const getFeedPosts = asyncHandler(async (req, res) => {
  const { search } = req.query;
  let query = {};
  if (search) {
    query = {
      $or: [
        { content: { $regex: search, $options: "i" } }
      ]
    };
  }`,
  `import User from "../models/User.js";\n\nexport const getFeedPosts = asyncHandler(async (req, res) => {
  const { search } = req.query;
  let query = {};
  if (search) {
    const matchingUsers = await User.find({ name: { $regex: search, $options: "i" } }).select('_id');
    const userIds = matchingUsers.map(u => u._id);
    query = {
      $or: [
        { content: { $regex: search, $options: "i" } },
        { author: { $in: userIds } }
      ]
    };
  }`
);

fs.writeFileSync('server/controllers/postController.js', content);
console.log("Updated search to include user name");
