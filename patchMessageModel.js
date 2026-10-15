import fs from 'fs';
let content = fs.readFileSync('server/models/Message.js', 'utf8');

// Allow text to be optional if sharing a post
content = content.replace(
  '    text: {\n      type: String,\n      required: true,\n      trim: true,\n      maxlength: 2000,\n    },',
  `    text: {\n      type: String,\n      required: false,\n      trim: true,\n      maxlength: 2000,\n    },\n    sharedPost: {\n      type: mongoose.Schema.Types.ObjectId,\n      ref: "Post",\n    },`
);

fs.writeFileSync('server/models/Message.js', content);
console.log("Patched Message.js to support sharedPost");
