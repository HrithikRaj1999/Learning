# Solved Exam and Sample Worksheet

Suggested answers, not an official marking scheme. Question labels E1-E6 refer to the supplied 30-mark exam; S1-S9 refer to the supplied 37-point worksheet. Attempt the original questions before reading these answers.

- Exam: [Preprocessing for ai ready data.pdf](../Exam%20Paper/Preprocessing%20for%20ai%20ready%20data.pdf).
- Worksheet: [Sample Question Paper (1).pdf](../Class%20Material/Sample%20Question%20Paper%20%281%29.pdf).
- Theory: [01_Combined_Lecture_Notes.md](01_Combined_Lecture_Notes.md).
- Numerical routine: formula -> substitution -> result -> interpretation.
- Python examples assume `import pandas as pd`, a numeric DataFrame where required, and scikit-learn 1.2 or later for `sparse_output`.

## Part A. Supplied Exam: 30 Marks

### E1. Applicant Data and Quality [7 Marks]

**(a) Data type [1].** Structured: records have a fixed tabular schema with named columns. Invalid cells do not make the table semi-structured.

**(b) Three issues [2].** Include an issue in the target column, as requested.

| Issue | Quality dimension | Why |
|---|---|---|
| A05 has missing Experience_Yrs | Completeness | A required attribute is absent |
| Shortlisted mixes Yes/No, 1/0, and true | Consistency | The same binary meaning has incompatible representations |
| A04 has Experience_Yrs = -2 | Accuracy | Negative work experience cannot describe the actual quantity correctly |

The negative value also fails a nonnegative validity rule. For the final subpart, explicitly use the paper's requested term **Accuracy**.

**(c) Pillars for the same issues [2].**

| Issue from (b) | Most direct AI-readiness pillar | Reason |
|---|---|---|
| Missing experience | Completeness | Missing information about the applicant |
| Inconsistent Shortlisted labels | Quality | The target must have one coherent representation |
| Negative experience | Quality | Incorrect values contaminate learning |

Do not merely repeat the dimension names: pillars are Quality, Completeness, Reliability, Trust, and Scale. Additional pillar claims need evidence, not speculation.

**(d) Numeric-only statistics [2].**

Keep 5, -2, 6, 5, 7. Skip `5+`, `three`, and the missing entry; do not silently clean -2 before the requested calculation.

$$\bar{x}=\frac{5-2+6+5+7}{5}=\frac{21}{5}=4.2\text{ years}$$

Sorted values: -2, 5, 5, 6, 7. The third value is the **median = 5 years**.

- -2 is an accuracy problem because actual years of experience cannot be negative.
- A01 and A07 agree on the non-ID attributes, but different IDs do not establish that they are the same person. Flag for investigation, not automatic deletion.

### E2. Missing Ratings, KNN, and Vibration [5 Marks]

**(a) Missingness [1].** MNAR. Let R indicate whether a rating is missing, observed information be $Y_{obs}$, and the unobserved rating be $Y_{mis}$.

$$P(R\mid Y_{obs},Y_{mis})\ne P(R\mid Y_{obs})$$

Even at the same observed call count, the missingness probability still depends on the unobserved low satisfaction score. The 62% versus 8% rates alone could be consistent with MAR; the remaining dependence on the missing score establishes MNAR in this scenario.

**(b) KNN blanks [2].** (1) `KNNImputer`; (2) `3`; (3) `fit_transform`.

```python
from sklearn.impute import KNNImputer

knn_imp = KNNImputer(n_neighbors=3)
result = pd.DataFrame(
    knn_imp.fit_transform(df),
    columns=df.columns,
    index=df.index,
)
```

The index argument preserves row labels and is not an additional exam blank. In real modelling, scale relevant numeric predictors before distance-based imputation and learn preprocessing on training data only. KNN does not, by itself, correct MNAR bias.

**(c) Z-score [1].** Readings: 4.1, 4.3, 4.0, 4.4, 4.2, 15.8 mm/s. Use all six readings, including 15.8.

Assumption: treat these readings as the population for this descriptive calculation.

$$\mu=\frac{36.8}{6}=6.1333$$

$$\sigma=\sqrt{\frac{\sum(x_i-\mu)^2}{6}}=\sqrt{18.7056}=4.3250$$

$$z=\frac{15.8-6.1333}{4.3250}=2.2351$$

Thus $|z|>2$: **15.8 is flagged as an outlier** under the stated rule.

If sample standard deviation is used, $s=4.7378$ and $z=2.0403$, also above 2. Declare the denominator because the paper does not specify it.

**(d) Treatment [1].** Given the stated aim of limiting the jolt's influence, **cap/winsorize the value at a justified boundary**. Retain the record and a flag, and preserve the raw reading separately. Removing it would discard a genuine event.

Important distinction: a capped mean is an adjusted summary, not the original physical average. If the question instead asks for the actual average across all six cycles, retain 15.8 and report the raw mean, optionally alongside the median. A logarithm changes the measurement scale and its mean is not the original arithmetic mean.

### E3. Hotel Entity Resolution [5 Marks]

**(a) Jaccard [2].** Follow the instruction to treat `&` and `and` as distinct tokens.

```text
A = {blue, ocean, resort, &, spa}
B = {blue, ocean, resort, and, spa}
A intersection B = {blue, ocean, resort, spa}
A union B = {blue, ocean, resort, &, and, spa}
```

$$J(A,B)=\frac{|A\cap B|}{|A\cup B|}=\frac{4}{6}=0.6667$$

Do not divide by 10: the denominator counts unique tokens in the union.

**(b) Dates [1].** `07-11-2025` could mean 7 November under DD-MM-YYYY or July 11 under MM-DD-YYYY. Assuming L1 uses DD-MM-YYYY and L2 uses ISO YYYY-MM-DD, both normalize to **2025-11-07**.

Without source-format metadata, the ambiguous first string cannot be resolved with certainty. A claimed common ISO date therefore requires that explicit assumption.

**(c) Linkage [1].** Use **probabilistic linkage** to combine strong phone agreement with partial name agreement. It can give more weight to agreement on a rare identifier and tolerate spelling differences. A shared phone is evidence, not proof, since properties may share a booking number. Deterministic linkage would also be reasonable if the phone were independently verified as a unique, reliable hotel ID; that is not established here.

**(d) Hash blanks [1].** (1) `hash`; (2) `add`.

```text
seen = set()
for record in dataset:
    key = hash(concat(record.field1, record.field2, ...))
    if key in seen:
        mark record as duplicate
    else:
        seen.add(key)
```

This is the supplied pseudocode pattern, not runnable Python. Production code needs unambiguous field serialization and equality checks to handle hash collisions; concatenating fields without boundaries can itself cause false matches.

### E4. Categorical Encoding [5 Marks]

**(a) Choose an encoder [1].** One-hot creates one indicator per category and does not impose order: use it for nominal Referral_Channel. Ordered integer encoding gives one rank per level: use Silver = 0, Gold = 1, Platinum = 2 for Subscription_Tier.

In scikit-learn, use `OrdinalEncoder` with an explicit order for ordered input features. `LabelEncoder` is intended for the target, and its automatic alphabetical coding does not establish the required tier order.

**(b) Frequency values [2].** Use normalized frequency = category count / 100.

| Category | Calculation | Encoded value |
|---|---|---:|
| Instagram | 38/100 | 0.38 |
| YouTube | 37/100 | 0.37 |
| Email | 15/100 | 0.15 |
| Direct | 10/100 | 0.10 |

The four values sum to 1. Raw counts would be count encoding; state the convention.

**(c) Limitation [1].** Instagram and YouTube become 0.38 and 0.37, only 0.01 apart. A distance-based or simple linear model may treat these distinct channels as nearly equivalent despite different effects on the target. Exactly equal frequencies would make them indistinguishable from this encoded feature alone. The two values here are close, not identical, so a tree could still split between them.

**(d) One-hot blanks [1].** (1) `OneHotEncoder`; (2) `fit_transform`.

```python
from sklearn.preprocessing import OneHotEncoder

encoder = OneHotEncoder(sparse_output=False)
encoded = encoder.fit_transform(df[["Referral_Channel"]])
```

Double brackets keep the input two-dimensional. For held-out rows, call the fitted encoder's `transform`, and decide how unseen categories will be handled.

### E5. Skewed Customer Lifetime Value [5 Marks]

Values: 1200, 1450, 1300, 1380, 15200.

**(a) Why not just min-max? [1].** The extreme maximum controls the range. The four ordinary values map between 0 and 0.0179, while 15200 maps to 1, compressing useful differences. Min-max is an affine rescaling; it does not remove skewness. A natural log is suitable because every value is positive.

**(b) Natural logs [1].**

$$\ln(1200)=7.0901\approx\boxed{7.09}$$

$$\ln(15200)=9.6291\approx\boxed{9.63}$$

Use natural log, not log base 10. For nonnegative data including zero, consider $\ln(1+x)$, but that is not the calculation requested here.

**(c) Standard versus robust [1].**

| Method | Benefit | Limitation with this outlier |
|---|---|---|
| Standard: $(x-\mu)/\sigma$ | Comparable units; useful for regularized/distance-sensitive models | Mean and SD are affected by 15200, compressing the ordinary observations |
| Robust: $(x-\mathrm{median})/\mathrm{IQR}$ | Center and spread less sensitive to extreme magnitude | Does not remove the extreme observation or cure skewness; its scaled value can remain very large |

Choose robust statistics for resistance to the extreme value; use a log as well when the model needs the right tail compressed. Neither scaler guarantees improved predictions.

**(d) Engineered feature [1].** Example fixed business rule:

| CLV range | Value tier | Ordered code |
|---|---|---:|
| $0\leq CLV<1300$ | Low | 0 |
| $1300\leq CLV<5000$ | Medium | 1 |
| $CLV\geq5000$ | High | 2 |

The five codes in original order are 0, 1, 1, 1, 2. Very large values have the same High code, limiting magnitude sensitivity. The trade-off is loss of within-tier detail. These are illustrative thresholds, not a uniquely correct answer.

**(e) Robust-scaling blanks [1].** (1) `RobustScaler`; (2) `fit_transform`.

```python
import numpy as np
from sklearn.preprocessing import RobustScaler

clv = np.array([1200, 1450, 1300, 1380, 15200])
scaler = RobustScaler()
scaled = scaler.fit_transform(clv.reshape(-1, 1))
```

With default interpolated percentiles: median = 1380, Q1 = 1300, Q3 = 1450, IQR = 150. The transformed 15200 is $(15200-1380)/150=92.1333$, illustrating that robust scaling does not cap outliers.

### E6. Imbalanced Quality Control [3 Marks]

**(a) Ratio [1].** Majority = 4850, minority = 150, total = 5000.

$$IR=\frac{4850}{150}=32.33:1,\qquad p_{minority}=\frac{150}{5000}=3\%$$

This is strongly imbalanced; **severe** is a reasonable descriptive label for only 3% defective units. Mild/moderate/severe cutoffs are not universal: use any numerical bands explicitly specified by the instructor and always show the ratio and percentage.

**(b) SMOTE [1].** Start at A = [1, 7], use B = [5, 11], and $\lambda=0.25$.

$$A+\lambda(B-A)=[1,7]+0.25[4,4]=\boxed{[2,8]}$$

The new point remains defective. Use one common lambda for both coordinates.

**(c) Accuracy [1].** Accuracy alone is misleading: predicting every unit as non-defective already gives $4850/5000=97\%$ and zero defect recall. Report **defective-class recall** to measure how many defects are detected; accompany it with precision or F1 to expose false alarms.

<!-- pagebreak -->

## Part B. Supplied Worksheet: 37 Points

### S1. Five Pillars [5 Points]

| Scenario | Single most direct pillar | Why |
|---|---|---|
| Nightly batch silently fails for two weeks | Reliability | Pipeline execution and monitoring are unreliable |
| Full payment-card numbers appear in a leaked export | Trust | Privacy and security are violated |
| Two million GPS pings per minute across 40 cities | Scale | Data volume and velocity stress processing capacity |
| App-only data excludes website-only customers | Completeness | A relevant population segment is missing |
| Resting heart rate reported as 380 bpm | Quality | The value is implausible and requires validation |

Give one pillar per row, as requested; do not dilute the answer by listing all five.

### S2. Completeness and Profiling [4 Points]

**(i) Completeness [2].**

$$\frac{1046}{1240}\times100=\boxed{84.35\%}$$

There are $1240-1046=194$ missing approvals. This is completeness of one field, not all cells in the dataset.

**(ii) Profiling [2].** **Content discovery** checks the Grade values against their domain and flags `150%` among letter grades. Relationship discovery could check that each enrolment's Student_ID exists in the student master table, detecting orphan foreign keys. A valid-looking value can still violate a cross-table relationship.

### S3. MAR and API Outliers [6 Points]

**(i) Is deletion automatically unbiased under MAR? [2].** False.

- MCAR: missingness is independent of both observed and missing values, $P(R\mid Y_{obs},Y_{mis})=P(R)$.
- MAR: after conditioning on observed information, there is no remaining dependence on missing values, $P(R\mid Y_{obs},Y_{mis})=P(R\mid Y_{obs})$.
- Under MAR, complete cases may overrepresent particular observed groups. Deleting incomplete rows is not generally safe for the desired population estimate; model the observed causes of missingness with an appropriate method.

Even MCAR deletion loses sample size and precision. Some estimands permit complete-case analysis under weaker conditions, but the blanket claim in the question is false.

**(ii) IQR [3].** Sorted readings: 118, 119, 120, 121, 122, 125, 260.

Assumption: exclude the overall median when splitting the odd-length list into halves.

$$Q_1=119,\quad Q_3=125,\quad IQR=125-119=6$$

$$L=119-1.5(6)=110,\qquad U=125+1.5(6)=134$$

Flag any $x<L$ or $x>U$. **260 ms is the only flagged reading.**

Software caveat: pandas/NumPy's default linear percentiles give Q1 = 119.5, Q3 = 123.5, IQR = 4, and upper fence = 129.5. They still flag 260. State your quartile convention rather than mixing the two calculations.

**(iii) Genuine delay [1].** For the actual arithmetic average of all observed calls, **retain 260 ms**: it is a real part of user experience.

$$\bar{x}=\frac{985}{7}=140.7143\text{ ms}$$

Report median = 121 ms as an additional typical-response summary. If the intended goal is explicitly an outlier-resistant adjusted average, capping is defensible, but label the result as adjusted. Transforming before averaging answers a different question.

### S4. Edit Distance and Blocking [5 Points]

**(i) Levenshtein [2].** Delete `h` from `Johnson` to obtain `Jonson`. One deletion costs 1, and the strings differ, so the minimum distance is **1**.

**(ii) Blocking [2].** Example composite key: `(normalized email domain, last four digits of normalized phone)`. Records that share this pair are candidate comparisons. Retain country-code context when normalizing phones; missing keys need a separate strategy.

An exact Customer_Name block separates `Johnson` and `Jonson`, so the intended duplicate pair is never compared. At one million rows, unrestricted matching requires $1{,}000{,}000\times999{,}999/2=499{,}999{,}500{,}000$ comparisons.

**(iii) Missed duplicate [1].** A customer changes both their email domain and phone suffix; their old and new records fall in different blocks. Multiple blocking passes, for example on normalized full email and on full phone separately, can improve recall. A shared blocking key only selects candidates; it does not prove a duplicate.

### S5. Target Encoding [4 Points]

**(i) Value [2].**

$$TE(\mathrm{Pune})=\frac{\mathrm{returned\ Pune\ listings}}{\mathrm{all\ Pune\ listings}}=\frac{54}{240}=\boxed{0.225}$$

This is a category-specific observed return rate, not Pune's frequency in the whole dataset.

**(ii) Leakage [2].** False. Computing the mapping before train/test splitting uses held-out target outcomes, leaking the answers into a feature. Split first. Cross-fit the encoding of training rows so each row's target is excluded from its own encoding; then fit the mapping on all training rows to transform held-out data. Smoothing and a training global-mean fallback help rare and unseen categories.

### S6. Trees and Engineered Features [3 Points]

**(i) Do Random Forests require scaling like KNN? [2].** False. Standard tree splits depend on value order, so a positive affine rescaling does not change the possible partitions in ordinary exact split construction. KNN uses distances, and regularized logistic regression is sensitive to feature scale. Scaling may still be needed for a KNN imputer or another distance-based step preceding a forest.

**(ii) Right-tailed sessions [1].** Engineer `log_duration = log1p(Session_Duration_Seconds)` for nonnegative durations. It accepts zero and compresses very large durations. This is a nonlinear transformation, not just a change of units; it need not make the distribution exactly normal.

### S7. Resampling and Leakage [3 Points]

**(i) Engineer B's flaw [1].** SMOTE before splitting uses neighbours across the future holdout boundary and can place closely related original/synthetic observations in both partitions. Split first and apply SMOTE only within the training data, including separately within each cross-validation training fold.

**(ii) Compare [2].**

| Method | One advantage | One disadvantage |
|---|---|---|
| Random majority undersampling | Smaller, faster training set | Discards potentially informative majority examples |
| SMOTE minority oversampling | Retains majority data and creates minority interpolations | Can create unrealistic/noisy overlapping points and costs more computation |

The 96:4 split is 24:1; its majority-only accuracy is already 96%. Evaluate the untouched holdout at its natural prevalence.

### S8. Four-Neighbour KNN Code [4 Points]

(1) `KNNImputer`; (2) `4`; (3) `fit_transform`.

```python
from sklearn.impute import KNNImputer

knn_imp = KNNImputer(n_neighbors=4)
result = pd.DataFrame(
    knn_imp.fit_transform(df),
    columns=df.columns,
    index=df.index,
)
```

The frame must contain appropriate numeric features, not arbitrary strings or the prediction target. Scale predictors when their magnitudes differ; fit on training rows and only transform held-out rows.

### S9. Min-Max Numerical [3 Points]

Minimum = 60, maximum = 900, range = 840.

$$x'=\frac{x-60}{900-60}$$

$$120'=\frac{120-60}{840}=\frac{60}{840}=\boxed{0.0714}$$

$$275'=\frac{275-60}{840}=\frac{215}{840}=\boxed{0.2560}$$

Round only the final result to four decimal places. The denominator is 840, not 900.

## Self-Marking Checklist

1. Did each requested subpart receive an answer, including the code blanks?
2. Did each justification use the actual scenario rather than a generic definition?
3. Did each numerical show its denominator and convention?
4. Did you distinguish a data-quality dimension from an AI-readiness pillar?
5. Did you keep genuine events when computing the actual raw average?
6. Did you keep test targets and resampling out of training-time decisions?
