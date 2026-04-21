import React from "react";

interface ResultCardProps {
  title: string;
  value: string;
  subtitle?: string;
}

export default function ResultCard({
  title,
  value,
  subtitle,
}: ResultCardProps): React.ReactElement {
  return (
    <div className="result-card">
      <h3>{title}</h3>
      <p className="result-card__value">{value}</p>
      {subtitle ? <p className="result-card__subtitle">{subtitle}</p> : null}
    </div>
  );
}