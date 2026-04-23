import math
from typing import List, Dict


class RelativityError(ValueError):
    """Raised when relativity inputs are physically invalid."""


def validate_beta(beta: float) -> None:
    """
    Validate beta = v/c.

    For this app:
    - beta must be >= 0
    - beta must be < 1
    """
    if beta < 0:
        raise RelativityError("Velocity fraction beta must be non-negative.")
    if beta >= 1:
        raise RelativityError("Velocity fraction beta must be less than 1.")


def lorentz_factor(beta: float) -> float:
    """
    Compute the Lorentz factor gamma from beta = v/c.

    gamma = 1 / sqrt(1 - beta^2)
    """
    validate_beta(beta)
    return 1.0 / math.sqrt(1.0 - beta ** 2)


def time_dilation(beta: float, proper_time: float) -> float:
    """
    Compute dilated time:
        t = gamma * proper_time
    """
    validate_beta(beta)

    if proper_time < 0:
        raise RelativityError("Proper time must be non-negative.")

    gamma = lorentz_factor(beta)
    return gamma * proper_time


def length_contraction(beta: float, proper_length: float) -> float:
    """
    Compute contracted length:
        L = L0 / gamma
    """
    validate_beta(beta)

    if proper_length < 0:
        raise RelativityError("Proper length must be non-negative.")

    gamma = lorentz_factor(beta)
    return proper_length / gamma


def generate_gamma_curve(max_beta: float = 0.99, step: float = 0.01) -> List[Dict[str, float]]:
    """
    Generate points for plotting gamma as a function of beta.
    """
    if max_beta <= 0 or max_beta >= 1:
        raise RelativityError("max_beta must be > 0 and < 1.")
    if step <= 0:
        raise RelativityError("step must be positive.")

    points = []
    beta = 0.0

    while beta <= max_beta + 1e-12:
        gamma = lorentz_factor(beta)
        points.append(
            {
                "beta": round(beta, 4),
                "gamma": round(gamma, 6),
            }
        )
        beta += step

    return points


def generate_length_curve(
    proper_length: float,
    max_beta: float = 0.99,
    step: float = 0.01,
) -> List[Dict[str, float]]:
    """
    Generate points for plotting contracted length as a function of beta.

    Returns:
    [
        {"beta": 0.0, "length": ...},
        ...
    ]
    """
    if proper_length < 0:
        raise RelativityError("Proper length must be non-negative.")
    if max_beta <= 0 or max_beta >= 1:
        raise RelativityError("max_beta must be > 0 and < 1.")
    if step <= 0:
        raise RelativityError("step must be positive.")

    points = []
    beta = 0.0

    while beta <= max_beta + 1e-12:
        contracted = length_contraction(beta, proper_length)
        points.append(
            {
                "beta": round(beta, 4),
                "length": round(contracted, 6),
            }
        )
        beta += step

    return points