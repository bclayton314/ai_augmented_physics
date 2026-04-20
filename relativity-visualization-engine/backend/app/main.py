from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.physics.special_relativity import (
    RelativityError,
    lorentz_factor,
    time_dilation,
    generate_gamma_curve,
)
from app.schemas.relativity import (
    GammaRequest,
    GammaResponse,
    TimeDilationRequest,
    TimeDilationResponse,
    GammaCurvePoint,
)

app = FastAPI(title="Spacetime Lab API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check() -> dict:
    return {"status": "ok"}


@app.post("/api/relativity/gamma", response_model=GammaResponse)
def compute_gamma(request: GammaRequest) -> GammaResponse:
    try:
        gamma = lorentz_factor(request.beta)
        return GammaResponse(beta=request.beta, gamma=gamma)
    except RelativityError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.post("/api/relativity/time-dilation", response_model=TimeDilationResponse)
def compute_time_dilation(request: TimeDilationRequest) -> TimeDilationResponse:
    try:
        gamma = lorentz_factor(request.beta)
        dilated = time_dilation(request.beta, request.proper_time)
        return TimeDilationResponse(
            beta=request.beta,
            gamma=gamma,
            proper_time=request.proper_time,
            dilated_time=dilated,
        )
    except RelativityError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.get("/api/relativity/gamma-curve", response_model=List[GammaCurvePoint])
def get_gamma_curve(max_beta: float = 0.99, step: float = 0.01) -> List[GammaCurvePoint]:
    try:
        points = generate_gamma_curve(max_beta=max_beta, step=step)
        return [GammaCurvePoint(**point) for point in points]
    except RelativityError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc