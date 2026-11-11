// Simple line icons for product tiles (64×64 grid, drawn with currentColor).
const P = {
  bookmark: '<path d="M20 8h24v48L32 46 20 56z"/><circle cx="32" cy="22" r="5"/>',
  planter: '<path d="M16 30h32l-4 24H20z"/><path d="M22 30c0-6 4-10 10-10s10 4 10 10"/><circle cx="24" cy="18" r="4"/><circle cx="40" cy="18" r="4"/><path d="M28 40h0m8 0h0"/>',
  cube: '<path d="M32 8 54 20v24L32 56 10 44V20z"/><path d="M10 20l22 12 22-12M32 32v24"/><circle cx="22" cy="38" r="2.5"/><circle cx="42" cy="38" r="2.5"/><circle cx="32" cy="20" r="2.5"/>',
  animal: '<ellipse cx="32" cy="36" rx="18" ry="14"/><path d="M18 26l-6-10 12 4m22 6 6-10-12 4"/><circle cx="26" cy="34" r="2"/><circle cx="38" cy="34" r="2"/><ellipse cx="32" cy="42" rx="6" ry="4"/>',
  yoyo: '<circle cx="28" cy="36" r="18"/><circle cx="28" cy="36" r="7"/><path d="M28 18C28 10 40 6 50 8"/>',
  pencil: '<path d="M14 50 44 20l6 6-30 30H14z"/><path d="M38 26l6 6"/><rect x="44" y="8" width="12" height="12" rx="3" transform="rotate(45 50 14)"/>',
  frame: '<rect x="12" y="10" width="40" height="40" rx="4"/><rect x="19" y="17" width="26" height="26" rx="2"/><path d="M19 38l8-8 6 6 4-4 8 8M24 50l-4 6m24-6 4 6"/>',
  die: '<rect x="12" y="12" width="40" height="40" rx="9"/><circle cx="23" cy="23" r="3"/><circle cx="41" cy="23" r="3"/><circle cx="32" cy="32" r="3"/><circle cx="23" cy="41" r="3"/><circle cx="41" cy="41" r="3"/>',
  clip: '<path d="M10 40h44"/><path d="M22 40V28a10 10 0 0 1 20 0v12"/><circle cx="27" cy="27" r="2"/><circle cx="37" cy="27" r="2"/><path d="M8 46c10 4 38 4 48 0"/>',
  hook: '<rect x="14" y="8" width="36" height="22" rx="11"/><circle cx="25" cy="18" r="2"/><circle cx="39" cy="18" r="2"/><path d="M32 30v14a8 8 0 0 0 16 0v-4"/>',
  keychain: '<circle cx="18" cy="18" r="8"/><path d="M24 24l6 6"/><rect x="28" y="28" width="26" height="26" rx="8"/><circle cx="41" cy="41" r="5"/>',
  sign: '<path d="M8 22h48v24H8z"/><path d="M16 30h6m4 0h6m4 0h6m-26 8h20"/><path d="M20 22l12-12 12 12"/>',
  phone: '<rect x="22" y="6" width="22" height="38" rx="4" transform="rotate(12 33 25)"/><path d="M10 54h44M14 54l12-12m24 12-6-14"/>',
  tag: '<path d="M10 14h26l18 18-22 22L10 36z"/><circle cx="22" cy="26" r="4"/>',
  controller: '<path d="M14 24h36c6 0 8 6 8 14s-2 14-8 14c-6 0-8-8-12-8H26c-4 0-6 8-12 8-6 0-8-6-8-14s2-14 8-14z"/><path d="M18 34v8m-4-4h8"/><circle cx="44" cy="34" r="2"/><circle cx="48" cy="40" r="2"/>',
  tower: '<path d="M18 8h28v44H18z"/><path d="M18 20l16 8M46 30l-16 8"/><path d="M18 52h-8v4h44v-4h-8"/><rect x="34" y="44" width="8" height="8" rx="2"/>',
  box: '<path d="M10 24h44v30H10z"/><path d="M8 16h48v8H8z"/><path d="M26 34h12"/>',
  star: '<path d="M32 6l7 16 17 2-13 11 4 17-15-9-15 9 4-17L8 24l17-2z"/>',
  earbuds: '<rect x="14" y="20" width="36" height="28" rx="14"/><path d="M14 32h36"/><circle cx="32" cy="40" r="2"/><path d="M18 56h28"/>',
  spinner: '<circle cx="32" cy="32" r="6"/><circle cx="32" cy="14" r="8"/><circle cx="16" cy="42" r="8"/><circle cx="48" cy="42" r="8"/><path d="M28 21l-2 5m10-5 2 5M23 38h18"/>',
  top: '<path d="M32 6v10"/><path d="M12 28c0-6 9-12 20-12s20 6 20 12L32 56z"/><path d="M14 30h36"/>',
  car: '<path d="M6 42V32l8-2 6-10h22l8 10 8 2v10z"/><circle cx="18" cy="44" r="6"/><circle cx="46" cy="44" r="6"/><path d="M24 22v8m10-8v8"/>',
};

export function icon(name) {
  return `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] ?? P.star}</svg>`;
}
