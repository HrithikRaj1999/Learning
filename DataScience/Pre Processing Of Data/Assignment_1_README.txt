ASSIGNMENT 1
STUDENT README
DSE ZG505 • Modules 1–3
============================================================

PREREQUISITES
-------------
Before starting Assignment 1, ensure Python 3 is installed.

Install the required Python packages:

    pip install pandas    # important
    pip install scikit-learn    # important

These packages are required for the data-processing work in Parts 1 and 2
and for executing Assignment_1_part_3.

0. EXTRACT FILES
----------------
E-learn portal is accessible with in the Prayogshala portal.Copy Assignment_bin.tar.gz into portal under workspace directory.

Before starting, extract the assignment binaries,execute below commands:
    cd ~/workspace;
    tar -xvf Assignment_bin.tar.gz;
    cp Assignment_bin/* ~/workspace/;
    chmod +x ~/workspace/

1. START ASSIGNMENT 1 — RUN Assignment_A1
------------------------------------------
Before starting Part 1, Run the program supplied by the instructor:

Command : 
    ./Assignment_A1

The program asks for your BITS institutional email.

After successful execution, Assignment_A1 validates your identity and creates
your student-specific Assignment 1 environment.

2. STUDENT-SPECIFIC RAW DATASET
--------------------------------
Assignment_A1 creates your assigned RAW dataset:

    <student_email>.csv

Example:

    student@wilp.bits-pilani.ac.in.csv

Use the actual file generated for your account.

This is the RAW dataset used as the starting point for Parts 1 and 2.

Do not:
- rename the RAW dataset;
- modify or replace it;
- exchange it with another student's dataset;
- manually recreate another student's dataset.

3. EXECUTION MANIFEST
----------------------
Assignment_A1 also creates:

    ~/workspace/A1_execution_manifest.json

Linux example:

    /home/<your-user>/workspace/A1_execution_manifest.json


The manifest stores the identity and dataset provenance required later by
Assignment_1_part_3.

Do not:
- edit the manifest;
- rename it;
- replace it;
- copy another student's manifest.

4. PART 1
---------
Use your assigned RAW dataset:

    <student_email>.csv

Complete Questions 1.1–1.4 using the Assignment 1 instructions.

5. PART 2
---------
Continue using the same assigned RAW dataset as the starting point.

Complete Questions 2.1–2.4.

After completing your preprocessing pipeline, save the final preprocessed
dataset as:

    UrbanGo_A1_cleaned.csv

6. PART 3
---------
Part 3 uses two dataset states:

RAW:
    <student_email>.csv

PREPROCESSED:
    UrbanGo_A1_cleaned.csv

You do NOT need to create X_raw, y_raw, X_clean, or y_clean manually.

Run Command:

    ./Assignment_1_part_3

Assignment_1_part_3 will:
- validate the execution manifest;
- validate the identity-bound RAW dataset fingerprint;
- prepare the required model inputs;
- execute the controlled RAW vs PREPROCESSED comparison;
- generate the final scorecard.

7. FINAL PART 3 OUTPUT
-----------------------
The final output should show:

    Student Email
    Assignment ID
    Dataset ID
    Dataset Fingerprint
    RAW Accuracy
    PREPROCESSED Accuracy
    Submission ID
    Verification Status

Do not display the generated RAW CSV filename or the absolute filesystem path
in the final scorecard.

8. FILE CONVENTION
------------------
Assigned RAW dataset:
    <student_email>.csv

Part 2 cleaned dataset:
    UrbanGo_A1_cleaned.csv

Manifest:
    ~/workspace/A1_execution_manifest.json

Part 1 program:
    Assignment_A1

Part 3 program:
    Assignment_1_part_3

9. IMPORTANT
------------
Run Assignment_A1 first.

Do not start Part 1 until the student-specific RAW dataset and execution
manifest have been created successfully.

Keep the RAW dataset and manifest unchanged throughout the assignment.
