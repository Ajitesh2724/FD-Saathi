import { useState } from 'react';

// ── Design tokens (match ChatWindow) ─────────────────────────────────────────
const C = {
  bg:         '#0a120a',
  surface:    'rgba(255,255,255,0.04)',
  surfaceHi:  'rgba(255,255,255,0.07)',
  border:     'rgba(74,222,128,0.12)',
  borderHi:   'rgba(74,222,128,0.3)',
  green:      '#4ade80',
  greenDim:   'rgba(74,222,128,0.65)',
  greenBg:    'rgba(74,222,128,0.1)',
  gradGreen:  'linear-gradient(135deg,#14532d,#16a34a)',
  text:       'rgba(255,255,255,0.85)',
  textDim:    'rgba(255,255,255,0.45)',
  textMuted:  'rgba(255,255,255,0.25)',
  amber:      '#fbbf24',
  amberBg:    'rgba(251,191,36,0.08)',
  amberBorder:'rgba(251,191,36,0.25)',
  red:        '#f87171',
  redBg:      'rgba(248,113,113,0.08)',
};

// ── BANK DATA ─────────────────────────────────────────────────────────────────
const SEARCHABLE_BANKS = [
  { id:'sbi',      name:'State Bank of India',          nameHindi:'स्टेट बैंक',       osmName:'State Bank of India',          color:'#60a5fa', coverage:'high',   phone:'1800 1234',        email:'customercare@sbi.co.in',                   website:'https://www.sbi.co.in',              website_locator:'https://www.sbi.co.in/web/branch-atm-locator' },
  { id:'pnb',      name:'Punjab National Bank',         nameHindi:'पंजाब नेशनल बैंक', osmName:'Punjab National Bank',         color:'#f87171', coverage:'high',   phone:'1800 180 2222',    email:'care@pnb.co.in',                           website:'https://www.pnbindia.in',            website_locator:'https://www.pnbindia.in/locateus.html' },
  { id:'bob',      name:'Bank of Baroda',               nameHindi:'बैंक ऑफ बड़ौदा',  osmName:'Bank of Baroda',               color:'#fb923c', coverage:'high',   phone:'1800 5700',        email:'customercare@bankofbaroda.com',            website:'https://www.bankofbaroda.in',         website_locator:'https://www.bankofbaroda.in/branch-and-atm-locator' },
  { id:'hdfc',     name:'HDFC Bank',                    nameHindi:'HDFC बैंक',         osmName:'HDFC Bank',                    color:'#818cf8', coverage:'high',   phone:'1800 202 6161',    email:'support@hdfcbank.com',                     website:'https://www.hdfcbank.com',            website_locator:'https://www.hdfcbank.com/content/bbp/repositories/723fb80a-2dde-42a3-9793-7ae1be57c87f/?folderPath=/branch-locator/' },
  { id:'icici',    name:'ICICI Bank',                   nameHindi:'ICICI बैंक',        osmName:'ICICI Bank',                   color:'#f87171', coverage:'high',   phone:'1800 1080',        email:'customer.care@icicibank.com',              website:'https://www.icicibank.com',           website_locator:'https://www.icicibank.com/branch-atm' },
  { id:'axis',     name:'Axis Bank',                    nameHindi:'एक्सिस बैंक',      osmName:'Axis Bank',                    color:'#e879f9', coverage:'high',   phone:'1800 419 5959',    email:'support@axisbank.com',                     website:'https://www.axisbank.com',            website_locator:'https://www.axisbank.com/locate-us' },
  { id:'canara',   name:'Canara Bank',                  nameHindi:'केनरा बैंक',        osmName:'Canara Bank',                  color:'#4ade80', coverage:'high',   phone:'1800 425 0018',    email:'ho_complaints@canarabank.com',             website:'https://www.canarabank.in',           website_locator:'https://www.canarabank.in/User_page.aspx?menuid=9&submenu=59' },
  { id:'union',    name:'Union Bank',                   nameHindi:'यूनियन बैंक',       osmName:'Union Bank of India',          color:'#fb923c', coverage:'medium', phone:'1800 22 2244',     email:'unionbankcustomercare@unionbankofindia.com', website:'https://www.unionbankofindia.co.in', website_locator:'https://www.unionbankofindia.co.in/english/branch.aspx' },
  { id:'bandhan',  name:'Bandhan Bank',                 nameHindi:'बंधन बैंक',         osmName:'Bandhan Bank',                 color:'#a78bfa', coverage:'medium', phone:'1800 258 8181',    email:'care@bandhanbank.com',                     website:'https://www.bandhanbank.com',         website_locator:'https://www.bandhanbank.com/branch-atm-locator' },
  { id:'kotak',    name:'Kotak Bank',                   nameHindi:'कोटक बैंक',         osmName:'Kotak Mahindra Bank',          color:'#fb923c', coverage:'medium', phone:'1860 266 2666',    email:'service.delivery@kotak.com',               website:'https://www.kotak.com',               website_locator:'https://www.kotak.com/en/personal-banking/tools-and-calculators/branch-atm-locator.html' },
  { id:'suryoday', name:'Suryoday SFB',                 nameHindi:'सूर्योदय SFB',      osmName:'Suryoday Small Finance Bank',  color:'#4ade80', coverage:'low',    phone:'1800 266 7711',    email:'customercare@suryodaybank.com',            website:'https://www.suryodaybank.com',         website_locator:'https://www.suryodaybank.com/branch-locator' },
  { id:'ujjivan',  name:'Ujjivan SFB',                  nameHindi:'उज्जीवन SFB',       osmName:'Ujjivan Small Finance Bank',   color:'#60a5fa', coverage:'low',    phone:'1800 208 2121',    email:'support@ujjivansfb.in',                    website:'https://www.ujjivansfb.in',           website_locator:'https://www.ujjivansfb.in/branch-atm-locator' },
  { id:'au',       name:'AU SFB',                       nameHindi:'AU SFB',             osmName:'AU Small Finance Bank',        color:'#f87171', coverage:'low',    phone:'1800 1200 1500',   email:'cs@aubank.in',                             website:'https://www.aubank.in',               website_locator:'https://www.aubank.in/branch-atm-locator' },
  { id:'utkarsh',  name:'Utkarsh SFB',                  nameHindi:'उत्कर्ष SFB',       osmName:'Utkarsh Small Finance Bank',   color:'#4ade80', coverage:'low',    phone:'1800 123 0060',    email:'customercare@utkarshbank.com',             website:'https://www.utkarshbank.com',         website_locator:'https://www.utkarshbank.com/branch-atm-locator' },
  { id:'jana',     name:'Jana SFB',                     nameHindi:'जना SFB',            osmName:'Jana Small Finance Bank',      color:'#a78bfa', coverage:'low',    phone:'1800 2080 2020',   email:'customercare@janabank.in',                 website:'https://www.janabank.in',             website_locator:'https://www.janabank.in/branch-locator' },
];

const FD_DOCUMENTS = {
  hindi:   { title:'FD खोलने के लिए जरूरी दस्तावेज', identity:{label:'🪪 पहचान प्रमाण (कोई एक)',items:['आधार कार्ड','पैन कार्ड','वोटर ID','पासपोर्ट','ड्राइविंग लाइसेंस']}, address:{label:'🏠 पते का प्रमाण (कोई एक)',items:['आधार कार्ड','बिजली/पानी का बिल (3 महीने से पुराना नहीं)','बैंक स्टेटमेंट','राशन कार्ड']}, photo:{label:'📷 फोटो',items:['2 पासपोर्ट साइज फोटो']}, pan:{label:'⚠️ पैन कार्ड (जरूरी)',items:['₹50,000 से ज्यादा की FD के लिए पैन अनिवार्य','पैन न होने पर फॉर्म 60/61 भरना होगा']}, note:'💡 पहले से खाता है तो — सिर्फ पैन + फोटो से भी हो सकता है।' },
  english: { title:'Documents Required to Open FD', identity:{label:'🪪 Identity Proof (any one)',items:['Aadhaar Card','PAN Card','Voter ID','Passport','Driving Licence']}, address:{label:'🏠 Address Proof (any one)',items:['Aadhaar Card','Electricity/Water Bill (max 3 months old)','Bank Statement','Ration Card']}, photo:{label:'📷 Photograph',items:['2 Passport Size Photos']}, pan:{label:'⚠️ PAN Card (mandatory)',items:['PAN required for FDs above ₹50,000','Without PAN, Form 60/61 must be submitted']}, note:'💡 Existing account holders may only need PAN + photo — confirm with your branch.' },
  bhojpuri:{ title:'FD खोले खातिर कागज', identity:{label:'🪪 पहचान पत्र (कवनो एक)',items:['आधार कार्ड','पैन कार्ड','वोटर ID','पासपोर्ट','ड्राइविंग लाइसेंस']}, address:{label:'🏠 पता प्रमाण (कवनो एक)',items:['आधार कार्ड','बिजली/पानी के बिल','बैंक स्टेटमेंट','राशन कार्ड']}, photo:{label:'📷 फोटो',items:['2 पासपोर्ट साइज फोटो']}, pan:{label:'⚠️ पैन कार्ड (जरूरी बा)',items:['₹50,000 से ऊपर के FD खातिर पैन जरूरी','नइखे त फॉर्म 60/61 भरे के पड़ी']}, note:'💡 पहिले से खाता बा त — सिर्फ पैन + फोटो से काम चल सकेला।' },
  awadhi:  { title:'FD खोलवाए के कागज', identity:{label:'🪪 पहचान पत्र (कोई एक)',items:['आधार कार्ड','पैन कार्ड','वोटर ID','पासपोर्ट','ड्राइविंग लाइसेंस']}, address:{label:'🏠 पते का प्रमाण (कोई एक)',items:['आधार कार्ड','बिजली/पानी का बिल','बैंक स्टेटमेंट','राशन कार्ड']}, photo:{label:'📷 फोटो',items:['2 पासपोर्ट साइज फोटो']}, pan:{label:'⚠️ पैन कार्ड (जरूरी)',items:['₹50,000 से ऊपर के FD खातिर पैन जरूरी','नाय है त फॉर्म 60/61 भरे के परी']}, note:'💡 पहले से खाता बा त — सिर्फ पैन + फोटो काफी हो सकत है।' },
};

const UI_TEXT = {
  hindi:   { title:'नजदीकी बैंक शाखा खोजें', selectBank:'बैंक चुनें', enterCity:'शहर का नाम', search:'खोजें', searching:'खोज रहा है...', found:'शाखाएं मिलीं', noResults:'इस शहर में शाखा नहीं मिली। नीचे आधिकारिक लोकेटर देखें।', visitWebsite:'आधिकारिक Branch Locator', nearest:'📍 सबसे नजदीक', km:'किमी दूर', directionsLabel:'Google Maps में देखें', allBranches:'सभी शाखाएं देखें', hideBranches:'छुपाएं', docs:'जरूरी दस्तावेज', hideDocs:'दस्तावेज छुपाएं', close:'बंद करें', cityPlaceholder:'जैसे: Gorakhpur, Lucknow, Delhi', helpline:'हेल्पलाइन', lowCoverage:'इस बैंक की शाखाएं हमारे डेटाबेस में कम हैं। आधिकारिक लोकेटर इस्तेमाल करें:', selected:'✅ चुनी हुई शाखा' },
  english: { title:'Find Nearest Bank Branch', selectBank:'Select Bank', enterCity:'City Name', search:'Search', searching:'Searching...', found:'branches found', noResults:'No branches found in this city. Use the official branch locator below.', visitWebsite:'Official Branch Locator', nearest:'📍 Nearest', km:'km away', directionsLabel:'Open in Google Maps', allBranches:'Show All Branches', hideBranches:'Hide', docs:'Required Documents', hideDocs:'Hide Documents', close:'Close', cityPlaceholder:'e.g. Gorakhpur, Mumbai, Delhi', helpline:'Helpline', lowCoverage:'Limited branch data for this bank. Please use the official locator:', selected:'✅ Selected' },
  bhojpuri:{ title:'नजदीकी बैंक शाखा खोजीं', selectBank:'बैंक चुनीं', enterCity:'शहर के नाम', search:'खोजीं', searching:'खोजत बा...', found:'शाखा मिलल', noResults:'एह शहर में शाखा नइखे।', visitWebsite:'ऑफिशियल Branch Locator', nearest:'📍 सबसे नजदीक', km:'किमी दूर', directionsLabel:'Google Maps में देखीं', allBranches:'सभ शाखा देखीं', hideBranches:'छुपाईं', docs:'जरूरी कागज', hideDocs:'कागज छुपाईं', close:'बंद करीं', cityPlaceholder:'जइसे: Gorakhpur, Lucknow', helpline:'हेल्पलाइन', lowCoverage:'एह बैंक के शाखा डेटा कम बा।', selected:'✅ चुनल शाखा' },
  awadhi:  { title:'नजदीकी बैंक शाखा खोजें', selectBank:'बैंक चुनें', enterCity:'शहर के नाम', search:'खोजें', searching:'खोजत है...', found:'शाखाएं मिलीं', noResults:'एह शहर में शाखा नाहीं मिली।', visitWebsite:'ऑफिशियल Branch Locator', nearest:'📍 सबसे नजदीक', km:'किमी दूर', directionsLabel:'Google Maps में देखें', allBranches:'सभ शाखा देखें', hideBranches:'छुपाएं', docs:'जरूरी दस्तावेज', hideDocs:'दस्तावेज छुपाएं', close:'बंद करें', cityPlaceholder:'जैसे: Gorakhpur, Lucknow', helpline:'हेल्पलाइन', lowCoverage:'एह बैंक के शाखा डेटा कम है।', selected:'✅ चुनी हुई शाखा' },
};

// ── UTILITIES ─────────────────────────────────────────────────────────────────
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371, dLat = ((lat2-lat1)*Math.PI)/180, dLon = ((lon2-lon1)*Math.PI)/180;
  const a = Math.sin(dLat/2)**2 + Math.cos((lat1*Math.PI)/180)*Math.cos((lat2*Math.PI)/180)*Math.sin(dLon/2)**2;
  return (R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a))).toFixed(1);
};

const geocodeCity = async (city) => {
  const res  = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city+', India')}&format=json&limit=1`, { headers:{'Accept-Language':'en','User-Agent':'FDSaathi/1.0'} });
  const data = await res.json();
  if (!data.length) return null;
  return { lat:parseFloat(data[0].lat), lon:parseFloat(data[0].lon) };
};

const fetchBranchesOverpass = async (osmName, lat, lon) => {
  const q = `[out:json][timeout:20];(node["name"~"${osmName}",i]["amenity"="bank"](around:20000,${lat},${lon});way["name"~"${osmName}",i]["amenity"="bank"](around:20000,${lat},${lon}););out body center;`;
  const res = await fetch('https://overpass-api.de/api/interpreter',{method:'POST',body:q});
  return (await res.json()).elements || [];
};

const fetchBranchesNominatim = async (osmName, city, lat, lon) => {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(osmName+' '+city+' India')}&format=json&limit=12&addressdetails=1&extratags=1&bounded=1&viewbox=${lon-0.6},${lat+0.6},${lon+0.6},${lat-0.6}`;
  const res  = await fetch(url,{headers:{'Accept-Language':'en','User-Agent':'FDSaathi/1.0'}});
  const data = await res.json();
  return data.map((r) => ({ id:r.place_id, lat:parseFloat(r.lat), lon:parseFloat(r.lon), name:r.display_name.split(',')[0], address:r.display_name.split(',').slice(1,4).join(', ').trim(), phone:r.extratags?.phone||r.extratags?.['contact:phone']||null }));
};

const normalizeBranches = (elements, cLat, cLon) =>
  elements.map((el) => {
    const lat = el.lat||el.center?.lat, lon = el.lon||el.center?.lon;
    if (!lat||!lon) return null;
    const tags = el.tags||{};
    const addr = [tags['addr:housenumber'],tags['addr:street'],tags['addr:suburb'],tags['addr:city']].filter(Boolean);
    return { id:el.id, lat, lon, name:tags.name||tags['name:en']||'', address:addr.length?addr.join(', '):null, phone:tags.phone||tags['contact:phone']||tags['contact:mobile']||null, opening_hours:tags.opening_hours||null, distance:parseFloat(getDistance(cLat,cLon,lat,lon)) };
  }).filter(Boolean).sort((a,b)=>a.distance-b.distance);

// ── DOCUMENTS PANEL ───────────────────────────────────────────────────────────
const DocumentsPanel = ({ language }) => {
  const docs = FD_DOCUMENTS[language] || FD_DOCUMENTS.hindi;
  return (
    <div style={{ background:C.surface, border:`1px solid ${C.borderHi}`, borderRadius:'14px', padding:'16px', marginTop:'12px' }}>
      <div style={{ fontSize:'13px', fontWeight:'700', color:C.green, marginBottom:'12px' }}>📋 {docs.title}</div>
      {[docs.identity, docs.address, docs.photo, docs.pan].map((section) => (
        <div key={section.label} style={{ marginBottom:'10px' }}>
          <div style={{ fontSize:'12px', fontWeight:'600', color:C.text, marginBottom:'5px' }}>{section.label}</div>
          <div style={{ paddingLeft:'8px' }}>
            {section.items.map((item) => (
              <div key={item} style={{ fontSize:'12px', color:C.textDim, padding:'2px 0', display:'flex', alignItems:'flex-start', gap:'6px' }}>
                <span style={{ color:C.green, marginTop:'1px', flexShrink:0 }}>•</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div style={{ marginTop:'8px', padding:'9px 11px', background:C.amberBg, border:`1px solid ${C.amberBorder}`, borderRadius:'8px', fontSize:'11px', color:C.amber, lineHeight:1.5 }}>
        {docs.note}
      </div>
    </div>
  );
};

// ── BRANCH CARD ───────────────────────────────────────────────────────────────
const BranchCard = ({ branch, index, isSelected, onSelect, bankColor, t }) => {
  const isNearest = index === 0;
  const mapsUrl   = `https://www.google.com/maps/search/?api=1&query=${branch.lat},${branch.lon}`;

  return (
    <div onClick={() => onSelect(branch)} style={{
      padding:'14px', marginBottom:'8px', cursor:'pointer', borderRadius:'12px',
      background: isSelected ? `${bankColor}15` : isNearest ? C.greenBg : C.surface,
      border: isSelected ? `1.5px solid ${bankColor}` : isNearest ? `1.5px solid ${C.borderHi}` : `1px solid ${C.border}`,
      transition:'all 0.15s',
    }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'10px' }}>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'6px', flexWrap:'wrap', marginBottom:'4px' }}>
            {isNearest && !isSelected && (
              <span style={{ fontSize:'10px', background:C.greenBg, color:C.green, border:`1px solid ${C.borderHi}`, padding:'2px 7px', borderRadius:'5px', flexShrink:0 }}>{t.nearest}</span>
            )}
            {isSelected && (
              <span style={{ fontSize:'10px', background:`${bankColor}20`, color:bankColor, border:`1px solid ${bankColor}50`, padding:'2px 7px', borderRadius:'5px', flexShrink:0 }}>{t.selected}</span>
            )}
          </div>
          <div style={{ fontSize:'13px', fontWeight:'600', color:C.text, marginBottom:'3px' }}>{branch.name || 'Branch'}</div>
          {branch.address
            ? <div style={{ fontSize:'11px', color:C.textDim, lineHeight:1.4 }}>📍 {branch.address}</div>
            : <div style={{ fontSize:'11px', color:C.textMuted }}>📍 Address not listed in OpenStreetMap</div>
          }
          {branch.phone && (
            <a href={`tel:${branch.phone.replace(/\s/g,'')}`} onClick={(e)=>e.stopPropagation()} style={{ fontSize:'11px', color:C.green, textDecoration:'none', display:'block', marginTop:'3px' }}>
              📞 {branch.phone}
            </a>
          )}
          {branch.opening_hours && (
            <div style={{ fontSize:'10px', color:C.textDim, marginTop:'2px' }}>🕐 {branch.opening_hours}</div>
          )}
        </div>
        <div style={{ textAlign:'right', flexShrink:0 }}>
          <div style={{ fontSize:'18px', fontWeight:'800', color:bankColor, fontVariantNumeric:'tabular-nums' }}>{branch.distance}</div>
          <div style={{ fontSize:'10px', color:C.textMuted, marginBottom:'6px' }}>{t.km}</div>
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer" onClick={(e)=>e.stopPropagation()} style={{ fontSize:'10px', color:'white', background:bankColor, padding:'4px 8px', borderRadius:'6px', textDecoration:'none', display:'inline-block', whiteSpace:'nowrap' }}>
            🗺 Maps
          </a>
        </div>
      </div>
    </div>
  );
};

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
const BranchFinder = ({ onClose, language = 'hindi' }) => {
  const t = UI_TEXT[language] || UI_TEXT.hindi;
  const [selectedBankId, setSelectedBankId] = useState('sbi');
  const [city, setCity]               = useState('');
  const [loading, setLoading]         = useState(false);
  const [branches, setBranches]       = useState([]);
  const [searched, setSearched]       = useState(false);
  const [error, setError]             = useState('');
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [showAllBranches, setShowAllBranches] = useState(false);
  const [showDocs, setShowDocs]       = useState(false);

  const selectedBank = SEARCHABLE_BANKS.find((b) => b.id === selectedBankId);

  const handleBankChange = (id) => {
    setSelectedBankId(id); setBranches([]); setSearched(false);
    setSelectedBranch(null); setError(''); setShowAllBranches(false);
  };

  const handleSearch = async () => {
    if (!city.trim()) return;
    setLoading(true); setError(''); setBranches([]); setSearched(false); setSelectedBranch(null); setShowAllBranches(false);
    try {
      const location = await geocodeCity(city);
      if (!location) {
        setError(language==='english' ? 'City not found. Try a different spelling.' : 'शहर नहीं मिला। दूसरा नाम try करें।');
        setLoading(false); return;
      }
      if (selectedBank.coverage === 'low') { setBranches([]); setSearched(true); setLoading(false); return; }

      let results = [];
      try {
        const raw = await fetchBranchesOverpass(selectedBank.osmName, location.lat, location.lon);
        results = normalizeBranches(raw, location.lat, location.lon);
      } catch { /* fallthrough to Nominatim */ }

      if (results.length === 0) {
        const nom = await fetchBranchesNominatim(selectedBank.osmName, city, location.lat, location.lon);
        results = nom.map((r)=>({...r, distance:parseFloat(getDistance(location.lat,location.lon,r.lat,r.lon))})).sort((a,b)=>a.distance-b.distance);
      }

      setBranches(results); setSelectedBranch(results[0]||null); setSearched(true);
    } catch {
      setError(language==='english' ? 'Network error. Please check your connection.' : 'नेटवर्क की दिक्कत। कनेक्शन जांचें।');
    } finally {
      setLoading(false);
    }
  };

  const displayedBranches = showAllBranches ? branches.slice(0,10) : branches.slice(0,1);

  const inputStyle = {
    flex:1, padding:'11px 14px',
    background:C.surface, border:`1px solid ${C.border}`,
    borderRadius:'10px', fontSize:'14px',
    fontFamily:"'DM Sans','Noto Sans Devanagari',sans-serif",
    color:C.text, outline:'none',
  };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:'12px' }}>
      <div style={{
        background:'#0a120a', borderRadius:'20px',
        width:'100%', maxWidth:'540px', maxHeight:'92vh', overflowY:'auto',
        padding:'24px', border:`1px solid ${C.borderHi}`,
        boxShadow:'0 0 60px rgba(74,222,128,0.08)',
        fontFamily:"'DM Sans','Noto Sans Devanagari',sans-serif",
        color:C.text,
      }}>

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
          <div style={{ fontSize:'17px', fontWeight:'700', color:C.green }}>🏦 {t.title}</div>
          <button onClick={onClose} style={{ width:'32px', height:'32px', background:C.surface, border:`1px solid ${C.border}`, borderRadius:'50%', cursor:'pointer', fontSize:'14px', color:C.textDim }}>✕</button>
        </div>

        {/* Bank selector pills */}
        <div style={{ marginBottom:'16px' }}>
          <div style={{ fontSize:'11px', color:C.textDim, marginBottom:'8px', textTransform:'uppercase', letterSpacing:'0.8px' }}>{t.selectBank}</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
            {SEARCHABLE_BANKS.map((bank) => {
              const active = selectedBankId === bank.id;
              return (
                <button key={bank.id} onClick={() => handleBankChange(bank.id)} style={{
                  padding:'6px 11px', fontSize:'12px', borderRadius:'8px', cursor:'pointer',
                  border: active ? `1.5px solid ${bank.color}` : `1px solid ${C.border}`,
                  background: active ? `${bank.color}18` : C.surface,
                  color: active ? bank.color : C.textDim,
                  fontWeight: active ? '700' : '400',
                  fontFamily:'inherit', transition:'all 0.15s',
                }}>
                  {language === 'english' ? bank.name : bank.nameHindi}
                </button>
              );
            })}
          </div>
        </div>

        {/* City search row */}
        <div style={{ display:'flex', gap:'8px', marginBottom:'14px' }}>
          <input
            value={city} onChange={(e)=>setCity(e.target.value)}
            onKeyDown={(e)=>e.key==='Enter'&&handleSearch()}
            placeholder={t.cityPlaceholder}
            style={inputStyle}
          />
          <button onClick={handleSearch} disabled={loading||!city.trim()} style={{
            padding:'11px 20px', borderRadius:'10px', border:'none',
            background: city.trim()&&!loading ? `linear-gradient(135deg,${selectedBank.color}cc,${selectedBank.color})` : 'rgba(255,255,255,0.06)',
            color: city.trim()&&!loading ? 'white' : C.textMuted,
            cursor: city.trim()&&!loading ? 'pointer' : 'default',
            fontSize:'14px', fontWeight:'600', whiteSpace:'nowrap', minWidth:'80px', fontFamily:'inherit',
          }}>{loading ? '⏳' : t.search}</button>
        </div>

        {/* Searching */}
        {loading && (
          <div style={{ textAlign:'center', padding:'24px', color:C.greenDim, fontSize:'14px' }}>
            <div style={{ fontSize:'28px', marginBottom:'8px' }}>🔍</div>
            {t.searching}
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ padding:'10px 12px', background:C.redBg, border:'1px solid rgba(248,113,113,0.2)', borderRadius:'10px', fontSize:'13px', color:C.red, marginBottom:'12px' }}>
            ❌ {error}
          </div>
        )}

        {/* Low coverage notice */}
        {searched && selectedBank.coverage === 'low' && (
          <div style={{ padding:'14px', background:C.amberBg, border:`1px solid ${C.amberBorder}`, borderRadius:'12px', marginBottom:'12px' }}>
            <div style={{ fontSize:'13px', color:C.amber, marginBottom:'10px' }}>⚠️ {t.lowCoverage}</div>
            <a href={selectedBank.website_locator} target="_blank" rel="noopener noreferrer" style={{ display:'inline-block', padding:'8px 14px', background:`${selectedBank.color}25`, color:selectedBank.color, border:`1px solid ${selectedBank.color}50`, borderRadius:'8px', textDecoration:'none', fontSize:'13px', fontWeight:'600' }}>
              🌐 {t.visitWebsite} →
            </a>
          </div>
        )}

        {/* Results header */}
        {searched && branches.length > 0 && (
          <div>
            <div style={{ fontSize:'13px', fontWeight:'600', color:C.green, marginBottom:'10px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span>🏦 {branches.length} {t.found}</span>
              {branches.length > 1 && (
                <button onClick={()=>setShowAllBranches((v)=>!v)} style={{ fontSize:'12px', color:selectedBank.color, background:`${selectedBank.color}15`, border:`1px solid ${selectedBank.color}40`, borderRadius:'7px', padding:'4px 10px', cursor:'pointer', fontWeight:'500', fontFamily:'inherit' }}>
                  {showAllBranches ? t.hideBranches : `${t.allBranches} (${branches.length})`}
                </button>
              )}
            </div>
            {displayedBranches.map((branch, i) => (
              <BranchCard key={branch.id} branch={branch} index={branches.indexOf(branch)} isSelected={selectedBranch?.id===branch.id} onSelect={setSelectedBranch} bankColor={selectedBank.color} t={t} />
            ))}
          </div>
        )}

        {/* No results */}
        {searched && branches.length===0 && selectedBank.coverage!=='low' && (
          <div style={{ textAlign:'center', padding:'24px', color:C.textDim }}>
            <div style={{ fontSize:'32px', marginBottom:'8px' }}>🔍</div>
            <div style={{ fontSize:'14px', marginBottom:'12px' }}>{t.noResults}</div>
            <a href={selectedBank.website_locator||selectedBank.website} target="_blank" rel="noopener noreferrer" style={{ display:'inline-block', padding:'8px 16px', background:C.greenBg, color:C.green, border:`1px solid ${C.borderHi}`, borderRadius:'8px', textDecoration:'none', fontSize:'13px', fontWeight:'600' }}>
              🌐 {t.visitWebsite} →
            </a>
          </div>
        )}

        {/* Bank contact card */}
        <div style={{ marginTop:'16px', padding:'14px', background:`${selectedBank.color}0d`, border:`1px solid ${selectedBank.color}30`, borderRadius:'12px' }}>
          <div style={{ fontSize:'13px', fontWeight:'700', color:selectedBank.color, marginBottom:'8px' }}>
            {language==='english' ? selectedBank.name : selectedBank.nameHindi} — {t.helpline}
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'12px', alignItems:'center' }}>
            <a href={`tel:${selectedBank.phone}`} style={{ display:'flex', alignItems:'center', gap:'5px', fontSize:'13px', color:C.green, textDecoration:'none', fontWeight:'600' }}>
              📞 {selectedBank.phone}
            </a>
            <a href={`mailto:${selectedBank.email}`} style={{ display:'flex', alignItems:'center', gap:'5px', fontSize:'12px', color:C.textDim, textDecoration:'none' }}>
              ✉️ {selectedBank.email}
            </a>
          </div>
          <a href={selectedBank.website} target="_blank" rel="noopener noreferrer" style={{ fontSize:'11px', color:C.textMuted, display:'block', marginTop:'5px' }}>
            🌐 {selectedBank.website}
          </a>
        </div>

        {/* Documents toggle */}
        <button onClick={()=>setShowDocs((v)=>!v)} style={{
          marginTop:'12px', width:'100%', padding:'12px',
          background: showDocs ? C.gradGreen : C.surface,
          color: showDocs ? 'white' : C.green,
          border: `1px solid ${showDocs ? 'rgba(74,222,128,0.4)' : C.borderHi}`,
          borderRadius:'12px', fontSize:'14px', fontWeight:'600', cursor:'pointer',
          fontFamily:'inherit', transition:'all 0.2s',
        }}>
          📋 {showDocs ? t.hideDocs : t.docs}
        </button>

        {showDocs && <DocumentsPanel language={language} />}

        {/* Close */}
        <button onClick={onClose} style={{ marginTop:'10px', width:'100%', padding:'12px', background:C.surface, color:C.textDim, border:`1px solid ${C.border}`, borderRadius:'12px', fontSize:'14px', fontWeight:'500', cursor:'pointer', fontFamily:'inherit' }}>
          {t.close}
        </button>
      </div>
    </div>
  );
};

export default BranchFinder;
