import mongoose from 'mongoose';
import MentorshipClass from './models/MentorshipClass.js';

async function test() {
  await mongoose.connect('mongodb://127.0.0.1:27017/connect');

  try {
    const classData = {
      mentorship: new mongoose.Types.ObjectId(),
      mentor: new mongoose.Types.ObjectId(),
      title: 'class1',
      description: 'class1',
      scheduledAt: new Date(),
      durationMinutes: 30,
    };
    
    // Case 1
    const meetingLink = '';
    if (meetingLink && meetingLink.trim() !== '') {
      classData.meetingLink = meetingLink;
    }
    const doc = new MentorshipClass(classData);
    await doc.validate();
    console.log('Class successfully created with empty meetingLink (Case 1)');
    
    // Case 2
    classData.meetingLink = 'https://meet.google.com/example';
    const doc2 = new MentorshipClass(classData);
    await doc2.validate();
    console.log('Class successfully created with valid meetingLink (Case 2)');
    
  } catch (err) {
    console.error('Validation failed:', err.message);
  }
  process.exit(0);
}
test();
