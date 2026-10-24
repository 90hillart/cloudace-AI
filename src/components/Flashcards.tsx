
import { useMemo, useState } from "react";
import "./Flashcards.css";

type Flashcard = {
  id: number;
  topic: string;
  front: string;
  back: string;
};

const flashcards: Flashcard[] = [
  {
    id: 1,
    topic: "Cloud Concepts",
    front: "What is cloud computing?",
    back: "Delivering computing services over the internet, usually on demand and with usage-based pricing.",
  },
  {
    id: 2,
    topic: "Cloud Concepts",
    front: "What is the shared responsibility model?",
    back: "A model that divides security and operational responsibilities between the cloud provider and the customer.",
  },
  {
    id: 3,
    topic: "Cloud Concepts",
    front: "What is high availability?",
    back: "Keeping services accessible and operational with minimal downtime.",
  },
  {
    id: 4,
    topic: "Cloud Concepts",
    front: "What is scalability?",
    back: "The ability to increase or decrease resources to meet changing workloads.",
  },
  {
    id: 5,
    topic: "Cloud Concepts",
    front: "What is elasticity?",
    back: "Automatically or dynamically adjusting resources as demand changes.",
  },
  {
    id: 6,
    topic: "Cloud Concepts",
    front: "What is the consumption-based model?",
    back: "Paying for the cloud resources you use instead of buying all infrastructure upfront.",
  },
  {
    id: 7,
    topic: "Azure Architecture",
    front: "What is an Azure region?",
    back: "A geographical area containing one or more Azure datacenters connected through a network.",
  },
  {
    id: 8,
    topic: "Azure Architecture",
    front: "What is an availability zone?",
    back: "A physically separate location within an Azure region, with independent power, cooling, and networking.",
  },
  {
    id: 9,
    topic: "Azure Architecture",
    front: "What is an Azure resource group?",
    back: "A logical container for managing related Azure resources.",
  },
  {
    id: 10,
    topic: "Azure Architecture",
    front: "What is an Azure subscription?",
    back: "A boundary for billing and resource management that provides access to Azure services.",
  },
  {
    id: 11,
    topic: "Azure Architecture",
    front: "What is an Azure Resource Manager (ARM) template?",
    back: "A JSON-based infrastructure-as-code file used to deploy and manage Azure resources.",
  },
  {
    id: 12,
    topic: "Azure Services",
    front: "What is Azure Virtual Machines?",
    back: "A service that provides virtualized computing resources with control over the operating system.",
  },
  {
    id: 13,
    topic: "Azure Services",
    front: "What is Azure App Service?",
    back: "A managed platform for hosting web applications and APIs.",
  },
  {
    id: 14,
    topic: "Azure Services",
    front: "What is Azure Functions?",
    back: "A serverless compute service for running event-driven code.",
  },
  {
    id: 15,
    topic: "Azure Services",
    front: "What is Azure Blob Storage?",
    back: "Object storage designed for unstructured data such as images, documents, and backups.",
  },
  {
    id: 16,
    topic: "Azure Services",
    front: "What is Azure Virtual Network?",
    back: "A private network in Azure that enables communication between resources and connected networks.",
  },
  {
    id: 17,
    topic: "Security",
    front: "What is Microsoft Entra ID?",
    back: "Microsoft's cloud identity and access management service.",
  },
  {
    id: 18,
    topic: "Security",
    front: "What is multifactor authentication (MFA)?",
    back: "An authentication method requiring two or more different verification factors.",
  },
  {
    id: 19,
    topic: "Security",
    front: "What is Azure RBAC?",
    back: "Role-Based Access Control assigns permissions according to a user's role and required access.",
  },
  {
    id: 20,
    topic: "Security",
    front: "What is the principle of least privilege?",
    back: "Giving users and services only the permissions they need to perform their tasks.",
  },
  {
    id: 21,
    topic: "Cost Management",
    front: "What is the Azure Pricing Calculator?",
    back: "A tool for estimating the cost of Azure products and configurations before deployment.",
  },
  {
    id: 22,
    topic: "Cost Management",
    front: "What is Azure Cost Management?",
    back: "Tools for monitoring, analyzing, and managing cloud spending.",
  },
  {
    id: 23,
    topic: "Cost Management",
    front: "What are Azure budgets?",
    back: "Spending thresholds that help track costs and trigger alerts when configured conditions are met.",
  },
  {
    id: 24,
    topic: "Governance",
    front: "What is Azure Policy?",
    back: "A service for creating and enforcing rules about resource configuration and compliance.",
  },
  {
    id: 25,
    topic: "Governance",
    front: "What are resource locks?",
    back: "Controls that help prevent resources from being accidentally deleted or modified.",
  },
];

const topics = [
  "All Topics",
  ...Array.from(new Set(flashcards.map((card) => card.topic))),
];

export default function Flashcards() {
  const [selectedTopic, setSelectedTopic] = useState("All Topics");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [knownIds, setKnownIds] = useState<number[]>([]);
  const [reviewIds, setReviewIds] = useState<number[]>([]);
  const [showReviewOnly, setShowReviewOnly] = useState(false);

  const deck = useMemo(() => {
    return flashcards.filter((card) => {
      const matchesTopic =
        selectedTopic === "All Topics" || card.topic === selectedTopic;

      const matchesReview = !showReviewOnly || reviewIds.includes(card.id);

      return matchesTopic && matchesReview;
    });
  }, [selectedTopic, showReviewOnly, reviewIds]);

  const currentCard = deck[currentIndex];

  function changeTopic(topic: string) {
    setSelectedTopic(topic);
    setCurrentIndex(0);
    setFlipped(false);
    setShowReviewOnly(false);
  }

  function moveTo(index: number) {
    if (deck.length === 0) return;

    setCurrentIndex((index + deck.length) % deck.length);
    setFlipped(false);
  }

  function markKnown() {
    if (!currentCard) return;

    setKnownIds((previous) =>
      previous.includes(currentCard.id)
        ? previous
        : [...previous, currentCard.id],
    );

    setReviewIds((previous) =>
      previous.filter((id) => id !== currentCard.id),
    );

    moveTo(currentIndex + 1);
  }

  function markForReview() {
    if (!currentCard) return;

    setReviewIds((previous) =>
      previous.includes(currentCard.id)
        ? previous
        : [...previous, currentCard.id],
    );

    setKnownIds((previous) =>
      previous.filter((id) => id !== currentCard.id),
    );

    moveTo(currentIndex + 1);
  }

  function resetProgress() {
    setKnownIds([]);
    setReviewIds([]);
    setCurrentIndex(0);
    setFlipped(false);
    setShowReviewOnly(false);
  }

  const knownCount = knownIds.filter((id) =>
    flashcards.some((card) => card.id === id),
  ).length;

  const progress = Math.round((knownCount / flashcards.length) * 100);

  return (
    <section className="flashcards-page">
      <header className="flashcards-header">
        <div>
          <span className="flashcards-eyebrow">AZ-900 PREPARATION</span>
          <h1>Flashcards</h1>
          <p>Learn the key Azure concepts one card at a time.</p>
        </div>

        <button className="flashcards-reset" onClick={resetProgress}>
          Reset session
        </button>
      </header>

      <div className="flashcards-stats">
        <div className="flashcard-stat">
          <span>Total cards</span>
          <strong>{flashcards.length}</strong>
        </div>

        <div className="flashcard-stat">
          <span>Known</span>
          <strong>{knownCount}</strong>
        </div>

        <div className="flashcard-stat">
          <span>Review again</span>
          <strong>{reviewIds.length}</strong>
        </div>

        <div className="flashcard-stat">
          <span>Mastery</span>
          <strong>{progress}%</strong>
        </div>
      </div>

      <div className="flashcards-progress">
        <div className="flashcards-progress-track">
          <div
            className="flashcards-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span>{knownCount} of {flashcards.length} cards marked known</span>
      </div>

      <div className="flashcards-filters">
        <label htmlFor="flashcard-topic">Study topic</label>
        <select
          id="flashcard-topic"
          value={selectedTopic}
          onChange={(event) => changeTopic(event.target.value)}
        >
          {topics.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>

        <button
          className={showReviewOnly ? "filter-active" : ""}
          onClick={() => {
            setShowReviewOnly((value) => !value);
            setCurrentIndex(0);
            setFlipped(false);
          }}
        >
          {showReviewOnly ? "Show all cards" : "Review missed cards"}
        </button>
      </div>

      {currentCard ? (
        <div className="flashcard-study">
          <div className="flashcard-position">
            Card {currentIndex + 1} of {deck.length}
            <span>{currentCard.topic}</span>
          </div>

          <button
            type="button"
            className={`flashcard ${flipped ? "is-flipped" : ""}`}
            onClick={() => setFlipped((value) => !value)}
            aria-label={flipped ? "Show question" : "Reveal answer"}
          >
            <span className="flashcard-label">
              {flipped ? "ANSWER" : "QUESTION"}
            </span>

            <span className="flashcard-content">
              {flipped ? currentCard.back : currentCard.front}
            </span>

            <span className="flashcard-hint">
              {flipped ? "Click to see the question" : "Click to reveal the answer"}
            </span>
          </button>

          <div className="flashcard-actions">
            <button
              className="flashcard-secondary"
              onClick={() => moveTo(currentIndex - 1)}
            >
              ← Previous
            </button>

            <button
              className="flashcard-review"
              onClick={markForReview}
            >
              ↻ Review again
            </button>

            <button className="flashcard-known" onClick={markKnown}>
              ✓ Know it
            </button>

            <button
              className="flashcard-secondary"
              onClick={() => moveTo(currentIndex + 1)}
            >
              Next →
            </button>
          </div>
        </div>
      ) : (
        <div className="flashcards-empty">
          <h2>No cards to review</h2>
          <p>There are no cards matching this selection.</p>
          <button
            onClick={() => {
              setSelectedTopic("All Topics");
              setShowReviewOnly(false);
              setCurrentIndex(0);
              setFlipped(false);
            }}
          >
            Show all flashcards
          </button>
        </div>
      )}

      <p className="flashcards-note">
        Your progress currently lasts for this browser session.
        Sign in to a future saved-progress feature to keep your learning history.
      </p>
    </section>
  );
}
