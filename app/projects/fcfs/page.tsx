"use client";

import React, { useState } from "react";
import Link from "next/link"; // Link is not used but kept in imports list for completeness if future navigation is added

const MAX_TIME_UNIT = 500;

// --- THEME CONFIGURATION (Retro Monochromatic Style) ---
const BACKGROUND_COLOR = "bg-white";
const TEXT_COLOR = "text-black";
const BORDER_COLOR = "border-black";
const ACCENT_COLOR = "text-red-600"; // Used sparingly for errors/warnings
const FONT_MONO = "font-mono"; // For the terminal-like input and output
const BOX_SHADOW = "shadow-[4px_4px_0px_#000]"; // Strong 4px black shadow

// Interfaces remain the same for type safety
interface Process {
  pid: string;
  arrival: number | "";
  burst: number | "";
}

interface ProcessResult extends Omit<Process, "arrival" | "burst"> {
  arrival: number;
  burst: number;
  completion: number;
  waiting: number;
  turnaround: number;
  remaining?: number;
}

const DEFAULT_PROCESS_DATA: Omit<Process, "pid"> = { arrival: "", burst: "" };

const getInitialProcesses = () => [
  { pid: "P1", ...DEFAULT_PROCESS_DATA },
  { pid: "P2", ...DEFAULT_PROCESS_DATA },
  { pid: "P3", ...DEFAULT_PROCESS_DATA },
  { pid: "P4", ...DEFAULT_PROCESS_DATA },
];

// --- FCFS Logic (remains unchanged) ---
function fcfs(processes: { pid: string; arrival: number; burst: number }[]) {
  const procs = processes
    .map((p) => ({ ...p }))
    .sort((a, b) => a.arrival - b.arrival || a.pid.localeCompare(b.pid));

  const done: ProcessResult[] = [];
  let time = 0;
  // Timeline stores the running process at each time unit
  const timeline: (string | "IDLE")[] = [];

  for (const current of procs) {
    let startTime = time;

    // 1. Check for IDLE time
    if (current.arrival > time) {
      const idleDuration = current.arrival - time;
      for (let i = 0; i < idleDuration; i++) {
        timeline.push("IDLE");
      }
      startTime = current.arrival;
    }

    // 2. Process Execution
    const completionTime = startTime + current.burst;
    for (let i = 0; i < current.burst; i++) {
      timeline.push(current.pid);
    }

    // 3. Update time and record results
    time = completionTime;

    done.push({
      ...current,
      completion: completionTime,
      turnaround: completionTime - current.arrival,
      waiting: completionTime - current.arrival - current.burst,
    });
  }

  return { timeline, results: done };
}

export default function FCFSSimulator() {
  const [processes, setProcesses] = useState<Process[]>(getInitialProcesses());
  const [results, setResults] = useState<ProcessResult[] | null>(null);
  const [timeline, setTimeline] = useState<(string | "IDLE")[] | null>(null);
  const [error, setError] = useState("");

  const updateField = (i: number, field: keyof Process, value: string) => {
    const updated = [...processes];
    setError("");

    if (field === "pid") {
      updated[i].pid = value;
    } else {
      // Ensure only non-negative integers are entered
      if (!/^\d*$/.test(value)) return;
      updated[i][field] = value === "" ? "" : parseInt(value);
    }

    setProcesses(updated);
  };

  const addProcess = () => {
    setProcesses([
      ...processes,
      { pid: `P${processes.length + 1}`, arrival: "", burst: "" },
    ]);
    setResults(null);
    setTimeline(null);
  };

  const removeProcess = (i: number) => {
    const copy = [...processes];
    copy.splice(i, 1);

    const renumbered = copy.map((p, index) => ({ ...p, pid: `P${index + 1}` }));
    setProcesses(renumbered);
    setResults(null);
    setTimeline(null);
    setError("");
  };

  const resetProcesses = () => {
    setProcesses(getInitialProcesses());
    setResults(null);
    setTimeline(null);
    setError("");
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    i: number,
    field: "arrival" | "burst"
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const nextId = `${field === "arrival" ? "burst" : "arrival"}-${
        i + (field === "burst" ? 2 : 1)
      }`;
      const nextElement = document.getElementById(nextId);

      if (nextElement) {
        nextElement.focus();
      } else if (i === processes.length - 1) {
        document.getElementById("simulate-button")?.focus();
      }
    }
  };

  const simulate = () => {
    setError("");
    setResults(null);
    setTimeline(null);

    const validProcesses: { pid: string; arrival: number; burst: number }[] = [];

    for (const p of processes) {
      if (!p.pid.trim()) {
        return setError("PID cannot be empty for any process.");
      }

      if (p.arrival === "" && p.burst === "") {
        continue;
      }

      if (p.arrival === "" || p.burst === "") {
        return setError(
          `Process ${p.pid}: Arrival Time and Burst Time must both be filled.`
        );
      }

      const arrival = Number(p.arrival);
      const burst = Number(p.burst);

      if (isNaN(arrival) || isNaN(burst)) {
        return setError(
          `Process ${p.pid}: Arrival Time and Burst Time must be valid numbers.`
        );
      }

      if (arrival < 0 || burst <= 0) {
        return setError(
          `Process ${p.pid}: Arrival Time must be ≥ 0 and Burst Time must be ≥ 1.`
        );
      }
      if (arrival > MAX_TIME_UNIT || burst > MAX_TIME_UNIT) {
        return setError(
          `Process ${p.pid}: Value too large. Times must be ≤ ${MAX_TIME_UNIT}.`
        );
      }

      validProcesses.push({ pid: p.pid, arrival, burst });
    }

    if (validProcesses.length === 0) {
      return setError("Please define at least one process.");
    }

    const out = fcfs(validProcesses);

    setResults(out.results.sort((a, b) => a.pid.localeCompare(b.pid)));
    setTimeline(out.timeline);
  };

  let avgW = 0,
    avgT = 0;

  if (results && results.length > 0) {
    avgW = results.reduce((a, b) => a + b.waiting, 0) / results.length;
    avgT = results.reduce((a, b) => a + b.turnaround, 0) / results.length;
  }

  // --- COMPRESS TIMELINE FOR GANTT CHART DISPLAY ---
  const compressedTimeline = timeline
    ? timeline.reduce(
        (acc: { id: string; duration: number }[], current) => {
          if (acc.length === 0 || acc[acc.length - 1].id !== current) {
            acc.push({ id: current, duration: 1 });
          } else {
            acc[acc.length - 1].duration += 1;
          }
          return acc;
        },
        []
      )
    : null;

  // --- PID Color Map (Monochromatic/Simple) ---
  const pidColorMap: { [key: string]: string } = {};
  if (results) {
    const pids = results.map((p) => p.pid);
    const colorClasses = [
      "bg-blue-300",
      "bg-green-300",
      "bg-yellow-300",
      "bg-pink-300",
      "bg-purple-300",
    ];
    pids.forEach((pid, index) => {
      pidColorMap[pid] = colorClasses[index % colorClasses.length] || "bg-gray-300";
    });
  }

  return (
    <main
      className={`${BACKGROUND_COLOR} ${TEXT_COLOR} min-h-screen ${FONT_MONO} p-4 md:p-8`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header/Title Section (Retro Style) */}
        <div
          className={`border-4 ${BORDER_COLOR} p-4 mb-8 ${BOX_SHADOW} bg-gray-100`}
        >
          <h1 className={`text-3xl md:text-4xl font-extrabold ${TEXT_COLOR}`}>
            FCFS SCHEDULING SIMULATOR
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            [OS Project: First Come, First Served - Non-Preemptive]
          </p>
        </div>

        <section className="space-y-8">
          {/* Input Parameters Section */}
          <div
            className={`p-6 border-4 ${BORDER_COLOR} ${BACKGROUND_COLOR} ${BOX_SHADOW}`}
          >
            <div className="flex justify-between items-start mb-4 border-b-2 pb-2">
              <h2 className="text-xl font-bold">Process Input (Arrival / Burst)</h2>
              <div className="flex space-x-2">
                <div className="flex space-x-1 items-center text-sm">
                  <span className="w-3 h-3 border border-black bg-white inline-block"></span>
                  <span>CPU</span>
                </div>
                <div className="flex space-x-1 items-center text-sm">
                  <span className="w-3 h-3 border border-black bg-gray-400 inline-block"></span>
                  <span>IDLE</span>
                </div>
              </div>
            </div>

            {error && (
              <div
                className={`border-2 border-red-500 p-3 mb-4 ${BACKGROUND_COLOR} ${BOX_SHADOW}`}
              >
                <p className={`${ACCENT_COLOR} font-bold text-sm`}>
                  !!! ERROR: {error}
                </p>
              </div>
            )}

            {/* Process Input Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border-2 border-black">
                <thead>
                  <tr className="bg-gray-200 border-b-2 border-black">
                    <th className="p-2 border-r-2 border-black w-[15%]">PID</th>
                    <th className="p-2 border-r-2 border-black w-[35%]">
                      Arrival Time (ms)
                    </th>
                    <th className="p-2 border-r-2 border-black w-[35%]">
                      Burst Time (ms)
                    </th>
                    <th className="p-2 w-[15%]">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {processes.map((p, i) => (
                    <tr
                      key={i}
                      className="border-b-2 border-black last:border-b-0 bg-white"
                    >
                      {/* PID - Read Only */}
                      <td className="p-2 border-r-2 border-black text-center">
                        <input
                          value={p.pid}
                          readOnly
                          className={`w-full text-center border-2 ${BORDER_COLOR} p-1 ${FONT_MONO} bg-gray-100 cursor-not-allowed outline-none`}
                        />
                      </td>

                      {/* Arrival Time */}
                      <td className="p-2 border-r-2 border-black text-center">
                        <input
                          type="text"
                          id={`arrival-${i + 1}`}
                          value={p.arrival}
                          onChange={(e) =>
                            updateField(i, "arrival", e.target.value)
                          }
                          onKeyDown={(e) => handleKeyDown(e, i, "arrival")}
                          className={`w-full text-center border-2 ${BORDER_COLOR} p-1 ${FONT_MONO} focus:bg-yellow-100 outline-none`}
                          placeholder="0"
                          maxLength={MAX_TIME_UNIT.toString().length}
                        />
                      </td>

                      {/* Burst Time */}
                      <td className="p-2 border-r-2 border-black text-center">
                        <input
                          type="text"
                          id={`burst-${i + 1}`}
                          value={p.burst}
                          onChange={(e) => updateField(i, "burst", e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, i, "burst")}
                          className={`w-full text-center border-2 ${BORDER_COLOR} p-1 ${FONT_MONO} focus:bg-yellow-100 outline-none`}
                          placeholder="5"
                          maxLength={MAX_TIME_UNIT.toString().length}
                        />
                      </td>

                      {/* Action */}
                      <td className="p-2 text-center">
                        <button
                          onClick={() => removeProcess(i)}
                          className={`bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-2 border-2 ${BORDER_COLOR} ${BOX_SHADOW} active:translate-x-1 active:translate-y-1 active:shadow-none`}
                        >
                          DELETE
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <button
                id="simulate-button"
                onClick={simulate}
                className={`bg-black text-white font-bold w-full sm:w-auto py-3 px-8 border-2 ${BORDER_COLOR} ${BOX_SHADOW} active:translate-x-1 active:translate-y-1 active:shadow-none`}
              >
                [ SIMULATE FCFS ]
              </button>

              <div className="flex space-x-4 w-full sm:w-auto justify-end">
                <button
                  onClick={addProcess}
                  className={`bg-gray-200 hover:bg-gray-300 text-black py-2 px-4 border-2 ${BORDER_COLOR} ${BOX_SHADOW} active:translate-x-1 active:translate-y-1 active:shadow-none`}
                >
                  + Add Process
                </button>
                <button
                  onClick={resetProcesses}
                  className={`bg-gray-200 hover:bg-gray-300 text-black py-2 px-4 border-2 ${BORDER_COLOR} ${BOX_SHADOW} active:translate-x-1 active:translate-y-1 active:shadow-none`}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Simulation Output */}
          {results && (
            <div className="mt-8">
              <SimulationOutput
                results={results}
                compressedTimeline={compressedTimeline}
                pidColorMap={pidColorMap}
                FONT_MONO={FONT_MONO}
                BOX_SHADOW={BOX_SHADOW}
                BORDER_COLOR={BORDER_COLOR}
                ACCENT_COLOR={ACCENT_COLOR}
              />
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="border-t-2 border-black pt-4 mt-12 text-center text-sm text-gray-700">
          <p>
            &copy; {new Date().getFullYear()} **LENJOHN OPALONG**. All rights
            reserved.
          </p>
          <p className="mt-1">
            FCFS CPU Scheduling Simulator - Retro UI.
          </p>
        </footer>
      </div>
    </main>
  );
}

// Separate component for Simulation Output to apply the theme consistently
interface OutputProps {
  results: ProcessResult[];
  compressedTimeline: { id: string; duration: number }[] | null;
  pidColorMap: { [key: string]: string };
  FONT_MONO: string;
  BOX_SHADOW: string;
  BORDER_COLOR: string;
  ACCENT_COLOR: string;
}

function SimulationOutput({
  results,
  compressedTimeline,
  pidColorMap,
  FONT_MONO,
  BOX_SHADOW,
  BORDER_COLOR,
  ACCENT_COLOR,
}: OutputProps) {
  let avgW = 0,
    avgT = 0;

  if (results && results.length > 0) {
    avgW = results.reduce((a, b) => a + b.waiting, 0) / results.length;
    avgT = results.reduce((a, b) => a + b.turnaround, 0) / results.length;
  }

  // Calculate Gantt Chart Time Labels
  const timeLabels = [{ time: 0, x: 0 }];
  let currentTime = 0;
  if (compressedTimeline) {
    compressedTimeline.forEach((block) => {
      currentTime += block.duration;
      timeLabels.push({ time: currentTime, x: currentTime });
    });
  }

  // Determine Max Duration for scaling (using a fixed max width for chart)
  const totalDuration = currentTime;
  const maxChartWidth = 1000; // Arbitrary large width for overflow-x-auto

  return (
    <section
      className={`p-6 border-4 ${BORDER_COLOR} bg-gray-50 ${BOX_SHADOW} space-y-6`}
    >
      <div className="border-b-2 border-black pb-3">
        <h2 className={`text-2xl font-bold ${TEXT_COLOR}`}>
          ::: SIMULATION RESULTS
        </h2>
      </div>

      {/* 1. Gantt Chart/Timeline */}
      {compressedTimeline && (
        <div>
          <h3 className="text-xl font-semibold mb-3">GANTT CHART</h3>
          <div
            className={`overflow-x-auto border-2 ${BORDER_COLOR} p-2 bg-gray-100 ${FONT_MONO}`}
          >
            <div
              style={{ width: `${totalDuration * 50 + 50}px` }} // Scale width by duration (50px per unit)
              className="relative h-20"
            >
              {/* Timeline Blocks */}
              <div className="absolute top-0 left-0 right-0 h-10 flex">
                {compressedTimeline.map((block, index) => {
                  const isIdle = block.id === "IDLE";
                  const bgColor = isIdle ? "bg-gray-400" : pidColorMap[block.id];
                  const textColor = isIdle ? "text-gray-800" : "text-black";
                  const width = block.duration * 50; // 50px per time unit

                  return (
                    <div
                      key={index}
                      style={{ width: `${width}px` }}
                      className={`h-full border-r-2 border-black ${bgColor} flex items-center justify-center font-bold text-sm ${textColor}`}
                    >
                      {block.id}
                    </div>
                  );
                })}
              </div>

              {/* Time Labels (Ticks) */}
              <div className="absolute top-10 left-0 right-0 h-10 flex">
                {timeLabels.map((label, index) => {
                  let leftPosition = 0;
                  if (index > 0) {
                    leftPosition = timeLabels[index - 1].x * 50;
                  }

                  const prevDuration =
                    index > 0
                      ? compressedTimeline![index - 1]?.duration || 0
                      : 0;

                  return (
                    <div
                      key={index}
                      style={{ transform: `translateX(${prevDuration * 50}px)` }}
                      className="relative h-full"
                    >
                      <div className="absolute left-0 -top-0.5 w-0.5 h-2 bg-black"></div>
                      <span className="absolute left-0 top-2 text-xs font-mono -translate-x-1/2">
                        {label.time}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <p className="mt-4 text-gray-700 text-sm">
            Total Execution Time: {totalDuration} ms
          </p>
        </div>
      )}

      {/* 2. Process Metrics Table */}
      <div>
        <h3 className="text-xl font-semibold mb-3 border-t-2 border-black pt-3">
          PROCESS METRICS
        </h3>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border-2 border-black bg-white">
            <thead>
              <tr className="bg-gray-200 border-b-2 border-black">
                <th className="p-2 border-r-2 border-black">PID</th>
                <th className="p-2 border-r-2 border-black">Arrival</th>
                <th className="p-2 border-r-2 border-black">Burst</th>
                <th className="p-2 border-r-2 border-black">Completion</th>
                <th className="p-2 border-r-2 border-black">Turnaround</th>
                <th className="p-2">Waiting</th>
              </tr>
            </thead>

            <tbody>
              {results.map((p) => (
                <tr key={p.pid} className="border-b-2 border-black last:border-b-0">
                  <td className="p-2 border-r-2 border-black text-center font-bold">
                    {p.pid}
                  </td>
                  <td className="p-2 border-r-2 border-black text-center text-gray-700">
                    {p.arrival}
                  </td>
                  <td className="p-2 border-r-2 border-black text-center text-gray-700">
                    {p.burst}
                  </td>
                  <td className="p-2 border-r-2 border-black text-center text-black font-semibold bg-green-100">
                    {Math.round(p.completion)}
                  </td>
                  <td
                    className={`p-2 border-r-2 border-black text-center font-bold bg-yellow-100`}
                  >
                    {Math.round(p.turnaround)}
                  </td>
                  <td
                    className={`p-2 text-center font-bold bg-blue-100`}
                  >
                    {Math.round(p.waiting)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Averages */}
      <div
        className={`mt-6 p-4 border-2 ${BORDER_COLOR} bg-white flex flex-col sm:flex-row justify-around text-lg font-bold space-y-2 sm:space-y-0 ${BOX_SHADOW}`}
      >
        <p>
          AVG Waiting Time:{" "}
          <span className="text-blue-600">
            {avgW.toFixed(2)} ms
          </span>
        </p>
        <p>
          AVG Turnaround Time:{" "}
          <span className="text-yellow-700">
            {avgT.toFixed(2)} ms
          </span>
        </p>
      </div>
    </section>
  );
}