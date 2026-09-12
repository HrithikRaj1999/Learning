**Birla Institute of Technology & Science, Pilani**

**Work Integrated Learning Programmes Division**

**Digital Learning Handout**

**Part A: Content Design**

|   |   |
|---|---|
|**Course Title**|Preprocessing for AI-Ready Data|
|**Course No(s)**|DSE ZG505|
|**Credit Units**|4|
|**Credit Model**|3-1-0|
|**Course Author**|Sugata Ghosal, Shakshi Sharma|
|**Version No:**|2|
|**Date:**|02/07/2026|

**Course Description:**

AI-readiness of data across modalities, e.g., audio, text, images, graphs, spatial, time-series; data wrangling (munging); contextual enrichment of metadata; feature selection; modality-specific feature extraction techniques for different data modalities; multimodal feature extraction; knowledge graph; pre-trained deep learning model-based feature extraction; pre-processing for deep learning; for data governance, e.g., fairness, explainability, security and privacy; regulatory compliance.

**Course Objectives**

|   |   |
|---|---|
|**No**|**Course Objective**|
|**CO1**|Diagnose data quality issues (missing values, duplicates, outliers, inconsistent schemas, label noise) and select appropriate remediation strategies|
|**CO2**|Apply feature engineering, encoding, and scaling techniques suited to different model families|
|**CO3**|Pre-process unstructured and multimodal data (text, images, audio, graphs, spatial, time series) into model-ready representations|
|**CO4**|Handle imbalanced datasets and evaluate the trade-offs of resampling and reweighting strategies|
|**CO5**|Design pre-trained deep learning model-based feature extraction|
|**CO6**|Evaluate data pre-processing decisions through the lens of data governance: fairness, explainability, security, privacy, and regulatory compliance|

**Text Book(s):**

|        |                                                                                                                                                 |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **T1** | [[T1 _ Feature Engineering for Machine Learning, O'Reilly, 2018, Alice Zheng & Amanda Casari.pdf]]                                              |
| **T2** | Data Cleaning, ACM Books, 2019, Ihab F. Ilyas & Xu Chu                                                                                          |
| **T3** | [[T3 _ Deep Learning (Adaptive Computation and Machine Learning series), MIT Press, 2016, Ian Goodfellow, Yoshua Bengio & Aaron Courville.pdf]] |
| **T4** | [[T4 _ Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow, O'Reilly, Aurélien Géron.pdf]]                                       |

**Reference Book(s) & other resources:**

|   |   |
|---|---|
|**R1**|Data Science, MIT Press, John D. Kelleher & Brendan Tierney|
|**R2**|Statistical Analysis with Missing Data, Wiley, Roderick J.A. Little & Donald B. Rubin|
|**R3**|Flexible Imputation of Missing Data, Stef van Buuren|
|**R4**|Outlier Analysis, Springer, Charu C. Aggarwal|
|**R5**|Data Matching, Springer, Peter Christen|
|**R6**|Feature Engineering and Selection, CRC Press, Max Kuhn & Kjell Johnson|
|**R7**|Speech and Language Processing, Daniel Jurafsky & James H. Martin|
|**R8**|Computer Vision: Algorithms and Applications, Richard Szeliski|
|**R9**|Forecasting: Principles and Practice, Rob J. Hyndman & George Athanasopoulos (free online)|
|**R10**|Fairness and Machine Learning, Solon Barocas, Moritz Hardt & Arvind Narayanan (fairmlbook.org)|
|**R11**|Research Papers, Blogs, and Tool Documentation (Great Expectations, scikit-learn, spaCy, PyTorch, TensorFlow docs; SMOTE, LOF, Isolation Forest, Box-Cox, Datasheets for Datasets, Model Cards, BPE, GAN, DDPM and related papers)|
|**R12**|Python Data Science Handbook, O'Reilly, Jake VanderPlas|
|**R13**|Time Series Analysis: Forecasting and Control, Wiley, George E.P. Box, Gwilym M. Jenkins, Gregory C. Reinsel & Greta M. Ljung|
|**R14**|Graph Representation Learning by William L. Hamilton|
|**R15**|Yuan, Y., Li, Z., & Zhao, B. A Survey of Multimodal Learning: Methods, Applications, and Future Directions. ACM Computing Surveys, 57(6), Article 130, 2025.|
|**R16**|Yin, S., Fu, C. L., Zhao, S., et al. A Survey on Multimodal Large Language Models. arXiv:2306.13549, 2023/2024.|

**Learning Outcomes: Students will be able to**

|   |   |
|---|---|
|**LO1**|Assess and remediate data quality issues across structured, unstructured, and multimodal datasets|
|**LO2**|Engineer, encode, and scale features appropriately for different model families, including modality-specific and multimodal feature extraction|
|**LO3**|Build model-ready representations for text, image, audio, graph, spatial, and time-series data, including deep-learning-specific pipelines|
|**LO4**|Apply LLM-based and pre-trained deep learning model-based techniques for feature representation and data augmentation|
|**LO5**|Evaluate pre-processing pipelines for data governance: fairness, explainability, security, privacy, and regulatory compliance|

**Modular Content Structure**

**1. Foundations of AI-Ready Data & the Data Lifecycle**

● What makes data "AI-ready"?

● Quality dimensions: accuracy, completeness, consistency, timeliness, validity, uniqueness

● The data pipeline

● Structured vs. unstructured vs. semi-structured data vs. multimodal data (types/examples of multimodal data).

● Relationship to Introduction to Data Science (concurrent course)

**2. Data Quality Assessment & Profiling**

● Data profiling techniques; summary statistics, distributions, cardinality checks

● Defining data quality metrics and thresholds

**3. Handling Missing Data & Outlier Detection**

● Deletion strategies vs. imputation

● Missingness as a feature; flag-and-fill approach

● Statistical methods (Z-score, IQR), model-based methods (Isolation Forest, LOF, DBSCAN)

● Contextual vs. global outliers

**4. Data Cleaning: Duplicates, Inconsistencies & Entity Resolution**

● Exact vs. fuzzy duplicate detection

● Standardizing formats

● Record linkage and entity resolution basics

**5. Feature Encoding**

● One-hot, label, ordinal, target/mean, frequency, and binary encoding

● Hashing for high-cardinality categorical variables

● Encoding pitfalls

**6. Feature Scaling, Normalization & Transformation**

● Min-max scaling, standardization, robust scaling

● Log, Box-Cox, and power transforms for skewed distributions

● Pros and Cons of scaling matters

**7. Feature Engineering & Selection**

● Domain-driven feature creation

● Dimensionality reduction, feature importance, mutual information

● Filter, wrapper, and embedded feature selection methods

● Dimensionality reduction in the AI-readiness context

**8. Handling Imbalanced Data**

● Oversampling (SMOTE, ADASYN), undersampling, hybrid methods

● Cost-sensitive learning and class weighting

● Evaluation pitfalls: accuracy trap; appropriate metrics

**9. Text Pre-processing & NLP-Ready Pipelines**

● Cleaning: camelcasing, punctuation, spelling, emojis

● Tokenization, normalization, stop word removal, stemming, lemmatization

● Vectorization: Bag-of-Words, TF-IDF, embeddings

● Handling noisy text

**10. Image & Signal Pre-processing for AI**

● Resizing, normalization, augmentation

● Denoising, contrast enhancement, handling class imbalance in vision datasets

● Basics of audio/signal pre-processing

**11. Time-Series Pre-processing**

● Resampling, interpolation, detrending, seasonality decomposition

● Handling irregular timestamps and lag feature creation

● Windowing strategies and avoiding temporal data leakage

**12. Graph Data Pre-processing & Knowledge Graphs**

● Graph data representation

● Data cleaning for graph datasets

● Constructing graphs from raw/relational data

● Knowledge graph construction

● Graph feature extraction: node2vec/DeepWalk and graph neural network embeddings

**13. Multimodal Feature Extraction**

● Feature extraction across modalities

● Fusion strategies: early, late, and hybrid fusion

● Cross-modal embeddings

● Challenges in multimodal learning

**14. Pre-processing for Deep Learning**

● How pre-processing needs differ for deep learning vs. classical ML: less manual feature engineering, more emphasis on scale, normalization, and pipeline throughput

● Input normalization/standardization conventions for neural nets

● Data augmentation as a deep learning-native pre-processing step

● Sub-word tokenization for deep NLP

**15. Generative AI-Based Techniques for Data Pre-processing**

● Synthetic data generation and diffusion models for augmentation and class balancing

● LLM-based data augmentation: paraphrasing, synthetic labeling, programmatic data cleaning and normalization

● Generative imputation and anomaly correction as an alternative to classical imputation

● Evaluating synthetic data quality: distributional fidelity, mode collapse, privacy leakage, downstream utility

● Course synthesis: revisiting the pre-processing checklist across classical, deep learning, and generative techniques

**16. Bias, Fairness & Ethical Considerations**

● How pre-processing choices introduce or amplify bias

● Privacy-preserving pre-processing

● Documentation practices

● Regulatory compliance considerations

  

**Part B: Learning Plan**

|   |   |   |   |
|---|---|---|---|
|**Contact Session**|**List of Topic Title**|**Sub-Topics**|**Reference**|
|1|**Foundations of AI-Ready Data & the Data Lifecycle**|What makes data "AI-ready"? Quality dimensions: accuracy, completeness, consistency, timeliness, validity, uniqueness; The data pipeline: ingestion → cleaning → transformation → feature engineering → validation → serving; Structured vs. unstructured vs. semi-structured data vs. multimodal data (types/examples of multimodal data). Relationship to Introduction to Data Science (concurrent course)|R1 Ch.1–2; T4 Ch.2; T2 Ch.1|
|2|**Data Quality Assessment & Profiling**|Data profiling techniques; summary statistics, distributions, cardinality checks; Automated profiling tools (pandas-profiling/ydata-profiling, Great Expectations); Defining data quality metrics and thresholds|T2 Ch.2; R11 (Great Expectations & profiling docs)|
|3|**Handling Missing Data & Outlier Detection**|Deletion strategies vs. imputation (mean/median/mode, KNN, regression); Missingness as a feature; flag-and-fill approach<br><br>Statistical methods (Z-score, IQR), model-based methods (Isolation Forest, LOF, DBSCAN); Contextual vs. global outliers; when to remove vs. cap vs. transform|R2 Ch.1–3; R3 Ch.1–2; R12<br><br>R4 Ch.1–2; R11 (LOF, Isolation Forest papers)|
|4|**Data Cleaning: Duplicates, Inconsistencies & Entity Resolution**|Exact vs. fuzzy duplicate detection (Levenshtein, Jaccard, embedding similarity); Standardizing formats (dates, units, categorical labels); Record linkage and entity resolution basics|T2 Ch.4–5; R5 Ch.1,5|
|5|**Feature Encoding (Categorical Data)**|One-hot, label, ordinal, target/mean, frequency, and binary encoding; Handling high-cardinality categorical variables; hashing trick; Encoding pitfalls: data leakage, unseen categories at inference|T1 Ch.5–6; R11 (scikit-learn preprocessing docs)|
|6|**Feature Scaling, Normalization & Transformation**|Min-max scaling, standardization, robust scaling; Log, Box-Cox, and power transforms for skewed distributions; When scaling matters (distance-/gradient-based models) vs. when it doesn't (tree-based models)|T1 Ch.2; R11 (Box & Cox, 1964)|
|7|**Feature Engineering & Selection**|Domain-driven feature creation, interaction terms, polynomial features; Dimensionality reduction: PCA, feature importance, mutual information; Filter, wrapper, and embedded feature selection methods; Dimensionality reduction in the AI-readiness context|T1 Ch.6; R6 Ch.3–5; R11 (Guyon & Elisseeff, 2003)|
|8|**Handling Imbalanced Data**|Oversampling (SMOTE, ADASYN), undersampling, hybrid methods; Cost-sensitive learning and class weighting; Evaluation pitfalls: accuracy trap; appropriate metrics (F1, PR-AUC)|R11 (SMOTE 2002; He & Garcia 2009; imbalanced-learn docs)|
|9|**Text Preprocessing & NLP-Ready Pipelines**|Cleaning: camelcasing, punctuation, spelling, emojis<br><br>Tokenization, normalization, stopword removal, stemming/lemmatization; Vectorization: Bag-of-Words, TF-IDF, embeddings (word2vec, transformer-based); Handling noisy text (social media, OCR output, multilingual text)|R7 Ch.2,6; T1 Ch.3–4; R11 (spaCy docs)|
|10|**Image & Signal Preprocessing for AI**|Resizing, normalization, augmentation (flip, rotate, crop, color jitter); Denoising, contrast enhancement, handling class imbalance in vision datasets; Basics of audio/signal preprocessing (sampling, filtering, spectrograms)|R8 Ch.3; T1 Ch.8; R11 (Shorten & Khoshgoftaar, 2019)|
|11|**Time-Series Preprocessing**|Resampling, interpolation, detrending, seasonality decomposition; Handling irregular timestamps and lag feature creation; Windowing strategies and avoiding temporal data leakage|R9 Ch.2–3; R13 Ch.1–2|
|12|**Graph Data Pre-processing & Knowledge Graphs**|Graph data representation: nodes, edges, attributes; Data cleaning for graph datasets; constructing graphs from raw/relational data; Knowledge graph construction: entity/relation extraction, linking, ontology alignment; Graph feature extraction: node2vec/DeepWalk and graph neural network embeddings|R14 Ch. 1-5|
|13|**Multimodal Feature Extraction & Preprocessing for Deep Learning**|Feature extraction across modalities; Fusion strategies: early, late, and hybrid fusion; Cross-modal embeddings; Challenges in multimodal learning.<br><br>differentiate preprocessing for deep learning vs. classical ML: less manual feature engineering, more emphasis on scale, normalization, and pipeline throughput; Input normalization conventions for neural nets; Data augmentation as a deep learning-native pre-processing step; Sub-word tokenization for deep NLP.|R15, R16 (research papers)<br><br>T3 Ch.11; R11 (Sennrich et al. 2016; PyTorch/TF docs)|
|14|**Generative AI-Based Techniques for Data Preprocessing**|Synthetic data generation and diffusion models for augmentation and class balancing; LLM-based data augmentation: paraphrasing, synthetic labeling, programmatic data cleaning and normalization; Generative imputation and anomaly correction as an alternative to classical imputation; Evaluating synthetic data quality: distributional fidelity, mode collapse, privacy leakage, downstream utility; Course synthesis: revisiting the preprocessing checklist across classical, deep learning, and generative techniques|R11 (Goodfellow et al. 2014; Ho et al. 2020; Jordon et al. 2022)|
|15|**Bias, Fairness & Ethical Considerations in Preprocessing**|How preprocessing choices introduce or amplify bias (sampling bias, proxy variables, label bias); Privacy-preserving preprocessing: anonymization, pseudonymization, differential privacy basics; Documentation practices: datasheets for datasets, data provenance, consent tracking; Regulatory compliance considerations in data preprocessing|R10 Ch.1–2; R11 (Gebru et al. 2021; Mitchell et al. 2019; Suresh & Guttag 2021)|
|16|**Review**|Review of contact sessions 1 to 15|NA|

_Reference codes (T = Text Book, R = Reference Book/resource) correspond to the Text Book(s) and Reference Book(s) & other resources tables in Part A above. Chapter numbers follow standard/current editions; confirm against your library's specific printing._

**Experiential Learning Components:**

● Lab work: 14

● Project work: 1 (Capstone Project)

● Case Study: Module 15 — discussion and real-world case studies on preprocessing failures

● Simulation: 0

● Work Integrated Learning Assignment: 2 Assignments

● Design work/Field work: 0

**Objective of Experiential Learning Component:**

Hands-on sessions applying data preprocessing techniques using industry-standard Python tooling, culminating in a reproducible, documented, end-to-end preprocessing pipeline for a real-world capstone dataset.

**Scope of Experiential Learning Component:**

Programming language: Python

Tools and libraries: pandas, NumPy, scikit-learn, Jupyter/Colab, spaCy/NLTK, OpenCV/Pillow, pandas-profiling, PyTorch/TensorFlow

Development Environment: - Python 3.8+ - TensorFlow 2.x / PyTorch 2.0+

**Lab Infrastructure:** WILP Virtual Lab

**List of Experiments:**

|   |   |   |
|---|---|---|
|**Lab No**|**Lab Objective**|**Session Reference**|
|1|Explore a raw, messy dataset with pandas|1|
|2|Generate a data quality report and quality scorecard|2|
|3|Compare imputation strategies and their downstream effect on model performance|3|
|4|Detect and treat outliers in a financial/sensor dataset|4|
|5|Deduplicate and standardize a multi-source customer dataset|5|
|6|Build an encoding pipeline with scikit-learn ColumnTransformer|6|
|7|Compare model sensitivity to scaling choices|7|
|8|Engineer and select features for a tabular prediction task|8|
|9|Address class imbalance in a fraud/churn dataset|9|
|10|Build a text preprocessing pipeline with spaCy/NLTK for a downstream classifier|10|
|11|Build an image preprocessing/augmentation pipeline with OpenCV/Pillow|11|
|12|Prepare a multivariate time-series dataset for forecasting|12|
|13|Build a PyTorch/TensorFlow data pipeline with on-the-fly augmentation and batching|13|
|14|Generate synthetic data using Generative AI models and compare it with conventional data augmentation techniques across different data modalities|15|

**Evaluation Scheme:**

_Legend: EC = Evaluation Component_

|   |   |   |   |   |   |
|---|---|---|---|---|---|
|**Evaluation Component**|**Name (Quiz, Lab, Project, Mid-term exam, End semester exam, etc.)**|**Type (Open book, Closed book, Online, etc.)**|**Weight**|**Duration**|**Day, Date, Session, Time**|
|**EC-1**|Quiz (2)|Online|10%|1 week|To be announced|
|Assignments (2)|20%|10 days|
|**EC-2**|Midterm Exam (Modules 1–8 coverage)|Closed Book|30%|2 hours|To be announced|
|**EC-3**|Comprehensive Exam|Open Book|40%|2.5 hours|To be announced|

Syllabus for Midterm Practical Exam (Closed Book): Modules 1 to 8

Syllabus for Comprehensive coverage (Open Book): All modules

**Important Links and Information:**

**eLearn Portal:** [https://elearn.bits-pilani.ac.in](https://elearn.bits-pilani.ac.in/)

Students must visit the eLearn portal regularly and stay updated with the latest announcements and deadlines.

**Contact Sessions:** Students should attend the online lectures as per the schedule provided on the eLearn portal.

**Evaluation Guidelines:**

● EC-1 consists of either two Assignments or three Quizzes. Students will attempt them through the course pages on the eLearn portal. Announcements will be made on the portal in a timely manner.

● For Closed Book tests: no books or reference material of any kind will be permitted.

● For Open Book exams: “open book” means text/ reference books (publisher copy only) and does not include any other learning material. No other learning material will be permitted during the open book examinations. For Detailed Guidelines refer to the attached document.

  [EC3 Guidelines](https://docs.google.com/document/d/1DJvlhVzOaIw4njc9g30MlBuu0DqTzeIL/edit?usp=drive_link&ouid=104481483083011111295&rtpof=true&sd=true) 

● If a student is unable to appear for the Regular Test/Exam due to genuine exigencies, the student should follow the procedure to apply for the Make-Up Test/Exam, which will be made available on the eLearn portal. The Make-Up Test/Exam will be conducted only at selected exam centres on the dates to be announced later.

It shall be the responsibility of the individual student to be regular in following the self-study schedule given in this course handout, attend the sessions, and complete all prescribed evaluation components — Lab Assignments, the Midterm Practical Exam, and the Capstone Project — according to the evaluation scheme provided above.