# Introduction to Data Science — Sample Question Set With Model Answers

> **Course:** DSE ZG532 · BITS Pilani WILP
> **Sources combined:**
> 1. **Actual EC-2R exam screenshots** — `Exam Material/WhatsApp Image 2026-09-22 …` (Questions 1–6)
> 2. **Official sample paper** — `Introduction to Data Science - Sample Questions.pdf`
> 3. **Past Mid-Sem Regular & Makeup paper with answer key** — `Mid-Sem Regular&Makeup - Q & A.pdf`
> 4. **New practice questions** modelled on the above patterns
>
> **Concepts file:** [IDS_Complete_Study_Notes.md](IDS_Complete_Study_Notes.md)

---

## Contents

| Section | Content | Questions |
|---|---|---|
| [A](#section-a--actual-ec-2r-exam-paper-solved) | Actual EC-2R exam paper (from screenshots) | A1 – A6 |
| [B](#section-b--official-sample-questions-solved) | Official sample-question PDF | B1 – B8 |
| [C](#section-c--past-mid-sem-paper-solved) | Past Mid-Sem Regular + Makeup | C1 – C10 |
| [D](#section-d--extra-practice-set) | Extra practice in the same style | D1 – D12 |
| [E](#section-e--answer-templates) | Reusable answer templates | — |

### How answers are marked

- Definition / classification: state the term **and** the justification. One without the other loses marks.
- Numeric questions: **formula → substitution → answer**. The substitution line carries marks.
- Scenario questions: answer **inside the given business case**. Generic answers score low.
- Keep to bullets — the paper explicitly says "bullet points preferred".

---

# Section A — Actual EC-2R Exam Paper (Solved)

> Paper: `NSP-S1-26_EC2R_DSEZG532_Introduction to Data Science` · Section #1 · 6 questions.
> Each question repeats the instruction: answers may be typed or handwritten and uploaded against the *corresponding* question via QR code.

---

## A1. Online Learning Dropout  `[1 + 2 + 1 + 1 = 5 Marks]`

> An online learning platform has observed that nearly **25% of newly enrolled learners discontinue a course within the first four weeks**. The available data contains:
>
> `Student_ID, Age, Program, Videos_Watched, Quiz_Attempts, Average_Quiz_Score, Forum_Posts, Login_Frequency, Assignment_Submission, Dropped_Out`
>
> a) Convert the business requirement into an appropriate Data Science problem. **[1]**
> b) Identify the target variable and any three useful predictors. **[2]**
> c) Identify the appropriate Data Science task. **[1]**
> d) State one business action that can be taken using the model output. **[1]**

### Model Answer

**a) Business requirement → data science problem**

- Business need: reduce the 25% four-week dropout rate on the platform.
- Data science problem: **predict, for each newly enrolled learner, the probability of dropping out within the first four weeks**, using behaviour recorded in the early weeks.
- It is a **supervised binary classification** problem, since `Dropped_Out` is a known labelled outcome (Yes/No).

**b) Target variable and predictors**

| | Attribute | Why |
|---|---|---|
| **Target** | `Dropped_Out` | Binary label the platform wants to predict |
| Predictor 1 | `Login_Frequency` | Falling logins is the earliest disengagement signal |
| Predictor 2 | `Videos_Watched` | Measures actual content consumption, not just enrolment |
| Predictor 3 | `Average_Quiz_Score` | Low scores indicate struggle, a known dropout driver |

- Also acceptable: `Assignment_Submission` (commitment), `Forum_Posts` (community engagement), `Quiz_Attempts`.
- `Student_ID` must **not** be used — it is a nominal identifier with no predictive meaning.

**c) Data science task**

- **Classification** — specifically binary classification (churn / dropout prediction).
- Suitable algorithms: logistic regression, decision tree, random forest.
- Output is a **dropout risk score** per learner.

**d) One business action**

- Learners flagged **high risk** in week 1 are auto-assigned a mentor and receive a reminder/nudge sequence before week 4.
- Equally valid: offer a free doubt-clearing session, or simplify the first module for the flagged group.

---

## A2. E-commerce Analytics Progression  `[5 Marks]`

> An e-commerce company reports:
> 1. Sales decreased by 12% last month.
> 2. Analysis shows that delayed delivery caused most cancellations.
> 3. A model predicts that cancellations may increase to 18% next month.
> 4. The company recommends adding delivery partners in three cities.
>
> Classify each statement as **Descriptive, Diagnostic, Predictive or Prescriptive Analytics**, and explain the progression from one stage to another.

### Model Answer

| # | Statement | Type | Justification |
|---|---|---|---|
| 1 | Sales decreased by 12% last month | **Descriptive** | Summarises past data; answers *what happened*; a dashboard metric |
| 2 | Delayed delivery caused most cancellations | **Diagnostic** | Root-cause analysis; answers *why it happened*; found by drill-down / correlation |
| 3 | Cancellations may increase to 18% next month | **Predictive** | Forecast of a future value; answers *what is likely to happen*; model-based |
| 4 | Add delivery partners in three cities | **Prescriptive** | Recommends an action; answers *what should be done*; optimisation + business rules |

**Explaining the progression**

```mermaid
flowchart LR
    D["1 Descriptive<br/>Sales down 12%"] --> Dg["2 Diagnostic<br/>Delay causes cancellations"]
    Dg --> P["3 Predictive<br/>18% next month"]
    P --> Pr["4 Prescriptive<br/>Add partners in 3 cities"]
```

- **Descriptive → Diagnostic**: the 12% drop is only a symptom; we must find its cause, so we drill into cancellation reasons.
- **Diagnostic → Predictive**: once delivery delay is identified as the driver, it becomes a feature that forecasts future cancellations.
- **Predictive → Prescriptive**: a forecast alone changes nothing; the predicted 18% justifies a concrete corrective action.
- **Value and complexity rise** at each step; so does the data and technique required (statistics → correlation → ML → optimisation).
- The loop then repeats: after adding partners, new descriptive data measures whether the action worked.

---

## A3. Attribute Classification In A University Dataset  `[5 Marks]`

> A university dataset contains:
> `Student_ID, Age, Gender, Satisfaction_Level, Temperature_Celsius, Height_cm`
>
> Classify each attribute as **Nominal, Ordinal, Interval or Ratio**. Justify your classification based on the permitted mathematical operations.

### Model Answer

| Attribute | Type | Permitted operations | Justification |
|---|---|---|---|
| `Student_ID` | **Nominal** | `=`, `≠` | Only a label. ID 2001 is not "greater" than 2000; averaging IDs is meaningless |
| `Age` | **Ratio** | `=` `≠` `<` `>` `+` `−` `×` `÷` | Has a **true zero** (zero age = no age elapsed), so "30 is twice 15" is valid |
| `Gender` | **Nominal** | `=`, `≠` | Unordered categories; only equality testing is meaningful |
| `Satisfaction_Level` | **Ordinal** | `=` `≠` `<` `>` | Ordered categories (Low < Medium < High), but the gaps are **not equal or measurable**, so subtraction is invalid |
| `Temperature_Celsius` | **Interval** | `=` `≠` `<` `>` `+` `−` | Differences are meaningful (30 °C − 20 °C = 10 °C) but 0 °C is **arbitrary**, not absence of heat, so 40 °C is *not* twice 20 °C |
| `Height_cm` | **Ratio** | all operations | True zero (0 cm = no height), so ratios such as "180 cm is 1.5 × 120 cm" are valid |

**Two-line rule to quote in the exam**

- Interval vs Ratio is decided **only** by the existence of a true zero.
- Nominal vs Ordinal is decided **only** by whether the categories have a meaningful order.

---

## A4. Sampling Strategy For A University Survey  `[1 + 3 + 1 = 5 Marks]`

> A university has:
>
> | Program | Students |
> |---|---|
> | UG | 6,000 |
> | PG | 3,000 |
> | PhD | 1,000 |
>
> A survey requires a representative sample of **500 students**.
> a) Identify an appropriate sampling strategy. **[1]**
> b) Calculate the number of students to sample from each program. **[3]**
> c) Explain why simple random sampling might produce a less representative sample. **[1]**

### Model Answer

**a) Sampling strategy**

- **Stratified random sampling with proportional allocation.**
- Strata = the three programs (UG, PG, PhD), because they are internally similar and mutually exclusive.
- Proportional allocation preserves each program's share in the sample.

**b) Calculation**

```
Population N = 6,000 + 3,000 + 1,000 = 10,000
Sample n = 500
Sampling fraction f = n / N = 500 / 10,000 = 0.05  (5%)

nᵢ = n × (Nᵢ / N)
UG  : 500 × (6,000 / 10,000) = 500 × 0.6 = 300
PG  : 500 × (3,000 / 10,000) = 500 × 0.3 = 150
PhD : 500 × (1,000 / 10,000) = 500 × 0.1 =  50
Check: 300 + 150 + 50 = 500 ✓
```

| Program | Population | Share | Sample size |
|---|---|---|---|
| UG | 6,000 | 60% | **300** |
| PG | 3,000 | 30% | **150** |
| PhD | 1,000 | 10% | **50** |
| **Total** | **10,000** | 100% | **500** |

**c) Why simple random sampling is weaker here**

- SRS gives every student an equal chance, but **does not guarantee** the programme mix of the sample.
- PhD students are only 10% of the population, so by chance they may be badly under- or over-represented.
- The smaller the stratum, the larger this sampling error — PhD opinions could almost vanish from the results.
- Stratification **removes** this risk by fixing each group's count in advance, so it gives lower variance for the same sample size.

---

## A5. Dissimilarity Using Simple Matching  `[2 + 2 + 1 = 5 Marks]`

> Four customers are described using:
>
> | Customer | City | Payment | Device |
> |---|---|---|---|
> | A | Chennai | Card | Mobile |
> | B | Chennai | UPI | Mobile |
> | C | Delhi | Card | Desktop |
>
> Using simple matching:
> a) Calculate the dissimilarity between A and B. **[2]**
> b) Calculate the dissimilarity between A and C. **[2]**
> c) Identify which customer is more similar to A. **[1]**

### Model Answer

All three attributes (City, Payment, Device) are **nominal**, so the simple-matching coefficient applies:

```
d(i, j) = (p − m) / p        where p = total attributes, m = number of matches
s(i, j) = 1 − d(i, j)
```

**a) A vs B**

| Attribute | A | B | Match? |
|---|---|---|---|
| City | Chennai | Chennai | ✓ |
| Payment | Card | UPI | ✗ |
| Device | Mobile | Mobile | ✓ |

```
p = 3, m = 2
d(A, B) = (3 − 2) / 3 = 1/3 ≈ 0.33
s(A, B) = 1 − 0.33 = 0.67
```

**b) A vs C**

| Attribute | A | C | Match? |
|---|---|---|---|
| City | Chennai | Delhi | ✗ |
| Payment | Card | Card | ✓ |
| Device | Mobile | Desktop | ✗ |

```
p = 3, m = 1
d(A, C) = (3 − 1) / 3 = 2/3 ≈ 0.67
s(A, C) = 1 − 0.67 = 0.33
```

**c) Which customer is more similar to A?**

- **Customer B**, because `d(A, B) = 0.33 < d(A, C) = 0.67`.
- Lower dissimilarity = higher similarity; B agrees with A on 2 of 3 attributes, C on only 1.
- Business reading: A and B are the same city and device, so they belong in the same segment.

---

## A6. Feature Engineering On A Loan Dataset  `[5 Marks]`

> A loan dataset contains:
> `Annual_Income, Total_Debt, Age, Loan_Amount, Employment_Start_Date`
>
> Propose **three potentially useful new features** for predicting loan default. For each feature, give the formula/derivation and explain why it could be more informative than the original variables.

### Model Answer

| # | New feature | Formula / derivation | Why more informative than the raw columns |
|---|---|---|---|
| 1 | **Debt-to-Income Ratio (DTI)** | `DTI = Total_Debt / Annual_Income` | Income and debt are meaningless alone. ₹20L debt is safe on ₹50L income but severe on ₹5L. DTI normalises repayment burden across all income levels, and is the standard credit-risk indicator |
| 2 | **Loan-to-Income Ratio (LTI)** | `LTI = Loan_Amount / Annual_Income` | Measures the size of the *new* obligation relative to repayment capacity. Captures over-borrowing that neither `Loan_Amount` nor `Annual_Income` shows separately |
| 3 | **Employment Tenure (years)** | `Tenure = (Application_Date − Employment_Start_Date) / 365.25` | A raw date is a non-usable interval attribute for a model. Converting it to a duration creates a **ratio** feature that directly measures income stability; short tenure strongly correlates with default risk |

**Optional fourth feature if more marks are available**

| Feature | Formula | Why |
|---|---|---|
| Total Debt Burden after loan | `(Total_Debt + Loan_Amount) / Annual_Income` | Shows post-sanction exposure, which is what actually causes default |
| Age band | Bucket `Age` into 18–25, 26–40, 41–60, 60+ | Converts a continuous attribute into life-stage groups, capturing non-linear risk |

**Points to state explicitly (marks are given for these lines)**

- All three are **derived features** built by feature construction using domain knowledge.
- Ratios are **scale-free**, so they behave well for distance-based and linear models.
- They reduce dimensionality: two correlated columns collapse into one meaningful signal.
- They make the model easier to explain to a credit officer — an important requirement in lending.

---

# Section B — Official Sample Questions (Solved)

> Source: `Introduction to Data Science - Sample Questions.pdf`

---

## B1. Agree / Disagree With Justification

> Challenge the accuracy of the statements (agree/disagree) with short justification. *(2–4 lines of bullets each)*
> - The roles of a Data Scientist and a Business Analyst are identical.
> - Training set should be larger than Test set. If so, write the ideal split.

### Model Answer

**Statement 1 — "Data Scientist and Business Analyst roles are identical": DISAGREE**

- A data scientist **builds predictive/prescriptive models** using statistics, programming and ML.
- A business analyst **interprets business needs** and reports descriptive insights to stakeholders.
- Skill sets differ: Python/R, ML, maths vs. domain knowledge, requirements, dashboards, Excel/Tableau.
- Time direction differs: data scientist looks **forward** (what will happen); business analyst looks **backward** (what happened).
- Overlap exists in domain understanding and communication — but the roles are complementary, not identical.

**Statement 2 — "Training set should be larger than the test set": AGREE**

- A model **learns** patterns from the training data, so it needs the majority of examples.
- Too little training data → underfitting and high variance in learned parameters.
- The test set only needs to be large enough to estimate performance reliably.
- **Ideal split: 70:30 or 80:20** (train:test); with a validation set, **60:20:20**.
- The test set must be kept completely unseen during training, otherwise the accuracy estimate is optimistic.

---

## B2. New-Market Expansion Case (Products A–E, Segments C1–C4)

> A company with five products (A–E) plans to expand to a new market believed similar to the current one. Existing customers are classified into four segments (C1–C4). About 10,000 customers exist in the new market. Data is available for existing customers and acquired for the new market.
> a) What kind of data science problem is this?
> b) Explain various stages of the data science process for this case study.
> c) What type of model would be appropriate?

### Model Answer

**a) Type of problem**

- It is a **supervised classification** problem.
- Specifically: assign each of the ~10,000 new-market customers to one of the four **known** segments C1–C4.
- Labels already exist (from the current market), so this is **not** clustering.
- Because the markets are assumed similar, the current market's labelled data becomes the **training set**, and the new market data is the **scoring set**.

**b) Data science process, applied to this case**

| Stage | Applied to this expansion case |
|---|---|
| Problem description | "Predict the segment (C1–C4) of each new-market customer, so that products A–E can be targeted correctly" |
| Data preparation | Merge existing customer data with acquired new-market data; fix missing demographics, duplicate customers, inconsistent formats; align the two schemas so the same attributes exist in both |
| Exploratory data analysis | Compare distributions of the two markets (age, income, purchase frequency); verify the "markets are similar" assumption; find which attributes separate C1–C4 |
| Setup | Partition existing customers into train/test (70:30); **balance the data** if one segment is much smaller; set a baseline (e.g. assign everyone to the largest segment) |
| Modeling | Train a classifier — decision tree, random forest or k-NN — on the labelled current-market customers |
| Evaluation | Test on held-out current-market customers using accuracy, precision, recall and the confusion matrix; beat the baseline |
| Deployment | Score all 10,000 new-market customers; hand segment tags to marketing so products A–E are targeted per segment; monitor and retrain as real new-market behaviour arrives |

**c) Appropriate model**

- A **classification model** — decision tree or random forest is the best answer here.
- Justification to write:
  - Customer data mixes categorical and numeric attributes; trees handle both without scaling.
  - Trees give **interpretable rules** that the marketing team can act on ("income > X and age < Y → C2").
  - The output must be one of four discrete classes, which is exactly what a classifier produces.
- If segments did **not** already exist, the answer would change to **clustering (k-Means)**.

---

## B3. Data Quality Issues In A Given Dataset

> a) Identify the quality issues with the dataset.
> b) Write any one method to rectify the issues identified.
> c) Identify the data type of the attributes **Blood type** and **Body temperature**; also state whether each is discrete or continuous.

### Model Answer

**a) Quality issues — checklist to apply to any table given in the exam**

| Issue | What to look for in the table |
|---|---|
| Missing values | Blank cells in any column |
| Duplicate records | The same person/row appearing twice |
| Inconsistent formats | Dates as `01-Jan-1995`, `Dec-01-1996`, `01-01-1959` in one column |
| Invalid / non-conforming values | Percentage = 175, impossible dates such as 30-Feb, month 4 with 31 days |
| Inconsistent coding | "F" and "Female" for the same category |
| Outliers / noise | Values far from the rest of the column |
| Small dataset size | Too few rows to draw statistical conclusions |

**b) One rectification method per issue**

- Missing values → **imputation**: mean for symmetric numeric, median for skewed numeric, mode for categorical; or model-based (decision tree / regression) imputation.
- Duplicates → de-duplicate on the key attributes, keeping one record.
- Inconsistent dates → **standardise to one format** (ISO `YYYY-MM-DD`) during transformation.
- Invalid values → apply **domain range rules** (0 ≤ percentage ≤ 100) and treat violations as missing, then impute.
- Small dataset → collect more data or use sampling/augmentation techniques.

**c) Attribute types**

| Attribute | Scale type | Discrete / Continuous | Justification |
|---|---|---|---|
| **Blood type** (A, B, AB, O) | **Nominal** | **Discrete** | Unordered labels; only `=`/`≠` are meaningful; finite set of values |
| **Body temperature** (°C or °F) | **Interval** | **Continuous** | Differences meaningful, but 0 °C is arbitrary (not absence of heat), so ratios are invalid; measured on a real-number scale |

---

## B4. Exploratory vs Explanatory Analysis In A Domain

> Using a case scenario in a particular domain, describe exploratory and explanatory analysis. Explain the circumstances (for the same scenario) under which you would use these two types.

### Model Answer — scenario: hospital readmission analysis

**a) Definitions**

| | **Exploratory analysis** | **Explanatory analysis** |
|---|---|---|
| Purpose | Understand what is in the data; generate hypotheses | Communicate a specific, already-confirmed finding |
| Audience | The analyst and the data team | Hospital management / stakeholders |
| Stage | Beginning of the project | End of the project |
| Output | Many rough plots, tables, correlations | One or two polished, annotated charts plus a narrative |
| Mindset | Open every oyster looking for pearls | Present only the pearls you found |

**b) Circumstances within the hospital scenario**

- **Exploratory** — after collecting two years of admission records, the analyst plots readmission rates by age, ward, diagnosis, length of stay and discharge day; nothing is known yet, and 30–40 quick charts are produced to find which factors matter.
- **Explanatory** — after finding that **patients discharged on weekends have 22% higher readmission**, the analyst builds a single annotated bar chart for the hospital board with a clear title, a recommendation, and the cost impact.
- Rule of thumb: exploratory answers *"what is going on?"*; explanatory answers *"here is what you must act on."*
- Using exploratory output in a board presentation confuses stakeholders — that is the classic mistake to mention.

---

## B5. Data Scientist vs Business Analyst

> a) Explain the role of the Data Scientist and the Business Analyst.
> b) Identify the key difference.

### Model Answer

**a) The two roles**

| | **Data Scientist** | **Business Analyst** |
|---|---|---|
| Core job | Designs modelling processes, builds algorithms and predictive models, performs custom analysis | Gathers business requirements, analyses business performance, recommends process improvements |
| Typical questions | "What will happen? What should we do?" | "What happened? How is the business performing?" |
| Techniques | ML, statistics, programming, ETL, big-data tooling | Reporting, dashboards, requirement analysis, domain modelling |
| Tools | Python, R, SQL, Spark, scikit-learn | Excel, Tableau/Power BI, SQL, BI suites |
| Deliverable | Trained models, statistical insight, data products | Reports, KPI dashboards, requirement documents |

**b) The key difference (one line to box)**

- The data scientist works on **unknown, forward-looking questions using advanced statistical/ML methods**, whereas the business analyst works on **known, backward-looking business questions using descriptive analysis and reporting**.
- Secondary difference: the data scientist needs deep mathematics and programming; the business analyst needs deep domain and stakeholder skills.

---

## B6. The Miscalibrated Tyre Gauge  `[Yes / No + one line]`

> Raju measures the pressure of all tyres coming into his garage and records the values. Unknown to him, his gauge is miscalibrated and **adds 3 psi to each reading**. Using the textbook definition of noise, is this error considered noise?

### Model Answer

- **No.**
- **Justification (one line):** noise is a **random** error or variance in a measured value, but this gauge adds a **constant +3 psi to every reading**, which is a systematic error (bias), not random variance.
- Extra line if marks allow: the error is fully correctable by subtracting 3 psi; random noise cannot be removed this way.

---

## B7. Data Scientist As The Bearer Of Bad News

> Describe a scenario where a data scientist needs to be the bearer of bad news.
> a) Identify the scenario. b) Explain it properly.

### Model Answer

**a) Scenario**

- A retail company has spent heavily on a new loyalty programme and asks the data science team to quantify the revenue lift.

**b) Explanation**

- Analysis of 12 months of transactions shows **no statistically significant increase** in spend by enrolled customers versus a matched control group.
- The apparent "lift" management was celebrating comes from **selection bias**: high-spending customers were the ones who joined, so they would have spent that money anyway.
- The data scientist must report that the programme is **not delivering the claimed ROI**, contradicting senior sponsors who championed it.
- Professional handling:
  - Lead with the method and the control-group design, so the finding cannot be dismissed.
  - Show the evidence visually and state the confidence level honestly.
  - Separate the *finding* from *blame*, and offer next steps (redesign the offer, A/B test a new version).
- Ethical point to state: hiding or softening such a result violates the data scientist's duty to let evidence drive decisions.

**Other acceptable scenarios**

- A fraud model reveals fraud coming from inside the organisation.
- Data shows a hiring or lending model is **biased** against a protected group.
- A forecast shows the flagship product will lose money next quarter.

---

## B8. Four Outcomes Of The Research-Goal / Project-Charter Step

> List the four outcomes of the data science project step where the research goal and project charter are defined.

### Model Answer

The first phase — **setting the research goal** — must produce a **project charter** containing:

1. **A clear research goal** — what the project is going to deliver, in one statement.
2. **The project mission and context** — why the business needs it and how it fits current operations.
3. **How the analysis will be performed** — the methodology, resources, data and people required.
4. **What resources / deliverables and timeline are agreed** — deliverables, measure of success, budget and schedule, with the charter signed off by the stakeholder.

- Purpose: everyone agrees on **what, why, how and when** before any data work starts.
- Without a charter, scope creep and mismatched expectations kill the project later.

---

# Section C — Past Mid-Sem Paper (Solved)

> Source: `Mid-Sem Regular&Makeup - Q & A.pdf` — answer keys summarised and completed.

---

## C1. Covid Vaccination Dataset  `[8 Marks]`

> Data columns: `Age, High Blood Pressure, Diabetic, Taking blood thinners, Taking Insulin, Covid Vaccinated, Vaccine type, Vaccinated date` (9 rows, several blanks, dates like `5-19-2021`, `30-2-2021`, `31-4-2021`).
> a) Identify the type of each attribute **[4]** b) Identify quality issues **[2]** c) One rectification method **[1]** d) Justify that a decision tree can model this data **[1]**

### Model Answer

**a) Attribute types**

| Attribute | Type | Reason |
|---|---|---|
| Age | **Ratio** | True zero; ratios valid |
| High Blood Pressure (Y/N) | **Nominal** (binary) | Two unordered categories |
| Diabetic (Y/N) | **Nominal** (binary) | Two unordered categories |
| Taking blood thinners (Y/N) | **Nominal** (binary) | Two unordered categories |
| Taking Insulin (Y/N) | **Nominal** (binary) | Two unordered categories |
| Covid Vaccinated (Y/N) | **Nominal** (binary) | Two unordered categories |
| Vaccine type (Covaxin / Covishield) | **Nominal** | Unordered labels |
| Vaccinated date | **Interval** | Ordered with meaningful differences, but no true zero |

**b) Quality issues** *(quote the dimension names: accuracy, completeness, consistency, validity, redundancy)*

- **Completeness** — many blank cells across High Blood Pressure, Diabetic, Vaccine type, Covid Vaccinated.
- **Consistency** — date formats mix `26-01-2021`, `13-5-2021` and `5-19-2021` (dd-mm vs mm-dd).
- **Validity / accuracy** — `30-2-2021` and `31-4-2021` are impossible calendar dates.
- **Logical inconsistency** — a vaccine type and date exist where "Covid Vaccinated" is blank.
- **Quantity issue** — only 9 rows; far too small for statistical conclusions.

**c) One rectification method**

- Missing categorical values (Diabetic, Vaccine type) → impute with the **mode** of the column.
- Missing Age → impute with **median** (age here is skewed towards elderly).
- Invalid dates → apply a calendar-validity rule, mark as missing, then standardise all dates to `DD-MM-YYYY`.
- Small dataset → collect more records / use appropriate **sampling** techniques.

**d) Why a decision tree suits this data**

- **Data type**: most attributes are categorical and relationships are non-linear; decision trees handle categorical and non-linear data directly, without normalization or encoding.
- **Quality**: after fixing missing and inconsistent values, trees are also robust to remaining noise and do not assume any distribution.
- **Variables**: a clear dependent variable can be defined — e.g. `Covid Vaccinated` or `Vaccine type` as the class label, with Age, comorbidities and medication as independent variables.
- **Interpretability**: the resulting IF-THEN rules are readable by doctors, which matters in a medical setting.

---

## C2. "Data Scientists Are Like Unicorns"  `[1 + 1 + 1 = 3 Marks]`

### Model Answer

- A unicorn is *"something highly desirable but very difficult to find or obtain"* — the analogy is correct.
- A true data scientist is expected to combine **all** of:
  1. **Programming** — Python or R, plus SQL and Excel.
  2. **Mathematics and statistics** — at a level sufficient to interpret models, not just run them.
  3. **Visualisation and communication** — Tableau/D3 plus storytelling to stakeholders.
  4. **Data mining / machine learning** technique knowledge.
  5. **Relevant domain experience**, which only comes with years in the industry.
- Because one person rarely holds all five, organisations build a **team**:

| Role | Profile |
|---|---|
| Chief Analytics Officer | Data science + programming + domain + leadership and vision |
| Data Analyst | Programming and analysis skills |
| Business Analyst | Domain expertise, visualisation |
| Data Architect | Defines database architecture and data warehousing |
| Data Engineer | Implements, tests and maintains the infrastructure the architect defines |

---

## C3. Role In An Insurance Fraud Project (Data Pipeline Task)  `[3 Marks]`

> You are tasked with establishing the data pipeline for a claims-fraud analytics model. Who are you? What role are you playing? Discuss your responsibilities.

### Model Answer

- **Role: Data Engineer** (the answer key also accepts *Data Analyst* responsible for pipelines — state the role clearly and stay consistent).
- **Role description**: responsible for identifying data sources, establishing cleansing and transformation rules, and designing storage so retrieval is fast and data integrity is maintained.

**Responsibilities**

- Identify all internal and external claim data sources (policy DB, claims DB, payments, third-party fraud lists).
- Determine requirements for new databases and identify installation solutions.
- Build extraction, cleansing and transformation rules; handle missing, duplicate and inconsistent claim records.
- Design storage (data warehouse / data lake) and the loading schedule; implement the pipeline as a DAG in a tool such as Airflow.
- Create systems to keep sensitive customer data secure and compliant.
- Coordinate with data scientists so the feature tables they need arrive on time.
- Troubleshoot technical issues; maintain code libraries and operating procedures for the team.
- Publish design reports and identify improvement areas in current systems.

---

## C4. Hotel Meal-Ordering App  `[8 Marks]`

> Mr Shravan wants to use client meal-ordering behaviour to enhance his e-commerce app and make suggestions.
> a) Data used **[1]** b) Attribute types **[2]** c) Type of analytics **[1]** d) Facet of data **[1]** e) Internal or external data **[1]** f) Best methodology and justification **[2]**

### Model Answer

**a) Data used**

- Item purchased, quantity purchased, customer who purchased the item, customer rating for the item, item description, item category.
- Also acceptable: order timestamp, order value, payment mode.

**b) Attribute types**

| Attribute | Type |
|---|---|
| Item purchased | Nominal |
| Quantity purchased | Ratio |
| Customer who purchased | Nominal |
| Customer rating for an item | **Ordinal** |
| Item description | Nominal |
| Item category | Nominal |

**c) Type of analytics**

- **Predictive analytics** — the app predicts what a client is likely to order and recommends it.
- (A recommendation engine is the data science task.)

**d) Facet of data**

- **Structured data** — orders are stored in defined fields in the app database.

**e) Internal or external**

- **Internal data** — generated by the hotel's own application and customers.

**f) Best methodology**

- **CRISP-DM**.
- Justification:
  - Six phases cover business understanding through deployment, matching an app-enhancement project.
  - It is **iterative** — recommendations must be refined as new ordering data arrives.
  - Data understanding explicitly surfaces quality issues in the order history early.
  - It is tool- and industry-independent, so a small hotel team can follow it without specialist software.

---

## C5. Cricket Dataset With Missing Values  `[8 Marks]`

> `Name, Weight, Gender, Play Cricket/Not` with blanks in Weight and Gender.
> a) Attribute types **[1]** b) Quality issues **[1]** c) Which of mean/mode/median is ideal for imputing each attribute, with justification **[4]** d) Can we derive any conclusion statistically? **[1]** e) Data model to use **[1]**

### Model Answer

**a) Attribute types**

| Attribute | Type |
|---|---|
| Name | Nominal |
| Weight | Ratio |
| Gender | Nominal |
| Play Cricket/Not | Nominal (binary class label) |

**b) Quality issues**

- **Completeness** — Weight missing for Priyanka; Gender missing for Aalia and Shalini.
- **Quantity** — only 8 rows, too small for reliable modelling.
- No duplicates or invalid values are visible.

**c) Ideal imputation per attribute**

| Attribute | Method | Justification |
|---|---|---|
| Weight | **Mean** (or **median**) | Numeric ratio attribute. Values 45–61 are fairly symmetric with no extreme outlier, so the **mean** is appropriate. If an extreme value existed, the **median** would be safer because it resists outliers |
| Gender | **Mode** | Categorical nominal attribute — mean and median are undefined for categories; the most frequent category (M) is the only sensible fill |
| Name | Neither | An identifier; it must not be imputed. Leave as missing or drop the record |
| Play Cricket/Not | Neither | This is the **class label**; imputing it would invent the answer. Rows with a missing label should be dropped |

**d) Statistical conclusion from the data**

- Use simple descriptive statistics against the class variable, for example:
  - Men: 2 of 4 play cricket = **50%**. Women: 1 of 2 play cricket = **50%**.
  - Inference: **gender shows no difference** in playing cricket in this sample.
- Add the caveat: with only 8 rows the result is **not statistically significant**; a larger sample is required.

**e) Data model**

- A **decision tree** classifier.
- Justification: mostly categorical attributes, non-linear relationship, very few attributes, handles missing values, and produces readable rules with `Play Cricket/Not` as the dependent variable.

---

## C6. Business Intelligence vs Data Science (Insurance Claims)  `[3 Marks]`

### Model Answer

| # | Business Intelligence | Data Science |
|---|---|---|
| 1 | Approach is **descriptive** — what happened to the claims | Approach is **explorative/predictive/prescriptive** — which claims will cause losses |
| 2 | **Backward-looking**: visualises which claim category caused past losses | **Forward-looking**: models claims to identify those prone to loss or fraud before payout |
| 3 | Deliverables are **reports, tables, charts, dashboards** | Deliverables are **statistical models, visualisations, insight and stories** |
| 4 | Works mainly on structured, warehoused data | Works on structured, semi-structured and unstructured data |
| 5 | Answers **known** questions | Discovers **unknown** patterns and questions |

- Applied line to add: BI tells the insurer that motor claims rose 20% last quarter; data science predicts which incoming claims are likely fraudulent so they can be investigated first.

---

## C7. Intrusion-Detection Model Presentation  `[3 Marks]`

> You must articulate the business problem and showcase results with compelling stories. Which role are you playing?

### Model Answer

- **Role: Data Journalist.**
- Description and responsibilities:
  - Helps make sense of data output by **putting it in the right context**.
  - Articulates the business problem and shapes analytics results into **compelling stories**.
  - Presents ideas to stakeholders and represents the data team to people unfamiliar with statistics.
  - Bridges the technical team and the business audience so findings lead to action.
- Preferred skills: SQL, Python, R, Scala, Carto, D3, QGIS, Tableau; plus narrative and visual-design ability.

---

## C8. Four Analytics Tasks In An Ed-Tech Organisation  `[8 Marks]`

### Model Answer

| Task | Question | Data attributes required | Expected outcome |
|---|---|---|---|
| **Descriptive** | How many students joined these courses? | Student ID, Student Name, Course ID | Chart/table of Course ID vs count of students |
| **Diagnostic** | Why is course A more popular than course B? | Course ID, count, rating, job trend | Reasoning: the driver behind the popularity gap |
| **Predictive** | How many students will join a particular course? | Historical Course ID, Month of joining, count | Course ID vs predicted enrolment count |
| **Prescriptive** | How do we get more enrolments for a course? | Institute rating, Course name, course rating, job trend, students placed, advertisement and its impact | Simulated enrolment count under each recommended action |

---

## C9. Food-Delivery Start-up (Regular Exam Q5)  `[2 + 2 + 4 = 8 Marks]`

> Bengaluru has 12,000+ restaurants. As a start-up entrepreneur and data scientist: a) business goal / KPIs and the role of data b) three data sources, dataset definition, model type c) project methodology plus roles and responsibilities per phase.

### Model Answer

**a) Business goal and KPIs**

- **Goal**: to be the **fastest food-delivery app with the widest restaurant coverage** in the city.
- KPIs:
  - Reduce average delivery time.
  - Time to assign the nearest valet after an order is placed.
  - Total time from order placement to delivery.
  - Restaurant preparation time and valet travel time, tracked separately.
  - Accuracy of the estimated delivery time shown before checkout (builds trust and loyalty).
  - Coverage growth: add 5 new restaurants and 10 valets per week.

- **Role of data** (state at least four):

| Data | Role |
|---|---|
| Customer order history | Identifies preferences; personalises recommendations and re-orders the restaurant list |
| Restaurant menu | Enables personalised and similar-item recommendations |
| All transaction data | Peak hours, popular dishes and restaurants, best payment method, valuable customers, dynamic pricing and offers |
| GPS data | Valet, restaurant and customer locations; best routes; correcting saved addresses |
| Ratings and reviews | Better personalised recommendations of food and restaurants |

**b) Data sources, dataset and model**

- Three sources:
  1. Transaction / app-browsing data from the customer's app (device + app server).
  2. GPS data of customers, valets and restaurants (device + app server).
  3. Ratings and review data (server).
- Dataset (feature matrix with variable types):

| Feature | Type |
|---|---|
| Customer ID, Restaurant ID, Item ID | Nominal |
| Order value, distance (km), prep time (min), delivery time (min) | Ratio |
| Order timestamp | Interval |
| Customer rating (1–5) | Ordinal |
| Payment mode, city | Nominal |
| Delivered late (Y/N) | Nominal (target) |

- Model type:
  - **Regression** to predict delivery time (numeric target).
  - **Recommendation engine** (collaborative filtering) for personalised food suggestions.
  - **Classification** to flag orders at risk of being late.

**c) Methodology plus roles**

| Phase | Work done | Owner |
|---|---|---|
| Business understanding | Define goal and KPIs | Product owner + data scientist |
| Data requirements | List the attributes needed for each KPI | Data scientist |
| Data acquisition | Build ingestion from app, GPS and review systems | Data engineer |
| Data understanding | Profile the data, check quality and coverage | Data analyst |
| Data preparation | Clean, join, engineer features (distance, prep time) | Data engineer + data scientist |
| Modelling | Train delivery-time and recommendation models | Data scientist |
| Model evaluation | Validate against held-out orders; compare to baseline ETA | Data scientist |
| Deployment and feedback | Ship to the app, monitor KPI movement, retrain | ML engineer + product owner |

---

## C10. eSports Blogging Venture (Makeup Exam Q5)  `[2 + 2 + 2 + 2 = 8 Marks]`

### Model Answer

**a) Goals and objectives**

- **Goal**: capture the marketing and merchandising market of the eSports domain through an online blogging platform.
- Objectives:
  - Identify the user base and growth of the eSports industry over the last five years.
  - Establish that eSports tournaments have become a **spectator sport**.
  - Quantify tournament popularity to prove a potential market for online blogging.
  - Associate closely with eSports games to tap sports marketing and merchandising through the blog.

**b) Data acquisition and understanding**

- Sources and their facets:

| Source | Facet |
|---|---|
| Online game registrations | Structured |
| Game/competition details published by hosts | Unstructured |
| Participant team information | Unstructured |
| Recorded gameplay | Streaming / real-time |
| Tournament sponsor details | Structured |
| Companies interested in gaming advertisements | Structured |
| Live viewership and comments | Streaming / real-time |

- Data understanding checklist:
  - Understand data touch points in the business process.
  - Know where data originates, how it is processed, what decisions it drives, where it is stored, how it flows downstream.
  - Deep-dive into the business meaning and the existing rules in current systems.
  - Check whether known external industry data can improve the decision boundary.
  - Check for target-label availability and late-arriving labels.

**c) Modelling**

- Choose the data model that matches the data:

| Model | Use |
|---|---|
| Hierarchical | Tree-structured data |
| Relational | Tables and relations — registrations, sponsors |
| Network / graph | Player–team–tournament relationships |
| Object-based (object-oriented, ER) | Real-world entity representation |
| Object-relational | Hybrid |

**d) Analysis and communication**

- Analysis techniques: text analysis (comments, blogs), statistical analysis, diagnostic, predictive and prescriptive analysis.
- Communication:
  - Link data → analysis → conclusion so investors see the chain of evidence.
  - Use explanatory visuals with a clear narrative and revenue projection.
  - Justify the methodology (**CRISP-DM**) for its iterative business-first structure.

---

# Section D — Extra Practice Set

> Same shapes as the exam. Answers are collapsed — attempt first, then expand.

---

## D1. Retail Transaction Attributes  `[5 Marks]`

A retail dataset contains: `Bill_No, Customer_Age, Membership_Tier (Silver/Gold/Platinum), Purchase_Date, Amount_Paid, Store_Pincode`.
Classify each attribute as nominal / ordinal / interval / ratio, and state discrete or continuous.

<details><summary>Model answer</summary>

| Attribute | Scale | Discrete/Continuous | Reason |
|---|---|---|---|
| Bill_No | Nominal | Discrete | Identifier; only `=`/`≠` |
| Customer_Age | Ratio | Continuous | True zero; ratios valid |
| Membership_Tier | Ordinal | Discrete | Ordered categories, unequal gaps |
| Purchase_Date | Interval | Discrete | Differences meaningful, zero arbitrary |
| Amount_Paid | Ratio | Continuous | True zero; ₹200 is twice ₹100 |
| Store_Pincode | Nominal | Discrete | Numeric-looking label, arithmetic meaningless |

</details>

---

## D2. Hospital Sampling  `[5 Marks]`

A hospital has 4,500 outpatients, 1,200 inpatients and 300 ICU patients. A quality survey needs 400 responses.
a) Name the strategy. b) Compute per-stratum counts. c) State one risk of using SRS.

<details><summary>Model answer</summary>

```
N = 4,500 + 1,200 + 300 = 6,000     n = 400     f = 400/6,000 = 0.0667
Outpatients: 400 × 4,500/6,000 = 300
Inpatients : 400 × 1,200/6,000 =  80
ICU        : 400 ×   300/6,000 =  20
Check: 300 + 80 + 20 = 400 ✓
```

- Strategy: **stratified random sampling, proportional allocation**; strata = care type.
- SRS risk: ICU is only 5% of the population, so a random draw could return very few (or zero) ICU patients, and the most critical care experience would be missing from the results.

</details>

---

## D3. Normalize A Salary  `[5 Marks]`

Salary has min ₹18,000, max ₹2,40,000, mean ₹72,000 and SD ₹36,000. For a salary of ₹90,000 compute
a) min-max to [0,1] b) z-score c) decimal scaling d) say which to use if extreme salaries exist.

<details><summary>Model answer</summary>

```
a) min-max = (90,000 − 18,000) / (2,40,000 − 18,000) = 72,000 / 2,22,000 = 0.324
b) z-score = (90,000 − 72,000) / 36,000 = 18,000 / 36,000 = 0.5
c) decimal: max |x| = 2,40,000 → j = 6 → 90,000 / 1,000,000 = 0.09
d) Use z-score — min-max is dominated by extreme values, and z-score also works when
   the true min/max are unknown or a future value falls outside the original range.
```

</details>

---

## D4. Binning A Sensor Reading  `[5 Marks]`

Values: `12, 14, 15, 18, 21, 24, 28, 30, 35, 40, 42, 48`. Discretize into 3 bins using
a) equal-width b) equal-depth. c) State one weakness of equal-width binning.

<details><summary>Model answer</summary>

```
a) Equal width: width = (48 − 12)/3 = 12
   Bin 1 [12, 24): 12, 14, 15, 18, 21
   Bin 2 [24, 36): 24, 28, 30, 35
   Bin 3 [36, 48]: 40, 42, 48

b) Equal depth: 12/3 = 4 values per bin
   Bin 1: 12, 14, 15, 18
   Bin 2: 21, 24, 28, 30
   Bin 3: 35, 40, 42, 48

c) Equal-width is highly sensitive to outliers — one extreme value stretches every bin,
   so most values crowd into a single bin and the data appears skewed.
```

</details>

---

## D5. Five-Number Summary And Outliers  `[5 Marks]`

Data: `8, 11, 12, 14, 15, 18, 19, 21, 24, 27, 30, 95`.
Compute the five-number summary, IQR, and test whether 95 is an outlier.

<details><summary>Model answer</summary>

```
Sorted, N = 12.
Q1 = 3rd value  = 12
Q2 (median) = (18 + 19)/2 = 18.5
Q3 = 9th value = 24
Min = 8, Max = 95
Five-number summary = [8, 12, 18.5, 24, 95]

IQR = 24 − 12 = 12
Upper fence = Q3 + 1.5 × IQR = 24 + 18 = 42
95 > 42  →  95 IS an outlier.
Action: investigate the reading; if it is a recording error, treat it as missing and impute
with the median (data is now skewed).
```

</details>

---

## D6. Binary Attribute Dissimilarity  `[5 Marks]`

Two patients are described by asymmetric binary symptoms:

| | Fever | Cough | Test-1 | Test-2 | Test-3 | Test-4 |
|---|---|---|---|---|---|---|
| Jack | 1 | 1 | 1 | 0 | 0 | 0 |
| Jim | 1 | 1 | 0 | 0 | 0 | 0 |

Compute the asymmetric dissimilarity and the Jaccard similarity.

<details><summary>Model answer</summary>

```
q = both 1  = 2  (Fever, Cough)
r = Jack 1, Jim 0 = 1  (Test-1)
s = Jack 0, Jim 1 = 0
t = both 0 = 3

Asymmetric: d = (r + s)/(q + r + s) = (1 + 0)/(2 + 1 + 0) = 1/3 ≈ 0.33
Jaccard   : sim = q/(q + r + s) = 2/3 ≈ 0.67   (= 1 − d ✓)

t is ignored because a negative test result is uninformative — this is why the
attributes are asymmetric.
```

</details>

---

## D7. Cosine Similarity Of Two Documents  `[5 Marks]`

`x = (3, 2, 0, 5, 0, 0, 0, 2, 0, 0)` and `y = (1, 0, 0, 0, 0, 0, 0, 1, 0, 2)`. Compute the cosine similarity and interpret it.

<details><summary>Model answer</summary>

```
x · y = (3×1) + (2×0) + 0 + 0 + 0 + 0 + 0 + (2×1) + 0 + 0 = 3 + 2 = 5
‖x‖ = √(9 + 4 + 25 + 4) = √42 ≈ 6.481
‖y‖ = √(1 + 1 + 4)      = √6  ≈ 2.449

cos(x, y) = 5 / (6.481 × 2.449) = 5 / 15.87 ≈ 0.315

Interpretation: ~0.32 is low, so the two documents share few terms and are
largely dissimilar in content. Cosine ignores document length, comparing only
the direction (term profile) of the vectors.
```

</details>

---

## D8. Pearson Correlation For Feature Selection  `[5 Marks]`

| Ad spend (A) | 10 | 20 | 30 | 40 |
|---|---|---|---|---|
| Sales (B) | 15 | 25 | 30 | 50 |

Compute `r` and state whether ad spend should be kept as a feature.

<details><summary>Model answer</summary>

```
Ā = 100/4 = 25      B̄ = 120/4 = 30

A    B    A−Ā   (A−Ā)²   B−B̄   (B−B̄)²   (A−Ā)(B−B̄)
10   15   −15    225     −15     225        225
20   25    −5     25      −5      25         25
30   30     5     25       0       0          0
40   50    15    225      20     400        300
                 500             650        550

r = 550 / √(500 × 650) = 550 / √325000 = 550 / 570.09 ≈ 0.96

Strong positive linear correlation → KEEP ad spend; it is a highly relevant predictor
of sales. Caveat to add: Pearson detects only linear relationships and assumes
independence between features.
```

</details>

---

## D9. Chi-Square Setup  `[5 Marks]`

A survey of 200 customers cross-tabulates **Region** (North/South) against **Preferred channel** (App/Web/Store).
a) State H₀ and HA. b) Give the expected-count formula. c) Compute df. d) State the decision rule.

<details><summary>Model answer</summary>

```
a) H₀: preferred channel is independent of region.
   HA: preferred channel depends on region.       α = 0.05

b) E = (Row total × Column total) / Grand total

c) df = (r − 1)(c − 1) = (2 − 1)(3 − 1) = 2      → critical value = 5.991

d) χ² = Σ (O − E)²/E
   If χ²(calculated) > 5.991 → reject H₀ → region and channel ARE related,
   so Region is a useful feature. Otherwise the feature can be dropped.
```

</details>

---

## D10. FP-Growth On A Small Basket  `[8 Marks]`

Transactions (min_sup = 2): `T1 {A,B,C}`, `T2 {A,C}`, `T3 {A,D}`, `T4 {B,C}`, `T5 {A,B,C}`.
a) Build list L. b) Build the FP-tree. c) Give frequent patterns for item B. d) Compute the confidence of `B → C`.

<details><summary>Model answer</summary>

```
a) Support counts: A = 4, C = 4, B = 3, D = 1
   D is dropped (1 < min_sup = 2).
   L (support-descending, ties broken alphabetically) = A:4, C:4, B:3
   Transactions re-ordered: T1 {A,C,B}  T2 {A,C}  T3 {A}  T4 {C,B}  T5 {A,C,B}

b) FP-tree
   null
   ├── A:4
   │    └── C:3
   │         └── B:2
   └── C:1
        └── B:1

c) Item B — conditional pattern base: {A,C}:2 ; {C}:1
   Conditional FP-tree: C:3 (A has count 2, still ≥ min_sup, so keep A:2 under C)
   Frequent patterns: {C,B}:3 ; {A,B}:2 ; {A,C,B}:2

d) confidence(B → C) = support({B,C}) / support({B}) = 3/3 = 1.00
   At a 0.7 threshold the rule is ACCEPTED: every basket with B also contained C.
   lift(B, C) = confidence / support(C) = 1.00 / (4/5) = 1.25 > 1 → positively correlated.
```

</details>

---

## D11. Feature Engineering For A Ride-Hailing App  `[5 Marks]`

Columns: `Trip_Distance_km, Trip_Duration_min, Fare, Driver_Rating, Pickup_Timestamp`.
Propose three new features with formulas and justification.

<details><summary>Model answer</summary>

| Feature | Formula | Why better |
|---|---|---|
| Average speed | `Trip_Distance_km / (Trip_Duration_min / 60)` | Captures traffic conditions, which neither distance nor duration shows alone; low speed flags congestion and cancellations |
| Fare per km | `Fare / Trip_Distance_km` | Scale-free price signal; exposes surge pricing and overcharging across trips of any length |
| Is peak hour | `1 if hour(Pickup_Timestamp) ∈ {8–11, 17–21} else 0` | A raw timestamp is unusable by a model; a peak flag encodes demand patterns that strongly affect fare and wait time |

- Optional: day-of-week, weekend flag, trips-per-driver-per-day.
- All are **derived features** from feature construction using domain knowledge.

</details>

---

## D12. Missing-Value Strategy Table  `[5 Marks]`

A customer table has missing values in `Income` (right-skewed), `City`, `Satisfaction (1–5)` and `Churn (target)`. State the best handling for each with justification.

<details><summary>Model answer</summary>

| Column | Handling | Justification |
|---|---|---|
| Income | **Median** imputation, or model-based (regression / decision tree) | Right-skewed numeric — the mean would be dragged up by high earners. Model-based imputation is the most accurate and most popular method |
| City | **Mode** imputation, or a separate "Unknown" category | Nominal — mean/median undefined. Warn that a global constant like "Unknown" may be mistaken for a real concept by the mining algorithm |
| Satisfaction (1–5) | **Median** (or mode) | Ordinal — order exists but gaps are not equal, so the mean is not strictly valid |
| Churn (target) | **Drop the row** | Never impute the class label; imputing it invents the answer and corrupts training and evaluation |

</details>

---

# Section E — Answer Templates

Reuse these exact structures under time pressure.

## T1. Classify An Attribute

> **`Attribute_Name` → Type.**
> Permitted operations: … . Zero is / is not a true zero, therefore ratios are / are not meaningful.
> It is discrete / continuous because … .

## T2. Business Requirement → Data Science Problem

1. Restate the **business need** in one line.
2. State the **prediction target** in one line.
3. Name the **learning type**: supervised / unsupervised, classification / regression / clustering / association.
4. Name the **task** and one suitable algorithm.
5. State the **business action** that the output enables.

## T3. Data Quality Question

| Step | What to write |
|---|---|
| 1 | Name the issue using the standard vocabulary — completeness, consistency, validity/accuracy, redundancy/duplicates, noise, bias |
| 2 | Quote the exact offending cell or column from the given table |
| 3 | Give one concrete fix (imputation, standard format, domain rule, de-duplicate) |
| 4 | Add the consequence if unfixed — "the model would learn a false pattern" |

## T4. Numeric Question

```
1  Write the formula.
2  Write the substitution with the given numbers.
3  Write the result with units.
4  Write one sentence of interpretation ("lower d means A and B are more similar").
5  Show the check line if one exists (parts must sum to the total).
```

## T5. Propose New Features

| Feature name | Formula | Why more informative |
|---|---|---|

- Prefer **ratios** (burden, intensity), **durations** (from dates), **rates per unit**, and **flags** (peak/off-peak).
- Never propose a feature that simply renames an existing column.
- Close with one line: "these are derived features created through feature construction using domain knowledge."

## T6. Scenario / Role Question

1. Name the **role** in the first line — no hedging.
2. Give a one-line description of what that role owns.
3. List 4–6 responsibilities as bullets, all tied to the given scenario.
4. Add preferred skills/tools if marks remain.

---

## Final-Hour Checklist

- [ ] Four analytics types and the progression between them.
- [ ] Nominal / Ordinal / Interval / Ratio + discrete vs continuous, with justification.
- [ ] Data quality vocabulary: completeness, consistency, validity, redundancy, noise, bias.
- [ ] Noise = **random**; a fixed offset is systematic bias.
- [ ] Missing values: mean (symmetric), median (skewed), mode (categorical), model-based (best), never the target.
- [ ] Stratified proportional sampling arithmetic `nᵢ = n × Nᵢ/N`, including the total check.
- [ ] Simple matching `d = (p − m)/p`; asymmetric binary and Jaccard; cosine similarity.
- [ ] Min-max, z-score, decimal scaling — and when to prefer z-score.
- [ ] Equal-width vs equal-depth binning, plus the outlier weakness.
- [ ] Three derived features with formula and justification.
- [ ] CRISP-DM phases; SEMMA; SMAM; Big Data life-cycle pillars.
- [ ] FP-tree list L, conditional pattern bases, confidence and lift.
- [ ] Exploratory vs explanatory analysis in a named domain.
- [ ] Data Scientist vs Business Analyst vs Data Engineer vs Data Journalist.
- [ ] Train/test split 70:30 or 80:20 and the reason.
