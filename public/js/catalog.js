// Product catalog for Nozzle & Beam

export const MAX_QUANTITY = 25;

export const CATEGORIES = [
  { id: "keychains", label: "Keychains" },
  { id: "signs", label: "Name signs" },
  { id: "fidgets", label: "Fidgets" },
  { id: "dice", label: "Dice" },
  { id: "desk", label: "Desk gear" },
  { id: "toys", label: "Toys & models" },
];

export const SIZES = [
  { id: "small", label: "Small", multiplier: 0.85 },
  { id: "standard", label: "Standard", multiplier: 1 },
  { id: "large", label: "Large", multiplier: 1.35 },
];

export const COLORS = [
  { id: "black", label: "Matte Black", hex: "#1a1a1a" },
  { id: "white", label: "White", hex: "#f5f5f5" },
  { id: "orange", label: "Signal Orange", hex: "#ff6b2c" },
  { id: "teal", label: "Teal", hex: "#00c2a8" },
  { id: "mustard", label: "Mustard", hex: "#e8b84a" },
  { id: "berry", label: "Berry", hex: "#d946a0" },
  { id: "blue", label: "Electric Blue", hex: "#3b82f6" },
  { id: "green", label: "Forest", hex: "#16a34a" },
  { id: "gray", label: "Slate", hex: "#64748b" },
  { id: "red", label: "Crimson", hex: "#ef4444" },
  { id: "purple", label: "Violet", hex: "#8b5cf6" },
  { id: "pink", label: "Hot Pink", hex: "#ec4899" },
];

export const PRODUCTS = [
  { id: "kc-name", name: "Personalized Name Keychain", image: null,  // set to "/images/keychain.jpg" later, blurb: "Your name (or any text) printed in clean raised letters. Great for bags, keys, or as a gift.", category: "keychains", icon: "tag", min: 6, max: 12, personalize: true },
  { id: "kc-logo", name: "Logo / Icon Keychain", blurb: "Simple geometric or icon-based keychain. Upload your design in the custom form for complex logos.", category: "keychains", icon: "bookmark", min: 5, max: 10, personalize: false },
  { id: "kc-initial", name: "Initial Monogram", blurb: "Bold single letter or two-letter monogram. Clean and minimal.", category: "keychains", icon: "star", min: 5, max: 9, personalize: true },
  { id: "sign-door", name: "Door Name Sign", blurb: "Name or phrase for a bedroom, office, or studio door. Mounting holes included.", category: "signs", icon: "tag", min: 12, max: 22, personalize: true },
  { id: "sign-desk", name: "Desk Name Plate", blurb: "Standing name plate for desks and workstations. Stable base, clean type.", category: "signs", icon: "box", min: 10, max: 18, personalize: true },
  { id: "sign-shelf", name: "Shelf Edge Sign", blurb: "Slim sign that hangs or sits on a shelf edge. Perfect for labels or short messages.", category: "signs", icon: "bookmark", min: 8, max: 15, personalize: true },
  { id: "fidget-spinner", name: "Classic Fidget Spinner", blurb: "Smooth bearing spinner printed in tough PLA. Quiet and balanced.", category: "fidgets", icon: "spinner", min: 7, max: 12, personalize: false },
  { id: "fidget-click", name: "Clicky Fidget", blurb: "Satisfying click mechanism. Great desk toy for focus.", category: "fidgets", icon: "cube", min: 6, max: 11, personalize: false },
  { id: "fidget-gyro", name: "Gyro Ring", blurb: "Spinning ring fidget that sits on a finger or spins on a desk.", category: "fidgets", icon: "spinner", min: 5, max: 9, personalize: false },
  { id: "dice-d6", name: "Custom D6 Set", blurb: "Set of six-sided dice. Choose colors and optional custom pips or numbers.", category: "dice", icon: "cube", min: 8, max: 16, personalize: true },
  { id: "dice-poly", name: "Polyhedral Set (7 pcs)", blurb: "Full RPG set: D4, D6, D8, D10, D12, D20 + percentile. Matching colors.", category: "dice", icon: "star", min: 18, max: 28, personalize: false },
  { id: "dice-jumbo", name: "Jumbo D20", blurb: "Oversized twenty-sided die. Desk decoration and conversation starter.", category: "dice", icon: "cube", min: 9, max: 15, personalize: false },
  { id: "desk-phone", name: "Phone Stand", blurb: "Simple angled stand for phones and small tablets. Cable-friendly.", category: "desk", icon: "box", min: 7, max: 13, personalize: false },
  { id: "desk-pen", name: "Pen / Pencil Holder", blurb: "Minimal cylindrical or hexagonal holder. Stable and clean.", category: "desk", icon: "tower", min: 6, max: 12, personalize: false },
  { id: "desk-cable", name: "Cable Clip Set", blurb: "Set of adhesive-friendly cable management clips. Keep desks tidy.", category: "desk", icon: "box", min: 5, max: 9, personalize: false },
  { id: "desk-headphone", name: "Headphone Hook", blurb: "Under-desk or wall headphone hang. Strong and low-profile.", category: "desk", icon: "earbuds", min: 6, max: 11, personalize: false },
  { id: "toy-car", name: "Mini Race Car", blurb: "Simple pull-back style body (no mechanism). Fun desktop model.", category: "toys", icon: "car", min: 8, max: 14, personalize: false },
  { id: "toy-robot", name: "Desktop Robot", blurb: "Cute articulated or static robot figure. Great gift or desk buddy.", category: "toys", icon: "controller", min: 10, max: 18, personalize: false },
  { id: "toy-animal", name: "Low-Poly Animal", blurb: "Geometric animal sculpture. Choose from common animals or request a custom one.", category: "toys", icon: "animal", min: 9, max: 16, personalize: false },
  { id: "toy-planter", name: "Mini Planter", blurb: "Small succulent or air-plant holder. Drainage optional.", category: "toys", icon: "planter", min: 7, max: 13, personalize: false },
  { id: "kc-qr", name: "QR Code Keychain", blurb: "Your link or message encoded as a scannable QR. Perfect for portfolios or Wi-Fi.", category: "keychains", icon: "tag", min: 7, max: 12, personalize: true },
  { id: "sign-quote", name: "Quote / Motto Sign", blurb: "Short quote or motto in clean typography. Wall or shelf ready.", category: "signs", icon: "bookmark", min: 11, max: 20, personalize: true },
  { id: "fidget-infinity", name: "Infinity Cube", blurb: "Folding infinity cube. Smooth hinges, satisfying motion.", category: "fidgets", icon: "cube", min: 8, max: 14, personalize: false },
  { id: "desk-stand", name: "Laptop Riser (small)", blurb: "Compact riser for better ergonomics. Ventilation slots included.", category: "desk", icon: "box", min: 14, max: 24, personalize: false },
  { id: "toy-spaceship", name: "Low-Poly Spaceship", blurb: "Geometric spaceship model. Display or play.", category: "toys", icon: "tower", min: 9, max: 16, personalize: false },
  { id: "dice-custom", name: "Fully Custom Dice", blurb: "Tell me the faces, numbers, or symbols you want. Quote based on complexity.", category: "dice", icon: "star", min: 12, max: 25, personalize: true },
  { id: "kc-set", name: "Family / Team Keychain Set", blurb: "Matching set of 3–6 keychains with names or numbers. Great for groups.", category: "keychains", icon: "tag", min: 18, max: 35, personalize: true },
  { id: "sign-house", name: "House Number Plaque", blurb: "Weather-resistant style number for your door or porch (indoor PLA by default).", category: "signs", icon: "box", min: 10, max: 18, personalize: true },
  { id: "desk-organizer", name: "Mini Desk Organizer", blurb: "Small compartments for paperclips, SD cards, and desk bits.", category: "desk", icon: "box", min: 9, max: 16, personalize: false },
  { id: "toy-top", name: "Spinning Top", blurb: "Classic spinning top. Balanced for long spins.", category: "toys", icon: "top", min: 5, max: 9, personalize: false },
];

export function findProduct(id) {
  return PRODUCTS.find((p) => p.id === id) || null;
}

export function formatCents(cents) {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function unitPriceCents(product, sizeId = "standard") {
  const size = SIZES.find((s) => s.id === sizeId) || SIZES[1];
  // Use the midpoint of min/max, then apply size multiplier
  const mid = ((product.min + product.max) / 2) * 100;
  return Math.round(mid * size.multiplier);
}
