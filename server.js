/********************************************************************************
 * * * WEB700 – Assignment 03 * I declare that this assignment is my own work in 
 * accordance with Seneca Academic Policy. No part * of this assignment has been 
 * copied manually or electronically from any other source * 
 * (including 3rd party web sites) or distributed to other students. *
 * Name: _David Oduwole_ Student ID: _185731213__ Date: _June 14, 2023___ *
 * *****************************************************************************/

const express = require("express");
const path = require("path");
const collegeData = require("./collegeData");

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// To import the express.static middleware
const staticMiddleware = express.static(path.join(__dirname, "public"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(staticMiddleware);

// Initialize collegeData before starting the server
collegeData.initialize()
  .then(() => {
    // Routes

    // GET /students
    app.get("/students", (req, res) => {
      collegeData.getAllStudents()
        .then(students => {
          if (students.length > 0) {
            if (req.query.course) {
              const course = parseInt(req.query.course);
              collegeData.getStudentsByCourse(course)
                .then(courseStudents => {
                  res.json(courseStudents);
                })
                .catch(() => {
                  res.json({ message: "no results" });
                });
            } else {
              res.json(students);
            }
          } else {
            res.json({ message: "no results" });
          }
        })
        .catch(() => {
          res.json({ message: "no results" });
        });
    });

    // GET /tas
    app.get("/tas", (req, res) => {
      collegeData.getTAs()
        .then(tas => {
          if (tas.length > 0) {
            res.json(tas);
          } else {
            res.json({ message: "no results" });
          }
        })
        .catch(() => {
          res.json({ message: "no results" });
        });
    });

    // GET /courses
    app.get("/courses", (req, res) => {
      collegeData.getCourses()
        .then(courses => {
          if (courses.length > 0) {
            res.json(courses);
          } else {
            res.json({ message: "no results" });
          }
        })
        .catch(() => {
          res.json({ message: "no results" });
        });
    });

    // GET /student/num
    app.get("/student/:num", (req, res) => {
      const studentNum = parseInt(req.params.num);
      collegeData.getStudentByNum(studentNum)
        .then(student => {
          res.json(student);
        })
        .catch(() => {
          res.json({ message: "no results" });
        });
    });

    // GET /
    app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "views", "home.html"));
    });

    // GET /about
    app.get("/about", (req, res) => {
      res.sendFile(path.join(__dirname, "views", "about.html"));
    });

    // GET /htmlDemo
    app.get("/htmlDemo", (req, res) => {
      res.sendFile(path.join(__dirname, "views", "htmlDemo.html"));
    });

    // GET /students/add
    app.get("/addStudent", (req, res) => {
      res.sendFile(path.join(__dirname, "views", "addStudent.html"));
    });

    // POST /students/add
    app.post("/students/add", (req, res) => {
      collegeData.addStudent(req.body)
        .then(() => {
          res.redirect("/students");
        })
        .catch(() => {
          res.status(500).json({ error: "Failed to add student" });
        });
    });

    // 404 route
    app.use((req, res) => {
      res.status(404).send("Page Not Found");
    });

    // Start the server
    app.listen(HTTP_PORT, () => {
      console.log("Server listening on port:", HTTP_PORT);
    });
  })
  .catch((err) => {
    console.error(err);
  });
