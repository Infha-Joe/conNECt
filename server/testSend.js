import sendEmail from "./utils/sendEmail.js";
import dotenv from "dotenv";
dotenv.config();

const run = async () => {
    try {
        await sendEmail({
            to: "realtest@nec.edu.in",
            subject: "Verify your conNECt Account",
            html: "<p>Hello</p>"
        });
        console.log("Success");
    } catch(e) {
        console.error("FAILED:", e);
    }
}
run();
