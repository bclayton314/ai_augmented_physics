from pydantic import BaseModel, Field


class GammaRequest(BaseModel):
    beta: float = Field(..., ge=0.0, lt=1.0, description="Velocity as a fraction of c")


class GammaResponse(BaseModel):
    beta: float
    gamma: float


class TimeDilationRequest(BaseModel):
    beta: float = Field(..., ge=0.0, lt=1.0, description="Velocity as a fraction of c")
    proper_time: float = Field(..., ge=0.0, description="Proper time interval")


class TimeDilationResponse(BaseModel):
    beta: float
    gamma: float
    proper_time: float
    dilated_time: float


class GammaCurvePoint(BaseModel):
    beta: float
    gamma: float