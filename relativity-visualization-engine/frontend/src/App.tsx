import React, { useEffect, useMemo, useState } from "react";
import {
  fetchGamma,
  fetchGammaCurve,
  fetchTimeDilation,
  type GammaCurvePoint,
} from "./api/relativityApi";
import GammaChart from "./components/GammaChart";
import ResultCard from "./components/ResultCard";
import "./index.css";

export default function App(): React.ReactElement {
  const [beta, setBeta] = useState<number>(0.5);
  const [properTime, setProperTime] = useState<number>(1.0);
  const [gamma, setGamma] = useState<number | null>(null);
  const [dilatedTime, setDilatedTime] = useState<number | null>(null);
  const [curveData, setCurveData] = useState<GammaCurvePoint[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const betaLabel = useMemo(() => beta.toFixed(2), [beta]);

  useEffect(() => {
    async function loadCurve(): Promise<void> {
      try {
        const points = await fetchGammaCurve();
        setCurveData(points);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load chart data.";
        setError(message);
      }
    }

    void loadCurve();
  }, []);

  useEffect(() => {
    async function loadResults(): Promise<void> {
      setLoading(true);
      setError("");

      try {
        const [gammaResponse, timeResponse] = await Promise.all([
          fetchGamma(beta),
          fetchTimeDilation(beta, properTime),
        ]);

        setGamma(gammaResponse.gamma);
        setDilatedTime(timeResponse.dilated_time);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Calculation failed.";
        setError(message);
        setGamma(null);
        setDilatedTime(null);
      } finally {
        setLoading(false);
      }
    }

    void loadResults();
  }, [beta, properTime]);

  return (
    <div className="app-shell">
      <header className="hero">
        <h1>Spacetime Lab</h1>
        <p>
          Stage 1: Explore the Lorentz factor and time dilation in special relativity.
        </p>
      </header>

      <main className="main-grid">
        <section className="control-panel">
          <h2>Inputs</h2>

          <label htmlFor="beta-slider" className="field-label">
            Velocity fraction β = v/c
          </label>
          <input
            id="beta-slider"
            type="range"
            min="0"
            max="0.99"
            step="0.01"
            value={beta}
            onChange={(event) => setBeta(Number(event.target.value))}
          />
          <p className="helper-text">Current β: {betaLabel}</p>

          <label htmlFor="proper-time-input" className="field-label">
            Proper time τ
          </label>
          <input
            id="proper-time-input"
            type="number"
            min="0"
            step="0.1"
            value={properTime}
            onChange={(event) => setProperTime(Number(event.target.value))}
          />
          <p className="helper-text">
            This is the time measured in the clock’s own rest frame.
          </p>

          <div className="explanation-box">
            <h3>Formulas used</h3>
            <p>γ = 1 / √(1 - β²)</p>
            <p>t = γτ</p>
          </div>
        </section>

        <section className="results-panel">
          <h2>Results</h2>

          {error ? <div className="error-box">{error}</div> : null}

          <div className="results-grid">
            <ResultCard
              title="Velocity"
              value={`${betaLabel} c`}
              subtitle="Fraction of the speed of light"
            />
            <ResultCard
              title="Lorentz Factor γ"
              value={loading || gamma === null ? "..." : gamma.toFixed(6)}
              subtitle="How strongly relativistic effects appear"
            />
            <ResultCard
              title="Proper Time τ"
              value={properTime.toFixed(3)}
              subtitle="Time in the clock's rest frame"
            />
            <ResultCard
              title="Dilated Time t"
              value={loading || dilatedTime === null ? "..." : dilatedTime.toFixed(6)}
              subtitle="Time measured by a moving observer"
            />
          </div>

          <GammaChart
            data={curveData}
            selectedBeta={beta}
            selectedGamma={gamma}
          />
        </section>
      </main>
    </div>
  );
}