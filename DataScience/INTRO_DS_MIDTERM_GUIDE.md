# Introduction To Data Science Midterm Guide

## Exam Facts

- Course: Introduction to Data Science.
- Code: DSE ZG532.
- Exam: 20 September 2026, morning.
- Weight: 30 percent.
- Type: closed book.
- Scope: sessions 1–8.

## Evidence Used

- [Intro to Ds/Handout.md](<Intro to Ds/Handout.md>) defines scope and assessment.
- Course slide decks directly support sessions 1–6.
- Sessions 7–8 lack dedicated in-scope slide decks.
- The assignment notebook demonstrates practical analysis style.
- [Sample questions](Intro%20to%20Ds/Exam%20Material/Introduction%20to%20Data%20Science%20-%20Sample%20Questions.pdf) show expected answer shapes.
- [Historical answers](Intro%20to%20Ds/Exam%20Material/Mid-Sem%20Regular%26Makeup%20-%20Q%20%26%20A.pdf) show earlier marking patterns.
- [EC-1 announcement](Intro%20to%20Ds/Exam%20Material/Proforma_Announcement_EC1_IDS_Updated_VF.docx) confirms activity dates only.
- [Python handbook](Intro%20to%20Ds/Reference%20Textbooks/Jake%20VanderPlas%20-%20Python%20Data%20Science%20Handbook.pdf) is optional support.
- Session 8 lacks a dedicated local lecture file.

## Big Picture

```mermaid
flowchart LR
    A[Question] --> B[Collect]
    B --> C[Clean]
    C --> D[Explore]
    D --> E[Build features]
    E --> F[Model]
    F --> G[Evaluate]
    G --> H[Explain]
```

## Session 1: Data Science Foundations

### Core Meaning

- Data science turns data into useful decisions.
- It combines computing, statistics, mathematics, and domain knowledge.
- Domain knowledge means understanding the real problem area.
- A model is a simplified representation of reality.
- Evidence must support every conclusion.

### Common Applications

- Banks detect suspicious payments.
- Hospitals estimate patient risks.
- Shops recommend relevant products.
- Factories predict machine failures.
- Governments plan services using population data.

### Main Challenges

- Poor data produces weak conclusions.
- Biased data can create unfair decisions.
- Large data needs scalable storage and processing.
- Privacy rules limit collection and usage.
- Correlation never automatically proves causation.

### Team Roles

| Role | Main responsibility |
|---|---|
| Data scientist | Finds patterns and builds models |
| Data engineer | Builds reliable data pipelines |
| Data analyst | Answers business questions using data |
| Machine-learning engineer | Deploys and monitors trained models |
| Domain expert | Explains real-world meaning and constraints |
| Product owner | Connects work with user value |

### DataOps And MLOps

- DataOps improves reliable movement and quality of data.
- MLOps manages model training, deployment, monitoring, and replacement.
- DataOps focuses primarily on data pipelines.
- MLOps focuses primarily on model lifecycles.

## Session 2: Analytics And Process Models

### Four Analytics Types

| Type | Question answered | Tiny example |
|---|---|---|
| Descriptive | What happened? | Sales fell ten percent |
| Diagnostic | Why happened? | Website failures reduced orders |
| Predictive | What may happen? | Demand may increase tomorrow |
| Prescriptive | What should happen? | Increase tomorrow's stock |

### CRISP-DM

- CRISP-DM means Cross-Industry Standard Process for Data Mining.

1. Understand the business problem.
2. Understand the available data.
3. Prepare useful, clean data.
4. Build candidate models.
5. Evaluate business and technical results.
6. Deploy the chosen solution.

- The process is iterative, not strictly one-way.
- Evaluation may send the team backwards.

### SEMMA

- SEMMA means Sample, Explore, Modify, Model, Assess.

1. Sample representative data.
2. Explore patterns and problems.
3. Modify variables and records.
4. Model relationships or outcomes.
5. Assess model usefulness.

### Process Comparison

| Process | Strongest focus |
|---|---|
| CRISP-DM | Complete business-to-deployment lifecycle |
| SEMMA | Technical modeling workflow |
| Big-data lifecycle | Large-scale collection, storage, processing, analysis |

- `SMAM` appears locally without a confirmed expansion.
- Never invent its expansion during revision.

## Session 3: Data, Models, And Pipelines

### Data Forms

| Form | Structure | Example |
|---|---|---|
| Structured | Fixed rows and columns | Customer table |
| Semi-structured | Flexible tags or keys | JSON document |
| Unstructured | No fixed table shape | Image or email |
| Multimodal | Several data forms together | Video with sound |

### Attribute Scales

| Scale | Meaning | Example |
|---|---|---|
| Nominal | Names without order | City |
| Ordinal | Ordered categories | Low, medium, high |
| Interval | Equal gaps, arbitrary zero | Celsius temperature |
| Ratio | Equal gaps, true zero | Distance |

### Data Quality

- Accuracy means values describe reality correctly.
- Completeness means required values are present.
- Consistency means related values agree.
- Timeliness means values remain current.
- Validity means values obey allowed rules.
- Uniqueness means duplicate records are absent.

### Analysis Models

- Association analysis finds items occurring together.
- Prediction estimates an unknown outcome from known inputs.
- Classification predicts a category.
- Regression predicts a number.

### Data Pipeline

```mermaid
flowchart LR
    A[Sources] --> B[Extract]
    B --> C[Ingest]
    C --> D[Clean]
    D --> E[Explore]
    E --> F[Wrangle]
    F --> G[Transform]
    G --> H[Manage features]
    H --> I[Serve]
```

### Pipeline Words

- Extraction reads data from its source.
- Ingestion moves data into a working system.
- Cleaning fixes detectable quality problems.
- Exploration searches for patterns and surprises.
- Wrangling reshapes data into usable form.
- Versioning records which data changed and when.
- Transformation changes values or structures.
- Feature management controls reusable model inputs.

### Modern Infrastructure

- A warehouse stores cleaned, structured analytical data.
- A lake stores large amounts of varied raw data.
- Cloud systems rent computing and storage when needed.

## Session 4: Numeric Data Wrangling

### Cleaning Choices

- Remove records only with a clear reason.
- Correct values when reliable truth exists.
- Impute means estimating missing values.
- Flag uncertain corrections for later review.

### Aggregation And Sampling

- Aggregation combines detailed records into summaries.
- Sampling studies a smaller representative data portion.
- Biased samples create biased conclusions.
- Random sampling gives each record a known selection chance.

### Statistical Description

$$
\bar{x}=\frac{1}{n}\sum_{i=1}^{n}x_i
$$

- Mean uses every value but reacts strongly to extremes.
- Median is the middle ordered value.
- Mode is the most frequent value.

$$
\operatorname{variance}=\frac{1}{n}\sum_{i=1}^{n}(x_i-\bar{x})^2
$$

- Variance measures squared spread around the mean.
- Standard deviation is variance's square root.

### Distance And Similarity

$$
d_{Euclidean}(x,y)=\sqrt{\sum_i(x_i-y_i)^2}
$$

- Euclidean distance measures straight-line separation.

$$
d_{Manhattan}(x,y)=\sum_i|x_i-y_i|
$$

- Manhattan distance adds coordinate differences.

$$
\cos(x,y)=\frac{x\cdot y}{\lVert x\rVert\lVert y\rVert}
$$

- Cosine similarity compares direction, not size.

$$
J(A,B)=\frac{|A\cap B|}{|A\cup B|}
$$

- Jaccard similarity compares shared set members.

### Attribute-Specific Proximity

$$
d(i,j)=\frac{p-m}{p}
$$

- $p$: compared nominal attributes.
- $m$: matching nominal attributes.

$$
J(i,j)=\frac{q}{q+r+s}
$$

- $q$: shared ones in asymmetric binary data.
- $r,s$: one-zero mismatches; shared zeros are ignored.

$$
z=\frac{r-1}{M-1}
$$

- $r$: an ordinal value's rank.
- $M$: total ordered states.
- Compare normalized ranks using numeric distance.

### Numeric Transformations

- Discretization changes continuous numbers into intervals.
- Binarization changes values into zero or one.
- Equal-width bins use equally sized numeric ranges.
- Equal-frequency bins contain similar record counts.
- Supervised discretization uses labels; unsupervised discretization ignores labels.

$$
x'=\frac{x-x_{min}}{x_{max}-x_{min}}
$$

- Min-max normalization usually maps values between zero and one.

$$
z=\frac{x-\mu}{\sigma}
$$

- Standardization centers values and scales their spread.
- Smoothing reduces random noise while preserving useful patterns.

## Session 5: Categorical And Multimedia Data

### Text Preparation

1. Normalize letter case.
2. Remove unwanted punctuation.
3. Split text into tokens.
4. Remove unhelpful common words carefully.
5. Reduce words using stemming or lemmatization.

- A term-document matrix stores token counts by document.
- Lexical substitution maps domain synonyms toward one chosen term.
- Stemming removes word endings using rules.
- Lemmatization uses grammar to find a dictionary root.

### Categorical Encoding

| Method | Best use | Main risk |
|---|---|---|
| One-hot | Unordered categories | Many new columns |
| Ordinal | Truly ordered categories | False order when misused |
| Label | Tree models or target labels | Implied numeric order |
| Frequency | Many categories | Rare labels may collide |

- Fit encoders using training data only.
- Prepare a rule for unseen categories.

### Other Modalities

- Images use pixels, colors, edges, shapes, and learned features.
- Audio uses samples, frequency, energy, and spectrograms.
- Video combines frames, motion, sound, and time.

### Exploratory Visualization

| Question | Helpful chart |
|---|---|
| Distribution shape | Histogram |
| Category comparison | Bar chart |
| Two-number relationship | Scatter plot |
| Trend over time | Line chart |
| Spread and outliers | Box plot |

- Exploratory charts help the analyst discover.
- Explanatory charts help the audience understand.

## Sessions 6–7: Feature Engineering

### Core Meanings

- A feature is an input used by a model.
- Extraction derives useful information from raw data.
- Construction combines existing variables into new variables.
- Selection keeps useful variables and removes weaker ones.
- Reduction represents many variables using fewer dimensions.

### Selection Methods

| Method | How selection happens | Main trade-off |
|---|---|---|
| Filter | Scores features before modeling | Fast, ignores model interactions |
| Wrapper | Tests feature subsets using models | Stronger, computationally expensive |
| Embedded | Selects during model training | Model-specific |

### Confirmed Filter Measures

| Measure | Suitable variables | Main caution |
|---|---|---|
| Pearson correlation | Two continuous variables | Detects linear relationships |
| Chi-square | Two categorical variables | Needs expected counts |
| Information gain | Discrete variables | Continuous values need discretization |
| Gini index | Classification splits | Interpretation depends on usage |

- Sequential Forward Selection adds the best remaining feature repeatedly.
- Sequential Backward Selection removes the weakest feature repeatedly.
- Recursive Feature Elimination repeatedly removes low-ranked features.

### Modality Examples

- Text features include counts, n-grams, and TF-IDF.
- Image features include edges, color, texture, and learned embeddings.
- Audio features include frequency energy and cepstral coefficients.
- Video features include frames, motion, audio, and temporal patterns.

### Dimensionality Reduction

- It compresses many features into fewer informative dimensions.
- Principal Component Analysis finds high-variance directions.
- Reduction may improve speed and reduce noise.
- Reduced features may become harder to explain.

### Leakage Warning

- Leakage exposes unavailable future or test information during training.
- Fit transformations using training data only.
- Apply learned transformations unchanged to validation and test data.

## Post-Midterm Source Warning

- [Association slides](Intro%20to%20Ds/Class%20Material/IDS_7_Association_Analysis-FP%20growth.pptx) cover FP-growth.
- The handout places association analysis in sessions 10–11.
- Do not treat the filename's `7` as midterm session 7.

## Session 8: Classification And Prediction

> Confirmed by the handout; no dedicated local lecture file exists.

### Core Meanings

- Classification predicts a category.
- Prediction is the broader act of estimating unknown outcomes.
- A label is the correct target value.
- Training data teaches the model.
- Test data checks performance on unseen examples.

### Confusion Matrix

| Term | Plain meaning |
|---|---|
| True positive | Correctly predicted positive |
| True negative | Correctly predicted negative |
| False positive | Incorrect positive alarm |
| False negative | Missed positive case |

### Evaluation Formulas

$$
\text{Accuracy}=\frac{TP+TN}{TP+TN+FP+FN}
$$

$$
\text{Precision}=\frac{TP}{TP+FP}
$$

$$
\text{Recall}=\frac{TP}{TP+FN}
$$

$$
F_1=2\times\frac{\text{Precision}\times\text{Recall}}{\text{Precision}+\text{Recall}}
$$

- Accuracy can mislead when classes are strongly imbalanced.
- Precision matters when false alarms are expensive.
- Recall matters when missed positives are dangerous.
- $F_1$ balances precision and recall.

## Assignment Evidence

### Confirmed Workflow

1. Ingest and validate the assigned dataset.
2. Clean and transform using pandas.
3. Analyze numbers using NumPy and SciPy.
4. Extract and aggregate relevant records.
5. Present insights, limitations, and conclusions.

### Expected Reasoning Pattern

- State the question before calculating.
- Show the supporting grouped output.
- Compare totals, counts, units, and means.
- Mention ties when the question requests them.
- Distinguish partial periods from real trends.
- State limitations before making broad claims.

### Assignment Lessons

- Mean and median differences reveal skew.
- Skewness describes distribution asymmetry.
- Grouped totals answer segment questions.
- Pivot tables reveal two-category patterns.
- Synthetic data cannot prove real business behavior.
- Revenue does not equal profit.

## Sample And Historical Paper Evidence

> These files show question style; they do not guarantee current questions.

- Eight-mark scenarios combine attribute types, quality issues, and model choice.
- Other eight-mark scenarios require goals, data sources, methodology, and roles.
- Three-mark questions commonly test team roles and responsibilities.
- Sample questions request short, case-specific bullets instead of generic definitions.
- Exploratory versus explanatory analysis appears as a scenario comparison.
- Data-science roles versus business roles appear repeatedly.

## Exam Answer Templates

### Define And Explain

1. Give one plain definition.
2. State why the idea matters.
3. Give one tiny example.
4. Add one limitation.

### Compare Two Concepts

1. Define both concepts.
2. Compare purpose, data, and output.
3. Give one suitable use case.
4. State one trade-off.

### Scenario Question

1. Name the best choice.
2. Connect evidence to that choice.
3. State the main trade-off.
4. Finish with a direct conclusion.

## Likely Practice Areas

> These are predictions, not guaranteed questions.

- Compare four analytics types using one scenario.
- Draw CRISP-DM and explain every stage.
- Compare structured, semi-structured, and unstructured data.
- Order and explain pipeline stages.
- Calculate one normalization result.
- Compare Euclidean, cosine, and Jaccard measures.
- Choose suitable categorical encoding.
- Compare filter, wrapper, and embedded selection.
- Calculate confusion-matrix metrics.
- Explain one assignment finding with a limitation.

## Recall Checklist

- Can I name all four analytics types?
- Can I draw CRISP-DM from memory?
- Can I classify common data forms?
- Can I explain each pipeline stage?
- Can I choose a distance measure?
- Can I choose an encoding method?
- Can I distinguish extraction, construction, selection, and reduction?
- Can I calculate accuracy, precision, recall, and $F_1$?