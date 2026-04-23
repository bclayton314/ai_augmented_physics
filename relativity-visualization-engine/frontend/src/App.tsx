import React, { useEffect, useMemo, useState } from "react";
import {
  fetchGamma,
  fetchGammaCurve,
  fetchLengthContraction,
  fetchLengthCurve,
  fetchTimeDilation,
  type GammaCurvePoint,
  type LengthCurvePoint,
} from "./api/relativityApi";
import GammaChart from "./components/GammaChart";
import LengthChart from "./components/LengthChart";
import ResultCard from "./components/ResultCard";
import "./index.css";

export default function App(): React.ReactElement {
  const [beta, setBeta] = useState<number>(0.5);
  const [properTime, setProperTime] = useState<number>(1.0);
  const [properLength, setProperLength] = useState<number>(10.0);

  const [gamma, setGamma] = useState<number | null>(null);
  const [dilatedTime, setDilatedTime] = useState<number | null>(null);
  const [contractedLength, setContractedLength] = useState<number | null>(null);

  const [gammaCurveData, setGammaCurveData] = useState<GammaCurvePoint[]>([]);
  const [lengthCurveData, setLengthCurveData] = useState<LengthCurvePoint[]>([]);

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const betaLabel = useMemo(() => beta.toFixed(2), [beta]);

  useEffect(() => {
    async function loadGammaCurve(): Promise<void> {
      try {
        const points = await fetchGammaCurve();
        setGammaCurveData(points);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load gamma chart.";
        setError(message);
      }
    }

    void loadGammaCurve();
  }, []);

  useEffect(() => {
    async function loadLengthCurve(): Promise<void> {
      try {
        const points = await fetchLengthCurve(properLength);
        setLengthCurveData(points);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load length chart.";
        setError(message);
      }
    }

    void loadLengthCurve();
  }, [properLength]);

  useEffect(() => {
    async function loadResults(): Promise<void> {
      setLoading(true);
      setError("");

      try {
        const [gammaResponse, timeResponse, lengthResponse] = await Promise.all([
          fetchGamma(beta),
          fetchTimeDilation(beta, properTime),
          fetchLengthContraction(beta, properLength),
        ]);

        setGamma(gammaResponse.gamma);
        setDilatedTime(timeResponse.dilated_time);
        setContractedLength(lengthResponse.contracted_length);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Calculation failed.";
        setError(message);
        setGamma(null);
        setDilatedTime(null);
        setContractedLength(null);
      } finally {
        setLoading(false);
      }
    }

    void loadResults();
  }, [beta, properTime, properLength]);

  const contractionRatio =
    properLength > 0 && contractedLength !== null
      ? contractedLength / properLength
      : null;

  return (
    <div className="app-shell">
      <header className="hero">
        <h1>Spacetime Lab</h1>
        <p>
          Stage 2: Explore Lorentz factor, time dilation, and length contraction
          in special relativity.
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
            Time measured in the clock's own rest frame.
          </p>

          <label htmlFor="proper-length-input" className="field-label">
            Proper length L₀
          </label>
          <input
            id="proper-length-input"
            type="number"
            min="0"
            step="0.1"
            value={properLength}
            onChange={(event) => setProperLength(Number(event.target.value))}
          />
          <p className="helper-text">
            Length measured in the object's own rest frame.
          </p>

          <div className="explanation-box">
            <h3>Formulas used</h3>
            <p>γ = 1 / √(1 - β²)</p>
            <p>t = γτ</p>
            <p>L = L₀ / γ</p>
          </div>

          <div className="explanation-box">
            <h3>Interpretation</h3>
            <p>
              As β increases, moving clocks run slower relative to an outside
              observer, while moving objects contract along the direction of motion.
            </p>
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
              subtitle="Strength of relativistic effects"
            />
            <ResultCard
              title="Dilated Time t"
              value={loading || dilatedTime === null ? "..." : dilatedTime.toFixed(6)}
              subtitle="Observed time in another frame"
            />
            <ResultCard
              title="Contracted Length L"
              value={
                loading || contractedLength === null
                  ? "..."
                  : contractedLength.toFixed(6)
              }
              subtitle="Observed length in another frame"
            />
          </div>

          <div className="comparison-panel">
            <h2>Comparison</h2>
            <p>
              Proper time <strong>increases</strong> by a factor of γ, while proper
              length <strong>decreases</strong> by a factor of 1/γ.
            </p>
            <p>
              {loading || gamma === null
                ? "Gamma loading..."
                : `At β = ${betaLabel}, γ ≈ ${gamma.toFixed(4)}.`}
            </p>
            <p>
              {loading || contractedLength === null || contractionRatio === null
                ? "Length contraction loading..."
                : `An object with proper length ${properLength.toFixed(
                    3
                  )} is observed as ${contractedLength.toFixed(
                    3
                  )}, which is ${(contractionRatio * 100).toFixed(2)}% of its rest length.`}
            </p>
          </div>

          <GammaChart
            data={gammaCurveData}
            selectedBeta={beta}
            selectedGamma={gamma}
          />

          <LengthChart
            data={lengthCurveData}
            selectedBeta={beta}
            selectedLength={contractedLength}
          />
        </section>
      </main>
    </div>
  );
}