// Target all the required DOM elements
const studentForm = document.getElementById("student-form");
const nameInput = document.getElementById("student-name");
const gradeInput = document.getElementById("student-grade");
const submitBtn = document.getElementById("submit-btn");
const errorMessage = document.getElementById("error-message");
const averageValue = document.getElementById("average-value");
const listContainer = document.getElementById("list-container");
const studentLength = document.querySelector(".student-length");
const studentCount = document.getElementById("student-count");
const student = document.getElementById("student");
const sortAlphabetically = document.getElementById("sort-alphabetically");
const sortByHighestGrade = document.getElementById("sort-by-highest-grade");
const failCount = document.getElementById("fail-count");
const passCount = document.getElementById("pass-count");
const meritCount = document.getElementById("merit-count");
const distinctionCount = document.getElementById("distinction-count");

// main student data array
let studentData = JSON.parse(localStorage.getItem("studentData")) || [];
let currentDataObj = {};

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

// if the student list has a current sort-filter on it, display student list based off that filter, if not, then display normally
let activeSortFilter = null;
const refreshDisplay = () => {
  if (activeSortFilter === "alpha") {
    const sortedData = [...studentData];
    sortedData.sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
    displayStudentData(sortedData);
  } else if (activeSortFilter === "grade") {
    const sortedData = [...studentData];
    sortedData.sort((a, b) => {
      const gradeA = +a.grade;
      const gradeB = +b.grade;
      if (gradeA > gradeB) {
        return -1;
      }
      if (gradeA < gradeB) {
        return 1;
      }
      return 0;
    });
    displayStudentData(sortedData);
  } else {
    displayStudentData(studentData);
  }
};

// update the grade distribution count
const updateGradeDistributionCount = () => {
  // fail
  const failedStudents = studentData.filter(
    (student) => student.grade >= 0 && student.grade <= 49,
  );
  failCount.textContent = failedStudents.length
    ? `${failedStudents.length}`
    : "0";

  // pass
  const passedStudents = studentData.filter(
    (student) => student.grade >= 50 && student.grade <= 69,
  );
  passCount.textContent = passedStudents.length
    ? `${passedStudents.length}`
    : "0";

  // merit
  const meritedStudents = studentData.filter(
    (student) => student.grade >= 70 && student.grade <= 84,
  );
  meritCount.textContent = meritedStudents.length
    ? `${meritedStudents.length}`
    : "0";

  // distinction
  const distinctionStudents = studentData.filter(
    (student) => student.grade >= 85 && student.grade <= 100,
  );
  distinctionCount.textContent = distinctionStudents.length
    ? `${distinctionStudents.length}`
    : "0";
};

// handles the functionality of adding students to the student data array
const addOrUpdateToStudentData = () => {
  const capitalizedName = nameInput.value
    .trim()
    .split(" ")
    .filter((name) => name !== "")
    .map((name) => name[0].toUpperCase() + name.slice(1).toLowerCase())
    .join(" ");

  const findStudentDataIndex = studentData.findIndex(
    (student) => student.id === currentDataObj.id,
  );

  const dataObj = {
    id: Date.now(),
    name: capitalizedName,
    grade: +gradeInput.value,
  };

  if (findStudentDataIndex === -1) {
    studentData.push(dataObj);
  } else {
    studentData[findStudentDataIndex] = { ...dataObj, id: currentDataObj.id };
  }

  localStorage.setItem("studentData", JSON.stringify(studentData));
  calculateAvgGrade();
  checkArr();
  reset();
};

// displays the student data onto the screen
const displayStudentData = (studentData) => {
  const returnedGradeAverage = calculateAvgGrade();
  listContainer.innerHTML = "";
  let listHTML = "";
  if (studentData.length !== 0) {
    studentData.forEach(({ id, name, grade }, i) => {
      listHTML += `
        <div class="list-flex">
            <div class="name-flex">
                <span class="student-idx">${String(i + 1).padStart(2, "0")}</span>
                <p>${name}</p>
                <span class=${grade > returnedGradeAverage ? "above-avg-indicator" : "do-not-display"}
                  ><i class="fa-solid fa-arrow-up"></i> AVG</span
                >
            </div>
            <div class="grade-flex">
                <p>${grade}</p>
                <div class="student-buttons">
                    <button class="edit-btn" onclick="editStudent(${id})">
                    <i class="fa-regular fa-pen-to-square"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteStudent(${id})">
                    <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </div>
        </div>
      `;
    });
    listContainer.innerHTML = listHTML;
    updateGradeDistributionCount();
    studentLength.style.display = "flex";
    studentCount.textContent = `${studentData.length}`;
    student.textContent = `${studentData.length === 1 ? "student" : "students"}`;
  } else {
    listContainer.innerHTML = `
    <div class="no-student">
        <p>No students added yet.</p>  
    </div>`;
    studentLength.style.display = "none";
  }
};

// calculates the grade average of the students
const calculateAvgGrade = () => {
  let initialValue = 0;
  const sumOfGrades = studentData.reduce(
    (accumulator, currentValue) => accumulator + currentValue.grade,
    initialValue,
  );
  const gradeAverage = studentData.length
    ? sumOfGrades / studentData.length
    : 0;

  // display average
  averageValue.textContent = gradeAverage ? `${gradeAverage.toFixed(1)}` : "—";
  return gradeAverage;
};

// edit button
const editStudent = (buttonElId) => {
  const studentDataArr = studentData.find(
    (student) => student.id === +buttonElId,
  );
  currentDataObj = studentDataArr;
  nameInput.value = currentDataObj.name;
  gradeInput.value = currentDataObj.grade;

  nameInput.classList.add("edit-border");
  gradeInput.classList.add("edit-border");
  submitBtn.innerText = "Save Changes";
  submitBtn.classList.add("save-changes");
};

// delete button
const deleteStudent = (buttonElId) => {
  // find the index of the student to be deleted
  const studentDataArr = studentData.findIndex(
    (student) => student.id === +buttonElId,
  );
  studentData.splice(studentDataArr, 1);
  localStorage.setItem("studentData", JSON.stringify(studentData));
  calculateAvgGrade();
  checkArr();
  reset();
};

// checks if the student list is empty or not
const checkArr = () => {
  listContainer.innerHTML = "";
  if (studentData.length === 0) {
    listContainer.innerHTML = `
    <div class="no-student">
        <p>No students added yet.</p>  
    </div>`;
    studentLength.style.display = "none";
  } else {
    refreshDisplay();
  }
};

// displays the student list on loading of page whether empty or from local storage.
checkArr();

//reset
const reset = () => {
  submitBtn.innerText = "Add Student";
  submitBtn.classList.remove("save-changes");
  nameInput.classList.remove("edit-border");
  gradeInput.classList.remove("edit-border");
  nameInput.value = "";
  gradeInput.value = "";
  currentDataObj = {};
};

// sort function that updates the state of the sortfiler value, it is either, null, alpha or grade.
sortAlphabetically.addEventListener("click", () => {
  if (activeSortFilter === "alpha") {
    activeSortFilter = null;
    sortAlphabetically.classList.remove("active");
  } else {
    activeSortFilter = "alpha";
    sortByHighestGrade.classList.remove("active");
    sortAlphabetically.classList.add("active");
  }
  checkArr();
});
sortByHighestGrade.addEventListener("click", () => {
  if (activeSortFilter === "grade") {
    activeSortFilter = null;
    sortByHighestGrade.classList.remove("active");
  } else {
    activeSortFilter = "grade";
    sortAlphabetically.classList.remove("active");
    sortByHighestGrade.classList.add("active");
  }
  checkArr();
});

// handles submission of form
studentForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (validateNameAndGrade()) {
    addOrUpdateToStudentData();
  }
});

// show error message
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
  const isDuplicate = studentData.filter((student) => {
    if (currentDataObj.name !== undefined) {
      if (student.name.toLowerCase() === currentDataObj.name.toLowerCase()) {
        return false;
      }
    }

    if (student.name.toLowerCase() === nameInputValue.toLowerCase()) {
      return true;
    }
  });

  if (isDuplicate.length > 0) {
    showError(`"${nameInputValue}" is already in the list.`);
    return false;
  }

  return true;
};
