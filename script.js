// Target all the required DOM elements
const studentForm = document.getElementById("student-form");
const nameInput = document.getElementById("student-name");
const gradeInput = document.getElementById("student-grade");
const errorMessage = document.getElementById("error-message");
const averageValue = document.getElementById("average-value");
const listContainer = document.getElementById("list-container");
const studentLength = document.querySelector(".student-length");
const studentCount = document.getElementById("student-count");
const student = document.getElementById("student");

// main student data array
let studentData = JSON.parse(localStorage.getItem("studentData")) || [];

// removes the error when user puts in a valid input
nameInput.addEventListener("input", (e) => {
  if (e.target.value) {
    nameInput.classList.remove("error-border");
    showError("");
  }
});

gradeInput.addEventListener("input", (e) => {
  if (e.target.value) {
    gradeInput.classList.remove("error-border");
    showError("");
  }
});

// handles the functionality of adding students to the student data array
const addToStudentData = () => {
  const capitalizedName = nameInput.value
    .trim()
    .split(" ")
    .filter((name) => name !== "")
    .map((name) => name[0].toUpperCase() + name.slice(1).toLowerCase())
    .join(" ");

  studentData.push({
    id: Date.now(),
    name: capitalizedName,
    grade: +gradeInput.value,
  });
  localStorage.setItem("studentData", JSON.stringify(studentData));
  calculateAvgGrade();
  displayStudentData();
  nameInput.value = "";
  gradeInput.value = "";
};

// displays the student data onto the screen
const displayStudentData = () => {
  const returnedGradeAverage = calculateAvgGrade();
  if (studentData.length !== 0) {
    listContainer.innerHTML = "";
    studentData.forEach(({ id, name, grade }, i) => {
      listContainer.innerHTML += `
        <div class="list-flex" id="${id}">
            <div class="name-flex">
                <span class="student-idx">${String(i + 1).padStart(2, "0")}</span>
                <p>${name}</p>
                <span class=${grade > returnedGradeAverage ? "above-avg-indicator" : "do-not-display"}
                  ><i class="fa-solid fa-arrow-up"></i> AVG</span
                >
            </div>
            <div class="grade-flex">
                <p>${grade}</p>
                <button class="delete-btn" onclick="deleteStudent(this)">
                  <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        </div>
      `;
    });
    studentLength.style.display = "flex";
    studentCount.textContent = `${studentData.length}`;
    student.textContent = `${studentData.length === 1 ? "student" : "students"}`;
  }
};

// calculates the grade average of the students
const calculateAvgGrade = () => {
  let sum = 0;
  studentData.map((student) => {
    return (sum += +student.grade);
  });
  const gradeAverage = sum / studentData.length;

  // display average
  averageValue.textContent = gradeAverage ? `${gradeAverage.toFixed(1)}` : "—";
  return gradeAverage;
};

// delete button
const deleteStudent = (buttonEl) => {
  // find the index of the student to be deleted
  const studentDataArr = studentData.findIndex(
    (student) => student.id === +buttonEl.parentElement.parentElement.id,
  );

  studentData.splice(studentDataArr, 1);
  buttonEl.parentElement.parentElement.remove();
  localStorage.setItem("studentData", JSON.stringify(studentData));
  calculateAvgGrade();
  displayStudentData();
  checkArr();
};

// display when the student data array is empty
const checkArr = () => {
  if (studentData.length === 0) {
    listContainer.innerHTML += `
    <div class="no-student">
        <p>No students added yet.</p>  
    </div>`;
    studentLength.style.display = "none";
  } else {
    displayStudentData();
  }
};

// array is empty on reload of page
// fix when local storage is added
checkArr();

studentForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (validateNameAndGrade()) {
    addToStudentData();
  }
});

const showError = (errMsg) => {
  errorMessage.style.display = errMsg ? "block" : "none";
  errorMessage.textContent = errMsg;
};

// validates the name and grade inputs and checks there are no duplicates before adding to array
const validateNameAndGrade = () => {
  const nameInputValue = nameInput.value.trim();
  const gradeInputValue = gradeInput.value;

  // checks if both values are empty and then asks user to fill in both
  if (!nameInputValue && !gradeInputValue) {
    nameInput.classList.add("error-border");
    gradeInput.classList.add("error-border");
    showError("Please fill the highlighted fields.");
    return false;
  }

  // if grade is available but not the name, then display error
  if (!nameInputValue) {
    nameInput.classList.add("error-border");
    showError("Student name cannot be empty.");
    return false;
  }

  // if name is available but not the grade, then display error
  if (
    !gradeInputValue ||
    isNaN(+gradeInputValue) ||
    +gradeInputValue < 0 ||
    +gradeInputValue > 100
  ) {
    gradeInput.classList.add("error-border");
    showError("Grade must be between 0 and 100.");
    return false;
  }

  // ensures that there are not duplicate names in the student list
  const isDuplicate = studentData.filter(
    (item) => item.name.toLowerCase() === nameInputValue.toLowerCase(),
  );
  if (isDuplicate.length > 0) {
    showError(`"${nameInputValue}" is already in the list.`);
    return false;
  }

  return true;
};
