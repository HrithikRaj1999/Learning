# Lecture 1: Foundations

- **Q1. Define a Database Management System (DBMS).**

  > - **Meaning**
  >   - Software that creates and manages databases.
  > - **Main jobs**
  >   - Store, retrieve, and update data.
  >   - Enforce permissions and correctness rules.
  >   - Support simultaneous users, backup, and recovery.
  > - **Distinction**
  >   - Database: stored records.
  >   - DBMS: software managing those records.
  >     - MySQL and PostgreSQL are DBMS products.
  >   - Application: interface for completing user tasks.

- **Q4. Classify an Excel marks sheet, MySQL server, and food-delivery app.**

  > - **Excel marks sheet: file**
  >   - Holds records inside a spreadsheet.
  > - **MySQL server: DBMS**
  >   - Manages databases and controls data access.
  > - **Food-delivery app: application**
  >   - Accepts orders and displays delivery status.
  >     - Its stored customer and order records belong to a database.
  > - **Connection**
  >   ```mermaid
  >   flowchart LR
  >       App[Application] --> Manager[DBMS]
  >       Manager --> Data[(Database)]
  >   ```

- **Q6. Admissions, library, and fees use separate student files. What problems arise?**

  > - **Redundancy: repeated facts**
  >   - The same student phone appears in three files.
  > - **Inconsistency: conflicting copies**
  >   - Updating one file leaves the other two unchanged.
  > - **Isolation: scattered data**
  >   - Combining department records requires extra work.
  > - **Solution: shared tables**
  >   - Keep student details once in `Student`.
  >   - Link admissions, loans, and fees using `StudentID`.
  >     - Change the phone once; departments retrieve the same value.
  >   - Apply access permissions and recovery controls.

- **Q8. Distinguish schema, instance, record, field, and metadata.**

  > - **Schema: structure and rules**
  >   - `Student(StudentID, Name, Program)` describes the structure.
  > - **Instance: currently stored data**
  >   - Adding a student changes the instance, not the schema.
  > - **Record: one complete row**
  >   - One student's details form one record.
  > - **Field: one property**
  >   - `StudentID` is a field with an assigned data type.
  >     - Adding a new field changes the schema.
  > - **Metadata: descriptions of data**
  >   - Column names, types, allowed values, and meanings.

- **Q10. Design Course Registration using StudentID, CourseID, and Semester.**

  > - **Fields and types**
  >   - `StudentID`: integer.
  >   - `CourseID`: text identifier.
  >   - `Semester`: text identifying year and term.
  > - **Primary key: combined identity**
  >   - `(StudentID, CourseID, Semester)`.
  >     - Assumption: one registration per student, course, and semester.
  >     - Repeating the course in another semester remains possible.
  > - **Foreign keys: valid references**
  >   - `StudentID` references `Student`.
  >   - `CourseID` references `Course`.
  > - **Constraints**
  >   - Required fields cannot be null.
  >   - Reject duplicate registrations and references to missing students or courses.

- **Q11. Differentiate primary, foreign, candidate, and composite keys.**

  > - **Primary key: chosen row identifier**
  >   - Unique and never null.
  >     - `Student.StudentID` identifies one student.
  > - **Foreign key: reference to another record**
  >   - Maintains referential integrity: references must match existing records.
  >     - `Loan.StudentID` references `Student.StudentID`.
  >   - Repeated values are allowed: one student can have several loans.
  > - **Candidate key: possible primary key**
  >   - Minimal fields sufficient to identify a row uniquely.
  > - **Composite key: multiple fields together**
  >   - Registration uses `StudentID`, `CourseID`, and `Semester`.

- **Q12. Normalize ATHLETE(AthleteID, AthleteName, CoachID, CoachName, Sport, TrainingSessions).**

  > - **Assumptions**
  >   - One coach trains many athletes; each athlete has one coach and sport.
  >   - Athletes attend many sessions; each session can contain many athletes.
  > - **Two problems**
  >   - Coach names repeat across athletes, causing inconsistent updates.
  >   - `TrainingSessions` contains a repeating group instead of separate attendance records.
  > - **Better tables**
  >   - `Coach(CoachID, CoachName)`; primary key: `CoachID`.
  >   - `Athlete(AthleteID, AthleteName, CoachID, Sport)`; primary key: `AthleteID`.
  >     - Foreign key: `CoachID` references `Coach`.
  >   - `TrainingSession(SessionID)`; primary key: `SessionID`.
  >   - `Attendance(AthleteID, SessionID)`; composite primary key: both fields.
  >     - Both attendance fields reference their corresponding parent tables.
  > - **Relationships**
  >   ```mermaid
  >   flowchart LR
  >       Coach[Coach] -->|one to many| Athlete[Athlete]
  >       Athlete -->|one to many| Attendance[Attendance]
  >       Session[Training session] -->|one to many| Attendance
  >   ```

- **Q13. Identify entities, attributes, and relationships in a college library.**

  > - **Entity: something whose data is stored**
  >   - `Student`, `Book`, `Loan`, and `Fine`.
  > - **Attribute: an entity's property**
  >   - Student: `StudentID`, `Name`, `Program`.
  >   - Book: `BookID`, `Title`, `Author`.
  > - **Relationship: connection between entities**
  >   - Loan connects a student with a borrowed book.
  >     - Store `LoanID`, `StudentID`, `BookID`, `IssueDate`, and `DueDate`.
  >   - Fine connects a charge with its loan.
  >     - Store `FineID`, `LoanID`, `Amount`, and `Paid`.
  > - **Model**
  >   ```mermaid
  >   flowchart LR
  >       Student[Student] -->|StudentID| Loan[Loan]
  >       Book[Book] -->|BookID| Loan
  >       Loan -->|LoanID| Fine[Fine]
  >   ```

- **Q14. Where should Grade belong: Student, Course, Instructor, or Enrollment?**

  > - **Answer: Enrollment**
  >   - A grade belongs to one student's enrollment in one course.
  > - **Why not Student or Course?**
  >   - One student receives different grades across courses.
  >   - Different students receive different grades within one course.
  > - **Key**
  >   - Use `(StudentID, CourseID, Semester)` when registrations repeat across semesters.
  >     - Grade describes this complete enrollment, not either identifier alone.
  > - **Useful query**
  >   - Join Student, Enrollment, and Course to retrieve names, courses, and grades.

- **Q15. Map relationship cardinalities to tables. Why normalize?**

  > - **Cardinality: number of permitted relationships**
  >   - One-to-one: one record matches at most one related record.
  >     - Enforce uniqueness on the foreign key.
  >   - One-to-many: one department has many students.
  >     - Put `DepartmentID` in `Student`, the many side.
  >   - Many-to-many: students take courses; courses contain students.
  >     - Create `Enrollment` containing student and course references.
  > - **Normalization: reduce repetition and update problems**
  >   - Store student details once, instead of repeating them in every loan.
  >   - Connect tables using keys; combine details using joins.
  > - **Many-to-many mapping**
  >   ```mermaid
  >   flowchart LR
  >       Student[Student] -->|one to many| Enrollment[Enrollment]
  >       Course[Course] -->|one to many| Enrollment
  >   ```