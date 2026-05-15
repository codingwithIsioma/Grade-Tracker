# Student Grade Tracker

Build a <b>Student Grade Tracker</b> web app that allows users to: \

```
- Add students with their grades \
- Display the list of students dynamically \
- Calculate and display the average grade \
- Remove students from the list
```

# Requirements:

<b>1. Data Structure:</b>

- Use an array to store student objects.
- Each student object should have this structure:
  `{ id: number, name: string, grade: number }` \

<b>2. DOM Functionality:</b>
<b>Your app should have:</b>

- A form with two inputs: Student Name and Grade.
- A button to Add Student.
- A section that displays:
  - A table or list of all students.
  - Each student’s name and grade.
  - A Delete button next to each student.
- A section showing the Average Grade of all students. \

<b>3. Event Handling:</b>

- When the Add Student button is clicked:
  - The student should be added to the list and displayed immediately.
  - The average grade should update automatically.
- When a Delete button is clicked:
  - That student should be removed from the array and the DOM.
  - The average grade should be recalculated. \

<b>4. Validation Rules:</b>

- The student name must not be empty.
- The grade must be a number between 0 and 100.
- Show an alert or error message for invalid input. \

<b>BONUS FUNCTIONALITIES:</b>

- Highlight students who scored above average.
- Store the student list in localStorage so data persists after reloading.
- Two sort functions: Alphabetically and Highest to Lowest grade
- Edit a student's name or grade
