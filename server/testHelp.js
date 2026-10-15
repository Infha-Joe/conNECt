import axios from "axios";
const testHelpRequests = async () => {
  try {
    const res = await axios.post("http://localhost:5000/api/auth/login", { email: "student@nec.edu.in", password: "password123" });
    const token = res.data.token;
    
    console.log("Logging in as Student -> OK");
    const headers = { Authorization: `Bearer ${token}` };
    
    const reqRes = await axios.post("http://localhost:5000/api/help-requests", {
      title: "Test Help Request",
      description: "Need help with routing",
      category: "Academic",
      urgency: "High"
    }, { headers });
    const requestId = reqRes.data.helpRequest._id;
    console.log("Created Help Request -> OK", requestId);
    
    // Login as Teacher
    const tRes = await axios.post("http://localhost:5000/api/auth/login", { email: "teacher@nec.edu.in", password: "password123" });
    const tToken = tRes.data.token;
    const tHeaders = { Authorization: `Bearer ${tToken}` };
    
    console.log("Logging in as Teacher -> OK");
    const offerRes = await axios.post(`http://localhost:5000/api/help-requests/${requestId}/offer`, {
      message: "I can help you with that!"
    }, { headers: tHeaders });
    const offerId = offerRes.data.helpRequest.offers[0]._id;
    console.log("Teacher offered help -> OK", offerId);
    
    // Student accepts
    await axios.put(`http://localhost:5000/api/help-requests/offer/${offerId}/accept`, { helperId: tRes.data.user._id }, { headers });
    console.log("Student accepted offer -> OK");
    
    // Teacher marks completed
    await axios.put(`http://localhost:5000/api/help-requests/${requestId}/complete`, {}, { headers: tHeaders });
    console.log("Teacher marked completed -> OK");
    
    // Student confirms
    await axios.put(`http://localhost:5000/api/help-requests/${requestId}/confirm`, { success: true }, { headers });
    console.log("Student confirmed success -> OK");
    
    // Check contributions
    const contribs = await axios.get("http://localhost:5000/api/help-requests/contributions", { headers: tHeaders });
    console.log("Teacher contributions -> OK", contribs.data.helpRequests.length > 0 ? "Format valid" : "Empty");
    
  } catch(e) {
    console.error("FAILED!", e.response ? e.response.data : e.message);
  }
}
testHelpRequests();
