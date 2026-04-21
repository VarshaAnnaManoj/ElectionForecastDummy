let constituencies = [];

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

const bubbleGrid = document.getElementById('bubble-grid');
const districtFilterButtons = document.getElementById('district-filter-buttons');
const selectionCount = document.getElementById('selection-count');
const entryTitle = document.getElementById('entry-title');
const entrySubtitle = document.getElementById('entry-subtitle');
const predictionForm = document.getElementById('prediction-form');
const winnerInputs = document.querySelectorAll('input[name="winner"]');
const marginSlider = document.getElementById('margin-slider');
const marginValue = document.getElementById('margin-value');
const panelDetailsBtn = null; // removed — details now shown inline
const clearPredictionBtn = document.getElementById('clear-prediction-btn');
const submitPredictionsBtn = document.getElementById('submit-predictions-btn');
const submitterNameInput = document.getElementById('submitter-name');
const submitterPhoneLast5Input = document.getElementById('submitter-phone-last5');
const submitterNameError = document.getElementById('submitter-name-error');
const submitterPhoneError = document.getElementById('submitter-phone-error');
const submitFormFeedback = document.getElementById('submit-form-feedback');
const voteLdfInput = document.getElementById('vote-ldf');
const voteUdfInput = document.getElementById('vote-udf');
const voteNdaInput = document.getElementById('vote-nda');
const voteOthersInput = document.getElementById('vote-others');
const voteLdfEditInput = document.getElementById('vote-ldf-edit');
const voteUdfEditInput = document.getElementById('vote-udf-edit');
const voteNdaEditInput = document.getElementById('vote-nda-edit');
const voteOthersEditInput = document.getElementById('vote-others-edit');
const voteLdfValue = document.getElementById('vote-ldf-value');
const voteUdfValue = document.getElementById('vote-udf-value');
const voteNdaValue = document.getElementById('vote-nda-value');
const voteOthersValue = document.getElementById('vote-others-value');
const voteShareTotal = document.getElementById('vote-share-total');
const voteShareStatus = document.getElementById('vote-share-status');
const constituencyInfo = document.getElementById('constituency-info');
const infoLdf = document.getElementById('info-ldf');
const infoUdf = document.getElementById('info-udf');
const infoNda = document.getElementById('info-nda');
const infoTotalVoters = document.getElementById('info-total-voters');
const infoVotingPercent = document.getElementById('info-voting-percent');
const infoPolledVotes = document.getElementById('info-polled-votes');
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

let filteredConstituencies = [];
let activeIndex = null;
let selectedDistrictAbbr = '';
const predictions = new Map();
const partyChartColors = {
  ldf: '#ef4444',
  udf: '#2563eb',
  nda: '#f59e0b',
  others: '#7c3aed',
  outstanding: '#10b981',
  remainder: '#e2e8f0'
};

function clampPercentage(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return 0;
  }
  return Math.max(0, Math.min(100, parsed));
}

function toTwoDecimals(value) {
  return Math.round(Number(value) * 100) / 100;
}

function formatPercentageLabel(value) {
  return `${Number(value).toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1')}%`;
}

function parseCount(value) {
  if (value === null || value === undefined) {
    return 0;
  }

  const numeric = Number(String(value).replace(/,/g, '').trim());
  return Number.isFinite(numeric) ? numeric : 0;
}

function formatCountLabel(value) {
  return Math.round(value).toLocaleString('en-IN');
}

function getActivePolledVoteCount() {
  if (activeIndex === null || !constituencies[activeIndex]) {
    return 0;
  }
  return parseCount(constituencies[activeIndex].polledVotes);
}

function readVoteSharesFromInputs() {
  const ldf = clampPercentage(voteLdfInput.value);
  const udf = clampPercentage(voteUdfInput.value);
  const nda = clampPercentage(voteNdaInput.value);
  const others = clampPercentage(voteOthersInput.value);
  const outstanding = Math.max(0, 100 - (ldf + udf + nda + others));

  return {
    ldf,
    udf,
    nda,
    others,
    outstanding
  };
}

function defaultVoteShare() {
  return { ldf: 0, udf: 0, nda: 0, others: 100, outstanding: 0 };
}

function normalizeVoteShare(voteShare, changedKey) {
  const OTHERS_MIN_AUTO = 0.5;
  const partyKeys = ['ldf', 'udf', 'nda', 'others'];
  const shares = {
    ldf: clampPercentage(voteShare.ldf),
    udf: clampPercentage(voteShare.udf),
    nda: clampPercentage(voteShare.nda),
    others: clampPercentage(voteShare.others),
    outstanding: 0
  };

  const key = changedKey === 'ldf' || changedKey === 'udf' || changedKey === 'nda' || changedKey === 'others'
    ? changedKey
    : 'others';

  let total = partyKeys.reduce((sum, partyKey) => sum + shares[partyKey], 0);
  if (total <= 100) {
    shares.outstanding = 100 - total;
    return shares;
  }

  let excess = total - 100;
  const otherKeys = partyKeys.filter((partyKey) => partyKey !== key);
  const getReducibleAmount = (partyKey) => {
    if (partyKey === 'others' && key !== 'others') {
      return Math.max(0, shares.others - OTHERS_MIN_AUTO);
    }
    return shares[partyKey];
  };

  // For LDF/UDF/NDA edits, consume Others first (down to 0.5%)
  // before reducing the other major blocs.
  if ((key === 'ldf' || key === 'udf' || key === 'nda') && excess > 0.0001) {
    const reducibleOthers = getReducibleAmount('others');
    if (reducibleOthers > 0) {
      const takeFromOthers = Math.min(excess, reducibleOthers);
      shares.others -= takeFromOthers;
      excess -= takeFromOthers;
    }
  }

  while (excess > 0.0001) {
    const adjustableKeys = otherKeys.filter((partyKey) => getReducibleAmount(partyKey) > 0);

    if (!adjustableKeys.length) {
      shares[key] = Math.max(0, shares[key] - excess);
      break;
    }

    const equalReduction = excess / adjustableKeys.length;
    let reducedAmount = 0;

    adjustableKeys.forEach((partyKey) => {
      const reduction = Math.min(equalReduction, getReducibleAmount(partyKey));
      shares[partyKey] -= reduction;
      reducedAmount += reduction;
    });

    if (reducedAmount <= 0.0001) {
      shares[key] = Math.max(0, shares[key] - excess);
      break;
    }

    excess -= reducedAmount;
  }

  total = partyKeys.reduce((sum, partyKey) => sum + shares[partyKey], 0);
  shares.outstanding = Math.max(0, 100 - total);

  return shares;
}

function setVoteSharesToInputs(voteShare) {
  const ldf = toTwoDecimals(clampPercentage(voteShare.ldf ?? 0));
  const udf = toTwoDecimals(clampPercentage(voteShare.udf ?? 0));
  const nda = toTwoDecimals(clampPercentage(voteShare.nda ?? 0));
  const others = toTwoDecimals(clampPercentage(voteShare.others ?? 0));

  voteLdfInput.value = String(ldf);
  voteUdfInput.value = String(udf);
  voteNdaInput.value = String(nda);
  voteOthersInput.value = String(others);

  voteLdfEditInput.value = String(ldf);
  voteUdfEditInput.value = String(udf);
  voteNdaEditInput.value = String(nda);
  voteOthersEditInput.value = String(others);
}

function updateVoteShareLabels(voteShare) {
  const polledVoteCount = getActivePolledVoteCount();
  const formatVoteLabel = (share) => {
    const percentage = clampPercentage(share ?? 0);
    const estimatedCount = formatCountLabel((polledVoteCount * percentage) / 100);
    return `${formatPercentageLabel(percentage)} | ${estimatedCount} votes`;
  };

  voteLdfValue.textContent = formatVoteLabel(voteShare.ldf);
  voteUdfValue.textContent = formatVoteLabel(voteShare.udf);
  voteNdaValue.textContent = formatVoteLabel(voteShare.nda);
  voteOthersValue.textContent = formatVoteLabel(voteShare.others);
}

function updateVoteShareSummary(voteShare) {
  const shares = {
    ldf: clampPercentage(voteShare.ldf),
    udf: clampPercentage(voteShare.udf),
    nda: clampPercentage(voteShare.nda),
    others: clampPercentage(voteShare.others),
    outstanding: clampPercentage(voteShare.outstanding)
  };

  const total = shares.ldf + shares.udf + shares.nda + shares.others;
  voteShareTotal.textContent = formatPercentageLabel(total);
  voteShareTotal.classList.remove('is-error');
  updateVoteShareLabels(shares);

  voteShareStatus.classList.remove('is-good', 'is-warn', 'is-error');
  if (Math.abs(total - 100) < 0.05) {
    voteShareStatus.textContent = '';
  } else if (total < 100) {
    voteShareTotal.classList.add('is-error');
    voteShareStatus.textContent = `Add ${(100 - total).toFixed(2)}% more to reach 100%`;
    voteShareStatus.classList.add('is-error');
  } else {
    voteShareStatus.textContent = `Reduce ${(total - 100).toFixed(2)}% to return to 100%`;
    voteShareStatus.classList.add('is-warn');
  }
}

function handleVoteShareInput(changedKey) {
  const normalizedVoteShare = normalizeVoteShare(readVoteSharesFromInputs(), changedKey);
  setVoteSharesToInputs(normalizedVoteShare);
  updateVoteShareSummary(normalizedVoteShare);
  updatePrediction({ voteShare: normalizedVoteShare });
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

  filteredConstituencies = constituencies.map((entry, index) => ({entry, index}));
  renderDistrictFilterButtons();
  updateSelectionCount();
  renderBubbles();
}

function districtToken(entry) {
  return (entry.distAbbr || entry.district || '').trim();
}

function renderDistrictFilterButtons() {
  const districts = [...new Set(constituencies.map((entry) => districtToken(entry)).filter(Boolean))].sort((a, b) => a.localeCompare(b));

  districtFilterButtons.innerHTML = '';
  const allButton = document.createElement('button');
  allButton.type = 'button';
  allButton.className = 'district-chip active';
  allButton.dataset.district = '';
  allButton.textContent = 'All';
  districtFilterButtons.appendChild(allButton);

  districts.forEach((district) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'district-chip';
    button.dataset.district = district;
    button.textContent = district;
    districtFilterButtons.appendChild(button);
  });
}

function renderBubbles() {
  bubbleGrid.innerHTML = '';

  if (!filteredConstituencies.length) {
    bubbleGrid.innerHTML = '<p class="empty-state">No constituencies match your search.</p>';
    return;
  }

  filteredConstituencies.forEach(({entry: constituency, index}) => {
    const prediction = predictions.get(index);
    const bubble = document.createElement('button');
    bubble.type = 'button';
    bubble.className = 'constituency-bubble';
    if (prediction && prediction.winner) {
      bubble.classList.add('completed');
    }
    if (index === activeIndex) {
      bubble.classList.add('active');
    }

    const winnerLabel = prediction && prediction.winner ? prediction.winner.toUpperCase() : '';
    bubble.innerHTML = `
      <span class="bubble-name">${constituency.constituency}</span>
      <span class="bubble-district">${constituency.distAbbr || ''}</span>
      ${winnerLabel ? `<span class="bubble-status">${winnerLabel}</span>` : ''}
    `;

    bubble.addEventListener('click', () => selectConstituency(index));
    bubbleGrid.appendChild(bubble);
  });
}

function selectConstituency(index) {
  activeIndex = index;
  const constituency = constituencies[index];
  const prediction = predictions.get(index) || {
    winner: '',
    margin: 0,
    voteShare: defaultVoteShare()
  };

  entryTitle.textContent = constituency.constituency;
  entrySubtitle.textContent = `${constituency.distAbbr || constituency.district} district`;
  predictionForm.classList.remove('hidden');
  constituencyInfo.classList.remove('hidden');

  infoLdf.textContent = constituency.ldf || '—';
  infoUdf.textContent = constituency.udf || '—';
  infoNda.textContent = constituency.nda || '—';
  infoTotalVoters.textContent = constituency.totalVoters || '—';
  infoVotingPercent.textContent = constituency.votingPercent || '—';
  infoPolledVotes.textContent = constituency.polledVotes || '—';

  winnerInputs.forEach((input) => {
    input.checked = input.value === prediction.winner;
  });

  marginSlider.value = String(prediction.margin || 0);
  marginValue.textContent = String(prediction.margin || 0);
  setVoteSharesToInputs(prediction.voteShare || defaultVoteShare());
  updateVoteShareSummary(readVoteSharesFromInputs());

  renderBubbles();
}

function updatePrediction(patch) {
  if (activeIndex === null) {
    return;
  }

  const current = predictions.get(activeIndex) || {
    winner: '',
    margin: 0,
    voteShare: defaultVoteShare()
  };
  predictions.set(activeIndex, { ...current, ...patch });
  updateSelectionCount();
  renderBubbles();
}

function updateSelectionCount() {
  let selected = 0;
  predictions.forEach((prediction) => {
    if (prediction.winner) {
      selected += 1;
    }
  });
  selectionCount.textContent = `${selected} selected`;
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
  const hideDistrict = Boolean(selectedDistrictAbbr);

  bubbleGrid.classList.toggle('hide-district', hideDistrict);

  filteredConstituencies = constituencies
    .map((entry, index) => ({entry, index}))
    .filter(({entry}) => {
      return !selectedDistrictAbbr || districtToken(entry) === selectedDistrictAbbr;
    });
  renderBubbles();
}

function closeDetails() {
  detailsModal.classList.add('hidden');
  detailsModal.classList.remove('open');
  detailsModal.setAttribute('aria-hidden', 'true');
}

function clearActiveSelection() {
  activeIndex = null;
  entryTitle.textContent = 'Select a constituency';
  entrySubtitle.textContent = 'Click any bubble to enter details.';
  predictionForm.classList.add('hidden');
  constituencyInfo.classList.add('hidden');

  winnerInputs.forEach((input) => {
    input.checked = false;
  });

  marginSlider.value = '0';
  marginValue.textContent = '0';
  setVoteSharesToInputs(defaultVoteShare());
  updateVoteShareSummary(defaultVoteShare());
}

detailsModal.addEventListener('click', (event) => {
  if (event.target === detailsModal) {
    closeDetails();
  }
});

modalCloseBtn.addEventListener('click', closeDetails);

function exportResults() {
  let csv = 'District,Constituency,LDF Candidate,UDF Candidate,NDA Candidate,Total Voters,Voting %,Polled Votes,Winner,Margin,LDF %,UDF %,NDA %,Others %,Outstanding %\n';

  constituencies.forEach((entry, index) => {
    const prediction = predictions.get(index) || { winner: '', margin: 0, voteShare: defaultVoteShare() };
    const share = prediction.voteShare || defaultVoteShare();
    csv += `${entry.district},${entry.constituency},${entry.ldf},${entry.udf},${entry.nda},${entry.totalVoters},${entry.votingPercent},${entry.polledVotes},${prediction.winner.toUpperCase()},${prediction.margin},${share.ldf},${share.udf},${share.nda},${share.others},${share.outstanding}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'election_results.csv';
  a.click();
  URL.revokeObjectURL(url);
}

function buildResultsPayload() {
  const submitterName = (submitterNameInput?.value || '').trim();
  const phoneDigits = (submitterPhoneLast5Input?.value || '').replace(/\D/g, '');

  const results = [];

  predictions.forEach((prediction, index) => {
    if (!prediction || !prediction.winner) {
      return;
    }

    const constituency = constituencies[index];
    if (!constituency) {
      return;
    }

    const share = prediction.voteShare || defaultVoteShare();
    results.push({
      district: constituency.district || constituency.distAbbr || '',
      constituency: constituency.constituency || '',
      name: submitterName || null,
      phone_number: phoneDigits ? Number(phoneDigits) : null,
      winner: String(prediction.winner || '').toUpperCase(),
      margin: Number(prediction.margin || 0),
      ldf_share_percentage: toTwoDecimals(clampPercentage(share.ldf ?? 0)),
      udf_share_percentage: toTwoDecimals(clampPercentage(share.udf ?? 0)),
      nda_share_percentage: toTwoDecimals(clampPercentage(share.nda ?? 0)),
      other_share_percentage: toTwoDecimals(clampPercentage(share.others ?? 0))
    });
  });

  return results;
}

async function submitPredictions() {
  const setFieldError = (input, errorEl, message) => {
    if (!input || !errorEl) {
      return;
    }
    errorEl.textContent = message || '';
    input.classList.toggle('input-error', Boolean(message));
  };

  const setSubmitFeedback = (message, kind) => {
    if (!submitFormFeedback) {
      return;
    }
    submitFormFeedback.textContent = message || '';
    submitFormFeedback.classList.remove('is-error', 'is-success');
    if (kind === 'error') {
      submitFormFeedback.classList.add('is-error');
    } else if (kind === 'success') {
      submitFormFeedback.classList.add('is-success');
    }
  };

  setFieldError(submitterNameInput, submitterNameError, '');
  setFieldError(submitterPhoneLast5Input, submitterPhoneError, '');
  setSubmitFeedback('', '');

  const submitterName = (submitterNameInput?.value || '').trim();
  const phoneDigits = (submitterPhoneLast5Input?.value || '').replace(/\D/g, '');

  if (!submitterName) {
    setFieldError(submitterNameInput, submitterNameError, 'Name is required');
    setSubmitFeedback('Please fix the highlighted fields.', 'error');
    submitterNameInput?.focus();
    return;
  }

  if (!/^\d{5}$/.test(phoneDigits)) {
    setFieldError(submitterPhoneLast5Input, submitterPhoneError, 'Enter exactly 5 digits');
    setSubmitFeedback('Please fix the highlighted fields.', 'error');
    submitterPhoneLast5Input?.focus();
    return;
  }

  const results = buildResultsPayload();
  if (!results.length) {
    setSubmitFeedback('No selected predictions to submit. Please choose winner for at least one constituency.', 'error');
    return;
  }

  const missingWinner = results.find((item) => !item.winner);
  if (missingWinner) {
    setSubmitFeedback('Winner is mandatory for all submitted records.', 'error');
    return;
  }

  const invalidMargin = results.find((item) => !Number.isFinite(item.margin) || item.margin <= 0);
  if (invalidMargin) {
    setSubmitFeedback('Margin is mandatory and must be greater than 0 for all submitted records.', 'error');
    return;
  }

  const originalLabel = submitPredictionsBtn.textContent;
  submitPredictionsBtn.disabled = true;
  submitPredictionsBtn.textContent = 'Submitting...';

  try {
    const response = await fetch('/api/constituencies-results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ results })
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.detail || `HTTP ${response.status}`);
    }

    setSubmitFeedback(`Submitted successfully. Inserted ${payload.inserted ?? results.length} records.`, 'success');
  } catch (error) {
    setSubmitFeedback(`Submit failed: ${error.message}`, 'error');
  } finally {
    submitPredictionsBtn.disabled = false;
    submitPredictionsBtn.textContent = originalLabel;
  }
}

districtFilterButtons.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement) || !target.classList.contains('district-chip')) {
    return;
  }

  selectedDistrictAbbr = target.dataset.district || '';

  districtFilterButtons.querySelectorAll('.district-chip').forEach((button) => {
    button.classList.toggle('active', button === target);
  });

  clearActiveSelection();
  applySearchFilter();
});

winnerInputs.forEach((input) => {
  input.addEventListener('change', () => {
    if (input.checked) {
      updatePrediction({ winner: input.value });
    }
  });
});

marginSlider.addEventListener('input', () => {
  marginValue.textContent = marginSlider.value;
  updatePrediction({ margin: Number(marginSlider.value) });
});

voteLdfInput.addEventListener('input', () => handleVoteShareInput('ldf'));
voteUdfInput.addEventListener('input', () => handleVoteShareInput('udf'));
voteNdaInput.addEventListener('input', () => handleVoteShareInput('nda'));
voteOthersInput.addEventListener('input', () => handleVoteShareInput('others'));

function handlePercentEditTyping(editInput, sliderInput, key) {
  const raw = editInput.value.trim().replace(/,/g, '.');

  if (!/^\d*(\.\d{0,2})?$/.test(raw)) {
    const [intPartRaw, decimalRaw = ''] = raw.split('.');
    const intPart = intPartRaw.replace(/[^\d]/g, '');
    const decimalPart = decimalRaw.replace(/[^\d]/g, '').slice(0, 2);
    editInput.value = decimalPart ? `${intPart}.${decimalPart}` : intPart;
  }

  const normalizedRaw = editInput.value.trim();

  if (normalizedRaw === '' || normalizedRaw.endsWith('.')) {
    return;
  }

  const parsed = Number(normalizedRaw);
  if (!Number.isFinite(parsed)) {
    return;
  }

  sliderInput.value = String(toTwoDecimals(clampPercentage(parsed)));
  handleVoteShareInput(key);
}

function commitPercentEdit(editInput, sliderInput, key) {
  const parsed = toTwoDecimals(clampPercentage(editInput.value));
  editInput.value = String(parsed);
  sliderInput.value = String(parsed);
  handleVoteShareInput(key);
}

voteLdfEditInput.addEventListener('input', () => {
  handlePercentEditTyping(voteLdfEditInput, voteLdfInput, 'ldf');
});

voteUdfEditInput.addEventListener('input', () => {
  handlePercentEditTyping(voteUdfEditInput, voteUdfInput, 'udf');
});

voteNdaEditInput.addEventListener('input', () => {
  handlePercentEditTyping(voteNdaEditInput, voteNdaInput, 'nda');
});

voteOthersEditInput.addEventListener('input', () => {
  handlePercentEditTyping(voteOthersEditInput, voteOthersInput, 'others');
});

[voteLdfEditInput, voteUdfEditInput, voteNdaEditInput, voteOthersEditInput].forEach((input) => {
  input.addEventListener('focus', () => {
    input.select();
  });

  input.addEventListener('click', () => {
    input.select();
  });

  input.addEventListener('wheel', (event) => {
    event.preventDefault();
  }, { passive: false });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
    }

    if (event.key === 'Enter') {
      const keyMap = new Map([
        [voteLdfEditInput, ['ldf', voteLdfInput]],
        [voteUdfEditInput, ['udf', voteUdfInput]],
        [voteNdaEditInput, ['nda', voteNdaInput]],
        [voteOthersEditInput, ['others', voteOthersInput]]
      ]);

      const mapped = keyMap.get(input);
      if (mapped) {
        event.preventDefault();
        const [key, slider] = mapped;
        commitPercentEdit(input, slider, key);
      }
    }
  });

  input.addEventListener('blur', () => {
    const keyMap = new Map([
      [voteLdfEditInput, ['ldf', voteLdfInput]],
      [voteUdfEditInput, ['udf', voteUdfInput]],
      [voteNdaEditInput, ['nda', voteNdaInput]],
      [voteOthersEditInput, ['others', voteOthersInput]]
    ]);

    const mapped = keyMap.get(input);
    if (mapped) {
      const [key, slider] = mapped;
      commitPercentEdit(input, slider, key);
    }
  });
});

clearPredictionBtn.addEventListener('click', () => {
  if (activeIndex === null) {
    return;
  }

  predictions.delete(activeIndex);
  winnerInputs.forEach((input) => {
    input.checked = false;
  });
  marginSlider.value = '0';
  marginValue.textContent = '0';
  setVoteSharesToInputs(defaultVoteShare());
  updateVoteShareSummary(defaultVoteShare());
  updateSelectionCount();
  renderBubbles();
});

submitPredictionsBtn.addEventListener('click', () => {
  submitPredictions();
});

if (submitterPhoneLast5Input) {
  submitterPhoneLast5Input.addEventListener('input', () => {
    submitterPhoneLast5Input.value = submitterPhoneLast5Input.value.replace(/\D/g, '').slice(0, 5);
    if (submitterPhoneError) {
      submitterPhoneError.textContent = '';
    }
    submitterPhoneLast5Input.classList.remove('input-error');
  });
}

if (submitterNameInput) {
  submitterNameInput.addEventListener('input', () => {
    if (submitterNameError) {
      submitterNameError.textContent = '';
    }
    submitterNameInput.classList.remove('input-error');
  });
}

loadConstituencies();
