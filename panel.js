document.addEventListener("DOMContentLoaded", () => {
  const log = document.getElementById("log");
  let lastSeparator = null;

  browser.devtools.network.onNavigated.addListener(() => {
    insertReloadSeparator();
  });

  function insertReloadSeparator() {
    if (lastSeparator) lastSeparator.remove();
    const wrapper = document.createElement("div");
    wrapper.className = "separator";
    lastSeparator = wrapper;

    const hr = document.createElement("hr");
    const label = document.createElement("div");
    label.className = "separator-label";
    label.textContent = `↺ Reloaded at ${new Date().toLocaleTimeString()}`;
    wrapper.appendChild(hr);
    wrapper.appendChild(label);
    log.prepend(wrapper);
  }

  function checkRemoveSeparator() {
    const entries = log.querySelectorAll(".entry-card");
    if (entries.length === 0 && lastSeparator) {
      lastSeparator.remove();
      lastSeparator = null;
    }
  }

  function createMilliEntry(request, milliHeaders, status) {
    const card = document.createElement("div");
    card.className = "entry-card highlight";
    card.setAttribute('data-status', status.toLowerCase());

    // Create the header with URL
    const url = document.createElement("h3");
    url.className = "url";
    url.textContent = "🔗 " + request.request.url;
    card.appendChild(url);

    // Add HTTP status code
    const httpStatus = request.response.status;
    const statusElement = document.createElement("div");
    statusElement.className = "http-status-code";
    statusElement.setAttribute('data-code', httpStatus);
    statusElement.textContent = httpStatus;
    card.appendChild(statusElement);

    // Extract data from headers
    let flags = [];
    let key = "";
    let time = "";
    let gzip = "";
    let expires = "";

    milliHeaders.forEach(h => {
      const name = h.name.toLowerCase().replace("x-millicache-", "");
      const value = h.value;
      switch (name) {
        case "key": key = value; break;
        case "time": time = value; break;
        case "flags": flags = value.split(" "); break;
        case "gzip": gzip = value === "true" ? "✔ Enabled" : "✖ Disabled"; break;
        case "expires": expires = value; break;
      }
    });

    // Create table
    const table = document.createElement("table");
    table.className = "milli-table";

    // Table body
    const tbody = document.createElement("tbody");

    // Add rows for each piece of information
    if (key) addTableRow(tbody, "🧠 Key", key);
    if (time) addTableRow(tbody, "🕑 Time", time);

    // Special handling for flags
    if (flags.length) {
      const row = document.createElement("tr");
      const labelCell = document.createElement("td");
      labelCell.className = "label";
      labelCell.textContent = "🏷 Flags";

      const valueCell = document.createElement("td");
      valueCell.className = "value";

      flags.forEach(f => {
        const pill = document.createElement("span");
        pill.className = "pill";
        pill.textContent = f;
        valueCell.appendChild(pill);
      });

      row.appendChild(labelCell);
      row.appendChild(valueCell);
      tbody.appendChild(row);
    }

    if (gzip) addTableRow(tbody, "🗜️ Gzip", gzip);

    // Special handling for status
    if (status) {
      const row = document.createElement("tr");
      const labelCell = document.createElement("td");
      labelCell.className = "label";
      labelCell.textContent = "💾 Status";

      const valueCell = document.createElement("td");
      valueCell.className = "value";

      const badge = document.createElement("span");
      badge.className = "status " + status.toLowerCase();

      const colorDot = status.toLowerCase() === "hit"
        ? '<span style="color:green">●</span>'
        : status.toLowerCase() === "miss"
          ? '<span style="color:red">●</span>'
          : status.toLowerCase() === "stale"
            ? '<span style="color:orange">●</span>'
            : '<span style="color:gray">●</span>';
      badge.innerHTML = colorDot + " " + status.toUpperCase();

      valueCell.appendChild(badge);
      row.appendChild(labelCell);
      row.appendChild(valueCell);
      tbody.appendChild(row);
    }

    if (expires) addTableRow(tbody, "⏳ Expires", expires);

    // Add table body to table
    table.appendChild(tbody);

    // Add table to card
    card.appendChild(table);

    // Add card to log
    log.prepend(card);

    // Highlight effect
    setTimeout(() => {
      card.classList.remove("highlight");
    }, 10000);

    // Auto-remove after 20 seconds
    setTimeout(() => {
      card.remove();
      checkRemoveSeparator();
    }, 20000);
  }

// Helper function to add a row to the table
  function addTableRow(tbody, label, value) {
    const row = document.createElement("tr");

    const labelCell = document.createElement("td");
    labelCell.className = "label";
    labelCell.textContent = label;

    const valueCell = document.createElement("td");
    valueCell.className = "value";
    valueCell.innerHTML = `<strong>${value}</strong>`;

    row.appendChild(labelCell);
    row.appendChild(valueCell);
    tbody.appendChild(row);
  }

  browser.devtools.network.onRequestFinished.addListener((request) => {
  const url = new URL(request.request.url);
  if (/favicon\.ico([?#].*)?$/.test(url.pathname)) {
    return;
  }

    const headers = request.response.headers;
    const statusHeader = headers.find(h => h.name.toLowerCase() === "x-millicache-status");


    const statusVal = statusHeader?.value?.toLowerCase() || '';
    const mime = request.response?.content?.mimeType || '';
    if (!(["hit", "miss", "stale"].includes(statusVal) || (statusVal === "bypass" && mime.includes("text/html")))) {

      return;
    }

    const milliHeaders = headers.filter(h =>
      h.name.toLowerCase().startsWith("x-millicache-")
    );

    if (milliHeaders.length) {
      createMilliEntry(request, milliHeaders, statusHeader.value);
    }
  });
});
