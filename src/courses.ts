
export type Lesson = {
  id: string;
  title: string;
  content: string;
};

export type Course = {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
};

export const courses: Course[] = [
  // =====================================================
  // 1. PYTHON PROGRAMMING
  // =====================================================
  {
    id: "python-basics",
    title: "Python Programming",
    description:
      "Master Python programming, problem-solving, functions, data structures, and practical projects.",
    lessons: [
      {
        id: "python-1",
        title: "Introduction to Python",
        content: `LEARNING OBJECTIVES

Understand what Python is, where it is used, and how to write your first program.

WHAT IS PYTHON?

Python is a high-level, interpreted programming language known for readable syntax. It is used in:
• Web development
• Data science and analytics
• Artificial intelligence
• Automation
• Scientific computing

YOUR FIRST PROGRAM

print("Hello, CloudAce AI!")

The print() function displays information on the screen.

PRACTICAL EXERCISE

1. Install Python.
2. Open VS Code.
3. Create a file called hello.py.
4. Print your name and your favourite programming language.

CHALLENGE

Write a program that displays:
Welcome to CloudAce AI
Your journey into programming starts here!`,
      },
      {
        id: "python-2",
        title: "Variables and Data Types",
        content: `LEARNING OBJECTIVES

Learn how to store, identify, and manipulate information.

VARIABLES

Variables are named storage locations for data.

name = "Alex"
age = 21
height = 1.75
is_student = True

COMMON DATA TYPES

• str: text, such as "CloudAce"
• int: whole numbers, such as 25
• float: decimal numbers, such as 3.14
• bool: True or False
• NoneType: represents the absence of a value

TYPE CHECKING

print(type(name))
print(type(age))

TYPE CONVERSION

age_text = "21"
age_number = int(age_text)

PRACTICAL EXERCISE

Create variables for your name, age, course, and student status. Print each value and its data type.

CHALLENGE

Calculate a person's age five years from now using a variable.`,
      },
      {
        id: "python-3",
        title: "Operators and Expressions",
        content: `OPERATORS

Python operators perform calculations and comparisons.

Arithmetic:
+ addition
- subtraction
* multiplication
/ division
// floor division
% remainder
** exponentiation

COMPARISON

== equal to
!= not equal to
> greater than
< less than
>= greater than or equal to
<= less than or equal to

LOGICAL OPERATORS

and, or, not

EXAMPLE

price = 500
quantity = 3
total = price * quantity

print("Total:", total)

PRACTICAL EXERCISE

Build a simple shopping calculator that accepts the price and quantity of three products and calculates the total cost.

CHALLENGE

Calculate the average of five examination marks.`,
      },
      {
        id: "python-4",
        title: "Conditions and Decision Making",
        content: `CONDITIONAL STATEMENTS

Conditions allow programs to make decisions.

EXAMPLE

marks = 75

if marks >= 70:
    print("Distinction")
elif marks >= 50:
    print("Pass")
else:
    print("Needs improvement")

HOW IT WORKS

• if checks the first condition.
• elif checks another condition when previous conditions are false.
• else executes when none of the conditions match.

INDENTATION

Python uses indentation to define code blocks. Incorrect indentation can cause errors.

PRACTICAL EXERCISE

Create a grading program that assigns grades based on examination marks.

CHALLENGE

Write a program that checks whether a number is positive, negative, or zero.`,
      },
      {
        id: "python-5",
        title: "Loops and Iteration",
        content: `WHY USE LOOPS?

Loops repeat instructions and reduce repetitive code.

FOR LOOP

for number in range(1, 6):
    print(number)

WHILE LOOP

count = 1

while count <= 5:
    print(count)
    count += 1

LOOP CONTROL

break stops a loop.
continue skips the current iteration.

PRACTICAL EXERCISE

Write a program that prints multiplication tables from 1 to 10.

CHALLENGE

Calculate the sum of all numbers from 1 to 100.`,
      },
      {
        id: "python-6",
        title: "Functions and Modular Programming",
        content: `WHAT IS A FUNCTION?

A function is a reusable block of code that performs a particular task.

DEFINING A FUNCTION

def greet(name):
    return f"Hello, {name}!"

print(greet("Alex"))

PARAMETERS AND ARGUMENTS

Parameters are variables defined in a function. Arguments are the actual values passed to it.

RETURN VALUES

The return statement sends a result back to the caller.

DEFAULT PARAMETERS

def calculate_total(price, quantity=1):
    return price * quantity

PRACTICAL EXERCISE

Create functions for addition, subtraction, multiplication, and division.

CHALLENGE

Build a calculator that uses separate functions for each operation.`,
      },
      {
        id: "python-7",
        title: "Lists, Tuples, Sets and Dictionaries",
        content: `PYTHON DATA STRUCTURES

Lists:
Ordered and changeable collections.

students = ["Alex", "Mary", "John"]
students.append("Grace")

Tuples:
Ordered collections that cannot be changed after creation.

coordinates = (10, 20)

Sets:
Collections of unique values.

numbers = {1, 2, 2, 3}

Dictionaries:
Store information using key-value pairs.

student = {
    "name": "Alex",
    "age": 21,
    "course": "Data Science"
}

print(student["name"])

PRACTICAL EXERCISE

Create a student record system using dictionaries and a list of students.

CHALLENGE

Calculate the average mark stored in a list of examination scores.`,
      },
      {
        id: "python-8",
        title: "Files, Exceptions and Debugging",
        content: `FILE HANDLING

Python can read and write files.

WRITING A FILE

with open("notes.txt", "w") as file:
    file.write("Learning Python")

READING A FILE

with open("notes.txt", "r") as file:
    content = file.read()

EXCEPTION HANDLING

try:
    number = int(input("Enter a number: "))
    print(100 / number)
except ValueError:
    print("Enter a valid number.")
except ZeroDivisionError:
    print("Cannot divide by zero.")

DEBUGGING

Debugging is the process of finding and correcting errors in a program.

PRACTICAL EXERCISE

Create a program that saves learner names and scores to a text file.

CHALLENGE

Improve the program by handling invalid input and missing files.`,
      },
      {
        id: "python-9",
        title: "Python Mini Project: Student Management System",
        content: `PROJECT OBJECTIVE

Build a simple student management system using the concepts learned in this course.

REQUIREMENTS

1. Add a student.
2. Store the student's name and examination score.
3. Display all registered students.
4. Calculate the average score.
5. Search for a student.
6. Save student records to a file.
7. Handle invalid user input.

SUGGESTED CONCEPTS

• Lists and dictionaries
• Functions
• Loops and conditions
• File handling
• Exception handling

SUCCESS CRITERIA

Your application should run without crashing when a user enters invalid data.

EXTENSION

Add the ability to update and delete student records.`,
      },
    ],
  },

  // =====================================================
  // 2. DATA SCIENCE FUNDAMENTALS
  // =====================================================
  {
    id: "data-science",
    title: "Data Science Fundamentals",
    description:
      "Learn data collection, cleaning, statistics, exploratory analysis, and visualization.",
    lessons: [
      {
        id: "data-1",
        title: "What Is Data Science?",
        content: `INTRODUCTION

Data science combines statistics, programming, mathematics, and domain knowledge to extract useful insights from data.

APPLICATIONS

• Healthcare: analysing patient information.
• Finance: detecting suspicious transactions.
• Agriculture: predicting crop yields.
• Business: understanding customer behaviour.
• Education: analysing learner performance.

THE DATA SCIENCE WORKFLOW

1. Define the problem.
2. Collect data.
3. Clean and prepare data.
4. Explore and analyse data.
5. Build models where appropriate.
6. Communicate findings.

PRACTICAL EXERCISE

Identify three problems in your community that could be investigated using data.

CHALLENGE

Explain how data analysis could help a small business increase its sales.`,
      },
      {
        id: "data-2",
        title: "Understanding Datasets",
        content: `WHAT IS A DATASET?

A dataset is a structured collection of observations and variables.

Rows generally represent observations, while columns represent features or attributes.

EXAMPLE

Name       Age       Score
Alex       20        85
Mary       22        91
John       21        76

IMPORTANT TERMS

• Observation: one record in a dataset.
• Feature: an input variable.
• Target: the value being predicted.
• Numerical data: measurable quantities.
• Categorical data: groups or labels.

DATA FORMATS

Common formats include CSV, Excel, JSON, and database tables.

PRACTICAL EXERCISE

Create a CSV file containing ten students, their ages, and examination scores.

CHALLENGE

Identify the observations, features, and possible target variable in your dataset.`,
      },
      {
        id: "data-3",
        title: "Introduction to Statistics",
        content: `WHY STATISTICS?

Statistics helps us understand patterns, variation, and relationships in data.

MEAN

The mean is the sum of values divided by the number of observations.

Mean = Sum of values / Number of values

MEDIAN

The median is the middle value after sorting observations.

MODE

The mode is the most frequently occurring value.

RANGE

Range = Maximum value - Minimum value

VARIANCE AND STANDARD DEVIATION

These describe how spread out values are around the mean.

PRACTICAL EXERCISE

Given scores [60, 70, 70, 80, 90], calculate the mean, median, mode, and range.

CHALLENGE

Explain why the median may be more useful than the mean when a dataset contains extreme values.`,
      },
      {
        id: "data-4",
        title: "Data Collection and Preparation",
        content: `DATA COLLECTION

Data can be collected through:
• Surveys and questionnaires
• Interviews
• Sensors
• Websites and APIs
• Existing databases
• Public datasets

DATA QUALITY

Good data should be accurate, complete, consistent, valid, and relevant.

DATA CLEANING

Common problems include:
• Missing values
• Duplicate records
• Incorrect data types
• Inconsistent categories
• Invalid observations

EXAMPLE WITH PYTHON

import pandas as pd

df = pd.read_csv("students.csv")

print(df.head())
print(df.isnull().sum())
print(df.duplicated().sum())

PRACTICAL EXERCISE

Load a CSV dataset and inspect its first five rows, data types, missing values, and duplicate records.

CHALLENGE

Create a cleaning plan for a dataset containing incomplete student records.`,
      },
      {
        id: "data-5",
        title: "Exploratory Data Analysis",
        content: `WHAT IS EDA?

Exploratory Data Analysis (EDA) is the process of examining data to understand its structure, distributions, patterns, and unusual observations.

IMPORTANT TECHNIQUES

• Summary statistics
• Frequency distributions
• Histograms
• Box plots
• Correlation analysis
• Group comparisons

PYTHON EXAMPLE

import pandas as pd

df = pd.read_csv("sales.csv")

print(df.describe())
print(df.info())

QUESTIONS TO ASK

1. How many records are present?
2. Which columns contain missing values?
3. What are the highest and lowest values?
4. Are there unusual observations?
5. Which variables appear related?

PRACTICAL EXERCISE

Explore a sales dataset and identify its strongest and weakest sales days.

CHALLENGE

Write five observations that could help a business make better decisions.`,
      },
      {
        id: "data-6",
        title: "Data Visualization",
        content: `WHY VISUALIZE DATA?

Visualizations make complex information easier to understand and communicate.

COMMON CHARTS

• Bar chart: compares categories.
• Line chart: displays changes over time.
• Histogram: shows numerical distributions.
• Scatter plot: examines relationships.
• Pie chart: displays proportions.
• Box plot: highlights spread and potential outliers.

PYTHON EXAMPLE

import matplotlib.pyplot as plt

days = ["Mon", "Tue", "Wed", "Thu"]
sales = [2000, 2500, 1800, 3200]

plt.plot(days, sales, marker="o")
plt.title("Daily Sales")
plt.xlabel("Day")
plt.ylabel("Sales")
plt.show()

GOOD PRACTICES

Use clear titles, labelled axes, appropriate scales, and readable legends.

PRACTICAL EXERCISE

Create a bar chart comparing sales across five products.

CHALLENGE

Choose a suitable chart to communicate monthly sales trends and explain your choice.`,
      },
      {
        id: "data-7",
        title: "Introduction to Pandas and NumPy",
        content: `NUMPY

NumPy provides efficient numerical arrays and mathematical operations.

import numpy as np

scores = np.array([70, 80, 90])
print(np.mean(scores))

PANDAS

Pandas provides tools for working with structured datasets.

import pandas as pd

df = pd.read_csv("data.csv")

USEFUL OPERATIONS

df.head()
df.tail()
df.shape
df.columns
df.describe()
df["score"].mean()

FILTERING

high_scores = df[df["score"] >= 80]

GROUPING

df.groupby("class")["score"].mean()

PRACTICAL EXERCISE

Load a dataset and calculate average scores for each class.

CHALLENGE

Identify the five highest scoring observations in your dataset.`,
      },
      {
        id: "data-8",
        title: "Data Science Mini Project: Business Analysis",
        content: `PROJECT SCENARIO

A small business owner wants to understand how the business is performing using daily sales records.

PROJECT REQUIREMENTS

1. Create or obtain a sales dataset.
2. Load the data into Python.
3. Inspect and clean the dataset.
4. Calculate total and average sales.
5. Identify the best and weakest sales days.
6. Visualize daily sales.
7. Identify trends and unusual values.
8. Write practical business recommendations.

TOOLS

• Python
• Pandas
• NumPy
• Matplotlib

FINAL DELIVERABLE

Submit a Jupyter Notebook containing:
• Problem statement
• Dataset description
• Data cleaning
• Exploratory analysis
• Visualizations
• Findings
• Recommendations

EXTENSION

Build a simple sales forecast using historical data.`,
      },
    ],
  },

  // =====================================================
  // 3. MACHINE LEARNING
  // =====================================================
  {
    id: "machine-learning",
    title: "Machine Learning",
    description:
      "Understand machine learning algorithms, model training, evaluation, and practical prediction projects.",
    lessons: [
      {
        id: "ml-1",
        title: "Introduction to Machine Learning",
        content: `WHAT IS MACHINE LEARNING?

Machine learning is a branch of artificial intelligence that enables computers to learn patterns from data and make predictions or decisions.

APPLICATIONS

• Fraud detection
• Recommendation systems
• Medical image analysis
• Spam filtering
• Weather prediction
• Customer segmentation

MACHINE LEARNING WORKFLOW

1. Define the problem.
2. Collect data.
3. Prepare features and targets.
4. Select an algorithm.
5. Train the model.
6. Evaluate performance.
7. Deploy and monitor.

PRACTICAL EXERCISE

Identify three real-world problems that could be solved using machine learning.

CHALLENGE

Explain the difference between traditional rule-based programming and machine learning.`,
      },
      {
        id: "ml-2",
        title: "Types of Machine Learning",
        content: `SUPERVISED LEARNING

Models learn from labelled examples.

Examples:
• Classification: predicting categories.
• Regression: predicting numerical values.

UNSUPERVISED LEARNING

Models discover patterns in unlabelled data.

Examples:
• Clustering
• Dimensionality reduction

REINFORCEMENT LEARNING

An agent learns through actions, rewards, and penalties while interacting with an environment.

APPLICATIONS

Classification: predicting whether an email is spam.

Regression: estimating house prices.

Clustering: grouping customers based on purchasing behaviour.

PRACTICAL EXERCISE

Classify five example problems into supervised, unsupervised, or reinforcement learning.

CHALLENGE

Explain why customer segmentation is commonly treated as an unsupervised learning problem.`,
      },
      {
        id: "ml-3",
        title: "Understanding Training Data and Testing Data",
        content: `WHY SPLIT DATA?

A model must be evaluated using data it did not use during training.

TRAINING SET

Used to teach the model.

TEST SET

Used to estimate performance on unseen examples.

VALIDATION SET

Used during model development to compare configurations and tune hyperparameters.

PYTHON EXAMPLE

from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

DATA LEAKAGE

Data leakage happens when information unavailable at prediction time influences training or evaluation.

PRACTICAL EXERCISE

Split a dataset into training and testing sets.

CHALLENGE

Explain why evaluating a model on its training data alone can produce misleading results.`,
      },
      {
        id: "ml-4",
        title: "Linear Regression",
        content: `WHAT IS REGRESSION?

Regression predicts a numerical value using one or more input features.

LINEAR REGRESSION

A simple linear regression model can be represented as:

y = mx + c

Where:
• y is the predicted output.
• x is the input.
• m is the slope.
• c is the intercept.

MULTIPLE LINEAR REGRESSION

Uses several features to predict an output.

PYTHON EXAMPLE

from sklearn.linear_model import LinearRegression

model = LinearRegression()
model.fit(X_train, y_train)

predictions = model.predict(X_test)

APPLICATIONS

• Predicting house prices
• Estimating electricity demand
• Forecasting sales

PRACTICAL EXERCISE

Train a linear regression model using a numerical dataset.

CHALLENGE

Compare actual and predicted values and discuss prediction errors.`,
      },
      {
        id: "ml-5",
        title: "Classification Algorithms",
        content: `WHAT IS CLASSIFICATION?

Classification predicts which category an observation belongs to.

EXAMPLES

• Spam or not spam
• Fraudulent or legitimate transaction
• Pass or fail
• Disease or no disease

COMMON ALGORITHMS

1. Logistic Regression
2. Decision Trees
3. Random Forest
4. K-Nearest Neighbours
5. Support Vector Machines
6. Naive Bayes

PYTHON EXAMPLE

from sklearn.tree import DecisionTreeClassifier

model = DecisionTreeClassifier(random_state=42)
model.fit(X_train, y_train)

predictions = model.predict(X_test)

PRACTICAL EXERCISE

Train a classifier using a labelled dataset.

CHALLENGE

Explain why classification is different from regression.`,
      },
      {
        id: "ml-6",
        title: "Model Evaluation Metrics",
        content: `WHY EVALUATE MODELS?

Evaluation helps determine whether a trained model performs reliably.

CLASSIFICATION METRICS

Accuracy:
Proportion of correct predictions.

Precision:
Proportion of positive predictions that are correct.

Recall:
Proportion of actual positive cases correctly identified.

F1 SCORE:
Harmonic mean of precision and recall.

CONFUSION MATRIX

Shows true positives, true negatives, false positives, and false negatives.

REGRESSION METRICS

• MAE: Mean Absolute Error.
• MSE: Mean Squared Error.
• RMSE: Root Mean Squared Error.
• R-squared: indicates the proportion of target variance explained by the model.

PRACTICAL EXERCISE

Calculate accuracy and a confusion matrix for a classification model.

CHALLENGE

Explain why accuracy may be misleading when one class is much more common than another.`,
      },
      {
        id: "ml-7",
        title: "Clustering and Unsupervised Learning",
        content: `WHAT IS CLUSTERING?

Clustering groups observations according to similarities in their features.

K-MEANS

K-Means divides observations into a specified number of clusters.

GENERAL PROCESS

1. Select the number of clusters.
2. Initialize cluster centres.
3. Assign observations to the nearest centre.
4. Recalculate cluster centres.
5. Repeat until assignments stabilize.

PYTHON EXAMPLE

from sklearn.cluster import KMeans

model = KMeans(n_clusters=3, random_state=42, n_init=10)
clusters = model.fit_predict(X)

OTHER ALGORITHMS

• Hierarchical clustering
• DBSCAN

APPLICATIONS

• Customer segmentation
• Document grouping
• Market research

PRACTICAL EXERCISE

Apply K-Means to a dataset and visualize the resulting clusters.

CHALLENGE

Explain why features should often be scaled before distance-based clustering.`,
      },
      {
        id: "ml-8",
        title: "Overfitting, Underfitting and Regularization",
        content: `OVERFITTING

A model learns training data too closely, including noise, and performs poorly on unseen data.

UNDERFITTING

A model is too simple to capture important patterns in the data.

BIAS AND VARIANCE

High bias is associated with overly simple models.

High variance is associated with models that are too sensitive to training data.

REGULARIZATION

Regularization discourages overly complex models.

COMMON TECHNIQUES

• L1 regularization (Lasso)
• L2 regularization (Ridge)
• Cross-validation
• Early stopping
• Pruning decision trees

PRACTICAL EXERCISE

Compare a regularized and non-regularized model.

CHALLENGE

Describe two ways to reduce overfitting.`,
      },
      {
        id: "ml-9",
        title: "Machine Learning Mini Project",
        content: `PROJECT OBJECTIVE

Develop a complete machine learning solution for a real-world problem.

CHOOSE A PROBLEM

Examples:
• Predict student examination performance.
• Classify emails as spam or not spam.
• Predict electricity output.
• Group customers by purchasing patterns.

PROJECT STEPS

1. Define the problem.
2. Obtain a suitable dataset.
3. Inspect and clean the data.
4. Explore the features.
5. Prepare training and testing sets.
6. Select an algorithm.
7. Train the model.
8. Evaluate performance.
9. Interpret results.
10. Communicate limitations.

TOOLS

• Python
• Pandas
• NumPy
• Matplotlib
• Scikit-learn
• Jupyter Notebook

FINAL DELIVERABLE

Submit a notebook with code, explanations, evaluation results, visualizations, and conclusions.

EXTENSION

Compare two algorithms and justify which one is more appropriate for the problem.`,
      },
    ],
  },

  // =====================================================
  // 4. CLOUD COMPUTING
  // =====================================================
  {
    id: "cloud-computing",
    title: "Cloud Computing Fundamentals",
    description:
      "Understand cloud architecture, service models, deployment models, security, and cloud infrastructure.",
    lessons: [
      {
        id: "cloud-1",
        title: "Introduction to Cloud Computing",
        content: `WHAT IS CLOUD COMPUTING?

Cloud computing provides computing resources such as servers, storage, databases, and networking over the internet.

KEY BENEFITS

• On-demand resources
• Flexible scaling
• Pay-as-you-go pricing
• Global accessibility
• Reduced need to maintain physical infrastructure

TRADITIONAL IT VS CLOUD

Traditional IT requires organizations to purchase and maintain their own infrastructure.

Cloud computing allows organizations to access infrastructure and services from cloud providers.

EXAMPLES

Microsoft Azure, Amazon Web Services, and Google Cloud.

PRACTICAL EXERCISE

Identify five services you use that rely on cloud computing.

CHALLENGE

Explain how a small business could benefit from migrating its files to cloud storage.`,
      },
      {
        id: "cloud-2",
        title: "Cloud Service Models",
        content: `THREE MAJOR SERVICE MODELS

IaaS - Infrastructure as a Service

Provides virtual machines, networking, and storage. Customers manage much of the operating system and applications.

PaaS - Platform as a Service

Provides a managed platform for building and deploying applications.

SaaS - Software as a Service

Provides ready-to-use software over the internet.

EXAMPLES

IaaS: Azure Virtual Machines.

PaaS: Azure App Service.

SaaS: Microsoft 365.

SHARED RESPONSIBILITY

Cloud providers and customers share responsibility for security. The exact division depends on the service model.

PRACTICAL EXERCISE

Classify ten digital services as IaaS, PaaS, or SaaS.

CHALLENGE

Explain why a development team might prefer PaaS over IaaS.`,
      },
      {
        id: "cloud-3",
        title: "Cloud Deployment Models",
        content: `PUBLIC CLOUD

Infrastructure is provided for use by multiple customers.

PRIVATE CLOUD

Cloud infrastructure is dedicated to one organization.

HYBRID CLOUD

Combines private infrastructure with public cloud services.

MULTICLOUD

Uses services from more than one cloud provider.

FACTORS IN CHOOSING A MODEL

• Security requirements
• Cost
• Compliance
• Control
• Scalability
• Existing infrastructure

PRACTICAL EXERCISE

Choose a deployment model for a bank, a startup, and a university. Explain your decisions.

CHALLENGE

Describe one advantage and one limitation of hybrid cloud.`,
      },
      {
        id: "cloud-4",
        title: "Cloud Storage and Networking",
        content: `CLOUD STORAGE

Cloud platforms offer different ways to store data.

OBJECT STORAGE

Suitable for files, images, backups, and unstructured data.

BLOCK STORAGE

Provides storage volumes commonly attached to virtual machines.

FILE STORAGE

Provides shared file-based access.

NETWORKING CONCEPTS

• Virtual networks
• Subnets
• IP addresses
• DNS
• Firewalls
• Load balancers

PRACTICAL EXERCISE

Draw a basic cloud architecture containing a virtual network, application server, and storage service.

CHALLENGE

Explain why network segmentation is useful for security.`,
      },
      {
        id: "cloud-5",
        title: "Cloud Security and Shared Responsibility",
        content: `CLOUD SECURITY

Cloud security protects applications, infrastructure, identities, and data.

IMPORTANT PRINCIPLES

• Least privilege
• Multi-factor authentication
• Encryption
• Backups
• Network security
• Monitoring
• Access control

SHARED RESPONSIBILITY

The cloud provider is responsible for security of the cloud infrastructure. Customers retain responsibilities that vary according to the services they use.

IDENTITY AND ACCESS MANAGEMENT

Users should receive only the permissions needed for their roles.

PRACTICAL EXERCISE

Design a basic access policy for a team containing administrators, developers, and ordinary users.

CHALLENGE

Explain why multi-factor authentication reduces account compromise risk.`,
      },
      {
        id: "cloud-6",
        title: "Cloud Architecture Mini Project",
        content: `PROJECT SCENARIO

A growing business wants to move its website and customer records to the cloud.

DESIGN A SOLUTION

Your architecture should identify:

1. A cloud deployment model.
2. A suitable service model.
3. Application hosting.
4. Database storage.
5. File storage.
6. Network security.
7. Identity management.
8. Backup and recovery.

DELIVERABLE

Create an architecture diagram and a short report explaining your choices.

CHALLENGE

Describe how your design would scale if the business grew from 100 to 100,000 customers.`,
      },
    ],
  },

  // =====================================================
  // 5. MICROSOFT AZURE FUNDAMENTALS
  // =====================================================
  {
    id: "azure-fundamentals",
    title: "Microsoft Azure Fundamentals (AZ-900)",
    description:
      "Prepare for AZ-900 with Azure architecture, services, identity, governance, pricing, and cloud concepts.",
    lessons: [
      {
        id: "azure-1",
        title: "Introduction to Microsoft Azure",
        content: `WHAT IS MICROSOFT AZURE?

Microsoft Azure is Microsoft's cloud computing platform. It provides services for computing, storage, networking, databases, analytics, and AI.

AZURE GLOBAL INFRASTRUCTURE

Important concepts include:
• Regions: geographic areas containing Azure datacentres.
• Availability Zones: physically separate locations within supported regions.
• Region pairs: paired regions used for certain resilience and disaster recovery scenarios.

AZURE RESOURCE ORGANIZATION

Management groups can organize subscriptions.

Subscriptions organize resources and billing.

Resource groups logically organize related resources.

Resources are the individual services you create.

PRACTICAL EXERCISE

Visit the Azure portal and explore its main dashboard.

CHALLENGE

Explain the difference between a region, subscription, resource group, and resource.`,
      },
      {
        id: "azure-2",
        title: "Azure Compute Services",
        content: `COMPUTE SERVICES

Azure offers different ways to run applications and workloads.

AZURE VIRTUAL MACHINES

Provides configurable virtualized computing resources.

AZURE APP SERVICE

A managed platform for hosting web applications and APIs.

AZURE FUNCTIONS

Runs event-driven code without requiring you to manage traditional servers.

AZURE CONTAINERS

Azure supports containerized workloads through services such as Azure Container Apps and Azure Kubernetes Service.

CHOOSING A SERVICE

Consider:
• Control requirements
• Application architecture
• Scaling
• Operational complexity
• Cost

PRACTICAL EXERCISE

Choose a compute service for a static website, an API, and a long-running custom application.

CHALLENGE

Explain the difference between a virtual machine and a serverless function.`,
      },
      {
        id: "azure-3",
        title: "Azure Storage Services",
        content: `AZURE STORAGE

Azure provides multiple storage services for different data needs.

BLOB STORAGE

Stores unstructured data such as images, videos, backups, and documents.

AZURE FILES

Provides managed file shares.

QUEUE STORAGE

Supports message storage for asynchronous communication.

TABLE STORAGE

Provides a NoSQL key-value storage option.

STORAGE REDUNDANCY

Redundancy options are designed to improve durability and availability.

Examples include locally redundant storage, zone-redundant storage, and geo-redundant storage.

PRACTICAL EXERCISE

Select a storage service for website images, shared documents, and application messages.

CHALLENGE

Explain why a business might choose geo-redundant storage.`,
      },
      {
        id: "azure-4",
        title: "Azure Networking Services",
        content: `NETWORKING IN AZURE

Azure networking connects cloud resources securely.

VIRTUAL NETWORK

An isolated network environment for Azure resources.

SUBNET

Divides a virtual network into smaller network segments.

NETWORK SECURITY GROUP

Controls inbound and outbound network traffic using security rules.

AZURE VPN GATEWAY

Enables encrypted connectivity between networks.

AZURE LOAD BALANCER

Distributes network traffic across backend resources.

AZURE DNS

Provides domain name resolution.

PRACTICAL EXERCISE

Design a virtual network with separate web and database subnets.

CHALLENGE

Explain why database resources should not normally be exposed directly to the public internet.`,
      },
      {
        id: "azure-5",
        title: "Azure Identity and Access Management",
        content: `MICROSOFT ENTRA ID

Microsoft Entra ID is Microsoft's cloud identity and access management service.

IMPORTANT CONCEPTS

Authentication verifies identity.

Authorization determines what an authenticated identity can access.

MULTI-FACTOR AUTHENTICATION

Adds another verification step beyond a password.

ROLE-BASED ACCESS CONTROL

Azure RBAC assigns permissions through roles at defined scopes.

LEAST PRIVILEGE

Users should receive only the permissions required to perform their work.

PRACTICAL EXERCISE

Design roles for an administrator, developer, and read-only auditor.

CHALLENGE

Explain the difference between authentication and authorization.`,
      },
      {
        id: "azure-6",
        title: "Azure Governance and Compliance",
        content: `GOVERNANCE

Azure governance helps organizations manage cloud resources consistently.

IMPORTANT SERVICES

Azure Policy:
Helps enforce organizational rules and assess compliance.

Resource Locks:
Help prevent accidental deletion or modification.

Tags:
Add metadata to resources for organization and cost allocation.

Microsoft Purview:
Supports data governance and compliance management.

AZURE MANAGEMENT HIERARCHY

Management groups
Subscriptions
Resource groups
Resources

PRACTICAL EXERCISE

Create a sample governance policy for resource naming, approved regions, and tagging.

CHALLENGE

Explain how resource locks can help prevent accidental deletion.`,
      },
      {
        id: "azure-7",
        title: "Azure Pricing and Cost Management",
        content: `CLOUD PRICING

Azure costs can depend on:
• Compute usage
• Storage consumption
• Data transfer
• Service tier
• Region
• Licensing

COST MANAGEMENT TOOLS

Azure Pricing Calculator:
Estimates costs before deployment.

Azure Cost Management:
Helps monitor, analyse, and manage spending.

TOTAL COST OF OWNERSHIP

A comparison of costs associated with running workloads on-premises and in the cloud.

BUDGETING

Budgets and alerts help teams monitor spending.

PRACTICAL EXERCISE

Estimate the cost of a small web application using the Azure Pricing Calculator.

CHALLENGE

Identify three ways a business could reduce unnecessary cloud spending.`,
      },
      {
        id: "azure-8",
        title: "Azure Monitoring and Reliability",
        content: `MONITORING

Monitoring provides visibility into the health and performance of cloud resources.

AZURE MONITOR

Collects and analyses monitoring data from Azure resources.

APPLICATION INSIGHTS

Helps monitor application performance, failures, and usage.

LOG ANALYTICS

Allows users to query and analyse log data.

RELIABILITY

High availability aims to keep services accessible.

Disaster recovery focuses on restoring services after major failures.

BACKUPS

Protect data and support recovery from accidental deletion or data loss.

PRACTICAL EXERCISE

Design a monitoring plan for a website hosted on Azure.

CHALLENGE

Explain the difference between high availability and disaster recovery.`,
      },
      {
        id: "azure-9",
        title: "AZ-900 Practice and Final Review",
        content: `AZ-900 REVIEW AREAS

1. Cloud concepts
2. Benefits of cloud computing
3. Cloud service models
4. Cloud deployment models
5. Azure architecture and services
6. Compute services
7. Storage services
8. Networking services
9. Identity and access
10. Governance and compliance
11. Pricing and cost management
12. Monitoring and reliability

STUDY STRATEGY

• Review each topic.
• Practise service selection scenarios.
• Learn the differences between similar services.
• Use practice questions to identify weak areas.
• Review incorrect answers.

FINAL PROJECT

Design a cloud solution for a small business using Azure services.

Include compute, storage, networking, identity, security, monitoring, and cost considerations.

ASSESSMENT

Complete a timed AZ-900 practice quiz and review every incorrect answer.

NOTE

Always check the current official Microsoft AZ-900 skills outline before sitting the certification exam.`,
      },
    ],
  },

  // =====================================================
  // 6. ARTIFICIAL INTELLIGENCE
  // =====================================================
  {
    id: "artificial-intelligence",
    title: "Artificial Intelligence Fundamentals",
    description:
      "Explore AI concepts, neural networks, generative AI, natural language processing, and responsible AI.",
    lessons: [
      {
        id: "ai-1",
        title: "Introduction to Artificial Intelligence",
        content: `WHAT IS AI?

Artificial Intelligence is the field of computing focused on developing systems that perform tasks commonly associated with human intelligence.

AI APPLICATIONS

• Speech recognition
• Image recognition
• Recommendation systems
• Robotics
• Language translation
• Decision support

AI, MACHINE LEARNING AND DEEP LEARNING

AI is the broad field.

Machine learning is an approach that learns patterns from data.

Deep learning uses multi-layer neural networks to learn complex representations.

PRACTICAL EXERCISE

Identify five AI applications you encounter in everyday life.

CHALLENGE

Explain the relationship between artificial intelligence and machine learning.`,
      },
      {
        id: "ai-2",
        title: "Neural Networks and Deep Learning",
        content: `NEURAL NETWORKS

Artificial neural networks are computational models inspired loosely by biological nervous systems.

BASIC STRUCTURE

• Input layer
• Hidden layers
• Output layer

NEURONS

Each artificial neuron receives inputs, applies weights and a bias, and uses an activation function.

TRAINING

Networks learn by adjusting their parameters to reduce a loss function.

DEEP LEARNING

Deep learning uses neural networks with multiple layers.

APPLICATIONS

Image classification, speech recognition, and language modelling.

PRACTICAL EXERCISE

Draw a simple neural network with an input layer, one hidden layer, and an output layer.

CHALLENGE

Explain why training a deep neural network often requires substantial data and computing resources.`,
      },
      {
        id: "ai-3",
        title: "Natural Language Processing",
        content: `WHAT IS NLP?

Natural Language Processing enables computers to process and work with human language.

COMMON TASKS

• Text classification
• Sentiment analysis
• Translation
• Named entity recognition
• Text summarization
• Question answering

TOKENIZATION

Splits text into smaller units called tokens.

SENTIMENT ANALYSIS

Identifies whether text expresses positive, negative, or neutral sentiment.

APPLICATIONS

Customer support, search engines, chatbots, and document analysis.

PRACTICAL EXERCISE

Collect five product reviews and manually classify their sentiment.

CHALLENGE

Explain why context and ambiguity make human language difficult for computers to interpret.`,
      },
      {
        id: "ai-4",
        title: "Generative AI and Large Language Models",
        content: `GENERATIVE AI

Generative AI creates new content such as text, images, audio, and code.

LARGE LANGUAGE MODELS

LLMs are models trained on large amounts of text to generate and process language.

PROMPTING

A prompt gives the model instructions and context.

GOOD PROMPTING PRACTICES

• State the task clearly.
• Provide relevant context.
• Specify the expected format.
• Include constraints.
• Review generated results.

LIMITATIONS

AI-generated responses can contain incorrect or unsupported information.

PRACTICAL EXERCISE

Write three prompts that ask an AI assistant to explain the same technical concept for beginner, intermediate, and advanced learners.

CHALLENGE

Identify situations where human verification is essential.`,
      },
      {
        id: "ai-5",
        title: "Responsible and Ethical AI",
        content: `RESPONSIBLE AI

AI systems should be developed and used in ways that respect people and reduce harm.

KEY CONSIDERATIONS

• Fairness
• Transparency
• Accountability
• Privacy
• Safety
• Security
• Reliability

BIAS

Bias can enter a model through unrepresentative data, flawed assumptions, or design decisions.

PRIVACY

Sensitive information should be protected during data collection, training, and deployment.

HUMAN OVERSIGHT

Important decisions may require human review.

PRACTICAL EXERCISE

Analyse a hypothetical AI recruitment system and identify possible fairness and privacy risks.

CHALLENGE

Suggest three safeguards for an AI system used in healthcare.`,
      },
      {
        id: "ai-6",
        title: "AI Mini Project: Intelligent Study Assistant",
        content: `PROJECT OBJECTIVE

Design a simple AI-powered study assistant.

FEATURES

1. Accept a learner's question.
2. Identify the topic.
3. Generate an explanation.
4. Create revision questions.
5. Summarize key concepts.
6. Provide suggested learning resources.

DESIGN CONSIDERATIONS

• User experience
• Data privacy
• Response accuracy
• Human verification
• Responsible AI usage

DELIVERABLE

Create a working prototype or a documented design with sample inputs and outputs.

EXTENSION

Add a quiz feature that generates questions from lesson content.`,
      },
    ],
  },

  // =====================================================
  // 7. SQL AND DATABASE MANAGEMENT
  // =====================================================
  {
    id: "sql-databases",
    title: "SQL and Database Management",
    description:
      "Learn relational databases, SQL queries, joins, database design, and practical data management.",
    lessons: [
      {
        id: "sql-1",
        title: "Introduction to Databases",
        content: `WHAT IS A DATABASE?

A database is an organized collection of data that can be stored, managed, and retrieved.

RELATIONAL DATABASES

Relational databases organize information into tables containing rows and columns.

IMPORTANT TERMS

• Table: stores related records.
• Row: represents one record.
• Column: represents an attribute.
• Primary key: uniquely identifies a row.
• Foreign key: references a key in another table.

EXAMPLES

PostgreSQL, MySQL, Microsoft SQL Server, and SQLite.

PRACTICAL EXERCISE

Design a simple database for a university containing students, courses, and enrolments.

CHALLENGE

Explain why a primary key should uniquely identify each record.`,
      },
      {
        id: "sql-2",
        title: "SQL Fundamentals and SELECT",
        content: `WHAT IS SQL?

Structured Query Language is used to communicate with relational database systems.

SELECT

Retrieves data from a table.

SELECT * FROM students;

SELECT name, age
FROM students;

WHERE

Filters records.

SELECT *
FROM students
WHERE age >= 20;

ORDER BY

Sorts results.

SELECT *
FROM students
ORDER BY age DESC;

LIMIT

Restricts the number of returned records in database systems that support this syntax.

PRACTICAL EXERCISE

Create a students table and retrieve all students older than 20.

CHALLENGE

Write a query that returns the five highest examination scores.`,
      },
      {
        id: "sql-3",
        title: "Filtering, Sorting and Aggregation",
        content: `FILTERING

WHERE filters records using conditions.

Useful operators include:
=, !=, >, <, >=, <=

BETWEEN checks a range.

IN checks membership in a list.

LIKE performs pattern matching.

AGGREGATE FUNCTIONS

COUNT() counts records.

SUM() calculates a total.

AVG() calculates an average.

MIN() returns the minimum.

MAX() returns the maximum.

GROUP BY

Groups records for aggregate calculations.

SELECT course, AVG(score)
FROM students
GROUP BY course;

HAVING

Filters grouped results.

PRACTICAL EXERCISE

Calculate the average score for each course.

CHALLENGE

Find all courses with more than ten registered students.`,
      },
      {
        id: "sql-4",
        title: "SQL Joins and Relationships",
        content: `WHY JOINS?

Joins combine related records from multiple tables.

INNER JOIN

Returns matching records from both tables.

LEFT JOIN

Returns all records from the left table and matching records from the right table.

RIGHT JOIN

Returns all records from the right table and matching records from the left table.

FULL OUTER JOIN

Returns matching and non-matching records from both sides where supported.

EXAMPLE

SELECT students.name, courses.title
FROM enrolments
INNER JOIN students
ON enrolments.student_id = students.id
INNER JOIN courses
ON enrolments.course_id = courses.id;

PRACTICAL EXERCISE

Create student and course tables and retrieve student enrolment information using joins.

CHALLENGE

Explain when a LEFT JOIN is more useful than an INNER JOIN.`,
      },
      {
        id: "sql-5",
        title: "Database Design and Normalization",
        content: `DATABASE DESIGN

Good database design organizes information to reduce duplication and maintain consistency.

NORMALIZATION

Normalization organizes relational tables according to defined rules.

FIRST NORMAL FORM

Each field should contain an atomic value, and records should be identifiable.

SECOND NORMAL FORM

A table should meet 1NF and remove partial dependencies on a composite candidate key.

THIRD NORMAL FORM

A table should meet 2NF and remove transitive dependencies of non-key attributes on candidate keys.

RELATIONSHIPS

• One-to-one
• One-to-many
• Many-to-many

PRACTICAL EXERCISE

Design a normalized database for a library containing books, members, and loans.

CHALLENGE

Explain how normalization helps reduce update anomalies.`,
      },
      {
        id: "sql-6",
        title: "SQL Mini Project: Student Records Database",
        content: `PROJECT OBJECTIVE

Build a relational database for managing student records.

TABLES

1. Students
2. Courses
3. Enrolments
4. Assessments

REQUIREMENTS

• Create tables.
• Define primary keys.
• Define foreign keys.
• Insert sample records.
• Retrieve records.
• Update records.
• Delete selected records.
• Use joins.
• Generate summary reports.

DELIVERABLE

Submit SQL scripts containing table creation, sample data, and useful queries.

EXTENSION

Create a dashboard using query results to show enrolment and academic performance.`,
      },
    ],
  },

  // =====================================================
  // 8. DATA STRUCTURES AND ALGORITHMS
  // =====================================================
  {
    id: "data-structures-algorithms",
    title: "Data Structures and Algorithms",
    description:
      "Develop problem-solving skills using arrays, linked lists, stacks, queues, trees, sorting, and searching.",
    lessons: [
      {
        id: "dsa-1",
        title: "Introduction to Data Structures and Algorithms",
        content: `DATA STRUCTURES

Data structures organize information so it can be accessed and modified efficiently.

ALGORITHMS

Algorithms are step-by-step procedures for solving problems.

WHY THEY MATTER

They help developers write software that is correct, efficient, and scalable.

COMMON DATA STRUCTURES

• Arrays
• Linked lists
• Stacks
• Queues
• Trees
• Graphs
• Hash tables

ALGORITHM EXAMPLE

Finding the largest value in a list:

numbers = [4, 8, 2, 10, 5]
largest = max(numbers)

PRACTICAL EXERCISE

Write an algorithm that finds the largest number in a list without using max().

CHALLENGE

Explain why selecting an appropriate data structure can improve application performance.`,
      },
      {
        id: "dsa-2",
        title: "Arrays and Linked Lists",
        content: `ARRAYS

Arrays store elements in an indexed collection.

Typical operations include:
• Access
• Insertion
• Deletion
• Searching
• Traversal

LINKED LISTS

Linked lists store elements in nodes connected by references.

SINGLY LINKED LIST

Each node points to the next node.

DOUBLY LINKED LIST

Each node can point to both the previous and next nodes.

COMPARISON

Arrays generally provide efficient indexed access.

Linked lists can support efficient insertion or deletion when the relevant node position is already known.

PRACTICAL EXERCISE

Implement a simple linked list in Python.

CHALLENGE

Compare arrays and linked lists for frequent insertion and random access.`,
      },
      {
        id: "dsa-3",
        title: "Stacks and Queues",
        content: `STACKS

A stack follows Last In, First Out (LIFO).

Operations:
• push: add an element.
• pop: remove the top element.
• peek: inspect the top element.

QUEUES

A queue follows First In, First Out (FIFO).

Operations:
• enqueue: add an element.
• dequeue: remove the front element.

APPLICATIONS

Stacks:
• Undo operations
• Function call management
• Expression evaluation

Queues:
• Task scheduling
• Printer management
• Request processing

PRACTICAL EXERCISE

Implement a stack and queue using Python lists or collections.deque.

CHALLENGE

Explain which structure is more suitable for processing customers in a service line.`,
      },
      {
        id: "dsa-4",
        title: "Searching Algorithms",
        content: `LINEAR SEARCH

Checks elements one by one until the target is found or the collection is exhausted.

Time complexity: O(n).

BINARY SEARCH

Repeatedly divides a sorted search space into halves.

Time complexity: O(log n).

IMPORTANT REQUIREMENT

Binary search requires sorted data.

PYTHON EXAMPLE

def binary_search(numbers, target):
    left = 0
    right = len(numbers) - 1

    while left <= right:
        middle = (left + right) // 2

        if numbers[middle] == target:
            return middle
        elif numbers[middle] < target:
            left = middle + 1
        else:
            right = middle - 1

    return -1

PRACTICAL EXERCISE

Implement linear and binary search and compare their performance on sorted data.

CHALLENGE

Explain why binary search cannot be applied directly to an unsorted list.`,
      },
      {
        id: "dsa-5",
        title: "Sorting Algorithms",
        content: `WHY SORT DATA?

Sorting arranges data in a particular order, making it easier to search, analyse, and present.

BUBBLE SORT

Repeatedly compares adjacent elements and swaps them when they are out of order.

SELECTION SORT

Repeatedly selects the smallest remaining element.

INSERTION SORT

Builds a sorted portion by inserting elements into their correct positions.

MERGE SORT

Uses divide and conquer to sort smaller sections and merge them.

QUICK SORT

Partitions values around a pivot and sorts the resulting sections.

COMPLEXITY

Common average or worst-case comparisons:
• Bubble sort: O(n²)
• Selection sort: O(n²)
• Insertion sort: O(n²) worst case
• Merge sort: O(n log n)
• Quick sort: O(n log n) average, O(n²) worst case

PRACTICAL EXERCISE

Implement bubble sort and insertion sort.

CHALLENGE

Explain why merge sort is generally more suitable than bubble sort for large datasets.`,
      },
      {
        id: "dsa-6",
        title: "Trees, Graphs and Hash Tables",
        content: `TREES

A tree is a hierarchical data structure made up of nodes and edges.

BINARY TREE

Each node has at most two children.

BINARY SEARCH TREE

Values in the left subtree are smaller than the node, while values in the right subtree are larger under the usual unique-key convention.

GRAPHS

Graphs represent relationships between vertices and edges.

Examples include road networks and social networks.

HASH TABLES

Store key-value pairs using a hash function.

APPLICATIONS

• Trees: file systems and search structures.
• Graphs: route planning and networks.
• Hash tables: fast lookup and caching.

PRACTICAL EXERCISE

Draw a binary search tree and perform an in-order traversal.

CHALLENGE

Describe a real-world problem that can be represented using a graph.`,
      },
      {
        id: "dsa-7",
        title: "Algorithm Complexity and Big O",
        content: `WHAT IS BIG O?

Big O notation describes how an algorithm's resource requirements grow as input size increases.

COMMON COMPLEXITIES

O(1): Constant time.

O(log n): Logarithmic time.

O(n): Linear time.

O(n log n): Linearithmic time.

O(n²): Quadratic time.

O(2ⁿ): Exponential time.

EXAMPLES

Accessing an array element by index is generally O(1).

Scanning a list is O(n).

Comparing every pair of elements can be O(n²).

WHY IT MATTERS

Complexity helps compare algorithm efficiency as datasets grow.

PRACTICAL EXERCISE

Determine the time complexity of five simple algorithms.

CHALLENGE

Explain why an O(n log n) algorithm can be preferable to an O(n²) algorithm for large inputs.`,
      },
      {
        id: "dsa-8",
        title: "Data Structures and Algorithms Mini Project",
        content: `PROJECT OBJECTIVE

Build a small application that demonstrates efficient data organization and algorithmic problem-solving.

PROJECT OPTIONS

1. Contact management system using a hash table or dictionary.
2. Task scheduler using a queue.
3. Browser history using a stack.
4. Student record search using binary search.
5. Sorting visualizer.

REQUIREMENTS

• Define the problem.
• Select appropriate data structures.
• Implement the algorithm.
• Test with different inputs.
• Analyse time complexity.
• Explain design decisions.

DELIVERABLE

Submit source code, test cases, and a short explanation of algorithm performance.

EXTENSION

Compare two alternative solutions and justify the more efficient design.`,
      },
    ],
  },
];
