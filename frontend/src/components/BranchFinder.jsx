import { useState, useEffect, useRef } from 'react';

const SEARCHABLE_BANKS = [
  { id: 'sbi',      name: 'State Bank of India', nameHindi: 'स्टेट बैंक ऑफ इंडिया', osmName: 'State Bank of India', color: '#1a237e', coverage: 'high' },
  { id: 'pnb',      name: 'Punjab National Bank', nameHindi: 'पंजाब नेशनल बैंक', osmName: 'Punjab National Bank', color: '#b71c1c', coverage: 'high' },
  { id: 'bob',      name: 'Bank of Baroda', nameHindi: 'बैंक ऑफ बड़ौदा', osmName: 'Bank of Baroda', color: '#f57f17', coverage: 'high' },
  { id: 'hdfc',     name: 'HDFC Bank', nameHindi: 'HDFC बैंक', osmName: 'HDFC Bank', color: '#004c8c', coverage: 'high' },
  { id: 'icici',    name: 'ICICI Bank', nameHindi: 'ICICI बैंक', osmName: 'ICICI Bank', color: '#b71c1c', coverage: 'high' },
  { id: 'axis',     name: 'Axis Bank', nameHindi: 'एक्सिस बैंक', osmName: 'Axis Bank', color: '#880e4f', coverage: 'high' },
  { id: 'canara',   name: 'Canara Bank', nameHindi: 'केनरा बैंक', osmName: 'Canara Bank', color: '#1b5e20', coverage: 'high' },
  { id: 'union',    name: 'Union Bank', nameHindi: 'यूनियन बैंक', osmName: 'Union Bank of India', color: '#e65100', coverage: 'medium' },
  { id: 'bandhan',  name: 'Bandhan Bank', nameHindi: 'बंधन बैंक', osmName: 'Bandhan Bank', color: '#4a148c', coverage: 'medium' },
  { id: 'kotak',    name: 'Kotak Bank', nameHindi: 'कोटक बैंक', osmName: 'Kotak Mahindra Bank', color: '#e65100', coverage: 'medium' },
  { id: 'suryoday', name: 'Suryoday SFB', nameHindi: 'सूर्योदय SFB', osmName: 'Suryoday Small Finance Bank', color: '#1a6b3c', coverage: 'low', website: 'https://www.suryodaybank.com/branch-locator' },
  { id: 'ujjivan',  name: 'Ujjivan SFB', nameHindi: 'उज्जीवन SFB', osmName: 'Ujjivan Small Finance Bank', color: '#0277bd', coverage: 'low', website: 'https://www.ujjivansfb.in/branch-atm-locator' },
  { id: 'au',       name: 'AU SFB', nameHindi: 'AU SFB', osmName: 'AU Small Finance Bank', color: '#c62828', coverage: 'low', website: 'https://www.aubank.in/branch-atm-locator' },
  { id: 'utkarsh',  name: 'Utkarsh SFB', nameHindi: 'उत्कर्ष SFB', osmName: 'Utkarsh Small Finance Bank', color: '#2e7d32', coverage: 'low', website: 'https://www.utkarshbank.com/branch-atm-locator' },
  { id: 'jana',     name: 'Jana SFB', nameHindi: 'जना SFB', osmName: 'Jana Small Finance Bank', color: '#6a1b9a', coverage: 'low', website: 'https://www.janabank.in/branch-locator' },
];

const UI_TEXT = {
  hindi: {
    title: 'नजदीकी बैंक शाखा खोजें',
    selectBank: 'बैंक चुनें',
    enterCity: 'शहर का नाम लिखें',
    search: 'खोजें',
    searching: '🔍 खोज रहा है...',
    found: 'शाखाएं मिलीं',
    noResults: 'इस शहर में शाखा नहीं मिली।',
    visitWebsite: 'आधिकारिक वेबसाइट पर देखें',
    lowCoverage: 'इस बैंक का डेटा OpenStreetMap पर कम है।',
    distance: 'दूरी',
    address: 'पता',
    close: 'बंद करें',
    cityPlaceholder: 'जैसे: Gorakhpur, Mumbai, Delhi',
    note: '📍 डेटा OpenStreetMap से — वास्तविक शाखाएं',
  },
  english: {
    title: 'Find Nearest Bank Branch',
    selectBank: 'Select Bank',
    enterCity: 'Enter City Name',
    search: 'Search',
    searching: '🔍 Searching...',
    found: 'branches found',
    noResults: 'No branches found in this city.',
    visitWebsite: 'Visit Official Website',
    lowCoverage: 'Limited OSM data for this bank.',
    distance: 'Distance',
    address: 'Address',
    close: 'Close',
    cityPlaceholder: 'e.g. Gorakhpur, Mumbai, Delhi',
    note: '📍 Data from OpenStreetMap — Real branch locations',
  },
  bhojpuri: {
    title: 'नजदीकी बैंक शाखा खोजीं',
    selectBank: 'बैंक चुनीं',
    enterCity: 'शहर के नाम लिखीं',
    search: 'खोजीं',
    searching: '🔍 खोजत बा...',
    found: 'शाखा मिलल',
    noResults: 'एह शहर में शाखा नइखे मिलल।',
    visitWebsite: 'वेबसाइट पर देखीं',
    lowCoverage: 'एह बैंक के डेटा कम बा।',
    distance: 'दूरी',
    address: 'पता',
    close: 'बंद करीं',
    cityPlaceholder: 'जइसे: Gorakhpur, Mumbai',
    note: '📍 OpenStreetMap से असली डेटा',
  },
  awadhi: {
    title: 'नजदीकी बैंक शाखा खोजें',
    selectBank: 'बैंक चुनें',
    enterCity: 'शहर के नाम लिखें',
    search: 'खोजें',
    searching: '🔍 खोजत है...',
    found: 'शाखाएं मिलीं',
    noResults: 'एह शहर में शाखा नाहीं मिली।',
    visitWebsite: 'वेबसाइट पर देखें',
    lowCoverage: 'एह बैंक के डेटा कम है।',
    distance: 'दूरी',
    address: 'पता',
    close: 'बंद करें',
    cityPlaceholder: 'जैसे: Gorakhpur, Mumbai',
    note: '📍 OpenStreetMap से असली डेटा',
  },
};

// Geocode city name to coordinates using Nominatim (free, no key)
const geocodeCity = async (city) => {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city + ', India')}&format=json&limit=1`;
  const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
  const data = await res.json();
  if (data.length === 0) return null;
  return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), displayName: data[0].display_name };
};

// Query Overpass for bank branches near coordinates
const fetchBranches = async (osmName, lat, lon, city) => {
  // Use Nominatim search — much more reliable than Overpass
  const searchTerms = [osmName, osmName.split(' ')[0]];
  const allResults = [];

  for (const term of searchTerms) {
    const url = `https://nominatim.openstreetmap.org/search?` +
      `q=${encodeURIComponent(term + ' bank ' + city + ' India')}` +
      `&format=json&limit=10&addressdetails=1` +
      `&bounded=1&viewbox=${lon-0.5},${lat+0.5},${lon+0.5},${lat-0.5}`;

    const res = await fetch(url, {
      headers: { 'Accept-Language': 'en', 'User-Agent': 'FDSaathi/1.0' }
    });
    const data = await res.json();
    allResults.push(...data);
  }

  // Deduplicate by place_id
  const seen = new Set();
  const unique = allResults.filter((r) => {
    if (seen.has(r.place_id)) return false;
    seen.add(r.place_id);
    return true;
  });

  // Convert to our format
  return unique.map((r) => ({
    id: r.place_id,
    lat: parseFloat(r.lat),
    lon: parseFloat(r.lon),
    tags: {
      name: r.display_name.split(',')[0],
      'addr:full': r.display_name.split(',').slice(1, 3).join(',').trim(),
      phone: r.extratags?.phone,
    },
    distance: getDistance(lat, lon, parseFloat(r.lat), parseFloat(r.lon)),
  }));
};

// Calculate distance between two coordinates in km
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);
};

// Simple map using Leaflet (loaded via CDN)
const BranchMap = ({ branches, centerLat, centerLon, bankColor }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || branches.length === 0) return;

    // Load Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Load Leaflet JS
    const loadLeaflet = () => {
      if (window.L) {
        initMap();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = initMap;
      document.head.appendChild(script);
    };

    const initMap = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      const map = window.L.map(mapRef.current).setView([centerLat, centerLon], 13);
      mapInstanceRef.current = map;

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      // Add branch markers
      branches.forEach((branch) => {
        const lat = branch.lat || branch.center?.lat;
        const lon = branch.lon || branch.center?.lon;
        if (!lat || !lon) return;

        const icon = window.L.divIcon({
          html: `<div style="background:${bankColor};color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:14px;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);">🏦</div>`,
          className: '',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const address = branch.tags?.['addr:full'] ||
          [branch.tags?.['addr:street'], branch.tags?.['addr:city']].filter(Boolean).join(', ') ||
          'Address not available';

        window.L.marker([lat, lon], { icon })
          .bindPopup(`<b>${branch.tags?.name || 'Bank Branch'}</b><br>${address}`)
          .addTo(map);
      });

      // Center marker
      window.L.circleMarker([centerLat, centerLon], {
        radius: 8, color: '#dc2626', fillColor: '#dc2626', fillOpacity: 0.8,
      }).bindPopup('Your searched location').addTo(map);
    };

    loadLeaflet();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [branches, centerLat, centerLon, bankColor]);

  return (
    <div ref={mapRef} style={{
      width: '100%', height: '280px', borderRadius: '12px',
      overflow: 'hidden', border: '1px solid #e2e8f0',
      marginBottom: '14px',
    }} />
  );
};

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
const BranchFinder = ({ onClose, language = 'hindi' }) => {
  const t = UI_TEXT[language] || UI_TEXT.hindi;
  const [selectedBankId, setSelectedBankId] = useState('sbi');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState([]);
  const [center, setCenter] = useState(null);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const selectedBank = SEARCHABLE_BANKS.find((b) => b.id === selectedBankId);

  const handleSearch = async () => {
    if (!city.trim()) return;
    setLoading(true);
    setError('');
    setBranches([]);
    setSearched(false);

    try {
      // Step 1: Geocode the city
      const location = await geocodeCity(city);
      if (!location) {
        setError('शहर नहीं मिला। दूसरा नाम try करें।');
        setLoading(false);
        return;
      }
      setCenter(location);

      // Step 2: If low coverage SFB, skip Overpass
      if (selectedBank.coverage === 'low') {
        setBranches([]);
        setSearched(true);
        setLoading(false);
        return;
      }

      // Step 3: Fetch branches from Overpass
      const results = await fetchBranches(selectedBank.osmName, location.lat, location.lon, city);

      // Sort by distance
      const sorted = results
        .filter((b) => b.lat || b.center?.lat)
        .map((b) => ({
          ...b,
          distance: getDistance(location.lat, location.lon, b.lat || b.center?.lat, b.lon || b.center?.lon),
        }))
        .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

      setBranches(sorted);
      setSearched(true);
    } catch (e) {
      setError('Network error. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '12px',
    }}>
      <div style={{
        background: 'white', borderRadius: '20px',
        width: '100%', maxWidth: '540px',
        maxHeight: '92vh', overflowY: 'auto', padding: '24px',
      }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '17px', fontWeight: '700', color: '#1a6b3c' }}>
            📍 {t.title}
          </div>
          <button onClick={onClose} style={{
            width: '32px', height: '32px', background: '#f0f0f0',
            border: 'none', borderRadius: '50%', cursor: 'pointer', fontSize: '14px',
          }}>✕</button>
        </div>

        {/* Bank selector */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '6px' }}>{t.selectBank}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {SEARCHABLE_BANKS.map((bank) => (
              <button
                key={bank.id}
                onClick={() => setSelectedBankId(bank.id)}
                style={{
                  padding: '6px 10px', fontSize: '12px',
                  border: selectedBankId === bank.id ? `2px solid ${bank.color}` : '1px solid #e2e8f0',
                  borderRadius: '8px', cursor: 'pointer',
                  background: selectedBankId === bank.id ? `${bank.color}15` : 'white',
                  color: selectedBankId === bank.id ? bank.color : '#555',
                  fontWeight: selectedBankId === bank.id ? '700' : '400',
                }}
              >
                {language === 'english' ? bank.name : bank.nameHindi}
              </button>
            ))}
          </div>
        </div>

        {/* Coverage warning for SFBs */}
        {selectedBank.coverage === 'low' && (
          <div style={{
            padding: '10px 12px', background: '#fffbeb',
            border: '1px solid #f59e0b', borderRadius: '10px',
            fontSize: '12px', color: '#92400e', marginBottom: '12px',
          }}>
            ⚠️ {t.lowCoverage}
            {selectedBank.website && (
              <a href={selectedBank.website} target="_blank" rel="noopener noreferrer"
                style={{ display: 'block', color: '#1a6b3c', fontWeight: '600', marginTop: '4px' }}>
                🌐 {t.visitWebsite} →
              </a>
            )}
          </div>
        )}

        {/* City input + search */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={t.cityPlaceholder}
            style={{
              flex: 1, padding: '10px 14px',
              border: '2px solid #e2e8f0', borderRadius: '10px',
              fontSize: '14px', fontFamily: 'inherit',
            }}
          />
          <button
            onClick={handleSearch}
            disabled={loading || !city.trim()}
            style={{
              padding: '10px 18px', borderRadius: '10px', border: 'none',
              background: city.trim() ? 'linear-gradient(135deg, #1a6b3c, #2d9e5f)' : '#ccc',
              color: 'white', cursor: city.trim() ? 'pointer' : 'default',
              fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap',
            }}
          >
            {loading ? t.searching : t.search}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={{ padding: '10px', background: '#fee2e2', borderRadius: '10px', fontSize: '13px', color: '#dc2626', marginBottom: '12px' }}>
            ❌ {error}
          </div>
        )}

        {/* Map */}
        {center && branches.length > 0 && (
          <BranchMap
            branches={branches}
            centerLat={center.lat}
            centerLon={center.lon}
            bankColor={selectedBank.color}
          />
        )}

        {/* Results */}
        {searched && branches.length > 0 && (
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#1a6b3c', marginBottom: '10px' }}>
              🏦 {branches.length} {t.found}
            </div>
            {branches.slice(0, 8).map((branch, i) => {
              const lat = branch.lat || branch.center?.lat;
              const lon = branch.lon || branch.center?.lon;
              const address = branch.tags?.['addr:full'] ||
                [branch.tags?.['addr:street'], branch.tags?.['addr:housenumber'], branch.tags?.['addr:city']]
                  .filter(Boolean).join(', ') || 'Address on map';
              const phone = branch.tags?.phone || branch.tags?.['contact:phone'];

              return (
                <div key={branch.id} style={{
                  padding: '12px 14px', marginBottom: '8px',
                  background: i === 0 ? '#f0fdf4' : '#fafafa',
                  borderRadius: '10px',
                  border: i === 0 ? '1.5px solid #1a6b3c' : '1px solid #f0f0f0',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#2d3748', marginBottom: '2px' }}>
                        {i === 0 ? '📍 ' : ''}{branch.tags?.name || selectedBank.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>{address}</div>
                      {phone && <div style={{ fontSize: '11px', color: '#1a6b3c' }}>📞 {phone}</div>}
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '10px' }}>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#1a6b3c' }}>{branch.distance} km</div>
                      
                        <a href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}&zoom=17`}
                        target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: '10px', color: '#888', textDecoration: 'none' }}
                      >
                        🗺 Map
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* No results */}
        {searched && branches.length === 0 && selectedBank.coverage !== 'low' && (
          <div style={{ textAlign: 'center', padding: '24px', color: '#888' }}>
            <div style={{ fontSize: '36px', marginBottom: '10px' }}>🔍</div>
            <div style={{ fontSize: '14px', marginBottom: '8px' }}>{t.noResults}</div>
            <div style={{ fontSize: '12px' }}>Try searching a larger nearby city.</div>
          </div>
        )}

        {/* OSM attribution note */}
        <div style={{ fontSize: '11px', color: '#aaa', textAlign: 'center', marginTop: '16px' }}>
          {t.note}
        </div>
      </div>
    </div>
  );
};

export default BranchFinder;