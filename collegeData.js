const fs = require('fs');

class Data {
  constructor(students, courses) {
    this.students = students;
    this.courses = courses;
  }
}

let dataCollection = null;

function initialize() {
  return new Promise((resolve, reject) => {
    fs.readFile('./data/students.json', 'utf8', (err, studentDataFromFile) => {
      if (err) {
        reject("Unable to read students.json");
        return;
      }

      fs.readFile('./data/courses.json', 'utf8', (err, courseDataFromFile) => {
        if (err) {
          reject("Unable to read courses.json");
          return;
        }

        const studentData = JSON.parse(studentDataFromFile);
        const courseData = JSON.parse(courseDataFromFile);

        dataCollection = new Data(studentData, courseData);

        resolve();
      });
    });
  });
}

function getAllStudents() {
  return new Promise((resolve, reject) => {
    if (dataCollection && dataCollection.students && dataCollection.students.length > 0) {
      resolve(dataCollection.students);
    } else {
      reject("No students found.");
    }
  });
}

function getTAs() {
  return new Promise((resolve, reject) => {
    if (dataCollection && dataCollection.students && dataCollection.students.length > 0) {
      const tas = dataCollection.students.filter(student => student.TA);
      if (tas.length > 0) {
        resolve(tas);
      } else {
        reject("No TAs found.");
      }
    } else {
      reject("No students found.");
    }
  });
}

function getCourses() {
  return new Promise((resolve, reject) => {
    if (dataCollection && dataCollection.courses && dataCollection.courses.length > 0) {
      resolve(dataCollection.courses);
    } else {
      reject("No courses found.");
    }
  });
}

function getStudentsByCourse(course) {
  return new Promise((resolve, reject) => {
    if (dataCollection && dataCollection.students && dataCollection.students.length > 0) {
      const students = dataCollection.students.filter(student => student.course === course);
      if (students.length > 0) {
        resolve(students);
      } else {
        reject("No results returned.");
      }
    } else {
      reject("No students found.");
    }
  });
}

function getStudentByNum(num) {
  return new Promise((resolve, reject) => {
    if (dataCollection && dataCollection.students && dataCollection.students.length > 0) {
      const student = dataCollection.students.find(student => student.studentNum === num);
      if (student) {
        resolve(student);
      } else {
        reject("No results returned.");
      }
    } else {
      reject("No students found.");
    }
  });
}

function addStudent(studentData) {
  return new Promise((resolve, reject) => {
    if (dataCollection && dataCollection.students) {
      const newStudentNum = dataCollection.students.length + 1;
      const newStudent = {
        studentNum: newStudentNum,
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        email: studentData.email,
        course: studentData.course,
        TA: studentData.TA || false
      };
      dataCollection.students.push(newStudent);
      fs.writeFile('./data/students.json', JSON.stringify(dataCollection.students), (err) => {
        if (err) {
          reject("Unable to add student.");
        } else {
          resolve(newStudent);
        }
      });
    } else {
      reject("No students found.");
    }
  });
}

module.exports = {
  initialize,
  getAllStudents,
  getTAs,
  getCourses,
  getStudentsByCourse,
  getStudentByNum,
  addStudent
};
