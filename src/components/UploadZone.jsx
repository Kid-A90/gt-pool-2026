import { useRef, useState } from 'react';
import * as XLSX from 'xlsx';

export default function UploadZone({ onLoad, visible }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  if (!visible) return null;

  function parseWB(wb) {
    const nmap = {};
    if (wb.SheetNames.includes('NameMapping')) {
      XLSX.utils.sheet_to_json(wb.Sheets['NameMapping'], { header: 1, defval: '' })
        .slice(1)
        .forEach(r => { if (r[0] && r[1]) nmap[String(r[1]).trim()] = String(r[0]).trim(); });
    }

    const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1, defval: '' });

    // Auto-detect header row (first row containing "player" or "name")
    let hi = 0;
    for (let i = 0; i < Math.min(rows.length, 6); i++) {
      if (rows[i].map(c => String(c).toLowerCase()).some(c => c.includes('player') || c.includes('name'))) {
        hi = i;
        break;
      }
    }

    const entries = [];
    rows.slice(hi + 1).forEach(r => {
      const n = String(r[0] || '').trim();
      const a = String(r[1] || '').trim();
      const b = String(r[2] || '').trim();
      const c = String(r[3] || '').trim();
      const d = String(r[4] || '').trim();
      if (n && a && b && c && d) entries.push({ name: n, a, b, c, d });
    });

    return { entries, nmap };
  }

  function go(file) {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'binary' });
        const { entries, nmap } = parseWB(wb);
        if (!entries.length) {
          alert('No entries found. Expected: Player Name, A Golfer, B Golfer, C Golfer, D Golfer');
          return;
        }
        onLoad(entries, nmap);
      } catch (err) {
        alert('Could not read file: ' + err.message);
      }
    };
    reader.readAsBinaryString(file);
  }

  function onFile(e) {
    if (e.target.files[0]) go(e.target.files[0]);
  }

  function onDrop(e) {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files[0]) go(e.dataTransfer.files[0]);
  }

  return (
    <div
      className={`upz${dragging ? ' drag' : ''}`}
      onClick={() => inputRef.current.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
    >
      <div className="upz-ico">⛳</div>
      <h2>Upload Your Pool Entry Sheet</h2>
      <p>
        Drop the .xlsx entries file here or click to browse<br />
        Same format as previous years — Player Name · A Golfer · B Golfer · C Golfer · D Golfer
      </p>
      <button
        className="upz-btn"
        onClick={e => { e.stopPropagation(); inputRef.current.click(); }}
      >
        Choose File
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={onFile}
        style={{ display: 'none' }}
      />
    </div>
  );
}
