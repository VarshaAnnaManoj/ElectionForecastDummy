const fallbackConstituencies = [
  {
    district: "NORTHLAND", distAbbr: "NLD",
    constituency: "Frozen Peak",
    ldf: "Arun Kumar", udf: "Benjamin B.", nda: "Charlie C.",
    totalVoters: "215,000", votingPercent: "78.50%", polledVotes: "168,775"
  },
  {
    district: "NORTHLAND", distAbbr: "NLD",
    constituency: "River Run",
    ldf: "David Deep", udf: "Edward E.", nda: "Frank F.",
    totalVoters: "198,000", votingPercent: "82.10%", polledVotes: "162,558"
  },
  {
    district: "NORTHLAND", distAbbr: "NLD",
    constituency: "Iron Gate",
    ldf: "George G.", udf: "Harry H.", nda: "Ian I.",
    totalVoters: "205,500", votingPercent: "75.40%", polledVotes: "154,947"
  },
  {
    district: "WESTCOAST", distAbbr: "WCT",
    constituency: "Sandy Shores",
    ldf: "Jack Java", udf: "Kevin K.", nda: "Liam L.",
    totalVoters: "222,000", votingPercent: "80.80%", polledVotes: "179,376"
  },
  {
    district: "WESTCOAST", distAbbr: "WCT",
    constituency: "Ocean View",
    ldf: "Mike Macro", udf: "Noah N.", nda: "Oscar O.",
    totalVoters: "185,000", votingPercent: "74.20%", polledVotes: "137,270"
  },
  {
    district: "HIGHLANDS", distAbbr: "HLD",
    constituency: "Misty Mount",
    ldf: "Paul Ping", udf: "Quinn Q.", nda: "Ryan R.",
    totalVoters: "192,000", votingPercent: "79.90%", polledVotes: "153,408"
  },
  {
    district: "HIGHLANDS", distAbbr: "HLD",
    constituency: "Green Valley",
    ldf: "Sam Stack", udf: "Tom T.", nda: "Uma U.",
    totalVoters: "210,000", votingPercent: "81.40%", polledVotes: "170,940"
  },
  {
    district: "CENTRALIA", distAbbr: "CTL",
    constituency: "Metro Hub",
    ldf: "Victor Vector", udf: "Will W.", nda: "Xander X.",
    totalVoters: "241,000", votingPercent: "84.80%", polledVotes: "204,368"
  },
  {
    district: "CENTRALIA", distAbbr: "CTL",
    constituency: "Cyber City",
    ldf: "Yuvraj Yield", udf: "Zain Z.", nda: "Abe A.",
    totalVoters: "201,000", votingPercent: "70.00%", polledVotes: "140,700"
  },
  {
    district: "SOUTHVALE", distAbbr: "SVL",
    constituency: "Sunset Bay",
    ldf: "Bob Binary", udf: "Chris C.", nda: "Dan D.",
    totalVoters: "177,000", votingPercent: "73.60%", polledVotes: "130,272"
  }
];

const allconstList = document.getElementById('allconst-list');
const allconstCount = document.getElementById('allconst-count');
const miniPopup = document.getElementById('mini-popup');
const miniPopupTitle = document.getElementById('mini-popup-title');
const miniPopupContent = document.getElementById('mini-popup-content');
const miniPopupClose = document.getElementById('mini-popup-close');

let constituencies = [];

function clampShare(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return 0;
  }
  return Math.max(0, Math.min(100, parsed));
}

function openPopup(title, html) {
  miniPopupTitle.textContent = title;
  miniPopupContent.innerHTML = html;
  miniPopup.classList.remove('hidden');
  miniPopup.classList.add('open');
  miniPopup.setAttribute('aria-hidden', 'false');
}

function closePopup() {
  miniPopup.classList.add('hidden');
  miniPopup.classList.remove('open');
  miniPopup.setAttribute('aria-hidden', 'true');
}

function createRow(entry, index) {
  const row = document.createElement('article');
  row.className = 'allconst-row';

  row.innerHTML = `
    <div class="allconst-head">
      <div class="allconst-title-wrap">
        <h3>${entry.constituency}</h3>
        <p>${entry.distAbbr || entry.district} district</p>
      </div>
      <div class="allconst-actions">
        <button type="button" class="mini-icon-btn" data-kind="candidates" data-index="${index}" title="Candidates">i</button>
        <button type="button" class="mini-icon-btn" data-kind="voting" data-index="${index}" title="Voting details">v</button>
      </div>
    </div>

    <div class="allconst-grid">
      <div class="allconst-cell">
        <span class="allconst-label">District</span>
        <span class="allconst-value">${entry.district}</span>
      </div>
      <div class="allconst-cell">
        <span class="allconst-label">Constituency</span>
        <span class="allconst-value">${entry.constituency}</span>
      </div>
      <fieldset class="allconst-winner">
        <legend>Winner</legend>
        <label><input type="radio" name="winner-${index}" value="ldf" /> LDF</label>
        <label><input type="radio" name="winner-${index}" value="udf" /> UDF</label>
        <label><input type="radio" name="winner-${index}" value="nda" /> NDA</label>
      </fieldset>
    </div>

    <div class="allconst-margin">
      <label for="margin-${index}">Range Bar Margin</label>
      <output id="margin-value-${index}">0</output>
      <input id="margin-${index}" class="allconst-slider" type="range" min="0" max="75000" step="100" value="0" />
    </div>

    <div class="allconst-voteshare" aria-label="Enter vote share">
      <p>Please Enter Vote Share%</p>
      <div class="allconst-vote-grid">
        <label>LDF <input type="number" min="0" max="100" step="0.01" value="0" data-share="ldf" /></label>
        <label>UDF <input type="number" min="0" max="100" step="0.01" value="0" data-share="udf" /></label>
        <label>NDA <input type="number" min="0" max="100" step="0.01" value="0" data-share="nda" /></label>
        <label>Others <input type="number" min="0" max="100" step="0.01" value="100" data-share="others" /></label>
      </div>
    </div>
  `;

  const slider = row.querySelector(`#margin-${index}`);
  const output = row.querySelector(`#margin-value-${index}`);
  slider.addEventListener('input', () => {
    output.textContent = slider.value;
  });

  row.querySelectorAll('input[data-share]').forEach((input) => {
    input.addEventListener('change', () => {
      input.value = String(clampShare(input.value));
    });
  });

  row.querySelectorAll('.mini-icon-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const kind = button.getAttribute('data-kind');
      if (kind === 'candidates') {
        openPopup(`Candidates - ${entry.constituency}`, `
          <ul class="mini-popup-list">
            <li><strong>LDF:</strong> ${entry.ldf || 'N/A'}</li>
            <li><strong>UDF:</strong> ${entry.udf || 'N/A'}</li>
            <li><strong>NDA:</strong> ${entry.nda || 'N/A'}</li>
          </ul>
        `);
      } else {
        openPopup(`Voting Details - ${entry.constituency}`, `
          <ul class="mini-popup-list">
            <li><strong>Total Voters:</strong> ${entry.totalVoters || 'N/A'}</li>
            <li><strong>Voting %:</strong> ${entry.votingPercent || 'N/A'}</li>
            <li><strong>Polled Votes:</strong> ${entry.polledVotes || 'N/A'}</li>
          </ul>
        `);
      }
    });
  });

  return row;
}

function renderAllConstituencies() {
  allconstList.innerHTML = '';
  allconstCount.textContent = `${constituencies.length} rows`;

  constituencies.forEach((entry, index) => {
    allconstList.appendChild(createRow(entry, index));
  });
}

async function loadConstituencies() {
  try {
    const response = await fetch('/api/constituencies', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    constituencies = await response.json();
  } catch (error) {
    console.warn('Backend unavailable, using fallback data.', error);
    constituencies = fallbackConstituencies;
  }

  renderAllConstituencies();
}

miniPopupClose.addEventListener('click', closePopup);
miniPopup.addEventListener('click', (event) => {
  if (event.target === miniPopup) {
    closePopup();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && miniPopup.classList.contains('open')) {
    closePopup();
  }
});

loadConstituencies();
