# Targeted Practice: Sessions 1-8 and Assignment 1

Attempt Part A without notes. Check Part B only after writing formula, substitution, result, and a short justification. Part C connects the exam to the UrbanGo assignment; its toy values are not results from your assigned CSV.

- Core theory: [01_Combined_Lecture_Notes.md](01_Combined_Lecture_Notes.md).
- Source-paper solutions: [02_Solved_Exam_and_Sample_Paper.md](02_Solved_Exam_and_Sample_Paper.md).
- Source assignment: [Assignment_1.pdf](../Assisgnments/Assignment_1.pdf).
- Suggested practice marks are self-assessment weights, not official marks.

## Part A. Questions

### Session 1: Foundations

**D01 [1 mark].** A fixed customer table has columns ID, Age, and City. Some Age cells contain `unknown`. Is it structured or semi-structured? Justify.

**D02 [5 marks].** Match each scenario to one pillar: Quality, Completeness, Reliability, Trust, or Scale. Scenarios: a negative physical distance; all rural customers omitted; a scheduled job repeatedly fails unnoticed; personal IDs exposed in a public export; ingestion cannot keep up with ten million events per hour.

**D03 [2 marks].** A binary target uses `Yes`, `1`, and `True` for the same outcome. Name its primary quality dimension and primary pillar. Is replacing every missing target with `No` a justified fix?

### Session 2: Profiling

**D04 [2 marks].** A dataset has 300 rows and 5 columns. Exactly 90 cells are missing. Compute overall cell completeness. Why is dividing by 300 incorrect here?

**D05 [2 marks].** Experience entries are 2, `4+`, -1, 5, missing, 6, `three`. Using only numeric entries, find mean and median. Explain why the negative entry is still included in this calculation.

**D06 [3 marks].** Choose structure, content, or relationship discovery for: detecting mixed date-format patterns; finding an age of 240; finding an enrolment whose Student_ID is absent from the student table.

### Session 3: Missing Data and Outliers

**D07 [3 marks].** Classify: a random packet loss independent of all measurements; missing pay depends only on recorded job grade; pay remains more likely to be omitted by higher earners within every job grade. Explain the difference between the last two cases.

**D08 [3 marks].** Sorted measurements are 8, 9, 10, 11, 12, 13, 40. Exclude the overall median when taking quartiles. Find both fences and the outlier. The goal is a bounded-influence model input, and 40 is real: propose a treatment.

**D09 [3 marks].** Three selected neighbours have ages 22, 28, 34. Find the uniform-weight KNN estimate. Complete the tokens `from sklearn.impute import ___`, `n_neighbors=___`, and `imputer.___(df)`. Why scale before finding neighbours?

### Session 4: Entity Resolution

**D10 [2 marks].** Compute word-set Jaccard for `Sunrise Health Centre` and `Sunrise Health and Centre`. Show intersection and union after lowercasing.

**D11 [3 marks].** Give Levenshtein distance and one edit for `Parker` versus `Paker`. Why is an exact-name block risky? Propose two alternative blocking passes using email and phone.

**D12 [2 marks].** Convert `03-04-2026` to ISO under DD-MM-YYYY. What other ISO date is possible if the source uses MM-DD-YYYY? What information resolves the ambiguity?

### Session 5: Encoding

**D13 [2 marks].** Select encoders for Colour = {red, green, blue} and Service = {Bronze, Silver, Gold}, where Service has that rank order. Give the ordered mapping and one risk of treating ordinal codes as equally spaced measurements.

**D14 [2 marks].** Categories A, B, C occur 48, 48, 64 times in 160 rows. Frequency-encode them. What information is lost?

**D15 [3 marks].** A city has 18 returns among 80 purchases. Find its target encoding. A colleague calculates the map using all targets before splitting. Identify the error and state a training-safe procedure.

### Session 6: Scaling

**D16 [3 marks].** Training minimum = 50 and maximum = 250. Min-max scale a training value 90 and a future value 350 without clipping. Must every future output lie in [0, 1]?

**D17 [2 marks].** Median = 100, Q1 = 80, Q3 = 120. Robust-scale 260. Does this operation remove the outlier or make the data normal?

**D18 [2 marks].** A duration feature includes 0 and 99 seconds and is right-skewed. Calculate `log1p` for both to four decimals. Why not use plain log for the zero? Would an ordinary tree require StandardScaler simply to split this feature?

### Session 7: Feature Engineering

**D19 [2 marks].** Create a value tier using Low for $0\leq x<100$, Medium for $100\leq x<1000$, and High for $x\geq1000$. Encode 40, 400, and 40000 with Low = 0, Medium = 1, High = 2. Give a benefit and a limitation.

**D20 [3 marks; lecture extension].** Classify variance thresholding, RFE, and L1-based selection as filter, wrapper, or embedded. Why must supervised selection be repeated inside each cross-validation training fold?

**D21 [2 marks; lecture extension].** PCA eigenvalues are 6, 3, 1. Find each explained-variance ratio and the minimum components needed for at least 90%. Does retaining 90% variance guarantee 90% prediction accuracy?

### Session 8: Imbalance

**D22 [2 marks].** There are 980 ordinary and 20 rare-event records. Find majority:minority ratio and majority-only accuracy. What is the rare-event recall of that classifier?

**D23 [2 marks].** Generate a SMOTE point from start [2, 6] toward neighbour [6, 14] using lambda = 0.5. State its label and check its location.

**D24 [3 marks].** With rare events positive, TP = 12, FN = 8, FP = 3, TN = 77. Compute precision, recall, and F1. Is generating SMOTE observations before cross-validation safe?

<!-- pagebreak -->

## Part B. Answers

### D01-D03: Foundations

- **D01:** Structured: the rows obey a fixed set of named fields. `unknown` is a cell/schema-quality issue, not evidence of semi-structured organization.
- **D02:** In the given order: Quality; Completeness; Reliability; Trust; Scale. Connect each answer to the scenario rather than merely listing pillar names.
- **D03:** Consistency dimension; Quality pillar. Use an explicit verified mapping for equivalent known labels. A missing outcome is unknown, not automatically negative; verify it or exclude it from supervised training under a documented rule.

### D04-D06: Profiling

**D04.** There are $300\times5=1500$ cells and $1500-90=1410$ populated cells.

$$\mathrm{Completeness}=\frac{1410}{1500}\times100=\boxed{94\%}$$

The numerator counts cells, so the denominator must count cells too. A row-completeness rate would require knowing which rows have missing cells.

**D05.** Keep 2, -1, 5, 6; their sum is 12.

$$\bar{x}=12/4=\boxed{3},\qquad\mathrm{Median}=\frac{2+5}{2}=\boxed{3.5}$$

The instruction says numeric-only, not valid-only. Separately flag -1 as impossible. Do not interpret `4+` as exactly 4.

**D06.** Structure; content; relationship, respectively. An orphan Student_ID can have a perfectly valid type while violating referential integrity.

### D07-D09: Missingness and Outliers

**D07.** MCAR; MAR; MNAR. MAR allows dependence on recorded job grade but no remaining dependence on unobserved pay after conditioning on grade. In the last case, that residual pay dependence remains.

**D08.** Lower half = 8, 9, 10; upper half = 12, 13, 40.

$$Q_1=9,\quad Q_3=13,\quad IQR=4$$

$$L=9-1.5(4)=3,\qquad U=13+1.5(4)=19$$

40 is outside [3, 19]. For this explicit bounded-input goal, cap it to 19 under the stated fence rule, retain an outlier flag, and preserve the raw value. This is not the raw arithmetic average problem.

**D09.** $(22+28+34)/3=\boxed{28}$ years. Tokens: `KNNImputer`, `3`, `fit_transform`. Otherwise a large-unit feature may dominate geometric distance. Fitted scaling and imputation parameters must come from training data.

### D10-D12: Entity Resolution

**D10.** Intersection = {sunrise, health, centre}; union = {sunrise, health, and, centre}.

$$J=3/4=\boxed{0.75}$$

**D11.** Distance = 1: delete the first `r` in `Parker`. Exact-name blocks separate these spellings. Compare candidates sharing normalized full email in one pass and normalized full phone in another; score the union of candidate pairs. Changed or missing identifiers can still cause missed matches.

**D12.** DD-MM gives **2026-04-03**; MM-DD gives **2026-03-04**. Use source locale/schema metadata or source confirmation. ISO formatting alone cannot discover the intended date.

### D13-D15: Encoding

**D13.** Colour: one-hot. Service: ordinal, Bronze = 0, Silver = 1, Gold = 2. Ordinal codes preserve rank but impose equal numerical gaps that may not match the true difference in service value.

**D14.** A = 48/160 = **0.30**; B = 48/160 = **0.30**; C = 64/160 = **0.40**. A and B become indistinguishable using only this feature, even if their effects on the target differ.

**D15.** $18/80=\boxed{0.225}$. The map uses held-out labels and leaks the target. Split first; cross-fit training encodings; use an all-training mapping for validation/test transformation. Use training-only smoothing/fallbacks for rare or unseen levels.

### D16-D18: Scaling

**D16.** Training range = 200.

$$90'=\frac{90-50}{200}=\boxed{0.2},\qquad350'=\frac{350-50}{200}=\boxed{1.5}$$

Future values can exceed [0, 1]. Do not refit on test data to force them into range.

**D17.** $(260-100)/(120-80)=160/40=\boxed{4}$. Robust scaling changes center/units; it does not cap, remove, or normalize the distribution's shape.

**D18.** $\ln(1+0)=\boxed{0.0000}$; $\ln(1+99)=\ln100=\boxed{4.6052}$. Plain log at zero is undefined. Ordinary axis-aligned trees generally do not require scaling, though a preceding KNN/SMOTE step may need it.

### D19-D21: Engineering

**D19.** Codes: **0, 1, 2**. Benefit: a very large value does not produce an arbitrarily large code. Limitation: different values within a tier collapse together. Keep boundary definitions explicit.

**D20.** Variance threshold: filter. RFE: wrapper. L1 selection: embedded. Selecting from all labels before cross-validation lets validation targets influence the chosen feature set, giving optimistic scores.

**D21.** Total eigenvalue sum = 10. Ratios = **60%, 30%, 10%**. Two components retain **90%**; they are the minimum because one retains only 60%. Explained predictor variance is not prediction accuracy and need not align with the target.

### D22-D24: Imbalance

**D22.** $980/20=\boxed{49:1}$; accuracy = $980/1000=\boxed{98\%}$; rare-event recall = $0/20=\boxed{0\%}$.

**D23.**

$$[2,6]+0.5([6,14]-[2,6])=[2,6]+[2,4]=\boxed{[4,10]}$$

It is the segment midpoint and keeps the minority label.

**D24.**

$$\mathrm{Precision}=\frac{12}{12+3}=\boxed{80\%}$$

$$\mathrm{Recall}=\frac{12}{12+8}=\boxed{60\%}$$

$$F_1=\frac{2(12)}{2(12)+3+8}=\frac{24}{35}=\boxed{68.57\%}$$

No: use a sampler-aware pipeline inside cross-validation, with SMOTE fitted only to each training fold. Validation and test sets retain their original observations and prevalence.

<!-- pagebreak -->

## Part C. UrbanGo Assignment Bridge

These exercises follow the concepts in assignment Parts 1-3. They are study aids, not a substitute submission or a fabricated VERIFIED scorecard. No student-specific CSV results are claimed.

### A01. Four Diagnostics and Metadata

**Question.** On the following toy frame, find cell completeness, invalid ages under the assignment's 18-100 rule, distinct payment spellings, casing-only excess variants, and excess duplicate rows. Create the schema log.

```python
import numpy as np
import pandas as pd

toy = pd.DataFrame({
    "customer_age": [20, 30, np.nan, 150, 20],
    "fare_amount": [100, np.nan, 200, -10, 100],
    "payment_type": ["Cash", "cash", "CARD", "CARD", "Cash"],
    "city": ["Metro", "Metro", "Small", "Small", "Metro"],
})

cell_completeness = toy.notna().to_numpy().mean() * 100
invalid_age_count = (
    (toy["customer_age"] < 18) | (toy["customer_age"] > 100)
).sum()
distinct_spellings = toy["payment_type"].nunique()
payments = toy["payment_type"].dropna().astype("string")
variants = payments.groupby(payments.str.casefold()).nunique()
casing_extras = (variants - 1).sum()
duplicate_extras = toy.duplicated().sum()
schema = {
    column: {
        "dtype": str(toy[column].dtype),
        "missing": int(toy[column].isna().sum()),
    }
    for column in toy.columns
}
```

**Expected answer.** 18 populated cells / 20 = **90%**; invalid ages = **1**; distinct raw spellings = **3**; canonical payment categories = **2**; casing extras = **1**; duplicate extras = **1**. `duplicated(keep=False)` would flag **2** rows, which answers a different duplicate-count question.

The missing age is absent, not automatically an invalid observed age. Age and fare have one missing value each; payment and city have none. pandas string dtype names can vary by installed version, so record `str(dtype)` rather than hardcoding them.

**Exam connection:** E1, S2; assignment 1.1-1.2. The under-18 exclusion is an assignment eligibility rule, not a claim that under-18 humans are biologically impossible.

### A02. Prove Variance Compression

**Question.** Observed ages are 18, 30, 42; two further ages are missing. Fill both with the observed mean. Compute sample variance before and after, and state the effect on demographic clusters.

$$\bar{x}=30,\qquad SS=(18-30)^2+(30-30)^2+(42-30)^2=288$$

$$s^2_{before}=288/(3-1)=\boxed{144}$$

$$s^2_{after}=288/(5-1)=\boxed{72}$$

The added values contribute zero squared deviation but increase the denominator. Mean filling compresses variance and inserts observations between potentially distinct groups.

```python
ages = pd.Series([18, 30, 42, np.nan, np.nan])
before_variance = ages.var(ddof=1)
after_variance = ages.fillna(ages.mean()).var(ddof=1)
```

**Exam connection:** imputation justifications; assignment 1.4. This temporary proof should not overwrite the original raw file or mandate mean filling in the real pipeline.

### A03. Preserve Informative Missingness

**Question.** Customers with low unobserved satisfaction often omit a rating. Preserve the absence signal, then fill a training feature. Is the flag a complete MNAR solution?

```python
train["rating_missing"] = train["customer_rating"].isna().astype(int)
test["rating_missing"] = test["customer_rating"].isna().astype(int)
rating_fill = train["customer_rating"].median()
train["customer_rating"] = train["customer_rating"].fillna(rating_fill)
test["customer_rating"] = test["customer_rating"].fillna(rating_fill)
```

Create the flag **before** filling. It preserves potentially predictive omission, but does not identify the missing values or eliminate MNAR bias. Assumptions: the rating is numeric, at least one training rating is observed, and the signal is available at prediction time.

**Exam connection:** E2(a), S3; assignment 2.1(1).

### A04. Median Fare and Three-Peer Age

**Question.** Fares are right-skewed; missing ages correlate with other numeric behaviours. Give the single-variable fare remedy and the correct KNN order. Exclude IDs, targets, and invalid sentinels from the distance calculation.

```python
from sklearn.impute import KNNImputer
from sklearn.preprocessing import StandardScaler

fare_fill = train["fare_amount"].median()
train["fare_amount"] = train["fare_amount"].fillna(fare_fill)
test["fare_amount"] = test["fare_amount"].fillna(fare_fill)

columns = ["customer_age", "lifetime_rides", "distance_km"]
scaler = StandardScaler()
imputer = KNNImputer(n_neighbors=3)
train_scaled = scaler.fit_transform(train[columns])
train_completed = imputer.fit_transform(train_scaled)
train[columns] = scaler.inverse_transform(train_completed)
test_scaled = scaler.transform(test[columns])
test_completed = imputer.transform(test_scaled)
test[columns] = scaler.inverse_transform(test_completed)
```

Median is resistant to extreme fare magnitudes. KNN order: select valid predictors -> scale -> impute using 3 neighbours -> inverse-transform. A fare of 1000 and distance of 5 should not receive importance merely because their units differ.

Assumptions: numeric finite observed values, sufficient neighbours, and no wholly missing training column. Inverse-transforming restores units; it does not leave the final classifier's inputs standardized. A scale-sensitive classifier may still require its own train-fitted scaler.

**Exam connection:** E2(b), S8; assignment 2.1(2-3). The train/test form demonstrates leakage-safe modelling; the assignment separately specifies operations on one active in-memory frame.

### A05. Impossible Values Versus Genuine Extremes

**Question.** Under the assignment rules, remove rows with distance above 200 km or negative fare, then cap genuine high fares at the upper IQR fence. Why are the actions different?

```python
invalid_operations = (df["distance_km"] > 200) | (df["fare_amount"] < 0)
df = df.loc[~invalid_operations].copy()
fare_quartiles = df["fare_amount"].quantile([0.25, 0.75])
fare_iqr = fare_quartiles.loc[0.75] - fare_quartiles.loc[0.25]
upper_fence = fare_quartiles.loc[0.75] + 1.5 * fare_iqr
df["fare_was_capped"] = (df["fare_amount"] > upper_fence).astype(int)
df["fare_amount"] = df["fare_amount"].clip(upper=upper_fence)
```

The first mask enforces explicit operational rules; the second limits the influence of genuine surge events while retaining their rows. The flag is useful study practice, not a required new column in the assignment. For predictive evaluation, learn quartiles from training data and reuse the threshold on held-out data.

Missing values are handled separately; neither a missing fare nor missing distance automatically satisfies these invalid-value tests. A valid trip above 200 km in another business would need a different policy.

**Exam connection:** E2(d), S3(iii); assignment 2.2(1-2).

### A06. Tail Compression and City Context

**Question.** Engineer a feature from nonnegative lifetime rides and compute city-level mean trip distances. Explain why the latter is not itself an outlier detector.

```python
df["log_lifetime_rides"] = np.log1p(df["lifetime_rides"])
city_baselines = df.groupby("city", dropna=False)["distance_km"].mean()
```

`log1p` supports zero and compresses the widening right tail, but does not guarantee normality. City means show context; flagging a trip additionally requires a within-city spread measure or a domain threshold. A mean alone gives neither.

The separate log column makes this teaching example auditable. If the assignment expects transformation of `lifetime_rides` itself, assign the transformed values to that active column and retain the untouched raw file for provenance.

**Exam connection:** E5, S6; assignment 2.2(3-4).

### A07. Profiling Observations That Earn Credit

**Question.** What should four technical observations contain? Why is saying only "the data is dirty" insufficient?

1. Name a specific numerical column, its measured skewness, and what the tail direction implies for a candidate transformation.
2. Name a specific numerical column, its measured excess kurtosis and/or extreme quantiles, and explain the need to investigate tails rather than delete automatically.
3. Quantify missingness for a named field and identify a plausible mechanism to investigate, without claiming the mechanism is proven by a histogram.
4. Quantify duplicate or category-alias patterns and state the canonicalization/entity rule to verify.

```python
numeric_profile = df.select_dtypes(include="number").agg(
    ["count", "min", "median", "max", "skew", "kurt"]
)
```

An optional report uses `ProfileReport(df, title="UrbanGo raw profile")` from `ydata_profiling`, followed by `report.to_file("profiling_report.html")`. The instructor requires actual measured observations and the generated HTML; do not reuse invented numbers. pandas kurtosis is excess kurtosis, so the normal-reference value is 0, not 3.

**Exam connection:** S2 and E5(a); assignment 1.3.

### A08. Provenance and Honest Evaluation

**Question.** List the required file discipline and give a defensible two-sentence conclusion about raw versus cleaned model performance.

- Keep the instructor-generated student CSV and execution manifest unchanged. Do not recreate them or bypass verification.
- Perform intermediate transformations in memory; no intermediate CSV exports.
- Export the final active DataFrame once as `UrbanGo_A1_cleaned.csv` in the required workspace, without the pandas row index.
- Run the instructor's provided evaluation program unchanged and submit its actual VERIFIED output; no output has been generated by these notes.
- Compare measured scores rather than assuming every preprocessing change improves accuracy. Explain that correcting invalid inputs, handling missingness, and managing feature magnitudes can improve optimization and signal quality.
- For a rigorous future comparison, use the same original held-out entities, fit learned preprocessing only on training rows, and report minority precision/recall or F1 as appropriate. The assignment's supplied workflow is not a replacement for leakage-safe experimental design.

**Conclusion template:** "The supplied evaluation reports raw accuracy ___ and cleaned accuracy ___. The change is consistent with ___; a stronger evaluation would fit preprocessing inside the training split and compare class-specific metrics on the same untouched holdout."

Fill the blanks only from real outputs. Do not claim inverse-transforming KNN inputs leaves them scaled for logistic regression, or that cleaning guarantees a better decision boundary.
