
class TabbedNavigation {
  constructor(tabContainerSelector) {
    this.tabContainer = document.querySelector(tabContainerSelector);
    this.tabButtons = this.tabContainer.querySelectorAll('[data-tab]');
    this.tabContents = this.tabContainer.querySelectorAll('.tab-content');

    this.initTabs();
  }

  initTabs() {
    this.tabButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const target = e.target.getAttribute('data-tab');

        // Remove active class from all
        this.tabButtons.forEach(btn => btn.classList.remove('active'));
        this.tabContents.forEach(content => content.classList.remove('active'));

        // Add active class to selected
        e.target.classList.add('active');
        const selectedTab = this.tabContainer.querySelector(`#${target}`);
        if (selectedTab) {
          selectedTab.classList.add('active');
        }
      });
    });
  }
}

// Run tab setup if container exists
document.addEventListener('DOMContentLoaded', () => {
  const tabSection = document.querySelector('.tab-container');
  if (tabSection) {
    new TabbedNavigation('.tab-container');
  }
});

// TheSportsDB API

class FootballStats {
  constructor(formSelector, inputSelector, resultSelector) {
    this.form = document.querySelector(formSelector);
    this.input = document.querySelector(inputSelector);
    this.result = document.querySelector(resultSelector);

    if (this.form) {
      this.form.addEventListener('submit', (e) => this.fetchPlayer(e));
    }
  }

  async fetchPlayer(e) {
    e.preventDefault();

    const playerName = this.input.value.trim();
    this.result.innerHTML = `<div class="alert alert-info">Searching for ${playerName}...</div>`;

    const url = `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(playerName)}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (!data || !data.player || data.player.length === 0) {
        this.result.innerHTML = `<div class="alert alert-warning">No stats found for "${playerName}".</div>`;
        return;
      }

      const player = data.player[0]; // First matching player

      this.result.innerHTML = `
        <div class="card shadow-sm">
          <div class="row g-0">
            <div class="col-md-4">
              <img src="${player.strCutout || player.strThumb || 'https://via.placeholder.com/300'}" class="img-fluid rounded-start" alt="${player.strPlayer}">
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h4 class="card-title">${player.strPlayer}</h4>
                <p><strong>Team:</strong> ${player.strTeam || 'N/A'}</p>
                <p><strong>Nationality:</strong> ${player.strNationality || 'N/A'}</p>
                <p><strong>Position:</strong> ${player.strPosition || 'N/A'}</p>
                <p><strong>Birth Date:</strong> ${player.dateBorn || 'N/A'}</p>
                <p><strong>Description:</strong> ${player.strDescriptionEN?.slice(0, 200) || 'N/A'}...</p>
              </div>
            </div>
          </div>
        </div>
      `;

    } catch (err) {
      console.error(err);
      this.result.innerHTML = `<div class="alert alert-danger">Error fetching player data. Try again later.</div>`;
    }
  }
}

// Activate if on stats.html
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('#searchForm')) {
    new FootballStats('#searchForm', '#playerInput', '#result');
  }
});


// CONTACT FORM VALIDATION

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.querySelector('#contactForm');
  const formResponse = document.querySelector('#formResponse');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.querySelector('#name').value.trim();
      const email = document.querySelector('#email').value.trim();
      const message = document.querySelector('#message').value.trim();

      // Simple validation
      if (!name || !email || !message) {
        formResponse.innerHTML = `<div class="alert alert-warning">All fields are required.</div>`;
        return;
      }

      if (!email.includes('@') || !email.includes('.')) {
        formResponse.innerHTML = `<div class="alert alert-danger">Please enter a valid email.</div>`;
        return;
      }

      // Send to Formspree via JSON
      try {
        const res = await fetch("https://formspree.io/f/movwnbnp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: name,
            email: email,
            message: message
          })
        });

        if (res.ok) {
          formResponse.innerHTML = `<div class="alert alert-success">Thank you, ${name}! Your message has been sent successfully.</div>`;
          contactForm.reset();
        } else {
          formResponse.innerHTML = `<div class="alert alert-danger">Something went wrong. Please try again later.</div>`;
        }
      } catch (err) {
        console.error(err);
        formResponse.innerHTML = `<div class="alert alert-danger">Error connecting to server.</div>`;
      }
    });
  }
});



