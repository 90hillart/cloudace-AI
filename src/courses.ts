
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
  {
    id: "python-basics",
    title: "Python Programming",
    description: "Learn Python fundamentals and write your first programs.",
    lessons: [
      {
        id: "python-1",
        title: "Introduction to Python",
        content:
          "Python is a high-level programming language known for readable syntax. It is widely used in automation, web development, data science, and artificial intelligence.",
      },
      {
        id: "python-2",
        title: "Variables and Data Types",
        content:
          "Variables store values. Python supports data types such as integers, floating-point numbers, strings, and booleans. Example: name = 'Alex', age = 20.",
      },
      {
        id: "python-3",
        title: "Conditions and Loops",
        content:
          "Conditions let a program make decisions using if and else. Loops repeat instructions. Python provides for loops and while loops.",
      },
    ],
  },
  {
    id: "data-science",
    title: "Data Science Fundamentals",
    description: "Explore data analysis, statistics, and visualization.",
    lessons: [
      {
        id: "data-1",
        title: "What Is Data Science?",
        content:
          "Data science combines statistics, programming, and domain knowledge to extract useful insights from data.",
      },
      {
        id: "data-2",
        title: "Understanding Datasets",
        content:
          "A dataset contains observations and variables. Rows commonly represent observations, while columns represent attributes or features.",
      },
      {
        id: "data-3",
        title: "Data Visualization",
        content:
          "Charts help reveal patterns, trends, and outliers. Bar charts compare categories, line charts show trends, and scatter plots show relationships.",
      },
    ],
  },
  {
    id: "machine-learning",
    title: "Machine Learning",
    description: "Discover models, predictions, and machine learning concepts.",
    lessons: [
      {
        id: "ml-1",
        title: "Introduction to Machine Learning",
        content:
          "Machine learning uses data to train models that identify patterns and make predictions or decisions.",
      },
      {
        id: "ml-2",
        title: "Supervised Learning",
        content:
          "Supervised learning trains a model using examples with known target labels or values. Classification predicts categories; regression predicts numerical values.",
      },
      {
        id: "ml-3",
        title: "Training and Evaluation",
        content:
          "Data is often divided into training and testing sets. Evaluation metrics help measure how well a model performs on unseen examples.",
      },
    ],
  },
];
