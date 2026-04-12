# app/data/fd_data.py
# Real FD rates from Small Finance Banks (approximate, as of 2025)
# Update these periodically before demo

FD_BANKS = [
    {
        "id": "suryoday",
        "name": "Suryoday Small Finance Bank",
        "name_hindi": "सूर्योदय स्मॉल फाइनेंस बैंक",
        "rates": [
            {"tenure_months": 6,  "tenure_label": "6 महीने",  "rate": 7.25},
            {"tenure_months": 12, "tenure_label": "12 महीने", "rate": 8.50},
            {"tenure_months": 24, "tenure_label": "24 महीने", "rate": 8.25},
            {"tenure_months": 36, "tenure_label": "36 महीने", "rate": 8.00},
        ],
        "min_amount": 1000,
        "max_amount": 10000000,
        "dicgc_insured": True,
        "tagline": "Gorakhpur mein bahut popular",
        "highlight": True,
    },
    {
        "id": "utkarsh",
        "name": "Utkarsh Small Finance Bank",
        "name_hindi": "उत्कर्ष स्मॉल फाइनेंस बैंक",
        "rates": [
            {"tenure_months": 6,  "tenure_label": "6 महीने",  "rate": 7.50},
            {"tenure_months": 12, "tenure_label": "12 महीने", "rate": 8.25},
            {"tenure_months": 24, "tenure_label": "24 महीने", "rate": 8.25},
            {"tenure_months": 36, "tenure_label": "36 महीने", "rate": 8.00},
        ],
        "min_amount": 500,
        "max_amount": 10000000,
        "dicgc_insured": True,
        "tagline": "UP mein strong presence",
        "highlight": False,
    },
    {
        "id": "jana",
        "name": "Jana Small Finance Bank",
        "name_hindi": "जना स्मॉल फाइनेंस बैंक",
        "rates": [
            {"tenure_months": 6,  "tenure_label": "6 महीने",  "rate": 7.00},
            {"tenure_months": 12, "tenure_label": "12 महीने", "rate": 8.00},
            {"tenure_months": 24, "tenure_label": "24 महीने", "rate": 8.10},
            {"tenure_months": 36, "tenure_label": "36 महीने", "rate": 7.75},
        ],
        "min_amount": 1000,
        "max_amount": 10000000,
        "dicgc_insured": True,
        "tagline": "Reliable aur safe",
        "highlight": False,
    },
    {
        "id": "esaf",
        "name": "ESAF Small Finance Bank",
        "name_hindi": "ESAF स्मॉल फाइनेंस बैंक",
        "rates": [
            {"tenure_months": 6,  "tenure_label": "6 महीने",  "rate": 7.00},
            {"tenure_months": 12, "tenure_label": "12 महीने", "rate": 8.25},
            {"tenure_months": 24, "tenure_label": "24 महीने", "rate": 7.50},
            {"tenure_months": 36, "tenure_label": "36 महीने", "rate": 7.25},
        ],
        "min_amount": 1000,
        "max_amount": 10000000,
        "dicgc_insured": True,
        "tagline": "Kaafi acchi interest rate",
        "highlight": False,
    },
    {
        "id": "equitas",
        "name": "Equitas Small Finance Bank",
        "name_hindi": "इक्विटास स्मॉल फाइनेंस बैंक",
        "rates": [
            {"tenure_months": 6,  "tenure_label": "6 महीने",  "rate": 7.25},
            {"tenure_months": 12, "tenure_label": "12 महीने", "rate": 8.00},
            {"tenure_months": 24, "tenure_label": "24 महीने", "rate": 8.00},
            {"tenure_months": 36, "tenure_label": "36 महीने", "rate": 7.80},
        ],
        "min_amount": 5000,
        "max_amount": 10000000,
        "dicgc_insured": True,
        "tagline": "Trustworthy choice",
        "highlight": False,
    },
]

# FD Jargon dictionary — used to enrich the system prompt context
JARGON_DICT = {
    "FD": {
        "hindi": "Fixed Deposit (FD) matlab aap apna paisa bank mein ek fixed samay ke liye rakh dete ho. Bank aapko us par interest deta hai. Jaise kisi dost ko udhar diya aur woh wapas karne par extra deta hai.",
        "bhojpuri": "FD matlab rउ apan paisa bank ke haath mein de dihla ek time ke liye. Bank ओह par byaj deta hai. Bilkul waise jaise ghar mein dhara rakha paisa badhta hai.",
        "awadhi": "FD matlab apna paisa bank mein band kar dena kuch samay ke liye. Bank uske badle mein zyada paisa wapas karta hai.",
    },
    "p.a.": {
        "hindi": "'Per Annum' matlab 'har saal'. 8.50% p.a. ka matlab hai ki aapke ₹100 pe har saal ₹8.50 milenge.",
        "bhojpuri": "Per Annum matlab saal bhar mein. 8.50% p.a. matlab rउ ₹100 dalihla ta ₹8.50 sal bhar mein miili.",
        "awadhi": "Per annum matlab ek saal mein. 8.50% p.a. mane har sau rupaye pe saal bhar mein saade aath rupaye milenge.",
    },
    "tenor": {
        "hindi": "Tenor matlab kitne samay ke liye aap paisa rakhoge. 12M matlab 12 mahine (1 saal).",
        "bhojpuri": "Tenor matlab kitna din/mahina ke liye paisa rakhba. 12M matlab barah mahina.",
        "awadhi": "Tenor matlab paisa rakhe ke muddat. 12M matlab barah maheena.",
    },
    "maturity": {
        "hindi": "Maturity matlab jab FD ki meyad khatam hoti hai. Uss waqt aapko apna paisa aur uska interest dono milta hai.",
        "bhojpuri": "Maturity matlab jab samay poora ho jaai. Tab apan paisa aur byaj dono mil jaai.",
        "awadhi": "Maturity matlab jab aapka time poora ho jaai. Tab poora paisa aur byaj wapas milta hai.",
    },
    "interest": {
        "hindi": "Interest matlab faida. Bank aapke paise ka upyog karta hai aur badle mein aapko kuch extra paisa deta hai — wahi interest hai.",
        "bhojpuri": "Byaj matlab faida. Aap paisa dihla, bank ओह par kuch extra dega — wahi byaj hoi.",
        "awadhi": "Byaj matlab nafa. Bank aapka paisa use karta hai aur nafa deta hai.",
    },
    "DICGC": {
        "hindi": "DICGC ek sarkar ki sanstha hai jo aapke ₹5 lakh tak ke paise ki guarantee deti hai. Agar bank band bhi ho jaaye, toh bhi aapka ₹5 lakh tak ka paisa safe hai.",
        "bhojpuri": "DICGC sarkar ke ek agency hai jo ₹5 lakh tak ke paisa ke guarantee deta hai. Bank kuch bhi ho jaai, apan paisa safe hai.",
        "awadhi": "DICGC sarkar ka ek idara hai jo ₹5 lakh tak ke paisa ki hifazat karta hai.",
    },
    "Small Finance Bank": {
        "hindi": "Small Finance Bank ek khas tarah ka bank hai jo RBI se registered hai. Yeh aam logon ke liye hai aur sabse zyada interest deta hai. Poora safe hai.",
        "bhojpuri": "Small Finance Bank ek aisa bank hai jo RBI ke permission se chalta hai. Aam aadmi ke liye bana hai. Bahut safe baa.",
        "awadhi": "Small Finance Bank ek RBI approved bank hai. Common log ke liye bana hai. Bilkul safe hai.",
    },
}
