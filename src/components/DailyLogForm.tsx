"use client";

import { useState } from "react";

export default function DailyLogForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    wakeUpTime: "",
    waterIntake: "",
    workout: {
      pushups: false,
      squats: false,
      pullups: false,
    },
    danceTime: "",
    readingTime: "",
    meditationTime: "",
    reflection: "",
    noPMOStreak: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, checked } = e.target as HTMLInputElement;

    if (name in form.workout) {
      setForm((prev) => ({
        ...prev,
        workout: {
          ...prev.workout,
          [name]: checked,
        },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const response = await fetch("/api/logs", {
      method: "POST",
      body: JSON.stringify({
        ...form,
        date: new Date(),
        workout: Object.keys(form.workout).filter(
          (key) => form.workout[key as keyof typeof form.workout]
        ),
        waterIntake: Number(form.waterIntake),
        danceTime: Number(form.danceTime),
        readingTime: Number(form.readingTime),
        meditationTime: Number(form.meditationTime),
        noPMOStreak: Number(form.noPMOStreak),
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      alert("Log saved!");
    } else {
      alert("Something went wrong.");
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="time"
        name="wakeUpTime"
        onChange={handleChange}
        className="input"
        placeholder="Wake-up time"
      />
      <input
        type="number"
        name="waterIntake"
        onChange={handleChange}
        className="input"
        placeholder="Water intake (ml)"
      />

      <div className="flex gap-4">
        {["pushups", "squats", "pullups"].map((w) => (
          <label key={w} className="flex items-center gap-1">
            <input type="checkbox" name={w} onChange={handleChange} />
            {w}
          </label>
        ))}
      </div>

      <input
        type="number"
        name="danceTime"
        onChange={handleChange}
        className="input"
        placeholder="Dance time (min)"
      />
      <input
        type="number"
        name="readingTime"
        onChange={handleChange}
        className="input"
        placeholder="Reading time (min)"
      />
      <input
        type="number"
        name="meditationTime"
        onChange={handleChange}
        className="input"
        placeholder="Meditation time (min)"
      />
      <textarea
        name="reflection"
        onChange={handleChange}
        className="input"
        placeholder="Reflection notes"
      />
      <input
        type="number"
        name="noPMOStreak"
        onChange={handleChange}
        className="input"
        placeholder="No PMO streak (days)"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {isSubmitting ? "Saving..." : "Save Log"}
      </button>
    </form>
  );
}
