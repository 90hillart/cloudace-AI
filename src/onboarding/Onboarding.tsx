
import { useState } from "react";
import {
  saveLearnerProfile,
  type LearnerProfile,
} from "../lib/onboarding";
import "./Onboarding.css";

type Props = {
  onComplete: () => void;
};

const interests = [
  { id: "Azure Fundamentals (AZ-900)", icon: "☁️" },
  { id: "Artificial Intelligence", icon: "🧠" },
  { id: "Cloud Computing", icon: "🌐" },
  { id: "Software Development", icon: "💻" },
];

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function Onboarding({ onComplete }: Props) {
  const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] =
    useState<string[]>(["Azure Fundamentals (AZ-900)"]);

  const [experience, setExperience] =
    useState<LearnerProfile["experience_level"]>("beginner");

  const [minutes, setMinutes] = useState(30);
  const [selectedDays, setSelectedDays] = useState<string[]>([
    "Monday",
    "Wednesday",
    "Friday",
  ]);

  const [goal, setGoal] = useState(
    "Prepare for the Azure Fundamentals AZ-900 certification."
  );

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function toggleInterest(value: string) {
    setSelectedInterests((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  }

  function toggleDay(value: string) {
    setSelectedDays((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  }

  function nextStep() {
    setError("");

    if (step === 1 && selectedInterests.length === 0) {
      setError("Please select at least one learning interest.");
      return;
    }

    if (step === 3 && selectedDays.length === 0) {
      setError("Please select at least one study day.");
      return;
    }

    setStep((current) => Math.min(current + 1, 4));
  }

  async function handleComplete() {
    if (!goal.trim()) {
      setError("Please enter your learning goal.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      await saveLearnerProfile({
        learning_interests: selectedInterests,
        experience_level: experience,
        daily_study_minutes: minutes,
        study_days: selectedDays,
        learning_goal: goal.trim(),
        onboarding_completed: true,
      });

      onComplete();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save your preferences. Please try again."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="onboarding-page">
      <div className="onboarding-card">

        <header className="onboarding-header">
          <div className="onboarding-logo">
            ✦ CloudAce <strong>AI</strong>
          </div>

          <span className="onboarding-label">
            PERSONALIZED LEARNING EXPERIENCE
          </span>

          <h1>Let's build your learning journey.</h1>

          <p>
            Tell us about your goals so we can personalize
            your CloudAce AI experience.
          </p>
        </header>

        <div className="onboarding-progress">
          <div className="progress-info">
            <span>YOUR SETUP</span>
            <span>Step {step} of 4</span>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {step === 1 && (
          <section className="onboarding-step">
            <h2>What interests you?</h2>
            <p>Select the subjects you want to explore.</p>

            <div className="interest-grid">
              {interests.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className={`interest-option ${
                    selectedInterests.includes(item.id)
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => toggleInterest(item.id)}
                  aria-pressed={selectedInterests.includes(item.id)}
                >
                  <span>{item.icon}</span>
                  <strong>{item.id}</strong>
                  <span className="selection-indicator">
                    {selectedInterests.includes(item.id) ? "✓" : "+"}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="onboarding-step">
            <h2>What's your experience level?</h2>
            <p>We'll adjust your learning recommendations.</p>

            <div className="experience-options">
              {[
                {
                  id: "beginner",
                  title: "Beginner",
                  description: "I'm just getting started.",
                },
                {
                  id: "intermediate",
                  title: "Intermediate",
                  description: "I understand the fundamentals.",
                },
                {
                  id: "advanced",
                  title: "Advanced",
                  description: "I have practical experience.",
                },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className={`experience-option ${
                    experience === item.id ? "selected" : ""
                  }`}
                  onClick={() =>
                    setExperience(
                      item.id as LearnerProfile["experience_level"]
                    )
                  }
                  aria-pressed={experience === item.id}
                >
                  <strong>{item.title}</strong>
                  <span>{item.description}</span>
                  {experience === item.id && <b>✓</b>}
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="onboarding-step">
            <h2>Build your study routine.</h2>
            <p>How much time can you dedicate to learning?</p>

            <div className="minutes-selector">
              <strong>{minutes} minutes</strong>
              <input
                type="range"
                min="10"
                max="240"
                step="10"
                value={minutes}
                onChange={(event) =>
                  setMinutes(Number(event.target.value))
                }
              />
              <div>
                <span>10 min</span>
                <span>4 hours</span>
              </div>
            </div>

            <h3>Choose your study days</h3>

            <div className="days-grid">
              {days.map((day) => (
                <button
                  type="button"
                  key={day}
                  className={
                    selectedDays.includes(day) ? "selected" : ""
                  }
                  onClick={() => toggleDay(day)}
                  aria-pressed={selectedDays.includes(day)}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 4 && (
          <section className="onboarding-step">
            <h2>What's your main learning goal?</h2>
            <p>Tell us what you want to accomplish.</p>

            <textarea
              value={goal}
              onChange={(event) => setGoal(event.target.value)}
              placeholder="Describe your learning goal..."
              rows={5}
              maxLength={300}
            />

            <div className="goal-tip">
              ✦ Your preferences will help personalize your study experience.
            </div>

            <div className="onboarding-summary">
              <strong>Your learning preferences</strong>
              <p>Interests: {selectedInterests.join(", ")}</p>
              <p>Level: {experience}</p>
              <p>Daily commitment: {minutes} minutes</p>
              <p>Study days: {selectedDays.join(", ")}</p>
            </div>
          </section>
        )}

        {error && (
          <div className="onboarding-error" role="alert">
            {error}
          </div>
        )}

        <footer className="onboarding-actions">
          {step > 1 && (
            <button
              type="button"
              className="back-button"
              disabled={busy}
              onClick={() => {
                setError("");
                setStep((current) => current - 1);
              }}
            >
              ← Back
            </button>
          )}

          <button
            type="button"
            className="continue-button"
            disabled={busy}
            onClick={step === 4 ? handleComplete : nextStep}
          >
            {busy
              ? "Saving preferences..."
              : step === 4
                ? "Complete Setup →"
                : "Continue →"}
          </button>
        </footer>

        <p className="onboarding-footer">
          Your learning journey. Your pace. Your success.
        </p>
      </div>
    </main>
  );
}
