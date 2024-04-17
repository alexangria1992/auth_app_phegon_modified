const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("./db/connection");
const colors = require("colors");

const app = express();
app.use(express.json());
app.use(cors());
require("dotenv").config();

//Registration Endpoint
app.post("/registerstudent", async (req, res) => {
  const { name, email, password, confPassword } = req.body;
  if (password !== confPassword)
    return res
      .status(400)
      .json({ msg: "Password and Confirm Password do not match." });
  // HASH PASSWORD
  let hashedPassword = await bcrypt.hash(password, 8);
  console.log(hashedPassword);

  const sql =
    "INSERT INTO student ( name, email, password, school, profile_pic, date_of_birth, contact_number, course) VALUES ( ?, ?, ?, 'ranui primary', '/images/students', '2010-03-19', '09-465-8765', 'beginner')";
  db.query(sql, [name, email, hashedPassword], (err, result) => {
    if (err) {
      console.log("Error in Registration" + err);
    } else {
      res.json({ message: "Registration Successful" });
    }
  });
});

//Login Student
// app.post("/loginstudent", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     db.query(
//       "SELECT * FROM student WHERE email = ?",
//       [email],
//       async (err, results) => {
//         console.log(results);
//         if (
//           !results ||
//           !(await bcrypt.compare(password, results[0].password))
//         ) {
//           res.status(401).json({ msg: "Email or password is incorrect" });
//         } else {
//           const id = results[0].id;
//           const token = jwt.sign({ id }, process.env.JWT_SECRET, {
//             expiresIn: process.env.JWT_EXPIRES_IN,
//           });
//           console.log("The token is:", token);

//           const cookieOptions = {
//             expires: new Date(
//               Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
//             ),
//             httpOnly: true,
//           };
//           res.cookie("jwt", token, cookieOptions);
//           res.status(200).json({ Status: "Success" });
//         }
//       }
//     );
//   } catch (error) {
//     console.log(error);
//   }
// });

app.post("/loginstudent", async (req, res) => {
  const { email, password } = req.body;
  //Check if username and password are present
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Username and Password are required" });
  }

  //Query
  const sql = "SELECT * FROM student WHERE email = ?";
  db.query(sql, [email], async (err, result) => {
    if (err || result.length === 0) {
      console.log("Error Searching for email: " + err);
      return res.status(404).json({ message: "Email is incorrect" });
    } else {
      //compare hashed password
      const match = await bcrypt.compare(password, result[0].password);
      if (match) {
        //create a jwt token
        const token = jwt.sign(
          { userId: result[0].student_id },
          "my_secret_key",
          {
            expiresIn: "1h",
          }
        );
        res.json({ message: "Login Successful", token });
      } else {
        res.status(401).json({ message: "Invalid Password" });
      }
    }
  });
});

//Registration Endpoint
app.post("/registerteacher", async (req, res) => {
  const { name, email, password, confPassword } = req.body;
  if (password !== confPassword)
    return res
      .status(400)
      .json({ msg: "Password and Confirm Password do not match." });
  // HASH PASSWORD
  let hashedPassword = await bcrypt.hash(password, 8);
  console.log(hashedPassword);

  const sql =
    "INSERT INTO teacher ( name, email, password, school, profile_pic, date_of_birth, contact_number) VALUES ( ?, ?, ?, 'ranui primary', '/images/students', '1988-05-17', '09-756-9485')";
  db.query(sql, [name, email, hashedPassword], (err, result) => {
    if (err) {
      console.log("Error in Registration" + err);
    } else {
      res.json({ message: "Registration Successful" });
    }
  });
});

//Login Student
app.post("/loginteacher", async (req, res) => {
  try {
    const { email, password } = req.body;
    db.query(
      "SELECT * FROM teacher WHERE email = ?",
      [email],
      async (err, results) => {
        console.log(results);
        if (
          !results ||
          !(await bcrypt.compare(password, results[0].password))
        ) {
          res.status(401).json({ msg: "Email or password is incorrect" });
        } else {
          const id = results[0].id;
          const token = jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
          });
          console.log("The token is:", token);

          const cookieOptions = {
            expires: new Date(
              Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
          };
          res.cookie("jwt", token, cookieOptions);
          res.status(200).json({ Status: "Success", token });
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
});

//Authentication Middlware using JWT
const authenticate = (req, res, next) => {
  const token = req.header("Authorization");
  console.log("Unextracted Token" + token);
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const extractedToken = token.split(" ")[1];
  console.log("Actual Token: " + extractedToken);

  try {
    // Verify and Validate our token
    const decoded = jwt.verify(extractedToken, "my_secret_key");
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

app.get("/profile", authenticate, (req, res) => {
  const userId = req.userId;
  const sql =
    "SELECT * FROM authenticationapplication.student where student_id = ?";
  db.query(sql, [userId], (err, result) => {
    if (err || result.length === 0) {
      res.status(500).json({ message: "Error fetching Details" });
    } else {
      res.json({ name: result[0].name });
    }
  });
});
// PORT
const port = 5500;
app.listen(port, () => {
  console.log(colors.cyan(`Server is running on localhost:${port}`));
});
