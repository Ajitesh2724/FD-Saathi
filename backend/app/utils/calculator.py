# app/utils/calculator.py

def calculate_maturity(principal: float, annual_rate: float, tenure_months: int) -> dict:
    """
    Calculate FD maturity amount using quarterly compounding (standard Indian bank practice).
    Formula: A = P * (1 + r/n)^(n*t)
    r = annual rate / 100
    n = 4 (quarterly compounding)
    t = tenure in years
    """
    r = annual_rate / 100
    n = 4  # quarterly compounding
    t = tenure_months / 12

    maturity_amount = principal * ((1 + r / n) ** (n * t))
    interest_earned = maturity_amount - principal

    return {
        "principal": round(principal, 2),
        "maturity_amount": round(maturity_amount, 2),
        "interest_earned": round(interest_earned, 2),
        "annual_rate": annual_rate,
        "tenure_months": tenure_months,
        "tenure_years": round(t, 2),
    }


def format_inr(amount: float) -> str:
    """Format amount in Indian Rupee style with commas."""
    amount = int(round(amount))
    s = str(amount)
    # Indian number system: last 3 digits, then groups of 2
    if len(s) <= 3:
        return f"₹{s}"
    last3 = s[-3:]
    rest = s[:-3]
    groups = []
    while len(rest) > 2:
        groups.append(rest[-2:])
        rest = rest[:-2]
    if rest:
        groups.append(rest)
    groups.reverse()
    return f"₹{','.join(groups)},{last3}"


def get_best_rate(banks: list, tenure_months: int) -> dict | None:
    """Find the bank with best rate for given tenure."""
    best = None
    best_rate = 0
    for bank in banks:
        for rate_entry in bank["rates"]:
            if rate_entry["tenure_months"] == tenure_months:
                if rate_entry["rate"] > best_rate:
                    best_rate = rate_entry["rate"]
                    best = {**bank, "selected_rate": rate_entry["rate"], "selected_tenure": tenure_months}
    return best


def compare_rates_for_tenure(banks: list, tenure_months: int) -> list:
    """Return all banks sorted by rate for a given tenure."""
    results = []
    for bank in banks:
        for rate_entry in bank["rates"]:
            if rate_entry["tenure_months"] == tenure_months:
                results.append({
                    "bank_id": bank["id"],
                    "bank_name": bank["name"],
                    "bank_name_hindi": bank["name_hindi"],
                    "rate": rate_entry["rate"],
                    "tenure_label": rate_entry["tenure_label"],
                    "dicgc_insured": bank["dicgc_insured"],
                    "tagline": bank["tagline"],
                    "highlight": bank.get("highlight", False),
                })
    results.sort(key=lambda x: x["rate"], reverse=True)
    return results
