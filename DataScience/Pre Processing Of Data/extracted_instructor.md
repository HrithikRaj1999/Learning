# UrbanGo — Assignment 1 (Instructor Material, Extracted)

**Course:** DSE ZG505 – Preprocessing for AI-Ready Data
**Modules:** 1–3 · **Total Marks:** 20

Extracted from the instructor bundle in this folder:

| Source | Notes |
|---|---|
| `Assignment_1.pdf` | 6 pages — the question paper |
| `Assignment_1_README.txt` | Setup and file-naming rules |
| `Instruction_Screenshot.pdf` | Portal download/extract steps |
| `Assignment_bin.tar.gz` | `Assignment_A1` and `Assignment_1_part_3` (both Python 3 scripts, hardcoded to `~/workspace/`) |

---

## Business Scenario

You are a Data Engineer at UrbanGo, an urban ride-hailing platform. UrbanGo wants to prepare
operational customer data for a future Customer Churn prediction system.

- **Target Variable:** 1 = Customer Churn, 0 = Customer Retained.
- **Problem Type:** Binary Classification.
- **Dataset Structure:** 13 columns. Numerical: `distance_km`, `fare_amount`, `customer_age`,
  `lifetime_rides`, `customer_rating`. Categorical: `payment_type`, `city`.
- **Data Quality:** Collected from raw operational systems and highly noisy. Contains incomplete
  records, exact duplicate rows, case-sensitive string inconsistencies, physical impossibilities,
  widening right-tail distributions, and severe global/contextual outliers.

## Dataset File Usage & Prerequisites

**Initialization:** Run the `Assignment_A1` program supplied by the instructor. It generates a
student-specific CSV named `<student_email>.csv` and a manifest `~/workspace/A1_execution_manifest.json`
inside your workspace folder.

**Rules:** Use your assigned RAW dataset as the input. Do not rename, modify, replace, or manually
recreate the assigned RAW dataset or the manifest file.

**Prerequisites:** Python 3 with `pandas`, `scikit-learn`, and `ydata-profiling`.

> The README lists only `pandas` and `scikit-learn`. `ydata-profiling` is required by Q1.3.

## Dataset Selection & Pipeline Flow (The In-Memory Workflow)

1. **The Raw Input:** Load `<student_email>.csv` into a pandas DataFrame.
2. **In-Memory Pipeline Operations:** Throughout Part 2, apply all sequential transformations
   directly to your active DataFrame variable in-memory. Do not export, save, or overwrite any CSV
   files on disk during intermediate steps.
3. **The Clean Output:** At the very end of the pipeline (Step 3.1), export the finalized in-memory
   DataFrame to a new CSV named exactly `UrbanGo_A1_cleaned.csv`, in the workspace folder.
4. **The ML Evaluation:** In Part 3 the provided binary (`Assignment_1_part_3`) reads all files in
   the workspace folder to ingest both the untouched raw dataset and the new clean dataset, and
   evaluates the pipeline's downstream impact.

---

## Part 1 — Diagnostics (7 Marks)

Submit Python code alongside output/screenshots for every question. Load `<student_email>.csv` into
a pandas DataFrame to begin.

### 1.1 (2 Marks) — Data-quality metrics

Calculate and print four metrics on the raw dataset. Identify the appropriate programmatic methods
to extract these counts.

1. Overall percentage of non-null values across the entire dataset.
2. Exact number of rows where `customer_age` contains biologically impossible values (e.g. <18 or >100).
3. Number of distinct casing variations present in the `payment_type` column.
4. Total number of exact duplicate rows across the dataset.

*Marking:* 0.5 marks per correctly coded and printed metric.

### 1.2 (1 Mark) — Schema metadata log

For Data Governance, AI-Ready datasets must document lineage and structural composition.

**Task:** Programmatically generate and print a Python dictionary (or JSON object) acting as a schema
metadata log. It must map every column name to its exact data type and its total count of missing values.

### 1.3 (2 Marks) — Automated profiling

- **Task A:** Use `ydata-profiling` to generate an HTML report of the dataset. Save and submit it as
  `profiling_report.html`.
- **Task B:** Write four distinct technical observations as comments in your code. At least two must
  explicitly analyze the asymmetry (**skewness**) and tail heaviness / extreme outlier presence
  (**kurtosis**) of specific numerical columns.

### 1.4 (2 Marks) — Why mean imputation is dangerous

A junior analyst proposes filling every missing numerical value with the arithmetic average. Prove
mathematically why this is dangerous for demographic attributes.

**Task:** Calculate and print the variance of `customer_age` with its missing values ignored. Then
temporarily fill all missing `customer_age` values with the arithmetic average and calculate/print
the variance again. Write a one-sentence comment explaining the resulting mathematical effect.

*Marking:* 1.0 for correctly coding and printing the before/after variance; 1.0 for the comment
explaining variance compression and the disruption of distinct clusters.

---

## Part 2 — The Pipeline (10 Marks)

Transform your active DataFrame purely in-memory. Submit code and output prints for all steps.
**Do not use `to_csv()` until you reach Part 3.**

### 2.1 Handling Missing Data Topologies (4 Marks)

1. **(1 Mark)** `customer_rating` contains missing values resulting from non-random omissions, where
   the absence of feedback correlates with customer sentiment. Before imputing missing cells, design
   a programmatic mechanism to capture and preserve this absence pattern using the best approach for
   this scenario.
2. **(1 Mark)** `fare_amount` contains missing values and exhibits a heavy right tail (skewness > 1.0)
   caused by extreme surge pricing. Programmatically fill missing values using the single-variable
   central tendency metric that remains stable and mathematically unaffected by extreme values.
3. **(2 Marks)** Missing records in `customer_age` belong to a multi-feature demographic manifold
   where customer behaviors correlate across multiple numerical attributes. Programmatically impute
   the missing age values using a local neighborhood approach based on geometric proximity to
   **3 peer records**.
   - *Constraint:* You must mathematically scale the relevant features before applying this technique
     to prevent magnitude dominance during Euclidean distance calculations, and inverse-transform
     them afterwards.

### 2.2 Anomaly Remediation & Distribution Alignment (6 Marks)

1. **(1.5 Marks)** Identify and permanently drop rows containing physically or logically impossible
   operational values — specifically local trip distances exceeding **200 km** or billing records
   recording **negative fare amounts**.
2. **(1.5 Marks)** Extreme surge fares represent genuine business activity but will distort linear
   models if left unconstrained. Using the spread between the first and third quartiles, calculate
   the upper statistical boundary (**Q3 + 1.5 × IQR**) and programmatically **cap** all fare values
   exceeding this threshold down to the upper boundary.
3. **(1.5 Marks)** `lifetime_rides` exhibits an exponentially widening positive tail. Apply a
   non-linear mathematical transformation to compress the extreme right-tail dispersion and align
   the feature closer to a bell-shaped distribution.
4. **(1.5 Marks)** An operational metric that is normal in a metropolitan market may be an extreme
   anomaly in a smaller tier city. Group the dataset by `city`, compute the mean `distance_km` per
   market, and print the resulting contextual baseline summary.

---

## Part 3 — Demonstrating the Downstream Effect (3 Marks)

Evaluates whether the Part 2 preprocessing decisions helped a linear optimization algorithm find a
better decision boundary.

### 3.1 Prepare the PREPROCESSED Dataset

Export the finalized in-memory DataFrame from Part 2 into a new CSV file.

**Mandatory naming & location:** save exactly as `UrbanGo_A1_cleaned.csv` inside the workspace folder.

### 3.2 Execute Assignment_1_part_3

Run `Assignment_1_part_3` from the same workspace. It performs provenance checks and executes a
Logistic Regression comparison.

**Requirement:** Do not modify, bypass, or decompile the supplied program. It automatically reads all
files in the workspace folder (the original `<student_email>.csv` and the output `UrbanGo_A1_cleaned.csv`).

**Reference code (what the binary executes behind the scenes):**

```python
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

def evaluate_model(X, y):
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    model = LogisticRegression(max_iter=100)
    model.fit(X_train, y_train)
    predictions = model.predict(X_test)
    return accuracy_score(y_test, predictions) * 100

raw_accuracy = evaluate_model(X_raw, y_raw)
clean_accuracy = evaluate_model(X_clean, y_clean)

print("=" * 55)
print("MODEL PERFORMANCE SCORECARD")
print("=" * 55)
print(f"Accuracy on RAW Data: {raw_accuracy:.2f}%")
print(f"Accuracy on PREPROCESSED Data: {clean_accuracy:.2f}%")
print("=" * 55)
```

### 3.3 Submission of Output (2 Marks)

Submit the final execution scorecard generated by the program.

*Marking:* 2.0 marks for submitting an untampered output showing **VERIFIED** status and the final
accuracy scorecard.

**Sample Output:**

```text
===============================================================
URBANGO ASSIGNMENT 1 — PART 3 EXECUTION
===============================================================
Student Email       : <student email>
Assignment ID       : A1
Dataset ID          : UG-B
Dataset Fingerprint : 8f4a...c921
Submission ID       : A1-XXXXXXXX
Verification Status : VERIFIED
---------------------------------------------------------------
MODEL PERFORMANCE SCORECARD
---------------------------------------------------------------
Accuracy on RAW Data          : 72.50%
Accuracy on PREPROCESSED Data : 81.25%
---------------------------------------------------------------
Execution Status : SUCCESS
===============================================================
```

> The README adds: do **not** display the generated RAW CSV filename or the absolute filesystem path
> in the final scorecard.

### 3.4 Technical Synthesis & Conclusion (1 Mark)

**Task:** Write a 1–2 sentence technical conclusion explaining why your preprocessing pipeline
improved downstream classification accuracy, and what preprocessing could be added to make
performance better.

**Bonus (Optional):** In terms of its learning, how would you apply these techniques in your day to
day work life?

*Marking:* 1.0 mark for correctly explaining that removing impossible sentinels, bounding heavy-tail
surge pricing, scaling feature manifolds, and avoiding mean-induced variance collapse prevented
gradient oscillation and allowed the model to converge onto a more accurate decision boundary.

---

## Final Submission Requirements

1. Your Python code (`.py` or `.ipynb`) and screenshots of all code outputs for Parts 1 and 2.
2. The generated HTML diagnostic profiling report (`profiling_report.html`).
3. The final preprocessed dataset (`UrbanGo_A1_cleaned.csv`) saved in the workspace folder.
4. The final printed scorecard from Part 3 showing VERIFIED status.
5. Your technical observations and written synthesis (from sections 1.3, 1.4, and 3.4).

---

# Appendix A — Student README (verbatim content)

## Prerequisites

Before starting Assignment 1, ensure Python 3 is installed. Install the required packages:

```bash
pip install pandas          # important
pip install scikit-learn    # important
```

## 0. Extract Files

E-learn portal is accessible within the Prayogshala portal. Copy `Assignment_bin.tar.gz` into the
portal under the workspace directory. Before starting, extract the assignment binaries:

```bash
cd ~/workspace;
tar -xvf Assignment_bin.tar.gz;
cp Assignment_bin/* ~/workspace/;
chmod +x ~/workspace/
```

## 1. Start Assignment 1 — Run Assignment_A1

Before starting Part 1, run the program supplied by the instructor:

```bash
./Assignment_A1
```

The program asks for your BITS institutional email. After successful execution, `Assignment_A1`
validates your identity and creates your student-specific Assignment 1 environment.

## 2. Student-Specific Raw Dataset

`Assignment_A1` creates your assigned RAW dataset: `<student_email>.csv`
(e.g. `student@wilp.bits-pilani.ac.in.csv`). This is the RAW dataset used as the starting point for
Parts 1 and 2.

Do not: rename it; modify or replace it; exchange it with another student's dataset; manually
recreate another student's dataset.

## 3. Execution Manifest

`Assignment_A1` also creates `~/workspace/A1_execution_manifest.json`. The manifest stores the
identity and dataset provenance required later by `Assignment_1_part_3`.

Do not: edit it; rename it; replace it; copy another student's manifest.

## 4–6. Parts 1, 2, 3

- **Part 1:** use `<student_email>.csv`, complete Questions 1.1–1.4.
- **Part 2:** continue from the same RAW dataset, complete Questions 2.1–2.4, save the final
  preprocessed dataset as `UrbanGo_A1_cleaned.csv`.
- **Part 3:** uses both dataset states (RAW `<student_email>.csv` and PREPROCESSED
  `UrbanGo_A1_cleaned.csv`). You do **not** need to create `X_raw`, `y_raw`, `X_clean`, or `y_clean`
  manually. Run `./Assignment_1_part_3`, which will validate the execution manifest, validate the
  identity-bound RAW dataset fingerprint, prepare the required model inputs, execute the controlled
  RAW vs PREPROCESSED comparison, and generate the final scorecard.

## 7. Final Part 3 Output

The final output should show: Student Email, Assignment ID, Dataset ID, Dataset Fingerprint, RAW
Accuracy, PREPROCESSED Accuracy, Submission ID, Verification Status.

Do not display the generated RAW CSV filename or the absolute filesystem path in the final scorecard.

## 8. File Convention

| Item | Name |
|---|---|
| Assigned RAW dataset | `<student_email>.csv` |
| Part 2 cleaned dataset | `UrbanGo_A1_cleaned.csv` |
| Manifest | `~/workspace/A1_execution_manifest.json` |
| Part 1 program | `Assignment_A1` |
| Part 3 program | `Assignment_1_part_3` |

## 9. Important

Run `Assignment_A1` first. Do not start Part 1 until the student-specific RAW dataset and execution
manifest have been created successfully. Keep the RAW dataset and manifest unchanged throughout.

---

# Appendix B — Portal Instructions (from Instruction_Screenshot.pdf)

1. Login to the E-learn portal from the Prayogshala portal.
2. Go to the course page > Assignment 1 > download `Assignment_bin.tar.gz`. The file lands in the
   Downloads folder.
3. Open the terminal and execute in sequence:

```bash
cd ../Downloads/;
cp Assignment_bin.tar.gz ~/workspace/;
cd ~/workspace;
tar -xvf Assignment_bin.tar.gz;
cp Assignment_bin/* ~/workspace/;
chmod +x ~/workspace/
```

4. Execute the bin `Assignment_A1`; it will prompt for email ID. The dataset will be created in the
   workspace folder — use it for the assignment.

---

# Appendix C — Practical Notes

These are observations about the bundle, not instructor text.

- **`chmod +x ~/workspace/` chmods the directory, not the scripts.** Use
  `chmod +x ~/workspace/Assignment_A1 ~/workspace/Assignment_1_part_3`, or run them as
  `python3 Assignment_A1`.
- **`cd ../Downloads/` in the screenshot assumes a particular starting directory.** `cd ~/Downloads`
  is safer.
- **Install `ydata-profiling` too** — the README omits it but Q1.3 requires it.
- **Both programs are Python 3 scripts, not compiled binaries**, and they read/write hardcoded
  `~/workspace/` paths. Everything is identity-bound to the BITS email via a dataset fingerprint, so
  the dataset must be generated and verified inside the Prayogshala lab.
- **Pipeline order matters in Part 2** — imputation happens before the drop/cap steps, so dropping
  rows first would change the KNN neighbours used for `customer_age`.
