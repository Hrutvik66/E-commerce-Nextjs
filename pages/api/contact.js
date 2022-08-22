import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function (req, res) {
  require("dotenv").config();

  let nodemailer = require("nodemailer");
  const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
      user: "brokar.hsm@gmail.com",
      pass: process.env.password,
    },
    secure: true,
  });
  const mailData = {
    from: "brokar.hsm@gmail.com",
    to: `${req.body.email}`,
    subject: `${req.body.userName} intrested in your product ${req.body.productName}`,
    text: req.body.message,
    html: `<div>${req.body.message}</div><p>Please click here to chat with customer ${req.body.link}</p>`,
  };
  transporter.sendMail(mailData, function (err, info) {
    if (err) {
      toast.error("Error sending email");
    } else {
      toast.success("Email sent successfully");
    }
  });
  res.status(200).send();
}
