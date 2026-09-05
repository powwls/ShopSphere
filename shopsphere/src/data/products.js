const categoryImages = {
  "Gaming PCs": "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=900&q=80",
  Monitors: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80",
  Keyboards: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80",
  Mice: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=80",
  Audio: "https://images.unsplash.com/photo-1599669454699-248893623440?auto=format&fit=crop&w=900&q=80",
  "Desk Setup": "https://images.unsplash.com/photo-1616627561950-9f746e330187?auto=format&fit=crop&w=900&q=80",
};

const productGroups = [
  {
    category: "Gaming PCs",
    names: [
      "NovaForge Gaming PC",
      "Titan Core Gaming PC",
      "PulseStrike Gaming PC",
      "Aether Pro Gaming PC",
      "Velocity Mini Gaming PC",
      "Overclock X Gaming PC",
      "Phantom RTX Gaming PC",
      "Atlas Creator PC",
      "Rival Compact Gaming PC",
      "Summit Elite Gaming PC",
    ],
    prices: [64999, 58999, 72999, 84999, 44999, 94999, 114999, 77999, 52999, 129999],
  },
  {
    category: "Monitors",
    names: [
      "Apex 27-inch 180Hz Monitor",
      "Vista 24-inch 165Hz Monitor",
      "Orbit 32-inch 4K Monitor",
      "Flux Ultrawide Monitor",
      "Prism 27-inch QHD Monitor",
      "Edge 25-inch Esports Monitor",
      "Horizon 34-inch Curved Monitor",
      "Clarity USB-C Monitor",
      "Focus 22-inch Office Monitor",
      "Zenith 32-inch Mini LED Monitor",
    ],
    prices: [15999, 9999, 27999, 32999, 21999, 13999, 38999, 24999, 7999, 45999],
  },
  {
    category: "Keyboards",
    names: [
      "Striker Mechanical Keyboard",
      "Forge 60 Mechanical Keyboard",
      "Tactile Pro Keyboard",
      "Nova Low-Profile Keyboard",
      "Rift Wireless Keyboard",
      "Core RGB Mechanical Keyboard",
      "Atlas 75 Keyboard",
      "Stealth Silent Keyboard",
      "Pulse Macro Keyboard",
      "Summit Custom Keyboard",
    ],
    prices: [4499, 3299, 5999, 4799, 5499, 3899, 6999, 4299, 7499, 8999],
  },
  {
    category: "Mice",
    names: [
      "Vector Wireless Gaming Mouse",
      "Swift Ultra-Light Mouse",
      "Apex Sensor Gaming Mouse",
      "Glide Ergonomic Mouse",
      "Rival RGB Gaming Mouse",
      "Phantom Wireless Mouse",
      "Pulse Pro Esports Mouse",
      "Orbit MMO Gaming Mouse",
      "Core Silent Office Mouse",
      "Titan Precision Mouse",
    ],
    prices: [3299, 2799, 3999, 2499, 3599, 4499, 5299, 4899, 1299, 5999],
  },
  {
    category: "Audio",
    names: [
      "Echo 7.1 Gaming Headset",
      "Pulse Wireless Headset",
      "Vox USB Gaming Microphone",
      "Sonic Studio Headphones",
      "Rift Bluetooth Headset",
      "ClearCast Streaming Mic",
      "Arena Surround Headset",
      "Loop In-Ear Gaming Buds",
      "Focus USB Microphone",
      "Summit Audio Interface",
    ],
    prices: [3799, 4999, 4299, 6999, 3299, 5999, 5499, 1899, 3499, 8999],
  },
  {
    category: "Desk Setup",
    names: [
      "Forge XL Desk Mat",
      "Pulse RGB Light Bar",
      "Titan Dual Monitor Arm",
      "Rise Electric Standing Desk",
      "Arc Desk Shelf",
      "Glow Monitor Light",
      "Nest Cable Management Kit",
      "Drift Ergonomic Desk Chair",
      "Base Headphone Stand",
      "Grid Desk Organizer",
    ],
    prices: [1299, 2199, 4999, 24999, 3999, 2899, 999, 18999, 1599, 1199],
  },
];

export const products = productGroups.flatMap(({ category, names, prices }) =>
  names.map((name, index) => ({
    id: productGroups
      .slice(0, productGroups.findIndex((group) => group.category === category))
      .reduce((total, group) => total + group.names.length, 0) + index + 1,
    name,
    category,
    price: prices[index],
    rating: Number((4.5 + (index % 5) * 0.1).toFixed(1)),
    image: categoryImages[category],
    inStock: true,
    description: `${name} made for a faster, cleaner, and more comfortable ${category.toLowerCase()} setup.`,
  }))
);
