const constituencies = [
  {
    district: "NORTHLAND",
    constituency: "Frozen Peak",
    ldf: "Arun Kumar",
    udf: "Benjamin B.",
    nda: "Charlie C.",
    totalVoters: "215,000",
    votingPercent: "78.50%",
    polledVotes: "168,775"
  },
  {
    district: "NORTHLAND",
    constituency: "River Run",
    ldf: "David Deep",
    udf: "Edward E.",
    nda: "Frank F.",
    totalVoters: "198,000",
    votingPercent: "82.10%",
    polledVotes: "162,558"
  },
  {
    district: "NORTHLAND",
    constituency: "Iron Gate",
    ldf: "George G.",
    udf: "Harry H.",
    nda: "Ian I.",
    totalVoters: "205,500",
    votingPercent: "75.40%",
    polledVotes: "154,947"
  },
  {
    district: "WESTCOAST",
    constituency: "Sandy Shores",
    ldf: "Jack Java",
    udf: "Kevin K.",
    nda: "Liam L.",
    totalVoters: "222,000",
    votingPercent: "80.80%",
    polledVotes: "179,376"
  },
  {
    district: "WESTCOAST",
    constituency: "Ocean View",
    ldf: "Mike Macro",
    udf: "Noah N.",
    nda: "Oscar O.",
    totalVoters: "185,000",
    votingPercent: "74.20%",
    polledVotes: "137,270"
  },
  {
    district: "HIGHLANDS",
    constituency: "Misty Mount",
    ldf: "Paul Ping",
    udf: "Quinn Q.",
    nda: "Ryan R.",
    totalVoters: "192,000",
    votingPercent: "79.90%",
    polledVotes: "153,408"
  },
  {
    district: "HIGHLANDS",
    constituency: "Green Valley",
    ldf: "Sam Stack",
    udf: "Tom T.",
    nda: "Uma U.",
    totalVoters: "210,000",
    votingPercent: "81.40%",
    polledVotes: "170,940"
  },
  {
    district: "CENTRALIA",
    constituency: "Metro Hub",
    ldf: "Victor Vector",
    udf: "Will W.",
    nda: "Xander X.",
    totalVoters: "241,000",
    votingPercent: "84.80%",
    polledVotes: "204,368"
  },
  {
    district: "CENTRALIA",
    constituency: "Cyber City",
    ldf: "Yuvraj Yield",
    udf: "Zain Z.",
    nda: "Abe A.",
    totalVoters: "201,000",
    votingPercent: "70.00%",
    polledVotes: "140,700"
  },
  {
    district: "SOUTHVALE",
    constituency: "Sunset Bay",
    ldf: "Bob Binary",
    udf: "Chris C.",
    nda: "Dan D.",
    totalVoters: "177,000",
    votingPercent: "73.60%",
    polledVotes: "130,272"
  }
];

const tableBody = document.getElementById('table-body');
const exportBtn = document.getElementById('export-btn');
const searchInput = document.getElementById('search-input');
const detailsModal = document.getElementById('details-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalConstituency = document.getElementById('modal-constituency');
const modalDistrict = document.getElementById('modal-district');
const modalLdf = document.getElementById('modal-ldf');
const modalUdf = document.getElementById('modal-udf');
const modalNda = document.getElementById('modal-nda');
const modalTotalVoters = document.getElementById('modal-total-voters');
const modalVotingPercent = document.getElementById('modal-voting-percent');
const modalPolledVotes = document.getElementById('modal-polled-votes');

let filteredConstituencies = constituencies.map((entry, index) => ({entry, index}));

function renderTable() {
  tableBody.innerHTML = '';

  filteredConstituencies.forEach(({entry: constituency, index}) => {
    const row = document.createElement('tr');
    row.dataset.index = index;

    row.innerHTML = `
      <td>${constituency.district}</td>
      <td>${constituency.constituency}</td>
      <td>
        <div class="winner-select">
          <label><input type="radio" name="winner-${index}" value="ldf"> LDF</label>
          <label><input type="radio" name="winner-${index}" value="udf"> UDF</label>
          <label><input type="radio" name="winner-${index}" value="nda"> NDA</label>
        </div>
      </td>
      <td>
        <input type="range" class="margin-slider" min="0" max="75000" value="0" step="100">
        <span class="margin-value">0</span>
      </td>
      <td>
        <button class="details-btn" data-index="${index}">More details</button>
      </td>
    `;

    tableBody.appendChild(row);

    const slider = row.querySelector('.margin-slider');
    const valueDisplay = row.querySelector('.margin-value');
    if (slider && valueDisplay) {
      slider.addEventListener('input', () => {
        valueDisplay.textContent = slider.value;
      });
    }

    const detailsBtn = row.querySelector('.details-btn');
    detailsBtn.addEventListener('click', () => openDetails(index));
  });
}

function openDetails(index) {
  const constituency = constituencies[index];
  modalConstituency.textContent = constituency.constituency;
  modalDistrict.textContent = constituency.district;
  modalLdf.textContent = constituency.ldf;
  modalUdf.textContent = constituency.udf;
  modalNda.textContent = constituency.nda;
  modalTotalVoters.textContent = constituency.totalVoters;
  modalVotingPercent.textContent = constituency.votingPercent;
  modalPolledVotes.textContent = constituency.polledVotes;
  detailsModal.classList.remove('hidden');
  detailsModal.classList.add('open');
  detailsModal.setAttribute('aria-hidden', 'false');
}

function applySearchFilter() {
  const query = searchInput.value.trim().toLowerCase();
  filteredConstituencies = constituencies
    .map((entry, index) => ({entry, index}))
    .filter(({entry}) =>
      entry.district.toLowerCase().includes(query) ||
      entry.constituency.toLowerCase().includes(query)
    );
  renderTable();
}

function closeDetails() {
  detailsModal.classList.add('hidden');
  detailsModal.classList.remove('open');
  detailsModal.setAttribute('aria-hidden', 'true');
}

detailsModal.addEventListener('click', (event) => {
  if (event.target === detailsModal) {
    closeDetails();
  }
});

modalCloseBtn.addEventListener('click', closeDetails);

function exportResults() {
  let csv = 'District,Constituency,LDF Candidate,UDF Candidate,NDA Candidate,Total Voters,Voting %,Polled Votes,Winner,Margin\n';

  const rows = tableBody.querySelectorAll('tr');
  rows.forEach((row) => {
    const rowIndex = parseInt(row.dataset.index, 10);
    const winnerRadios = row.querySelectorAll('input[type="radio"]');
    const marginInput = row.querySelector('.margin-slider');

    let winner = '';
    winnerRadios.forEach(radio => {
      if (radio.checked) {
        winner = radio.value.toUpperCase();
      }
    });

    const margin = marginInput ? marginInput.value : '0';
    const entry = constituencies[rowIndex];
    csv += `${entry.district},${entry.constituency},${entry.ldf},${entry.udf},${entry.nda},${entry.totalVoters},${entry.votingPercent},${entry.polledVotes},${winner},${margin}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'election_results.csv';
  a.click();
  URL.revokeObjectURL(url);
}

searchInput.addEventListener('input', applySearchFilter);
exportBtn.addEventListener('click', exportResults);
renderTable();
