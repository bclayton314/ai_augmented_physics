export interface GammaResponse {
  beta: number;
  gamma: number;
}

export interface TimeDilationResponse {
  beta: number;
  gamma: number;
  proper_time: number;
  dilated_time: number;
}

export interface LengthContractionResponse {
  beta: number;
  gamma: number;
  proper_length: number;
  contracted_length: number;
}

export interface GammaCurvePoint {
  beta: number;
  gamma: number;
}

export interface LengthCurvePoint {
  beta: number;
  length: number;
}

const API_BASE_URL = "http://127.0.0.1:8000";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message = errorBody?.detail ?? "Request failed";
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export async function fetchGamma(beta: number): Promise<GammaResponse> {
  const response = await fetch(`${API_BASE_URL}/api/relativity/gamma`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ beta }),
  });

  return handleResponse<GammaResponse>(response);
}

export async function fetchTimeDilation(
  beta: number,
  properTime: number
): Promise<TimeDilationResponse> {
  const response = await fetch(`${API_BASE_URL}/api/relativity/time-dilation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      beta,
      proper_time: properTime,
    }),
  });

  return handleResponse<TimeDilationResponse>(response);
}

export async function fetchLengthContraction(
  beta: number,
  properLength: number
): Promise<LengthContractionResponse> {
  const response = await fetch(`${API_BASE_URL}/api/relativity/length-contraction`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      beta,
      proper_length: properLength,
    }),
  });

  return handleResponse<LengthContractionResponse>(response);
}

export async function fetchGammaCurve(): Promise<GammaCurvePoint[]> {
  const response = await fetch(`${API_BASE_URL}/api/relativity/gamma-curve`);
  return handleResponse<GammaCurvePoint[]>(response);
}

export async function fetchLengthCurve(
  properLength: number
): Promise<LengthCurvePoint[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/relativity/length-curve?proper_length=${encodeURIComponent(
      properLength
    )}`
  );
  return handleResponse<LengthCurvePoint[]>(response);
}