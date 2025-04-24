// public/js/admin.js

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login';
        return;
    }
    fetchCharities();
});

async function fetchCharities() {
    const token = localStorage.getItem('token');
    try {
        const res = await axios.get('http://localhost:4000/admin/charities', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const charities = res.data;
        const charitiesDiv = document.getElementById('charitiesList');
        if (!charities.length) {
            charitiesDiv.innerHTML = '<p>No charities found.</p>';
            return;
        }
        let html = '<h2>Charities</h2>';
        html += '<ul style="list-style: none; padding: 0;">';
        charities.forEach(ch => {
            html += `<li style="margin-bottom: 10px; border: 1px solid #ddd; padding: 10px;">
            <span><strong>Name:</strong> ${ch.name}</span> &nbsp;
            <span><strong>Mission:</strong> ${ch.mission || 'N/A'}</span> &nbsp;
            <span><strong>Location:</strong> ${ch.location || 'N/A'}</span> &nbsp;
            <span><strong>Category:</strong> ${ch.category || 'N/A'}</span> &nbsp;
            <span><strong>Approved:</strong> ${ch.isApproved ? 'Yes' : 'No'}</span> &nbsp;`;
            if (!ch.isApproved) {
                html += `<button data-id="${ch.id}" onclick="approveCharity(this)">Accept</button> 
                   <button data-id="${ch.id}" onclick="rejectCharity(this)">Reject</button>`;
            }
            html += `</li>`;
        });
        html += '</ul>';
        charitiesDiv.innerHTML = html;
    } catch (err) {
        console.error('Error fetching charities:', err);
        alert('Error fetching charities.');
    }
}

async function approveCharity(buttonElem) {
    const charityId = buttonElem.getAttribute('data-id');
    const token = localStorage.getItem('token');
    try {
        const res = await axios.put(`http://localhost:4000/charities/${charityId}/approve`, {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        alert(res.data.message);
        fetchCharities();
    } catch (err) {
        console.error('Error approving charity:', err);
        alert('Error approving charity.');
    }
}

async function rejectCharity(buttonElem) {
    const charityId = buttonElem.getAttribute('data-id');
    const token = localStorage.getItem('token');
    if (!confirm('Are you sure you want to reject this charity?')) return;
    try {
        const res = await axios.delete(`http://localhost:4000/charities/${charityId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        alert(res.data.message);
        fetchCharities();
    } catch (err) {
        console.error('Error rejecting charity:', err);
        alert('Error rejecting charity.');
    }
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
}
