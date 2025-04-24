// public/js/charityManage.js

let currentCharityData = null;
let currentImpactData = null;

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('No token found. Please log in.');
        window.location.href = '/login';
        return;
    }
    // Reset the registration form
    document.getElementById('charityForm').reset();

    // If a saved search query exists, re-populate and run the search
    const savedQuery = localStorage.getItem('charitySearchQuery');
    if (savedQuery) {
        document.getElementById('searchQuery').value = savedQuery;
        searchCharities();
    }
    hideUpdateCharityForm();
    hideUpdateImpactForm();
});

// Search charities using async/await and try-catch
async function searchCharities() {
    const query = document.getElementById('searchQuery').value.trim();
    localStorage.setItem('charitySearchQuery', query);
    const resultsDiv = document.getElementById('searchResults');

    if (!query) {
        resultsDiv.innerHTML = '';
        return;
    }
    try {
        const res = await axios.get(`http://localhost:4000/donations/search?q=${query}`);
        const charities = res.data;
        if (!charities.length) {
            resultsDiv.innerHTML = '<p>No charities found.</p>';
            return;
        }

        let html = '<ul class="search-results-list">';
        charities.forEach(c => {
            html += `
                <li class="search-result-item">
                  <div class="search-result-inner">
                    <span><strong>Name:</strong> ${c.name}</span>
                    <span><strong>Location:</strong> ${c.location || 'N/A'}</span>
                    <span><strong>Category:</strong> ${c.category || 'N/A'}</span>
                    <span><strong>Mission:</strong> ${c.mission || 'N/A'}</span>
                    <button onclick='showUpdateCharityForm(${JSON.stringify(c)})'>Update Charity</button>
                    <button onclick='showUpdateImpactForm(${JSON.stringify(c)})'>Update Impact Report</button>
                  </div>
                </li>
            `;
        });
        html += '</ul>';
        resultsDiv.innerHTML = html;
    } catch (err) {
        console.error('Error searching charities:', err);
        alert('Error searching charities.');
    }
}

//<button onclick='showUpdateCharityForm({"id":10,"name":"Hope Foundation","location":"New York","mission":"Provide shelter"})'>Update Charity</button>
function showUpdateCharityForm(charity) {
    currentCharityData = charity;//This line assigns the entire charity object to the global variable currentCharityData
    document.getElementById('updName').value = charity.name || '';
    document.getElementById('updMission').value = charity.mission || '';
    document.getElementById('updLocation').value = charity.location || '';
    document.getElementById('updCategory').value = charity.category || '';
    document.getElementById('updateCharityContainer').style.display = 'block';
    document.getElementById('updateImpactContainer').style.display = 'none';
}

function hideUpdateCharityForm() {
    document.getElementById('updateCharityContainer').style.display = 'none';
    currentCharityData = null;
}

// Update charity using async/await and try-catch
async function updateCharity(event) {
    event.preventDefault();

    //currentCharityData is a global variable that should contain the charity object the user wants to update (set previously when the user clicked an "Update Charity" button
    if (!currentCharityData) {
        alert('No charity selected for update.');
        return;
    }
    const token = localStorage.getItem('token');

    const nameInput = document.getElementById('updName').value.trim();
    const missionInput = document.getElementById('updMission').value.trim();
    const locationInput = document.getElementById('updLocation').value.trim();
    const categoryInput = document.getElementById('updCategory').value.trim();

    const updatedData = {
        name: nameInput || currentCharityData.name,
        mission: missionInput || currentCharityData.mission,
        location: locationInput || currentCharityData.location,
        category: categoryInput || currentCharityData.category
    };

    try {
        const res = await axios.put(`http://localhost:4000/charities/${currentCharityData.id}`,
            updatedData,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        alert(res.data.message);
        hideUpdateCharityForm();
        searchCharities();
    } catch (err) {
        alert(err.response?.data?.error || 'Error updating charity');
    }
}


// Show Update Impact prompt
function showUpdateImpactForm(charity) {
    currentImpactData = charity;
    document.getElementById('updImpact').value = charity.impactReport || '';
    document.getElementById('updateImpactContainer').style.display = 'block';
    document.getElementById('updateCharityContainer').style.display = 'none';
}

function hideUpdateImpactForm() {
    document.getElementById('updateImpactContainer').style.display = 'none';
    currentImpactData = null;
}

// Update impact using async/await and try-catch
async function updateImpact(event) {
    event.preventDefault();
    if (!currentImpactData) {
        alert('No charity selected for impact report update.');
        return;
    }
    const token = localStorage.getItem('token');
    const impactInput = document.getElementById('updImpact').value.trim();
    const updatedImpact = impactInput || currentImpactData.impactReport;

    try {
        const res = await axios.put(`http://localhost:4000/charities/${currentImpactData.id}/impact`,
            { impactReport: updatedImpact },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        alert(res.data.message);
        hideUpdateImpactForm();
        searchCharities();
    } catch (err) {
        alert(err.response?.data?.error || 'Error updating impact report');
    }
}

// Create new charity using async/await and try-catch
async function createCharity(event) {
    event.preventDefault();
    const token = localStorage.getItem('token');
    const name = document.getElementById('name').value;
    const mission = document.getElementById('mission').value;
    const location = document.getElementById('location').value;
    const category = document.getElementById('category').value;

    try {
        const res = await axios.post('http://localhost:4000/charities/register',
            { name, mission, location, category },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        alert(res.data.message);
        document.getElementById('charityForm').reset();
        searchCharities(); // refresh search results if any
    } catch (err) {
        alert(err.response?.data?.error || 'Error registering charity');
    }
}

// Logout
function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
}
