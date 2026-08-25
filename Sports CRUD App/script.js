(function () {
  const STORAGE_KEY = "sports_products";

  const seedData = [
    { id: makeId(), name: "Nike", category: "Football", price: 9000, stock: 3 },
  ];

  function makeId() {
    return (
      "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
    );
  }

  function loadProducts() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
        return seedData.slice();
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Failed to load products", e);
      return [];
    }
  }

  function saveProducts(products) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.error("Failed to save products", e);
      alert("Could not save. Your browser storage might be full.");
    }
  }

  let products = loadProducts();
  let query = "";

  const tableBody = document.getElementById("tableBody");
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const openAdd = document.getElementById("openAdd");
  const cancelAdd = document.getElementById("cancelAdd");
  const overlay = document.getElementById("overlay");
  const addForm = document.getElementById("addForm");

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function render() {
    const q = query.trim().toLowerCase();
    const filtered = products.filter(
      (p) =>
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );

    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <tr class="empty-row">
          <td colspan="6">${products.length === 0 ? "No products added yet." : "No products match your search."}</td>
        </tr>`;
      return;
    }

    tableBody.innerHTML = filtered
      .map(
        (p, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${escapeHtml(p.name)}</td>
        <td>${escapeHtml(p.category)}</td>
        <td>₹${Number(p.price).toLocaleString("en-IN")}</td>
        <td>${escapeHtml(p.stock)}</td>
        <td><button class="btn-delete" data-id="${escapeHtml(p.id)}">Delete</button></td>
      </tr>
    `,
      )
      .join("");
  }

  // Search
  function runSearch() {
    query = searchInput.value;
    render();
  }
  searchBtn.addEventListener("click", runSearch);
  searchInput.addEventListener("input", runSearch);
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") runSearch();
  });

  // Delete
  tableBody.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-delete");
    if (!btn) return;
    const id = btn.dataset.id;
    if (!confirm("Delete this product?")) return;
    products = products.filter((p) => p.id !== id);
    saveProducts(products);
    render();
  });

  // Modal open/close
  function openModal() {
    overlay.classList.add("open");
    document.getElementById("p-name").focus();
  }
  function closeModal() {
    overlay.classList.remove("open");
    addForm.reset();
    ["f-name", "f-category", "f-price", "f-stock"].forEach((id) =>
      document.getElementById(id).classList.remove("invalid"),
    );
  }
  openAdd.addEventListener("click", openModal);
  cancelAdd.addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("open")) closeModal();
  });

  // Add product
  addForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameEl = document.getElementById("p-name");
    const catEl = document.getElementById("p-category");
    const priceEl = document.getElementById("p-price");
    const stockEl = document.getElementById("p-stock");

    const name = nameEl.value.trim();
    const category = catEl.value.trim();
    const price = priceEl.value;
    const stock = stockEl.value;

    let valid = true;
    const check = (fieldId, ok) => {
      document.getElementById(fieldId).classList.toggle("invalid", !ok);
      if (!ok) valid = false;
    };
    check("f-name", name.length > 0);
    check("f-category", category.length > 0);
    check("f-price", price !== "" && Number(price) >= 0);
    check(
      "f-stock",
      stock !== "" && Number(stock) >= 0 && Number.isInteger(Number(stock)),
    );

    if (!valid) return;

    products.push({
      id: makeId(),
      name,
      category,
      price: Number(price),
      stock: Number(stock),
    });

    saveProducts(products);
    render();
    closeModal();
  });

  render();
})();
