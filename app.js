const constituencies = [
  "Adoor",
  "Alappuzha",
  "Alathur",
  "Aluva",
  "Ambalappuzha",
  "Angamaly",
  "Aranmula",
  "Aroor",
  "Aruvikkara",
  "Attingal",
  "Azhikode",
  "Balussery",
  "Beypore",
  "Chadayamangalam",
  "Chalakudy",
  "Changanassery",
  "Chathannoor",
  "Chavara",
  "Chelakkara",
  "Chengannur",
  "Cherthala",
  "Chirayinkeezhu",
  "Chittur",
  "Devikulam",
  "Dharmadam",
  "Elathur",
  "Eranad",
  "Eravipuram",
  "Ernakulam",
  "Ettumanoor",
  "Guruvayur",
  "Haripad",
  "Idukki",
  "Irikkur",
  "Irinjalakuda",
  "Kaduthuruthy",
  "Kaipamangalam",
  "Kalamassery",
  "Kalliasseri",
  "Kalpetta",
  "Kanhangad",
  "Kanjirappally",
  "Kannur",
  "Karunagappally",
  "Kasaragod",
  "Kattakada",
  "Kayamkulam",
  "Kazhakootam",
  "Kochi",
  "Kodungallur",
  "Koduvally",
  "Kollam",
  "Kondotty",
  "Kongad",
  "Konni",
  "Kothamangalam",
  "Kottakkal",
  "Kottarakkara",
  "Kottayam",
  "Kovalam",
  "Kozhikode North",
  "Kozhikode South",
  "Kundara",
  "Kunnamangalam",
  "Kunnamkulam",
  "Kunnathunad",
  "Kunnathur",
  "Kuthuparamba",
  "Kuttanad",
  "Kuttiady",
  "Malampuzha",
  "Malappuram",
  "Manalur",
  "Mananthavady",
  "Manjeri",
  "Manjeshwar",
  "Mankada",
  "Mannarkkad",
  "Mattanur",
  "Mavelikara",
  "Muvattupuzha",
  "Nadapuram",
  "Nattika",
  "Nedumangad",
  "Nemom",
  "Nenmara",
  "Neyyattinkara",
  "Nilambur",
  "Ollur",
  "Ottapalam",
  "Pala",
  "Palakkad",
  "Parassala",
  "Paravur",
  "Pathanapuram",
  "Pattambi",
  "Payyanur",
  "Peerumade",
  "Perambra",
  "Peravoor",
  "Perinthalmanna",
  "Perumbavoor",
  "Piravom",
  "Ponnani",
  "Poonjar",
  "Punalur",
  "Puthukkad",
  "Puthuppally",
  "Quilandy",
  "Ranni",
  "Shornur",
  "Sulthan Bathery",
  "Taliparamba",
  "Tanur",
  "Tarur",
  "Thalassery",
  "Thavanur",
  "Thiruvalla",
  "Thiruvambady",
  "Thiruvananthapuram",
  "Thodupuzha",
  "Thrikaripur",
  "Thrikkakara",
  "Thrippunithura",
  "Thrissur",
  "Thrithala",
  "Tirur",
  "Tirurangadi",
  "Udma",
  "Udumbanchola",
  "Vadakara",
  "Vaikom",
  "Vallikunnu",
  "Vamanapuram",
  "Varkala",
  "Vattiyoorkavu",
  "Vengara",
  "Vypen",
  "Wadakkanchery",
  "Wandoor",
];

const listEl = document.getElementById('constituency-list');
const countEl = document.getElementById('match-count');
const searchEl = document.getElementById('search');

function renderItems(items) {
  listEl.innerHTML = '';
  if (!items.length) {
    const emptyMessage = document.createElement('li');
    emptyMessage.className = 'no-results';
    emptyMessage.textContent = 'No constituencies match your search.';
    listEl.appendChild(emptyMessage);
    return;
  }

  const fragment = document.createDocumentFragment();
  items.forEach(name => {
    const item = document.createElement('li');
    item.className = 'constituency-item';
    item.innerHTML = `<strong>${name}</strong>`;
    fragment.appendChild(item);
  });
  listEl.appendChild(fragment);
}

function updateResults() {
  const query = searchEl.value.trim().toLowerCase();
  const filtered = constituencies.filter(name => name.toLowerCase().includes(query));
  countEl.textContent = `${filtered.length} constituency${filtered.length === 1 ? '' : 'ies'}`;
  renderItems(filtered);
}

searchEl.addEventListener('input', updateResults);
renderItems(constituencies);
countEl.textContent = `${constituencies.length} constituencies`;
