import { useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock3,
  Cloud,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import "./App.css";

const chartData = [
  { day: "Mon", score: 45 },
  { day: "Tue", score: 52 },
  { day: "Wed", score: 48 },
  { day: "Thu", score: 61 },
  { day: "Fri", score: 58 },
  { day: "Sat", score: 72 },
  { day: "Sun", score: 68 },
];

const topics = [
  { name: "Cloud Concepts", progress: 75, color: "blue" },
  { name: "Azure Architecture", progress: 55, color: "purple" },
  { name: "Management & Governance", progress: 38, color: "orange" },
];

const activities = [
  { title: "Cloud Concepts Quiz", detail: "10 questions · Today", score: "80%", color: "blue" },
  { title: "Azure Architecture", detail: "15 questions · Yesterday", score: "67%", color: "purple" },
  { title: "Cloud Governance", detail: "10 questions · 2 days ago", score: "50%", color: "orange" },
];

type Page = "Dashboard" | "Practice Quiz" | "Study Plan" | "AI Study Buddy";

function App() {
  const [page, setPage] = useState<Page>("Dashboard");
  const [menuOpen, setMenuOpen] = useState(false);

  const navigation = [
    { name: "Dashboard" as Page, icon: LayoutDashboard },
    { name: "Practice Quiz" as Page, icon: BookOpen },
    { name: "Study Plan" as Page, icon: Target },
    { name: "AI Study Buddy" as Page, icon: BrainCircuit },
  ];

  function navigate(nextPage: Page) {
    setPage(nextPage);
    setMenuOpen(false);
  }

  return (
    <div className="app-shell">
      {menuOpen && (
        <button
          className="mobile-overlay"
          aria-label="Close navigation"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon"><Cloud size={23} /></div>
          <div>
            <h2>CloudAce<span> AI</span></h2>
            <p>AZ-900 LEARNING HUB</p>
          </div>
          <button className="close-menu" onClick={() => setMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="nav-label">WORKSPACE</div>

        <nav className="navigation">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.name)}
                className={`nav-item ${page === item.name ? "active" : ""}`}
              >
                <Icon size={19} />
                <span>{item.name}</span>
                {page === item.name && <span className="active-dot" />}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-icon"><Sparkles size={19} /></div>
            <h3>Your next milestone</h3>
            <p>Strengthen your weak topics to improve your understanding.</p>
            <button onClick={() => navigate("Practice Quiz")}>
              Start practicing <ArrowRight size={15} />
            </button>
          </div>

          <button className="nav-item muted-nav">
            <Settings size={19} /><span>Settings</span>
          </button>
          <div className="profile">
            <div className="avatar">CA</div>
            <div className="profile-info">
              <strong>CloudAce Learner</strong>
              <span>Free learner account</span>
            </div>
            <LogOut size={17} className="logout-icon" />
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMenuOpen(true)}>
            <Menu size={22} />
          </button>
          <div className="breadcrumb">
            <span>Workspace</span><ChevronRight size={15} />
            <strong>{page}</strong>
          </div>
          <div className="topbar-right">
            <span className="demo-badge"><span /> DEMO MODE</span>
            <button className="icon-button" aria-label="Search">
              <Search size={19} />
            </button>
            <div className="avatar top-avatar">CA</div>
          </div>
        </header>

        <div className="page-content">
          {page === "Dashboard" && <Dashboard onNavigate={navigate} />}
          {page === "Practice Quiz" && <QuizPage />}
          {page === "Study Plan" && <StudyPlan />}
          {page === "AI Study Buddy" && <CoachPage />}
          <footer>
            CloudAce AI · Independent educational project · Not affiliated with Microsoft.
          </footer>
        </div>
      </main>
    </div>
  );
}

function Dashboard({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <>
      <section className="welcome-row">
        <div>
          <div className="eyebrow"><Sparkles size={15} /> YOUR LEARNING SPACE</div>
          <h1>Keep building your <span>cloud skills.</span></h1>
          <p>Every question is a step closer to understanding Azure.</p>
        </div>
        <button className="primary-button" onClick={() => onNavigate("Practice Quiz")}>
          <Zap size={17} /> Start a quiz
        </button>
      </section>

      <section className="stats-grid">
        <StatCard
          title="Practice accuracy"
          value="68%"
          note="Sample weekly result"
          icon={<Target size={20} />}
          trend="+8%"
          color="blue"
        />
        <StatCard
          title="Questions answered"
          value="21 / 50"
          note="Sample learning goal"
          icon={<BookOpen size={20} />}
          trend="42%"
          color="purple"
        />
        <StatCard
          title="Topics to review"
          value="2"
          note="Based on demo results"
          icon={<BrainCircuit size={20} />}
          trend="Focus"
          color="orange"
        />
        <StatCard
          title="Study streak"
          value="3 days"
          note="Example streak"
          icon={<Activity size={20} />}
          trend="Active"
          color="green"
        />
      </section>

      <section className="dashboard-grid">
        <div className="panel performance-panel">
          <div className="panel-heading">
            <div>
              <h2>Learning performance</h2>
              <p>Your practice accuracy over the last seven days</p>
            </div>
            <span className="subtle-pill"><TrendingUp size={14} /> This week</span>
          </div>

          <div className="chart-summary">
            <strong>68%</strong>
            <span className="positive-change"><ArrowUpRight size={15} /> Sample trend</span>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#36c9f0" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#36c9f0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#233044" strokeDasharray="4 5" vertical={false} />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#8492a8", fontSize: 12 }}
                  dy={10}
                />
                <Tooltip
                  contentStyle={{
                    background: "#111c2c",
                    border: "1px solid #304158",
                    borderRadius: 10,
                    color: "#ffffff",
                  }}
                  formatter={(value) => [`${value}%`, "Accuracy"]}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#36c9f0"
                  strokeWidth={3}
                  fill="url(#scoreGradient)"
                  activeDot={{ r: 5, fill: "#36c9f0" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="demo-note">Illustrative data only — not saved learner history.</p>
        </div>

        <div className="panel recommendation-panel">
          <div className="panel-heading">
            <div>
              <h2>Recommended next step</h2>
              <p>Start with an area that needs practice</p>
            </div>
            <div className="small-icon purple-icon"><BrainCircuit size={20} /></div>
          </div>

          <div className="recommendation-highlight">
            <span className="topic-tag">PRIORITY REVIEW</span>
            <h3>Management & Governance</h3>
            <p>Review governance tools, cost management, and resource organization.</p>
            <div className="recommendation-progress">
              <div><span>Sample topic accuracy</span><strong>38%</strong></div>
              <div className="progress-track"><span style={{ width: "38%" }} /></div>
            </div>
          </div>

          <button className="primary-button full-button" onClick={() => onNavigate("Practice Quiz")}>
            Practice this topic <ArrowRight size={16} />
          </button>
          <button className="text-button" onClick={() => onNavigate("Study Plan")}>
            View study plan <ChevronRight size={16} />
          </button>
        </div>
      </section>

      <section className="dashboard-grid lower-grid">
        <div className="panel topics-panel">
          <div className="panel-heading">
            <div>
              <h2>Topic mastery</h2>
              <p>Example performance by learning domain</p>
            </div>
            <button className="text-button" onClick={() => onNavigate("Practice Quiz")}>
              Practice <ArrowRight size={15} />
            </button>
          </div>

          <div className="topic-list">
            {topics.map((topic) => (
              <div className="topic-row" key={topic.name}>
                <div className={`topic-icon ${topic.color}`}><BookOpen size={18} /></div>
                <div className="topic-details">
                  <div className="topic-label">
                    <strong>{topic.name}</strong><span>{topic.progress}%</span>
                  </div>
                  <div className="progress-track">
                    <span className={topic.color} style={{ width: `${topic.progress}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel activity-panel">
          <div className="panel-heading">
            <div>
              <h2>Recent practice</h2>
              <p>Example quiz activity</p>
            </div>
            <Clock3 size={19} className="muted-icon" />
          </div>

          <div className="activity-list">
            {activities.map((activity) => (
              <div className="activity-row" key={activity.title}>
                <div className={`activity-icon ${activity.color}`}><CheckCircle2 size={18} /></div>
                <div className="activity-info">
                  <strong>{activity.title}</strong>
                  <span>{activity.detail}</span>
                </div>
                <strong className="activity-score">{activity.score}</strong>
              </div>
            ))}
          </div>
          <button className="text-button history-button" onClick={() => onNavigate("Practice Quiz")}>
            Start another quiz <ArrowRight size={15} />
          </button>
        </div>
      </section>
    </>
  );
}

function StatCard({
  title,
  value,
  note,
  icon,
  trend,
  color,
}: {
  title: string;
  value: string;
  note: string;
  icon: React.ReactNode;
  trend: string;
  color: string;
}) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <div className={`stat-icon ${color}`}>{icon}</div>
        <span className={`stat-trend ${color}`}>{trend}</span>
      </div>
      <p>{title}</p>
      <h2>{value}</h2>
      <span className="stat-note">{note}</span>
    </div>
  );
}

function QuizPage() {
  const questions = [
    {
      question: "Which Azure service helps enforce rules such as restricting deployments to approved regions?",
      options: ["Azure Monitor", "Azure Policy", "Azure Advisor", "Azure Service Health"],
      answer: 1,
      explanation: "Azure Policy helps create, assign, and manage rules that enforce organizational standards and assess compliance across Azure resources.",
    },
    {
      question: "Which cloud model combines on-premises infrastructure with public cloud services?",
      options: ["Public cloud", "Private cloud", "Hybrid cloud", "Community cloud"],
      answer: 2,
      explanation: "A hybrid cloud combines private infrastructure, such as an on-premises environment, with public cloud services.",
    },
    {
      question: "Which cloud service model gives you the greatest control over the operating system of a virtual machine?",
      options: ["SaaS", "PaaS", "IaaS", "Serverless"],
      answer: 2,
      explanation: "Infrastructure as a Service provides virtualized computing resources. The customer generally manages the guest operating system and applications.",
    },
  ];

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const question = questions[index];

  function submitAnswer() {
    if (selected === null || checked) return;
    setChecked(true);
    if (selected === question.answer) setScore((current) => current + 1);
  }

  function nextQuestion() {
    if (index === questions.length - 1) {
      setFinished(true);
    } else {
      setIndex((current) => current + 1);
      setSelected(null);
      setChecked(false);
    }
  }

  function restart() {
    setIndex(0);
    setSelected(null);
    setChecked(false);
    setFinished(false);
    setScore(0);
  }

  return (
    <section className="learning-page">
      <div className="eyebrow"><BookOpen size={15} /> PRACTICE MODE</div>
      <h1>Test your cloud knowledge.</h1>
      <p className="page-description">Practice with original AZ-900-style questions and learn from every answer.</p>

      {finished ? (
        <div className="panel quiz-panel result-panel">
          <div className="result-icon"><CheckCircle2 size={35} /></div>
          <h2>Practice complete</h2>
          <p>You answered {score} out of {questions.length} questions correctly.</p>
          <div className="result-score">{Math.round((score / questions.length) * 100)}%</div>
          <p className="demo-note">This score exists only in this browser session. It has not been saved.</p>
          <button className="primary-button" onClick={restart}>Try again <ArrowRight size={16} /></button>
        </div>
      ) : (
        <div className="panel quiz-panel">
          <div className="quiz-meta">
            <span>AZ-900 fundamentals</span>
            <span>Question {index + 1} of {questions.length}</span>
          </div>
          <div className="progress-track quiz-progress">
            <span style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
          </div>
          <h2>{question.question}</h2>
          <div className="answer-options">
            {question.options.map((option, optionIndex) => (
              <button
                key={option}
                disabled={checked}
                className={`answer-option ${selected === optionIndex ? "selected" : ""} ${
                  checked && optionIndex === question.answer ? "correct" : ""
                } ${checked && selected === optionIndex && selected !== question.answer ? "incorrect" : ""}`}
                onClick={() => setSelected(optionIndex)}
              >
                <span className="option-letter">{String.fromCharCode(65 + optionIndex)}</span>
                <span>{option}</span>
                {checked && optionIndex === question.answer && <CheckCircle2 size={18} />}
              </button>
            ))}
          </div>
          {checked && (
            <div className="answer-explanation">
              <strong>{selected === question.answer ? "Well done!" : "Let's learn from this."}</strong>
              <p>{question.explanation}</p>
            </div>
          )}
          <div className="quiz-footer">
            <span className="demo-note">Demo quiz · Original practice questions</span>
            {!checked ? (
              <button className="primary-button" disabled={selected === null} onClick={submitAnswer}>
                Check answer <ArrowRight size={16} />
              </button>
            ) : (
              <button className="primary-button" onClick={nextQuestion}>
                {index === questions.length - 1 ? "See results" : "Next question"} <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

function StudyPlan() {
  const initialTasks = [
    "Review cloud computing concepts",
    "Practice Azure architecture questions",
    "Study governance and compliance tools",
    "Complete a mixed-topic practice quiz",
  ];
  const [completed, setCompleted] = useState<number[]>([]);

  return (
    <section className="learning-page">
      <div className="eyebrow"><Target size={15} /> YOUR LEARNING ROUTINE</div>
      <h1>Build your study plan.</h1>
      <p className="page-description">A simple example plan. Task completion is local and is not saved yet.</p>
      <div className="panel study-panel">
        <div className="panel-heading">
          <div><h2>AZ-900 revision checklist</h2><p>Four suggested study activities</p></div>
          <div className="small-icon blue-icon"><BookOpen size={20} /></div>
        </div>
        <div className="study-progress-label">
          <span>Progress</span><strong>{completed.length} of {initialTasks.length}</strong>
        </div>
        <div className="progress-track"><span style={{ width: `${(completed.length / initialTasks.length) * 100}%` }} /></div>
        <div className="study-task-list">
          {initialTasks.map((task, index) => (
            <label className={`study-task ${completed.includes(index) ? "task-done" : ""}`} key={task}>
              <input
                type="checkbox"
                checked={completed.includes(index)}
                onChange={() => setCompleted((current) =>
                  current.includes(index)
                    ? current.filter((item) => item !== index)
                    : [...current, index]
                )}
              />
              <span>{task}</span>
            </label>
          ))}
        </div>
      </div>
    </section>
  );
}

function CoachPage() {
  const [question, setQuestion] = useState("");
  const [submitted, setSubmitted] = useState("");

  return (
    <section className="learning-page">
      <div className="eyebrow"><BrainCircuit size={15} /> YOUR LEARNING ASSISTANT</div>
      <h1>Understand the cloud.</h1>
      <p className="page-description">Explore concepts and prepare questions for your AI Study Buddy.</p>
      <div className="panel coach-panel">
        <div className="coach-welcome">
          <div className="coach-orb"><Sparkles size={29} /></div>
          <h2>Meet your Study Buddy</h2>
          <p>Ask about cloud concepts, Azure services, or topics you want to revise.</p>
        </div>
        <div className="coach-example">
          <CircleHelp size={18} />
          <span>What is the difference between IaaS, PaaS, and SaaS?</span>
          <ArrowDownRight size={17} />
        </div>
        <form onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(question.trim());
        }} className="coach-form">
          <input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask a question about Azure..." />
          <button className="primary-button" type="submit" disabled={!question.trim()}>Submit</button>
        </form>
        {submitted && (
          <div className="answer-explanation">
            <strong>Demo mode — AI not connected</strong>
            <p>Your question: {submitted}</p>
            <p>Next, we will connect a real AI model through a secure server-side function. No AI answer has been generated yet.</p>
          </div>
        )}
        <p className="demo-note">Do not enter private or sensitive information in this prototype.</p>
      </div>
    </section>
  );
}

export default App;