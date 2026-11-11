import { CATEGORIES, COLORS, MAX_QUANTITY, PRODUCTS, SIZES, findProduct, formatCents, unitPriceCents } from "./catalog.js";
import { icon } from "./icons.js";

const TILE_COLORS = ["var(--orange)", "var(--teal)", "var(--mustard)", "var(--berry)", "#5b9bd0"];
const tileColor = (product) => TILE_COLORS[PRODUCTS.indexOf(product) % TILE_COLORS.length];
const $ = (sel) => document.querySelector(sel);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const swatchBg = (color) => (color.hex.startsWith("#") ? color.hex : color.hex);

function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toast.t);
  toast.t = setTimeout(() => el.classList.remove("show"), 2400);
}

/* ---------------- Shop grid ---------------- */
let activeCategory = "all";

function renderFilters() {
  const counts = Object.fromEntries(CATEGORIES.map((c) => [c.id, PRODUCTS.filter((p) => p.category === c.id).length]));
  const chips = [{ id: "all", label: "Everything" }, ...CATEGORIES];
  $("#filters").innerHTML = chips
    .map((c) => `<button class="chip" role="tab" data-cat="${c.id}" aria-selected="${c.id === activeCategory}">${c.label}<span>${c.id === "all" ? PRODUCTS.length : counts[c.id]}</span></button>`)
    .join("");
}

function renderGrid() {
  const list = activeCategory === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === activeCategory);
  $("#grid").innerHTML = list
    .map(
      (p, i) => `
      <li class="product" data-id="${p.id}" tabindex="0" style="animation-delay:${Math.min(i * 30, 400)}ms">
        ${p.personalize ? '<span class="pers">Personalize</span>' : ""}
        <div class="tile ${p.image ? 'has-img' : ''}" style="--tile:${tileColor(p)}">
          ${p.image ? `<img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy" />` : icon(p.icon)}
        </div>
        <div class="product-body">
          <h3>${esc(p.name)}</h3>
          <span class="price">$${p.min}–${p.max}</span>
          <button class="add" tabindex="-1">Choose options</button>
        </div>
      </li>`,
    )
    .join("");
}

$("#filters").addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  activeCategory = chip.dataset.cat;
  renderFilters();
  renderGrid();
});

$("#grid").addEventListener("click", (e) => {
  const card = e.target.closest(".product");
  if (card) openProduct(card.dataset.id);
});
$("#grid").addEventListener("keydown", (e) => {
  const card = e.target.closest(".product");
  if (card && (e.key === "Enter" || e.key === " ")) {
    e.preventDefault();
    openProduct(card.dataset.id);
  }
});

/* ---------------- Product dialog ---------------- */
const dialog = $("#productDialog");
let current = null;

function selectedSize() {
  return dialog.querySelector('input[name="size"]:checked')?.value ?? "standard";
}

function updateDialogPrice() {
  const qty = clampQty($("#pdQty").value);
  $("#pdPrice").textContent = formatCents(unitPriceCents(current.product, selectedSize()) * qty);
}

function clampQty(v) {
  return Math.min(Math.max(Math.floor(Number(v)) || 1, 1), MAX_QUANTITY);
}

function openProduct(id) {
  const product = findProduct(id);
  if (!product) return;
  current = { product, color: COLORS[0].id };
  if (product.image) {
    $("#pdIcon").innerHTML = `<img src="${esc(product.image)}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:8px" />`;
    $("#pdIcon").style.background = "transparent";
  } else {
    $("#pdIcon").innerHTML = icon(product.icon);
    $("#pdIcon").style.background = tileColor(product);
  }
  $("#pdName").textContent = product.name;
  $("#pdBlurb").textContent = product.blurb;
  $("#pdSizes").innerHTML = SIZES.map(
    (s) => `<label class="size"><input type="radio" name="size" value="${s.id}" ${s.id === "standard" ? "checked" : ""}/><span>${s.label}<b>${formatCents(unitPriceCents(product, s.id))}</b></span></label>`,
  ).join("");
  $("#pdColors").innerHTML = COLORS.map(
    (c) => `<button type="button" class="swatch" role="radio" aria-checked="${c.id === current.color}" aria-label="${c.label}" title="${c.label}" data-color="${c.id}" style="background:${swatchBg(c)}"></button>`,
  ).join("");
  $("#pdColorName").textContent = `— ${COLORS[0].label}`;
  $("#pdPersonalWrap").hidden = !product.personalize;
  $("#pdPersonal").value = "";
  $("#pdQty").value = 1;
  updateDialogPrice();
  dialog.showModal();
}

$("#pdSizes").addEventListener("change", updateDialogPrice);
$("#pdQty").addEventListener("input", updateDialogPrice);
$("#pdColors").addEventListener("click", (e) => {
  const sw = e.target.closest(".swatch");
  if (!sw) return;
  current.color = sw.dataset.color;
  dialog.querySelectorAll(".swatch").forEach((el) => el.setAttribute("aria-checked", String(el === sw)));
  $("#pdColorName").textContent = `— ${COLORS.find((c) => c.id === current.color).label}`;
});
dialog.addEventListener("click", (e) => {
  if (e.target === dialog) dialog.close();
});

$("#productForm").addEventListener("submit", (e) => {
  if (e.submitter?.value !== "add") return;
  addToCart({
    productId: current.product.id,
    size: selectedSize(),
    color: current.color,
    personalization: current.product.personalize ? $("#pdPersonal").value.trim().slice(0, 80) : "",
    quantity: clampQty($("#pdQty").value),
  });
  toast(`Added ${current.product.name}`);
});

/* ---------------- Cart ---------------- */
const CART_KEY = "nb-cart-v1";
let cart = loadCart();

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY)) ?? [];
    return saved.filter((i) => findProduct(i.productId));
  } catch {
    return [];
  }
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  renderCart();
}

function addToCart(item) {
  const same = cart.find(
    (i) =>
      i.productId === item.productId &&
      i.size === item.size &&
      i.color === item.color &&
      i.personalization === item.personalization,
  );
  if (same) same.quantity = Math.min(same.quantity + item.quantity, MAX_QUANTITY);
  else cart.push(item);
  saveCart();
}

function renderCart() {
  const count = cart.reduce((n, i) => n + i.quantity, 0);
  $("#cartCount").textContent = count;
  $("#cartEmpty").hidden = cart.length > 0;
  $("#checkoutForm").hidden = cart.length === 0;

  let total = 0;
  $("#cartItems").innerHTML = cart
    .map((item, idx) => {
      const p = findProduct(item.productId);
      const color = COLORS.find((c) => c.id === item.color) ?? COLORS[0];
      const size = SIZES.find((s) => s.id === item.size) ?? SIZES[1];
      const line = unitPriceCents(p, size.id) * item.quantity;
      total += line;
      return `
        <li class="cart-item">
          <div>
            <div class="name">${esc(p.name)}</div>
            <div class="meta">${size.label} · ${color.label}${item.personalization ? ` · “${esc(item.personalization)}”` : ""}</div>
            <div class="qty-row">
              <button type="button" data-idx="${idx}" data-step="-1" aria-label="Decrease">−</button>
              <span>${item.quantity}</span>
              <button type="button" data-idx="${idx}" data-step="1" aria-label="Increase">+</button>
              <button type="button" class="remove" data-remove="${idx}">Remove</button>
            </div>
          </div>
          <div class="price">${formatCents(line)}</div>
        </li>`;
    })
    .join("");
  $("#cartTotal").textContent = formatCents(total);
}

$("#cartItems").addEventListener("click", (e) => {
  const stepBtn = e.target.closest("button[data-step]");
  if (stepBtn) {
    const idx = Number(stepBtn.dataset.idx);
    const item = cart[idx];
    item.quantity += Number(stepBtn.dataset.step);
    if (item.quantity < 1) cart.splice(idx, 1);
    else item.quantity = Math.min(item.quantity, MAX_QUANTITY);
    saveCart();
    return;
  }
  const removeBtn = e.target.closest("button[data-remove]");
  if (removeBtn) {
    cart.splice(Number(removeBtn.dataset.remove), 1);
    saveCart();
  }
});

function setDrawer(open) {
  $("#drawer").classList.toggle("open", open);
  $("#drawer").setAttribute("aria-hidden", String(!open));
  $("#scrim").hidden = !open;
  document.body.style.overflow = open ? "hidden" : "";
}
$("#cartOpen").addEventListener("click", () => setDrawer(true));
$("#cartClose").addEventListener("click", () => setDrawer(false));
$("#scrim").addEventListener("click", () => setDrawer(false));
$("#emptyShop").addEventListener("click", () => setDrawer(false));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setDrawer(false);
});

function showMsg(el, text, kind) {
  el.textContent = text;
  el.className = `form-msg ${kind ?? ""}`;
}

function validate(form, fields) {
  let firstBad = null;
  for (const name of fields) {
    const input = form.elements[name];
    const ok = input.type === "email" ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim()) : input.value.trim().length > 0;
    input.setAttribute("aria-invalid", String(!ok));
    if (!ok && !firstBad) firstBad = input;
  }
  firstBad?.focus();
  return !firstBad;
}

/* ---------------- Stripe Checkout ---------------- */
$("#checkoutForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  const msg = $("#checkoutMsg");
  if (!validate(form, ["name", "email", "address"])) return showMsg(msg, "Please fill in the highlighted fields.", "error");

  const btn = $("#checkoutBtn");
  btn.disabled = true;
  btn.textContent = "Redirecting to Stripe…";
  showMsg(msg, "");

  try {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: Object.fromEntries(new FormData(form)),
        items: cart,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Checkout failed.");

    // Clear cart only after successful session creation
    cart = [];
    saveCart();

    if (data.url) {
      window.location.href = data.url; // Stripe Checkout
    } else {
      throw new Error("No checkout URL returned.");
    }
  } catch (err) {
    showMsg(msg, err.message || "Something went wrong. Please try again.", "error");
    btn.disabled = false;
    btn.textContent = "Checkout with Stripe";
  }
});

/* ---------------- Custom request + file uploads ---------------- */
const MAX_FILES = 8;
const MAX_BYTES = 5.5 * 1024 * 1024;
let uploads = [];

function renderFiles() {
  $("#fileList").innerHTML = uploads
    .map((u) => {
      const label = u.status === "uploading" ? "uploading…" : u.status === "done" ? "ready" : esc(u.error);
      return `<li class="file ${u.status}"><span class="name">${esc(u.file.name)}</span><span class="state">${label}</span><button type="button" data-remove="${u.id}" aria-label="Remove ${esc(u.file.name)}">×</button></li>`;
    })
    .join("");
}

async function uploadFile(entry) {
  try {
    // For now we just mark as done (no real upload backend yet).
    // When you add a real /api/upload or Netlify function, replace this.
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 800));
    entry.status = "done";
    entry.result = { name: entry.file.name, size: entry.file.size };
  } catch (err) {
    entry.status = "error";
    entry.error = err.message;
  }
  renderFiles();
}

function addFiles(fileList) {
  for (const file of fileList) {
    if (uploads.length >= MAX_FILES) {
      toast(`Up to ${MAX_FILES} files per request`);
      break;
    }
    const entry = { id: crypto.randomUUID(), file, status: "uploading" };
    if (file.size > MAX_BYTES) Object.assign(entry, { status: "error", error: "over 5.5 MB" });
    uploads.push(entry);
    if (entry.status === "uploading") uploadFile(entry);
  }
  renderFiles();
}

const drop = $("#drop");
const fileInput = $("#fileInput");
drop.addEventListener("click", () => fileInput.click());
drop.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    fileInput.click();
  }
});
fileInput.addEventListener("change", () => {
  addFiles(fileInput.files);
  fileInput.value = "";
});
["dragenter", "dragover"].forEach((t) =>
  drop.addEventListener(t, (e) => {
    e.preventDefault();
    drop.classList.add("over");
  }),
);
["dragleave", "drop"].forEach((t) =>
  drop.addEventListener(t, (e) => {
    e.preventDefault();
    drop.classList.remove("over");
  }),
);
drop.addEventListener("drop", (e) => addFiles(e.dataTransfer.files));
$("#fileList").addEventListener("click", (e) => {
  const id = e.target.closest("button[data-remove]")?.dataset.remove;
  if (!id) return;
  uploads = uploads.filter((u) => u.id !== id);
  renderFiles();
});

$("#requestForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  const msg = $("#requestMsg");
  if (!validate(form, ["name", "email", "description"])) return showMsg(msg, "Please fill in the required fields.", "error");

  const btn = $("#requestSubmit");
  btn.disabled = true;
  btn.textContent = "Sending…";
  showMsg(msg, "");

  try {
    // Placeholder – replace with a real Netlify function or form service later
    await new Promise((r) => setTimeout(r, 900));
    showMsg(msg, "Request sent! I’ll email you a quote soon.", "ok");
    form.reset();
    uploads = [];
    renderFiles();
    toast("Custom request sent");
  } catch (err) {
    showMsg(msg, err.message || "Could not send. Please try again.", "error");
  } finally {
    btn.disabled = false;
    btn.textContent = "Send request";
  }
});

/* Coming-soon links preselect service */
document.querySelectorAll("[data-service]").forEach((a) => {
  a.addEventListener("click", () => {
    const sel = $("#requestForm").elements.service;
    if (sel) sel.value = a.dataset.service;
  });
});

/* Init */
renderFilters();
renderGrid();
renderCart();
