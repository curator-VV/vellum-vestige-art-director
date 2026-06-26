/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Copy, 
  Check, 
  BookOpen, 
  FileText, 
  Image as ImageIcon, 
  RefreshCw, 
  Instagram, 
  Layers, 
  Compass, 
  Sliders, 
  Info, 
  Sunset, 
  BookMarked,
  HelpCircle,
  Eye,
  History,
  Trash2,
  Download,
  Sun,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";

// Brand constants from Vellum & Vestige guidelines
const SWATCHES = [
  { id: "ink", name: "Ink", hex: "#1F2022", desc: "Deep off-black", textLight: true },
  { id: "echo", name: "Echo", hex: "#232D42", desc: "Muted architectural navy", textLight: true },
  { id: "haze", name: "Haze", hex: "#D4D7D9", desc: "Muted grey-blue stone", textLight: false },
  { id: "parchment", name: "Parchment", hex: "#D7CEBE", desc: "Warm, organic beige", textLight: false }
];

const MATERIALS = [
  { id: "linen", name: "European Flax Linen", desc: "Premium European flax linen with a distinct tactile weave" },
  { id: "leather", name: "Italian Full-Grain Leather", desc: "Authentic Italian full-grain leather with natural grain articulation" }
];

const PLATFORMS = [
  { id: "ig_post_sq", name: "Instagram Post (Square)", sub: "Square layout", ratio: "1:1", token: "[--ar 1:1]" },
  { id: "ig_post_pt", name: "Instagram Post (Portrait)", sub: "Classic portrait", ratio: "4:5", token: "[--ar 4:5]" },
  { id: "ig_story", name: "Instagram Story", sub: "Exact vertical framing", ratio: "9:16", token: "[--ar 9:16]" },
  { id: "ig_reel", name: "Instagram Reel / TikTok", sub: "Cinematic vertical stills", ratio: "9:16", token: "[--ar 9:16]" }
];

const OPEN_PHOTO_THEMES = [
  { id: "family", name: "Family Bonds", desc: "Heartwarming scenes of family connections and gatherings" },
  { id: "relationships", name: "Profound Relationships", desc: "Emotional portraits of couples or dear friends" },
  { id: "beginnings", name: "New Beginnings", desc: "Capturing hope, fresh starts, and intimate life shifts" },
  { id: "homes", name: "Welcoming New Homes", desc: "Sunlit interiors, architectural details, and homeliness" },
  { id: "grandparents", name: "Grandparents Sharing Stories", desc: "Generational storytelling, rich textures, and wisdom" },
  { id: "pets", name: "Household Pets", desc: "Intimate and endearing frames of beloved pets in home light" }
];

const PHOTO_STYLES = [
  { id: "analog_color", name: "Analog Warm Color", desc: "Authentic, rich, warm-toned analog color film photography" },
  { id: "bw", name: "Crisp Black & White", desc: "Timeless black and white photography with deep rich contrasts" }
];

const VOLUMES = [
  { id: "volume_1", label: "Volume I", title: "The Provenance" },
  { id: "volume_2", label: "Volume II", title: "The Ascent" },
  { id: "volume_3", label: "Volume III", title: "The Meridian" },
  { id: "volume_4", label: "Volume IV", title: "The Vestige" }
];

// Upgraded display settings backdrops
const BACKDROPS = [
  { id: "concrete", name: "Gray Concrete Slab", desc: "raw, minimalist grey concrete slab with natural pitting and fine sand texture", cssStyle: "bg-[#D1CFC9] bg-[radial-gradient(#a3a19b_1px,transparent_1px)] [background-size:12px_12px]" },
  { id: "walnut", name: "Dark Walnut Wood", desc: "matte dark walnut wood surface with rich, warm organic grain patterns", cssStyle: "bg-gradient-to-r from-[#2c1d11] via-[#3a2818] to-[#2c1d11] border-b-4 border-[#1f140b]" },
  { id: "oak", name: "Light Modern Oak", desc: "light modern oak table top with clean, soft-colored wood grain lines and a smooth matte finish", cssStyle: "bg-gradient-to-r from-[#e3d3b8] via-[#ebdec8] to-[#e3d3b8] border-b-4 border-[#d4be9e]" },
  { id: "bed", name: "Modern Linen Bed", desc: "minimal neutral-toned wrinkled linen sheets and soft duvet fabric on a modern bed", cssStyle: "bg-[#EDE9E2] shadow-[inset_0_0_80px_rgba(0,0,0,0.06)] rounded-sm" },
  { id: "museum", name: "Museum Display Pedestal", desc: "museum exhibition pedestal under a clean gallery spotlight with a minimalist architectural atmosphere", cssStyle: "bg-gradient-to-t from-[#B5B2AB] to-[#DDD9D2] shadow-2xl relative before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.45)_0%,transparent_75%)]" },
  { id: "travertine", name: "Outdoors: Travertine Patio", desc: "sun-drenched travertine stone patio with soft leaf shadows casting over the surface under bright sunlight", cssStyle: "bg-[#E6DEC9] bg-[radial-gradient(#c7bea7_2px,transparent_2px)] [background-size:24px_24px] relative overflow-hidden after:absolute after:inset-0 after:bg-gradient-to-tr after:from-[#1F2022]/15 after:via-transparent after:to-transparent" },
  { id: "sandstone", name: "Outdoors: Sandstone Cliff", desc: "weathered coastal sandstone cliff surface under bright natural seaside daylight", cssStyle: "bg-[#DEC8A5] bg-[linear-gradient(45deg,#d2b892_25%,transparent_25%),linear-gradient(-45deg,#d2b892_25%,transparent_25%)] [background-size:40px_40px] opacity-90" },
  { id: "custom", name: "Custom Area...", desc: "Write your own custom environment", cssStyle: "bg-gradient-to-br from-[#E2DFD8] to-[#C8C5BE]" }
];

// Foil settings
const FOILS = [
  { id: "gold", name: "Genuine Gold Leaf", desc: "genuine gold foil leaf", textStyle: "from-[#E2C98F] via-[#C5A059] to-[#99793C]" },
  { id: "silver", name: "Burnished Silver Foil", desc: "burnished silver foil", textStyle: "from-[#F2F2F2] via-[#CCCCCC] to-[#999999]" },
  { id: "rose_gold", name: "Rose Gold Leaf", desc: "rose gold leaf", textStyle: "from-[#F0C2B4] via-[#DCA395] to-[#B87D70]" },
  { id: "blind_deboss", name: "Blind Debossed (Inkless)", desc: "blind-debossed inkless stamp", textStyle: "from-black/40 to-black/70 opacity-80" }
];

// Lighting styles
const LIGHTINGS = [
  { id: "morning", name: "Morning Sunrise (25°)", desc: "morning sunlight coming diagonally from the side at approximately 25 degrees casting sharp geometric shadows" },
  { id: "afternoon", name: "Afternoon Zenith (45°)", desc: "dramatic afternoon daylight casting sharp diagonal shadows at approximately 45 degrees" },
  { id: "sunset", name: "Golden Hour Sunset (15°)", desc: "warm golden-hour sunset light casting long, soft glowing shadows from a low angle" },
  { id: "dappled", name: "Dappled Forest (35°)", desc: "bright sunlight filtering through overhead tree leaves, casting natural dappled organic shadows" }
];

// Upgraded modern styling props
const PROPS = [
  { id: "eucalyptus", name: "Dried Eucalyptus (Botanical)", desc: "a single dried silver dollar eucalyptus branch casting a soft shadow" },
  { id: "brass_bookmark", name: "Solid Brass Bookmark (Modern Decor)", desc: "a raw, minimal solid brass bookmark resting casually near the book" },
  { id: "ceramic_cup", name: "Ceramic Cup (Tactile Lifestyle)", desc: "a hand-thrown raw stoneware ceramic cup on a rough linen coaster" },
  { id: "travertine_block", name: "Travertine Block (Architectural)", desc: "a small geometric block of raw travertine stone casting a hard diagonal shadow" },
  { id: "none", name: "No Props", desc: "" },
  { id: "custom", name: "Custom Styling Prop...", desc: "" }
];

interface BookConfig {
  id: string;
  swatch: string;
  material: string;
  volume: string;
  foilStyle: string;
}

interface HistoryItem {
  id: string;
  timestamp: string;
  prompt: string;
  imageUrl: string;
  settings: {
    platform: string;
    swatch: string;
    material: string;
    state: string;
    volume: string;
    foilStyle: string;
    lightingStyle: string;
    backdrop: string;
    customBackdrop: string;
    stylingProp: string;
    customProps: string;
    photoTheme: string;
    photoStyle: string;
    aestheticStyle: string;
    includeProps: boolean;
    paperType: string;
    spreadLayout: string;
    books?: BookConfig[];
    compositionArrangement?: "stacked" | "row";
  }
}

export default function App() {
  // State for the prompt configurations
  const [platform, setPlatform] = useState("ig_post_pt");
  const [swatch, setSwatch] = useState("echo"); // Default to echo as in the reference image
  const [material, setMaterial] = useState("linen");
  const [state, setState] = useState("closed"); // "closed" | "open"

  // Multi-Volume Configurations
  const [books, setBooks] = useState<BookConfig[]>([
    {
      id: "book_1",
      swatch: "echo",
      material: "linen",
      volume: "volume_3",
      foilStyle: "gold"
    }
  ]);
  const [activeBookIndex, setActiveBookIndex] = useState(0);
  const [compositionArrangement, setCompositionArrangement] = useState<"stacked" | "row">("stacked");

  const updateActiveBook = (fields: Partial<Omit<BookConfig, "id">>) => {
    setBooks(prev => prev.map((b, i) => i === activeBookIndex ? { ...b, ...fields } : b));
  };

  const selectActiveBook = (index: number) => {
    setActiveBookIndex(index);
    const targetBook = books[index];
    setSwatch(targetBook.swatch);
    setMaterial(targetBook.material);
    setSelectedVolume(targetBook.volume);
    setFoilStyle(targetBook.foilStyle);
  };

  const addBook = () => {
    if (books.length >= 4) return;
    const nextVolumeId = `volume_${Math.min(4, books.length + 1)}`;
    const newBook: BookConfig = {
      id: `book_${Date.now()}`,
      swatch: "echo",
      material: "linen",
      volume: nextVolumeId,
      foilStyle: "gold"
    };
    const updated = [...books, newBook];
    setBooks(updated);
    setActiveBookIndex(updated.length - 1);
    setSwatch(newBook.swatch);
    setMaterial(newBook.material);
    setSelectedVolume(newBook.volume);
    setFoilStyle(newBook.foilStyle);
  };

  const removeBook = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (books.length <= 1) return;
    const updated = books.filter((_, i) => i !== index);
    setBooks(updated);
    const newIndex = activeBookIndex >= updated.length ? updated.length - 1 : activeBookIndex;
    setActiveBookIndex(newIndex);
    const targetBook = updated[newIndex];
    setSwatch(targetBook.swatch);
    setMaterial(targetBook.material);
    setSelectedVolume(targetBook.volume);
    setFoilStyle(targetBook.foilStyle);
  };
  
  // Customizations
  const [selectedVolume, setSelectedVolume] = useState("volume_3"); // Default to Volume III
  const [foilStyle, setFoilStyle] = useState("gold");
  const [lightingStyle, setLightingStyle] = useState("morning");
  const [backdrop, setBackdrop] = useState("concrete");
  const [customBackdrop, setCustomBackdrop] = useState("raw volcanic basalt block, matte earthy finish");
  const [stylingProp, setStylingProp] = useState("eucalyptus");
  const [customProps, setCustomProps] = useState("a single dried silver dollar eucalyptus branch casting a soft shadow");
  const [includeProps, setIncludeProps] = useState(true);
  const [aestheticStyle, setAestheticStyle] = useState("Quiet luxury editorial, high-end design journal mood, minimalist and pure");
  
  // Openspread controls
  const [photoTheme, setPhotoTheme] = useState("family");
  const [photoStyle, setPhotoStyle] = useState("analog_color");
  const [paperType, setPaperType] = useState("hahnemuhle");
  const [spreadLayout, setSpreadLayout] = useState("standard");
  
  // Interactive details
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("prompt_engine"); // "prompt_engine" | "brand_guide" | "visual_director"
  const [complianceMode, setComplianceMode] = useState(true);

  // AI image generation states
  const [viewMode, setViewMode] = useState("draft"); // "draft" | "photo"
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [loadingQuoteIndex, setLoadingQuoteIndex] = useState(0);

  // History Gallery
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);

  const LOADING_QUOTES = [
    "Weaving pure European flax linen cover fibers...",
    "Preheating mechanical stamping block to 180°C...",
    "Orienting natural morning daylight rays to 25 degrees...",
    "Inscribing Volume details with fine serif alignment...",
    "Applying hot gold foil leaf onto the bottom-centered watermark...",
    "Finishing premium thick clean-cut edges of museum-grade art paper...",
    "Gently styling dried silver dollar eucalyptus props nearby...",
    "Finishing photorealistic 3D lighting refraction pass..."
  ];

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("vv_generation_history");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Clean up legacy base64 data URLs to reclaim localStorage quota space immediately
          const cleaned = parsed.map((item: any) => {
            if (item && item.imageUrl && item.imageUrl.startsWith("data:image")) {
              return null; // Exclude items with huge base64 strings
            }
            return item;
          }).filter(Boolean);
          
          if (cleaned.length !== parsed.length) {
            console.log(`Cleaned up ${parsed.length - cleaned.length} legacy base64 history entries to reclaim quota.`);
            localStorage.setItem("vv_generation_history", JSON.stringify(cleaned));
          }
          setHistoryList(cleaned);
        }
      }
    } catch (e) {
      console.error("Failed to load history:", e);
      localStorage.removeItem("vv_generation_history");
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      interval = setInterval(() => {
        setLoadingQuoteIndex((prev) => (prev + 1) % LOADING_QUOTES.length);
      }, 3500);
    } else {
      setLoadingQuoteIndex(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGenerating]);

  // Generated text prompt calculation
  const getCompiledPrompt = () => {
    const selectedPlatform = PLATFORMS.find(p => p.id === platform) || PLATFORMS[0];
    const selectedLighting = LIGHTINGS.find(l => l.id === lightingStyle) || LIGHTINGS[0];
    
    let promptParts = [];
    
    if (state === "closed" && books.length > 1) {
      // Multiple closed books stack/row
      promptParts.push(`A premium composition displaying a collection of ${books.length} portrait monographs, each with a structural ratio of 12" vertical height by 9" width, published by Vellum & Vestige`);
      
      if (compositionArrangement === "stacked") {
        promptParts.push(`The monographs are stacked neatly in a single vertical pile on the surface, with their spines aligned and the top book's front cover fully visible`);
      } else {
        promptParts.push(`The monographs are arranged side-by-side in an elegant overlapping row on the surface, showcasing the front cover of each book`);
      }
      
      promptParts.push(`All books feature thick, substantial, high-density book blocks with clean-cut, perfectly stacked pages and smooth, even vertical paper block edges`);
      promptParts.push(`The spines of all the books in the collection are completely blank, smooth, and solid-toned cover material with zero printing, text, or markings`);
      
      // Describe each book in the stack/row
      books.forEach((book, idx) => {
        const bSwatch = SWATCHES.find(s => s.id === book.swatch) || SWATCHES[0];
        const bMaterial = MATERIALS.find(m => m.id === book.material) || MATERIALS[0];
        const bVol = VOLUMES.find(v => v.id === book.volume) || VOLUMES[0];
        const bFoil = FOILS.find(f => f.id === book.foilStyle) || FOILS[0];
        
        let positionName = `Book ${idx + 1}`;
        if (compositionArrangement === "stacked") {
          positionName = idx === 0 ? "The top book" : idx === 1 ? "The second book down in the stack" : idx === 2 ? "The third book down in the stack" : "The bottom book of the stack";
        } else {
          positionName = idx === 0 ? "The leftmost book" : idx === 1 ? "The second book in the row" : idx === 2 ? "The third book in the row" : "The rightmost book";
        }
        
        let bookDesc = `${positionName} is bound in a pristine ${bSwatch.name} (${bSwatch.hex}) cover made of ${bMaterial.desc}. `;
        bookDesc += `Centered on its front cover, exactly one-third (1/3) of the way down from the top edge, in elegant, fine gold-embossed serif lettering, is the volume label: "${bVol.label}: ${bVol.title}". `;
        bookDesc += `Centered near the bottom edge of its front cover is the elegant 'VV' monogram logo hallmark, deeply debossed and hot-stamped with ${bFoil.desc}`;
        if (book.foilStyle !== "blind_deboss") {
          bookDesc += `, with the uppercase brand name 'VELLUM & VESTIGE' cleanly hot-stamped in gold directly beneath the monogram.`;
        } else {
          bookDesc += `, with the uppercase brand name 'VELLUM & VESTIGE' cleanly blind-debossed directly beneath the monogram.`;
        }
        promptParts.push(bookDesc);
      });
    } else if (state === "closed" && books.length === 1) {
      // Single closed book (maintains base prompt layout rules exactly)
      const book = books[0];
      const selectedSwatch = SWATCHES.find(s => s.id === book.swatch) || SWATCHES[0];
      const selectedMaterial = MATERIALS.find(m => m.id === book.material) || MATERIALS[0];
      const vol = VOLUMES.find(v => v.id === book.volume) || VOLUMES[0];
      const selectedFoil = FOILS.find(f => f.id === book.foilStyle) || FOILS[0];
      
      promptParts.push(`A premium 12"x9" portrait monograph published by Vellum & Vestige`);
      promptParts.push(`featuring a thick, substantial, high-density book block with clean-cut, perfectly stacked pages and a smooth, even vertical paper block edge`);
      promptParts.push(`bound in a pristine ${selectedSwatch.name} (${selectedSwatch.hex}) cover made of ${selectedMaterial.desc}`);
      promptParts.push(`The spine of the book is completely blank, smooth, and solid-toned cover material with zero printing, text, or markings`);
      promptParts.push(`Centered on the front cover, exactly one-third (1/3) of the way down from the top edge, in elegant, fine gold-embossed serif lettering, is the volume label: "${vol.label}: ${vol.title}"`);
      
      let logoDesc = `Centered near the bottom edge of the front cover is the elegant 'VV' calligraphic script monogram logo hallmark, deeply blind-debossed and hot-stamped with ${selectedFoil.desc}`;
      if (book.foilStyle !== "blind_deboss") {
        logoDesc += `, with the uppercase serif brand name 'VELLUM & VESTIGE' cleanly hot-stamped in gold directly beneath the monogram`;
      } else {
        logoDesc += `, with the uppercase serif brand name 'VELLUM & VESTIGE' cleanly blind-debossed directly beneath the monogram`;
      }
      promptParts.push(logoDesc);
    } else {
      // Open Spread configuration
      const selectedTheme = OPEN_PHOTO_THEMES.find(t => t.id === photoTheme) || OPEN_PHOTO_THEMES[0];
      const selectedPhotoStyle = PHOTO_STYLES.find(s => s.id === photoStyle) || PHOTO_STYLES[0];
      
      const paperDesc = paperType === "hahnemuhle"
        ? "heavyweight textured museum-grade Hahnemühle matte art paper"
        : "heavyweight semi-matte giclée photographic paper with a smooth matte finish";
      
      promptParts.push(`presented as an open spread monograph displaying thick, heavy pages of ${paperDesc} with perfectly clean-cut, straight edges and precise borders`);
      
      // Select layout descriptions (at most two photos per spread)
      let layoutDesc = "";
      if (spreadLayout === "standard") {
        layoutDesc = `The open spread features two distinct photographs, with one centered on the left page and one centered on the right page, each surrounded by a generous, clean, even white paper margin.`;
      } else if (spreadLayout === "asymmetric") {
        layoutDesc = `The open spread features an asymmetrical layout with a smaller portrait-oriented photograph centered on the left page and a larger landscape-oriented photograph centered on the right page, creating an elegant editorial contrast.`;
      } else if (spreadLayout === "full_bleed_right") {
        layoutDesc = `The open spread features a single photograph that takes up the entirety of the right page in a full-bleed crop, while the left page remains completely blank, empty, and clean white paper.`;
      } else if (spreadLayout === "panoramic") {
        layoutDesc = `The open spread features a single panoramic photograph that spans continuously across both pages, crossing the center page fold gutter.`;
      }
      
      layoutDesc += ` The layout should feel organic, random, and unique: photos vary in size and cropping—some taking up 3/4 of a page, others taking up the entirety of a page, and one occasionally crossing the center gutter. Each individual page must contain at most one photo, and there are never more than two photos on the entire open spread. Under no circumstances should multiple pictures be printed on a single page.`;
      
      promptParts.push(layoutDesc);
      
      promptParts.push(`On the pages is the professional, high-end editorial photography capturing ${selectedTheme.desc}`);
      promptParts.push(`The photography is rendered with an intentional, happy, and heartwarming tone in ${selectedPhotoStyle.desc}`);
      promptParts.push(`The photographic imagery must feature only adults and strictly contain no children, kids, toddlers, or babies whatsoever`);
      promptParts.push(`The pages are completely clean, empty, and pristine, containing no printed text, words, labels, page numbers, or watermark text whatsoever`);
      
      if (books.length > 1) {
        // Resting on top of a stack of the other closed monographs
        const topBook = books[0];
        const topSwatch = SWATCHES.find(s => s.id === topBook.swatch) || SWATCHES[0];
        promptParts.push(`The open book rests flat on top of a neat stack of the other closed monographs in the collection, its thick book block edge showing the luxurious ${topSwatch.name} tone of the cover material (${topSwatch.hex})`);
        
        const otherBooks = books.slice(1);
        otherBooks.forEach((book, idx) => {
          const bSwatch = SWATCHES.find(s => s.id === book.swatch) || SWATCHES[0];
          const bMaterial = MATERIALS.find(m => m.id === book.material) || MATERIALS[0];
          const bVol = VOLUMES.find(v => v.id === book.volume) || VOLUMES[0];
          promptParts.push(`Stacked directly underneath it is Volume ${idx + 2} (${bVol.title}) which is bound in a pristine ${bSwatch.name} (${bSwatch.hex}) cover made of ${bMaterial.desc}, showing its clean-cut edges and blank spine protruding slightly`);
        });
      } else {
        const topBook = books[0];
        const topSwatch = SWATCHES.find(s => s.id === topBook.swatch) || SWATCHES[0];
        promptParts.push(`The thick edges of the book block underneath show the luxurious ${topSwatch.name} tone of the cover material (${topSwatch.hex}) resting flat on the surface`);
      }
    }

    // Atmospheric Sunlight rules
    promptParts.push(`Natural daylight-balanced illumination with ${selectedLighting.desc}`);

    // Surface and environment
    const selectedBackdrop = BACKDROPS.find(b => b.id === backdrop) || BACKDROPS[0];
    const surfaceText = selectedBackdrop.id === "custom" ? customBackdrop : selectedBackdrop.desc;
    promptParts.push(`The volume is grounded upon a ${surfaceText}`);
    
    // Incorporate Styling Props
    if (includeProps) {
      const selectedProp = PROPS.find(p => p.id === stylingProp) || PROPS[0];
      const propText = selectedProp.id === "custom" ? customProps : selectedProp.desc;
      if (propText) {
        promptParts.push(`with ${propText} styled nearby on the surface`);
      }
    }

    // Aesthetic style
    if (aestheticStyle) {
      promptParts.push(`${aestheticStyle}`);
    }

    // Append aspect ratio token at the very end
    const finalPrompt = promptParts.join(". ") + `. ${selectedPlatform.token}`;
    return finalPrompt;
  };

  const getLedger = () => {
    const selectedPlatform = PLATFORMS.find(p => p.id === platform) || PLATFORMS[0];
    const selectedBackdrop = BACKDROPS.find(b => b.id === backdrop) || BACKDROPS[0];
    
    const swatchesText = books.map((b, i) => {
      const sw = SWATCHES.find(s => s.id === b.swatch) || SWATCHES[0];
      return `Vol ${i+1}: ${sw.name}`;
    }).join(", ");

    const foilText = books.map((b, i) => {
      const fl = FOILS.find(f => f.id === b.foilStyle) || FOILS[0];
      return `Vol ${i+1}: ${fl.name}`;
    }).join(", ");

    return {
      swatch: swatchesText,
      platform: `${selectedPlatform.name} (${selectedPlatform.ratio})`,
      state: state === "closed" 
        ? `${books.length} Closed Book${books.length > 1 ? 's' : ''} (${compositionArrangement})` 
        : `Open spread resting on stack`,
      foil: foilText,
      backdrop: selectedBackdrop.name
    };
  };

  // Compile brand guide compliance checklist
  const checkBrandCompliance = () => {
    const promptText = getCompiledPrompt().toLowerCase();
    
    const swatchesPassed = books.every(b => {
      const s = SWATCHES.find(sw => sw.id === b.swatch);
      return s && (promptText.includes(s.name.toLowerCase()) || promptText.includes(s.hex.toLowerCase()));
    });

    const rules = [
      {
        id: "proportion",
        label: '12"x9" Monograph Proportion',
        desc: 'Prompt must specify the 12"x9" dimensions.',
        passed: promptText.includes('12"x9"') && (promptText.includes('portrait monograph') || promptText.includes('portrait monographs'))
      },
      {
        id: "spine",
        label: "Pristine Blank Spine",
        desc: "Spines must be completely blank, smooth, and free of print.",
        passed: promptText.includes("spine") && (promptText.includes("blank") || promptText.includes("zero printing"))
      },
      {
        id: "title_position",
        label: "Title Placement (1/3 Down)",
        desc: "Volume titles must be placed 1/3 down from the top edge.",
        passed: promptText.includes("one-third (1/3)") || promptText.includes("1/3 of the way")
      },
      {
        id: "logo_position",
        label: "Logo Hallmark Placement",
        desc: "The monogram and brand logo must sit centered near the bottom edge.",
        passed: promptText.includes("near the bottom edge") && promptText.includes("logo hallmark")
      },
      {
        id: "swatch",
        label: "Authorized Color Swatch",
        desc: "All book cover colors must match Ink, Echo, Haze, or Parchment.",
        passed: swatchesPassed
      },
      {
        id: "sunlight",
        label: "Diagonal Ambient Sunlight",
        desc: "Illumination must cast diagonal, geometric morning or warm shadows.",
        passed: promptText.includes("sunlight") && (promptText.includes("diagonally") || promptText.includes("diagonal") || promptText.includes("shadows"))
      },
      {
        id: "clean_cut",
        label: "Clean-Cut Page Edges",
        desc: "Pages must be cut perfectly straight with clean edges (no deckled or ripped page borders).",
        passed: (state === "closed" ? promptText.includes("clean-cut") : (promptText.includes("clean-cut") || promptText.includes("straight edges") || promptText.includes("precise borders"))) && !promptText.includes("deckle") && !promptText.includes("deckled") && !promptText.includes("ripped") && !promptText.includes("torn")
      },
      {
        id: "no_text",
        label: "Pristine Unprinted Pages",
        desc: "Interior pages must contain no printed text, words, page numbers, or label print.",
        passed: state === "closed" ? true : (promptText.includes("no printed text") || promptText.includes("completely clean"))
      },
      {
        id: "no_children",
        label: "Adults-Only Imagery",
        desc: "All photos must feature only adults and strictly contain no children, kids, toddlers, or babies.",
        passed: state === "closed" ? true : (promptText.includes("no children") || promptText.includes("no kids") || promptText.includes("only adults"))
      }
    ];

    const passedCount = rules.filter(r => r.passed).length;
    const score = Math.round((passedCount / rules.length) * 100);

    return {
      score,
      rules,
      isPerfect: score === 100
    };
  };

  const handleGenerateImage = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    setGeneratedImageUrl(null);
    setViewMode("photo");
    
    const selectedPlatform = PLATFORMS.find(p => p.id === platform) || PLATFORMS[0];
    const finalPrompt = getCompiledPrompt();
    
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: finalPrompt,
          aspectRatio: selectedPlatform.ratio
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to generate image.");
      }
      
      if (data.imageUrl) {
        setGeneratedImageUrl(data.imageUrl);
        
        // Add to history list
        const newItem: HistoryItem = {
          id: Math.random().toString(36).substring(2, 9),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          prompt: finalPrompt,
          imageUrl: data.imageUrl,
          settings: {
            platform,
            swatch,
            material,
            state,
            volume: selectedVolume,
            foilStyle,
            lightingStyle,
            backdrop,
            customBackdrop,
            stylingProp,
            customProps,
            photoTheme,
            photoStyle,
            aestheticStyle,
            includeProps,
            paperType,
            spreadLayout,
            books,
            compositionArrangement
          }
        };

        const updatedHistory = [newItem, ...historyList].slice(0, 12); // Limit to 12 history items
        setHistoryList(updatedHistory);
        localStorage.setItem("vv_generation_history", JSON.stringify(updatedHistory));
      } else {
        throw new Error("No image URL returned from the server.");
      }
    } catch (err: any) {
      console.error("Error generating image:", err);
      setGenerationError(err.message || "An unexpected error occurred during generation.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    const compiled = getCompiledPrompt();
    const ledger = getLedger();
    const compliance = checkBrandCompliance();
    const markdownOutput = `\`\`\`markdown\n${compiled}\n\`\`\`\n\n- **Swatch**: ${ledger.swatch}\n- **Format**: ${ledger.platform}\n- **State**: ${ledger.state}\n- **Foil**: ${ledger.foil}\n- **Backdrop**: ${ledger.backdrop}\n- **Brand Compliance Score**: ${compliance.score}%`;
    
    navigator.clipboard.writeText(markdownOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLoadHistory = (item: HistoryItem) => {
    const s = item.settings;
    setPlatform(s.platform);
    setSwatch(s.swatch);
    setMaterial(s.material);
    setState(s.state);
    setSelectedVolume(s.volume);
    setFoilStyle(s.foilStyle);
    setLightingStyle(s.lightingStyle);
    setBackdrop(s.backdrop);
    setCustomBackdrop(s.customBackdrop);
    setStylingProp(s.stylingProp);
    setCustomProps(s.customProps);
    setPhotoTheme(s.photoTheme);
    setPhotoStyle(s.photoStyle);
    setAestheticStyle(s.aestheticStyle);
    setIncludeProps(s.includeProps);
    setPaperType(s.paperType || "hahnemuhle");
    setSpreadLayout(s.spreadLayout || "standard");
    
    // Load multi-volume settings if present, otherwise fallback to single book
    if (s.books && s.books.length > 0) {
      setBooks(s.books);
      setCompositionArrangement(s.compositionArrangement || "stacked");
      // Set active book to the first one in the list
      setActiveBookIndex(0);
      const b = s.books[0];
      setSwatch(b.swatch);
      setMaterial(b.material);
      setSelectedVolume(b.volume);
      setFoilStyle(b.foilStyle);
    } else {
      setBooks([
        {
          id: "book_1",
          swatch: s.swatch,
          material: s.material,
          volume: s.volume,
          foilStyle: s.foilStyle
        }
      ]);
      setActiveBookIndex(0);
      setCompositionArrangement("stacked");
    }
    
    // Set view to display the loaded image
    setGeneratedImageUrl(item.imageUrl);
    setViewMode("photo");
  };

  const handleDeleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = historyList.filter(item => item.id !== id);
    setHistoryList(updated);
    localStorage.setItem("vv_generation_history", JSON.stringify(updated));
    if (generatedImageUrl && !updated.some(item => item.imageUrl === generatedImageUrl)) {
      setGeneratedImageUrl(null);
      setViewMode("draft");
    }
  };

  const compliance = checkBrandCompliance();
  const currentBackdropObj = BACKDROPS.find(b => b.id === backdrop) || BACKDROPS[0];
  const currentSwatchObj = SWATCHES.find(s => s.id === swatch) || SWATCHES[0];
  const currentVolumeObj = VOLUMES.find(v => v.id === selectedVolume) || VOLUMES[0];
  const currentFoilObj = FOILS.find(f => f.id === foilStyle) || FOILS[0];

  return (
    <div id="vv-app-root" className="bg-[#FAF8F5] text-[#1F2022] font-sans min-h-screen flex flex-col antialiased">
      {/* Top Banner Warning */}
      <div className="bg-[#1F2022] text-[#D7CEBE] text-center text-[10px] uppercase tracking-[0.25em] py-2 px-4 border-b border-[#1F2022]/20 flex justify-between items-center">
        <span>Vellum & Vestige Core Director Suite v3.0</span>
        <span className="flex items-center gap-1.5 font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
          {compliance.isPerfect ? "Strict Brand Certified" : "Creative Custom License"}
        </span>
      </div>

      {/* Header Navigation */}
      <header className="border-b border-[#1F2022]/10 px-6 md:px-12 py-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-[#F5F2ED] shadow-sm">
        <div className="text-center flex flex-col items-center">
          <h1 className="text-4xl font-serif tracking-tight leading-none uppercase font-normal text-[#1F2022]">
            Vellum & Vestige
          </h1>
          <p className="text-[9px] tracking-[0.3em] uppercase mt-2 opacity-70 text-[#1F2022] font-bold">
            Art Director & Visual Engine
          </p>
        </div>
        <div className="flex gap-6 text-[11px] uppercase tracking-widest font-semibold">
          <button 
            id="tab-prompt"
            onClick={() => setActiveTab("prompt_engine")}
            className={`pb-1 transition-all border-b-2 ${activeTab === "prompt_engine" ? "border-[#1F2022] text-[#1F2022] font-bold" : "border-transparent opacity-40 hover:opacity-80"}`}
          >
            Prompt Engine
          </button>
          <button 
            id="tab-brand"
            onClick={() => setActiveTab("brand_guide")}
            className={`pb-1 transition-all border-b-2 ${activeTab === "brand_guide" ? "border-b-2 border-[#1F2022] text-[#1F2022] font-bold" : "border-transparent opacity-40 hover:opacity-80"}`}
          >
            Brand Guide
          </button>
          <button 
            id="tab-director"
            onClick={() => setActiveTab("visual_director")}
            className={`pb-1 transition-all border-b-2 ${activeTab === "visual_director" ? "border-b-2 border-[#1F2022] text-[#1F2022] font-bold" : "border-transparent opacity-40 hover:opacity-80"}`}
          >
            Director Notes
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* TAB 1: Main Interactive Form / Prompt Engine */}
        {activeTab === "prompt_engine" && (
          <>
            {/* Sidebar Controls */}
            <section className="w-full lg:w-[450px] border-r border-[#1F2022]/10 p-6 flex flex-col gap-6 bg-[#FCFAF7] overflow-y-auto max-h-[calc(100vh-140px)] scrollbar-thin">
              
              {/* COMPLIANCE SWITCHER */}
              <div className="bg-[#1F2022]/5 p-4 rounded-sm border border-[#1F2022]/10 flex justify-between items-center">
                <div>
                  <h4 className="text-[10px] uppercase font-bold tracking-wider text-[#1F2022]">Compliance Checker</h4>
                  <p className="text-[9px] text-stone-500 italic mt-0.5">Locks controls to V&V Brand Standard</p>
                </div>
                <button
                  onClick={() => setComplianceMode(!complianceMode)}
                  className={`w-12 h-6 rounded-full p-0.5 transition-all duration-300 ${complianceMode ? 'bg-[#C5A059]' : 'bg-stone-300'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-all duration-300 ${complianceMode ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Distribution Channel */}
              <div>
                <label className="text-[10px] uppercase tracking-widest opacity-60 block mb-2 font-bold flex items-center justify-between">
                  <span>I. Distribution Channel</span>
                  <span className="text-[9px] bg-[#1F2022]/5 px-1.5 py-0.5 rounded font-mono">Format</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p.id}
                      id={`platform-btn-${p.id}`}
                      onClick={() => setPlatform(p.id)}
                      className={`border p-2 text-left transition-all rounded-sm ${
                        platform === p.id
                          ? "border-[#1F2022] bg-[#1F2022] text-[#D7CEBE]"
                          : "border-[#1F2022]/20 hover:bg-[#1F2022]/5 text-[#1F2022]"
                      }`}
                    >
                      <div className="text-[10px] uppercase tracking-wider font-bold">{p.name}</div>
                      <div className="text-[8px] opacity-70 font-mono mt-0.5">{p.ratio} • {p.token}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cover Materials & Authorized Swatches */}
              <div>
                <label className="text-[10px] uppercase tracking-widest opacity-60 block mb-2 font-bold flex items-center justify-between">
                  <span>II. Cover & Color Palette</span>
                  <span className="text-[9px] bg-[#1F2022]/5 px-1.5 py-0.5 rounded font-mono">Material</span>
                </label>

                {/* Volume Tab Selector */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1 mb-2 bg-[#1F2022]/5 p-1 rounded-sm border border-[#1F2022]/10">
                    {books.map((book, idx) => (
                      <button
                        key={book.id}
                        onClick={() => selectActiveBook(idx)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 text-[9px] uppercase tracking-wider rounded font-bold transition-all cursor-pointer ${
                          idx === activeBookIndex
                            ? "bg-[#1F2022] text-[#D7CEBE] shadow-sm"
                            : "text-[#1F2022]/60 hover:bg-[#1F2022]/5"
                        }`}
                      >
                        <span>Vol {idx + 1}</span>
                        {books.length > 1 && (
                          <span 
                            onClick={(e) => removeBook(idx, e)}
                            className="hover:text-red-400 font-normal ml-0.5"
                            title="Remove Volume"
                          >
                            ×
                          </span>
                        )}
                      </button>
                    ))}
                    {books.length < 4 && (
                      <button
                        onClick={addBook}
                        className="px-2.5 py-1 text-[9px] uppercase tracking-wider rounded font-bold border border-dashed border-[#1F2022]/30 text-[#1F2022]/60 hover:border-[#1F2022] hover:text-[#1F2022] transition-all cursor-pointer"
                      >
                        + Add Volume
                      </button>
                    )}
                  </div>
                  
                  {/* Arrangement Selection (only visible if multiple books) */}
                  {books.length > 1 && state === "closed" && (
                    <div className="flex justify-between items-center bg-[#FAF8F5] p-2 border border-[#1F2022]/10 rounded-sm mb-2">
                      <span className="text-[9px] uppercase tracking-wider font-semibold text-[#1F2022]/70">Composition Arrangement:</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setCompositionArrangement("stacked")}
                          className={`px-2 py-0.5 text-[8.5px] uppercase tracking-wider rounded-sm font-bold border ${
                            compositionArrangement === "stacked"
                              ? "bg-[#1F2022] text-[#D7CEBE] border-[#1F2022]"
                              : "bg-white text-[#1F2022]/70 border-[#1F2022]/15 hover:bg-[#1F2022]/5"
                          }`}
                        >
                          Stacked
                        </button>
                        <button
                          onClick={() => setCompositionArrangement("row")}
                          className={`px-2 py-0.5 text-[8.5px] uppercase tracking-wider rounded-sm font-bold border ${
                            compositionArrangement === "row"
                              ? "bg-[#1F2022] text-[#D7CEBE] border-[#1F2022]"
                              : "bg-white text-[#1F2022]/70 border-[#1F2022]/15 hover:bg-[#1F2022]/5"
                          }`}
                        >
                          Row
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Material Selection */}
                <div className="flex gap-4 mb-3">
                  {MATERIALS.map((m) => (
                    <button
                      key={m.id}
                      id={`material-btn-${m.id}`}
                      onClick={() => { setMaterial(m.id); updateActiveBook({ material: m.id }); }}
                      className={`flex items-center gap-2 cursor-pointer text-left focus:outline-none transition-all ${
                        material === m.id ? "opacity-100 font-semibold" : "opacity-40 hover:opacity-75"
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full border border-[#1F2022] flex items-center justify-center`}>
                        {material === m.id && <span className="w-1.5 h-1.5 rounded-full bg-[#1F2022]"></span>}
                      </span>
                      <span className="text-[11px] uppercase tracking-wider">{m.name}</span>
                    </button>
                  ))}
                </div>

                {/* Swatch Colors Grid */}
                <div className="grid grid-cols-4 gap-2">
                  {SWATCHES.map((s) => (
                    <button
                      key={s.id}
                      id={`swatch-btn-${s.id}`}
                      onClick={() => { setSwatch(s.id); updateActiveBook({ swatch: s.id }); }}
                      style={{ backgroundColor: s.hex }}
                      className={`aspect-square rounded transition-all focus:outline-none relative group ${
                        swatch === s.id 
                          ? "ring-2 ring-offset-2 ring-[#1F2022] border-white scale-[1.03]" 
                          : "opacity-80 hover:opacity-100 border border-[#1F2022]/10"
                      }`}
                      title={`${s.name} - ${s.desc}`}
                    >
                      <span className={`absolute bottom-1 right-2 text-[8px] font-semibold tracking-tighter ${
                        s.textLight ? "text-white/80" : "text-[#1F2022]/80"
                      }`}>
                        {s.name[0]}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-2 font-serif text-[10px] opacity-60 italic mb-4">
                  <span>Current: <span className="font-semibold text-[#1F2022] uppercase">{swatch}</span></span>
                  <span>{SWATCHES.find(s => s.id === swatch)?.hex}</span>
                </div>

                {/* Paper Stock Selection */}
                <div className="mt-3 pt-3 border-t border-[#1F2022]/10">
                  <label className="text-[9px] uppercase tracking-wider font-semibold text-[#1F2022]/80 block mb-1.5">
                    Interior Paper Stock (Clean-Cut)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setPaperType("hahnemuhle")}
                      className={`border p-1.5 text-[9px] uppercase tracking-wider rounded transition-all font-bold ${
                        paperType === "hahnemuhle"
                          ? "bg-[#1F2022] text-[#D7CEBE] border-[#1F2022]"
                          : "bg-white text-[#1F2022] border-[#1F2022]/20 hover:bg-[#1F2022]/5"
                      }`}
                    >
                      Hahnemühle Art Paper
                    </button>
                    <button
                      onClick={() => setPaperType("giclee")}
                      className={`border p-1.5 text-[9px] uppercase tracking-wider rounded transition-all font-bold ${
                        paperType === "giclee"
                          ? "bg-[#1F2022] text-[#D7CEBE] border-[#1F2022]"
                          : "bg-white text-[#1F2022] border-[#1F2022]/20 hover:bg-[#1F2022]/5"
                      }`}
                    >
                      Semi-Matte Giclée
                    </button>
                  </div>
                </div>
              </div>

              {/* Physical State / Spread */}
              <div>
                <label className="text-[10px] uppercase tracking-widest opacity-60 block mb-2 font-bold flex items-center justify-between">
                  <span>III. Monograph Physical State</span>
                  <span className="text-[9px] bg-[#1F2022]/5 px-1.5 py-0.5 rounded font-mono">Composition</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    id="state-closed-btn"
                    onClick={() => setState("closed")}
                    className={`border p-2 text-center transition-all uppercase text-[10px] tracking-widest font-bold rounded-sm ${
                      state === "closed"
                        ? "border-[#1F2022] bg-[#1F2022] text-[#D7CEBE]"
                        : "border-[#1F2022]/20 hover:bg-[#1F2022]/5"
                    }`}
                  >
                    Closed Cover
                  </button>
                  <button
                    id="state-open-btn"
                    onClick={() => setState("open")}
                    className={`border p-2 text-center transition-all uppercase text-[10px] tracking-widest font-bold rounded-sm ${
                      state === "open"
                        ? "border-[#1F2022] bg-[#1F2022] text-[#D7CEBE]"
                        : "border-[#1F2022]/20 hover:bg-[#1F2022]/5"
                    }`}
                  >
                    Open Spread
                  </button>
                </div>
              </div>

              {/* Dynamic Settings */}
              {state === "closed" ? (
                <div className="space-y-4 p-4 border border-[#1F2022]/10 bg-[#1F2022]/5 rounded-sm">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-bold mb-1 opacity-70">
                    <span>Cover Stamp Customizations</span>
                    <Sliders className="w-3.5 h-3.5" />
                  </div>

                  {/* Volume Selection Option */}
                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-semibold text-[#1F2022]/80 block mb-1">
                      Monograph Volume (Placed 1/3 Down)
                    </label>
                    <select
                      id="volume-select"
                      value={selectedVolume}
                      onChange={(e) => { setSelectedVolume(e.target.value); updateActiveBook({ volume: e.target.value }); }}
                      className="w-full bg-white border border-[#1F2022]/20 rounded p-1.5 text-xs focus:outline-none font-serif text-[#1F2022]"
                    >
                      {VOLUMES.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.label}: {v.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Foil Selection Option */}
                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-semibold text-[#1F2022]/80 block mb-1">
                      VV Hallmark Foil (Placed near bottom)
                    </label>
                    <select
                      id="foil-select"
                      value={foilStyle}
                      onChange={(e) => { setFoilStyle(e.target.value); updateActiveBook({ foilStyle: e.target.value }); }}
                      className="w-full bg-white border border-[#1F2022]/20 rounded p-1.5 text-xs focus:outline-none text-[#1F2022]"
                    >
                      {FOILS.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 p-4 border border-[#1F2022]/10 bg-[#1F2022]/5 rounded-sm">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-bold mb-1 opacity-70">
                    <span>Open Spread Photography Parameters</span>
                    <BookOpen className="w-3.5 h-3.5" />
                  </div>

                  {/* Curated Happy & Heartwarming Photo Themes */}
                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-semibold text-[#1F2022]/80 block mb-1">
                      Happy Photo Subject
                    </label>
                    <select
                      id="photo-theme-select"
                      value={photoTheme}
                      onChange={(e) => setPhotoTheme(e.target.value)}
                      className="w-full bg-white border border-[#1F2022]/20 rounded p-1.5 text-xs focus:outline-none text-[#1F2022]"
                    >
                      {OPEN_PHOTO_THEMES.map(theme => (
                        <option key={theme.id} value={theme.id}>{theme.name} — {theme.desc.substring(0, 32)}...</option>
                      ))}
                    </select>
                  </div>

                  {/* Photography Style */}
                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-semibold text-[#1F2022]/80 block mb-1">
                      Analog Film Color Tone
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {PHOTO_STYLES.map(style => (
                        <button
                          key={style.id}
                          id={`photo-style-${style.id}`}
                          onClick={() => setPhotoStyle(style.id)}
                          className={`border p-1.5 text-[10px] uppercase tracking-wider rounded transition-all ${
                            photoStyle === style.id 
                              ? "bg-[#1F2022] text-[#D7CEBE] border-[#1F2022]" 
                              : "bg-white text-[#1F2022] border-[#1F2022]/20 hover:bg-[#1F2022]/5"
                          }`}
                        >
                          {style.name.split(" ")[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Editorial Spread Layout Selection */}
                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-semibold text-[#1F2022]/80 block mb-1">
                      Editorial Spread Layout
                    </label>
                    <select
                      value={spreadLayout}
                      onChange={(e) => setSpreadLayout(e.target.value)}
                      className="w-full bg-white border border-[#1F2022]/20 rounded p-1.5 text-xs focus:outline-none text-[#1F2022]"
                    >
                      <option value="standard">Standard Double (1 Left, 1 Right)</option>
                      <option value="asymmetric">Asymmetric Dual (Small Left, Large Right)</option>
                      <option value="full_bleed_right">Single Page Full-Bleed (Right Page Only)</option>
                      <option value="panoramic">Panoramic Gutter-Span (Crosses Gutter)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Surface Workspace Background options */}
              <div>
                <label className="text-[10px] uppercase tracking-widest opacity-60 block mb-2 font-bold">
                  IV. Backdrop Display Surface
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {BACKDROPS.map((b) => (
                    <button
                      key={b.id}
                      id={`backdrop-btn-${b.id}`}
                      onClick={() => setBackdrop(b.id)}
                      className={`border p-2 text-left rounded-sm transition-all ${
                        backdrop === b.id
                          ? "border-[#1F2022] bg-[#1F2022]/5 font-semibold"
                          : "border-[#1F2022]/10 hover:bg-[#1F2022]/5 text-[#1F2022]"
                      }`}
                    >
                      <div className="text-[10px] uppercase tracking-tight">{b.name}</div>
                    </button>
                  ))}
                </div>

                {backdrop === "custom" && (
                  <div className="mt-2">
                    <input
                      id="custom-backdrop-input"
                      type="text"
                      value={customBackdrop}
                      onChange={(e) => setCustomBackdrop(e.target.value)}
                      className="w-full bg-[#1F2022]/5 p-2 text-xs font-serif italic border-b border-[#1F2022]/30 focus:outline-none focus:border-[#1F2022] text-[#1F2022]"
                      placeholder="e.g. rough textured grey-beige limestone block"
                    />
                  </div>
                )}
              </div>

              {/* Lighting Options */}
              <div>
                <label className="text-[10px] uppercase tracking-widest opacity-60 block mb-2 font-bold">
                  V. Natural Sunlight Lighting
                </label>
                <select
                  value={lightingStyle}
                  onChange={(e) => setLightingStyle(e.target.value)}
                  className="w-full bg-white border border-[#1F2022]/20 rounded p-2 text-xs focus:outline-none text-[#1F2022]"
                >
                  {LIGHTINGS.map(l => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>

              {/* Preselectable Styling Props */}
              <div className="pt-2 border-t border-[#1F2022]/10">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] uppercase tracking-widest opacity-60 font-bold">
                    VI. Styling Props
                  </label>
                  <input
                    id="include-props-checkbox"
                    type="checkbox"
                    checked={includeProps}
                    onChange={(e) => setIncludeProps(e.target.checked)}
                    className="rounded border-[#1F2022]/30 accent-[#1F2022] w-3.5 h-3.5"
                  />
                </div>
                {includeProps && (
                  <div className="space-y-2">
                    <select
                      value={stylingProp}
                      onChange={(e) => {
                        setStylingProp(e.target.value);
                        const selectedPropObj = PROPS.find(p => p.id === e.target.value);
                        if (selectedPropObj && selectedPropObj.id !== "custom" && selectedPropObj.id !== "none") {
                          setCustomProps(selectedPropObj.desc);
                        }
                      }}
                      className="w-full bg-white border border-[#1F2022]/20 rounded p-2 text-xs focus:outline-none text-[#1F2022]"
                    >
                      {PROPS.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>

                    {(stylingProp === "custom" || stylingProp === "eucalyptus" || stylingProp === "brass_bookmark" || stylingProp === "ceramic_cup" || stylingProp === "travertine_block") && (
                      <input
                        id="custom-props-input"
                        type="text"
                        value={customProps}
                        onChange={(e) => setCustomProps(e.target.value)}
                        disabled={stylingProp !== "custom"}
                        className="w-full bg-[#1F2022]/5 border border-[#1F2022]/10 rounded p-2 text-xs font-serif italic focus:outline-none text-[#1F2022] disabled:opacity-60"
                        placeholder="Customize prop description..."
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Desired Aesthetic Fine-Tuning */}
              <div>
                <label className="text-[10px] uppercase tracking-widest opacity-60 block mb-1.5 font-bold">
                  VII. Creative Fine-Tuning
                </label>
                <textarea
                  id="aesthetic-style-input"
                  value={aestheticStyle}
                  onChange={(e) => setAestheticStyle(e.target.value)}
                  rows={2}
                  className="w-full bg-white border border-[#1F2022]/10 rounded p-2 text-xs font-serif italic focus:outline-none focus:ring-1 focus:ring-[#1F2022] text-[#1F2022] resize-none"
                  placeholder="e.g. Quiet luxury editorial, minimalist, warm natural ambient mood..."
                />
              </div>

            </section>

            {/* Visualizer & Code Output Panel */}
            <section className="flex-1 bg-[#EBE8E3] p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[calc(100vh-140px)] scrollbar-thin">
              
              {/* Preview Canvas */}
              <div className="flex-1 relative flex flex-col items-center justify-center min-h-[420px] py-8">
                
                {/* Mode Selector Tabs */}
                <div className="absolute top-0 left-0 right-0 flex justify-center gap-4 z-20">
                  <div className="bg-[#1F2022]/5 p-0.5 rounded-full flex gap-1 border border-[#1F2022]/10 backdrop-blur-sm">
                    <button
                      onClick={() => setViewMode("draft")}
                      className={`px-4 py-1.5 text-[10px] uppercase tracking-wider font-semibold rounded-full transition-all cursor-pointer ${
                        viewMode === "draft"
                          ? "bg-[#1F2022] text-[#D7CEBE] shadow-md"
                          : "text-[#1F2022]/60 hover:text-[#1F2022]"
                      }`}
                    >
                      CAD Mockup Draft
                    </button>
                    <button
                      onClick={() => {
                        setViewMode("photo");
                        if (!generatedImageUrl && !isGenerating) {
                          handleGenerateImage();
                        }
                      }}
                      className={`px-4 py-1.5 text-[10px] uppercase tracking-wider font-semibold rounded-full transition-all flex items-center gap-1 cursor-pointer ${
                        viewMode === "photo"
                          ? "bg-[#1F2022] text-[#D7CEBE] shadow-md"
                          : "text-[#1F2022]/60 hover:text-[#1F2022]"
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>AI Photorealism</span>
                    </button>
                  </div>
                </div>

                {/* Brand Compliance Floating Status */}
                <div className="absolute top-0 left-4 bg-white/90 backdrop-blur-sm border border-[#1F2022]/10 rounded shadow-sm p-3 text-[10px] max-w-[200px] hidden md:block">
                  <p className="font-bold uppercase tracking-wider flex items-center gap-1 text-[#1F2022] mb-1.5 border-b border-[#1F2022]/10 pb-1">
                    <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                    <span>Compliance Audit</span>
                  </p>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span>Brand Alignment:</span>
                      <span className={`font-mono font-bold ${compliance.isPerfect ? 'text-green-600' : 'text-amber-600'}`}>
                        {compliance.score}%
                      </span>
                    </div>
                    <div className="w-full bg-stone-200 h-1 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${compliance.isPerfect ? 'bg-green-500' : 'bg-amber-500'}`} 
                        style={{ width: `${compliance.score}%` }} 
                      />
                    </div>
                  </div>
                </div>

                {/* Visual Director Floating Note */}
                <div className="absolute top-0 right-4 max-w-[220px] text-[10px] leading-relaxed bg-[#FAF8F5]/90 p-3.5 border border-[#1F2022]/10 shadow-sm backdrop-blur-sm rounded-sm hidden sm:block">
                  <p className="font-bold uppercase mb-1 tracking-tighter text-[#1F2022] flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Visual Core Directive:</span>
                  </p>
                  <p className="font-serif italic text-stone-600">
                    "Volume Title sits 1/3 down from top. Logo hallmark centered near bottom edge. Absolutely blank, smooth spine. Enforce sharp diagonal morning rays."
                  </p>
                </div>

                {/* Main Render Area depending on viewMode */}
                {viewMode === "draft" ? (
                  <>
                    {/* Render Backdrop Container dynamically with custom CSS texture styles */}
                    <div className={`p-10 rounded-sm shadow-inner transition-all duration-500 flex items-center justify-center min-w-[320px] md:min-w-[460px] min-h-[360px] ${currentBackdropObj.cssStyle}`}>
                      
                      {state === "closed" ? (
                        // CLOSED MONOGRAPH MOCKUP (aligned precisely with user's reference photo)
                        <div 
                          id="book-mockup-closed"
                          style={{ 
                            backgroundColor: currentSwatchObj.hex,
                            boxShadow: "25px 35px 55px -15px rgba(0,0,0,0.5), inset -2px -2px 12px rgba(255,255,255,0.05)"
                          }} 
                          className="w-56 h-[300px] relative flex flex-col p-6 transition-all duration-500 rounded-sm border border-white/5 overflow-hidden"
                        >
                          {/* Spine detail effect - Blank Spine enforced */}
                          <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/30 via-black/10 to-transparent"></div>
                          <div className="absolute inset-y-0 left-3 w-[1px] bg-white/5"></div>
                          
                          {/* Linen/Leather tactile textures via CSS Masking or background patterns */}
                          {material === "linen" ? (
                            <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay bg-[radial-gradient(#1f2022_1px,transparent_1px)] [background-size:3px_3px]"></div>
                          ) : (
                            <div className="absolute inset-0 opacity-15 pointer-events-none mix-blend-soft-light bg-[radial-gradient(circle,rgba(255,255,255,0.2)_10%,transparent_20%)] [background-size:5px_5px]"></div>
                          )}

                          {/* Sunlight/shadow overlay simulation */}
                          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-sm z-10">
                            <div className="absolute -left-1/4 top-0 w-[200%] h-full bg-gradient-to-tr from-transparent via-white/8 to-transparent rotate-[30deg] translate-x-4 translate-y-4 blur-md"></div>
                            {/* Sharp shadow from top-left */}
                            <div className="absolute -left-[50%] -top-[50%] w-[120%] h-[120%] bg-black/15 rotate-[35deg] blur-sm"></div>
                          </div>

                          {/* Volume Title - Placed EXACTLY 1/3 of the way down from the top edge */}
                          <div className="mt-[28%] mb-auto flex flex-col items-center text-center px-2 relative z-20 select-none">
                            <p className={`font-serif text-[13px] md:text-[14px] tracking-wide bg-gradient-to-r ${currentFoilObj.textStyle} text-transparent bg-clip-text font-normal leading-relaxed drop-shadow-sm`}>
                              {currentVolumeObj.label}: {currentVolumeObj.title}
                            </p>
                          </div>

                          {/* Hallmark Logo + Brand Text - Centered Bottom */}
                          <div className="relative z-20 text-center mb-1 mt-auto select-none flex flex-col items-center">
                            {/* Elegant custom script 'VV' monogram matching brand assets */}
                            <svg width="60" height="36" viewBox="0 0 80 48" fill="none" className="mb-1.5 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.3)]">
                              <defs>
                                <linearGradient id="svg-foil-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor={foilStyle === 'gold' ? '#E2C98F' : foilStyle === 'silver' ? '#F2F2F2' : foilStyle === 'rose_gold' ? '#F0C2B4' : '#222222'} />
                                  <stop offset="50%" stopColor={foilStyle === 'gold' ? '#C5A059' : foilStyle === 'silver' ? '#CCCCCC' : foilStyle === 'rose_gold' ? '#DCA395' : '#444444'} />
                                  <stop offset="100%" stopColor={foilStyle === 'gold' ? '#99793C' : foilStyle === 'silver' ? '#999999' : foilStyle === 'rose_gold' ? '#B87D70' : '#111111'} />
                                </linearGradient>
                              </defs>
                              <path 
                                d="M 22 24 C 18 24 18 16 23 11 C 29 6 35 12 34 20 C 33 29 27 41 31 44 C 33 46 37 45 40 37 C 43 28 47 16 51 11 C 53 8 56 8 56 13 C 56 20 51 32 49 37 C 47 41 49 43 52 43 C 56 43 64 28 74 21" 
                                stroke="url(#svg-foil-gradient)" 
                                strokeWidth="2.4" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                              />
                            </svg>
                            {/* Uppercase branding name text underneath monogram logo */}
                            <p className={`text-[6.5px] uppercase tracking-[0.3em] font-serif bg-gradient-to-r ${currentFoilObj.textStyle} text-transparent bg-clip-text font-normal`}>
                              Vellum & Vestige
                            </p>
                          </div>

                        </div>
                      ) : (
                        // OPEN SPREAD MOCKUP
                        <div className="flex flex-col items-center">
                          <div className="flex w-[320px] md:w-[440px] h-[210px] md:h-[260px] shadow-[30px_30px_55px_-15px_rgba(0,0,0,0.4)] relative bg-[#FCFAF7] border-y border-stone-200 overflow-hidden">
                            
                            {/* Center page fold shadow */}
                            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-4 bg-gradient-to-r from-black/10 via-black/25 to-black/10 z-20 pointer-events-none"></div>

                            {/* Hahnemühle paper grain/texture effect */}
                            {paperType === "hahnemuhle" && (
                              <div className="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-multiply bg-[radial-gradient(#1f2022_1px,transparent_1px)] [background-size:2px_2px] z-10"></div>
                            )}

                            {/* Layout-specific mockup page content (COMPLETELY UNPRINTED, no words on pages) */}
                            {spreadLayout === "standard" && (
                              <>
                                {/* Left Page */}
                                <div className="w-1/2 h-full bg-[#FCFAF7] relative border-r border-stone-100 flex items-center justify-center p-4">
                                  <div className="absolute inset-0 bg-stone-500/5 mix-blend-multiply rounded-l-sm"></div>
                                  <div className="w-[80%] h-[75%] bg-stone-100 border border-stone-200/60 shadow-sm relative overflow-hidden flex items-center justify-center">
                                    <div className={`absolute inset-0 ${
                                      photoStyle === "bw" 
                                        ? "bg-gradient-to-br from-stone-300 via-stone-400 to-stone-500 grayscale" 
                                        : "bg-gradient-to-br from-amber-100/40 via-orange-100/30 to-amber-900/10"
                                    } opacity-50 mix-blend-multiply z-10`}></div>
                                    <svg className="w-6 h-6 opacity-30 text-stone-600 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                </div>

                                {/* Right Page */}
                                <div className="w-1/2 h-full bg-[#FCFAF7] relative flex items-center justify-center p-4">
                                  <div className="absolute inset-0 bg-stone-500/5 mix-blend-multiply rounded-r-sm"></div>
                                  <div className="w-[80%] h-[75%] bg-stone-100 border border-stone-200/60 shadow-sm relative overflow-hidden flex items-center justify-center">
                                    <div className={`absolute inset-0 ${
                                      photoStyle === "bw" 
                                        ? "bg-gradient-to-br from-stone-300 via-stone-400 to-stone-500 grayscale" 
                                        : "bg-gradient-to-br from-amber-100/40 via-orange-100/30 to-amber-900/10"
                                    } opacity-50 mix-blend-multiply z-10`}></div>
                                    <svg className="w-6 h-6 opacity-30 text-stone-600 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                </div>
                              </>
                            )}

                            {spreadLayout === "asymmetric" && (
                              <>
                                {/* Left Page (Small Photo) */}
                                <div className="w-1/2 h-full bg-[#FCFAF7] relative border-r border-stone-100 flex items-center justify-center p-4">
                                  <div className="absolute inset-0 bg-stone-500/5 mix-blend-multiply rounded-l-sm"></div>
                                  <div className="w-[60%] h-[55%] bg-stone-100 border border-stone-200/60 shadow-sm relative overflow-hidden flex items-center justify-center">
                                    <div className={`absolute inset-0 ${
                                      photoStyle === "bw" 
                                        ? "bg-gradient-to-br from-stone-300 via-stone-400 to-stone-500 grayscale" 
                                        : "bg-gradient-to-br from-amber-100/40 via-orange-100/30 to-amber-900/10"
                                    } opacity-50 mix-blend-multiply z-10`}></div>
                                    <svg className="w-4 h-4 opacity-25 text-stone-600 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                </div>

                                {/* Right Page (Large Photo) */}
                                <div className="w-1/2 h-full bg-[#FCFAF7] relative flex items-center justify-center p-4">
                                  <div className="absolute inset-0 bg-stone-500/5 mix-blend-multiply rounded-r-sm"></div>
                                  <div className="w-[90%] h-[85%] bg-stone-100 border border-stone-200/60 shadow-md relative overflow-hidden flex items-center justify-center">
                                    <div className={`absolute inset-0 ${
                                      photoStyle === "bw" 
                                        ? "bg-gradient-to-br from-stone-300 via-stone-400 to-stone-500 grayscale" 
                                        : "bg-gradient-to-br from-amber-100/40 via-orange-100/30 to-amber-900/10"
                                    } opacity-50 mix-blend-multiply z-10`}></div>
                                    <svg className="w-8 h-8 opacity-35 text-stone-600 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                </div>
                              </>
                            )}

                            {spreadLayout === "full_bleed_right" && (
                              <>
                                {/* Left Page (Empty Blank Paper) */}
                                <div className="w-1/2 h-full bg-[#FCFAF7] relative border-r border-stone-100">
                                  <div className="absolute inset-0 bg-stone-500/5 mix-blend-multiply rounded-l-sm"></div>
                                </div>

                                {/* Right Page (Full Bleed Photo) */}
                                <div className="w-1/2 h-full bg-stone-100 relative overflow-hidden flex items-center justify-center">
                                  <div className="absolute inset-0 bg-stone-500/5 mix-blend-multiply rounded-r-sm"></div>
                                  <div className={`absolute inset-0 ${
                                    photoStyle === "bw" 
                                      ? "bg-gradient-to-br from-stone-300 via-stone-400 to-stone-500 grayscale" 
                                      : "bg-gradient-to-br from-amber-100/40 via-orange-100/30 to-amber-900/10"
                                  } opacity-55 mix-blend-multiply z-10`}></div>
                                  <svg className="w-10 h-10 opacity-30 text-stone-600 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              </>
                            )}

                            {spreadLayout === "panoramic" && (
                              <>
                                {/* Left Background Page */}
                                <div className="w-1/2 h-full bg-[#FCFAF7] relative border-r border-stone-100">
                                  <div className="absolute inset-0 bg-stone-500/5 mix-blend-multiply rounded-l-sm"></div>
                                </div>
                                {/* Right Background Page */}
                                <div className="w-1/2 h-full bg-[#FCFAF7] relative">
                                  <div className="absolute inset-0 bg-stone-500/5 mix-blend-multiply rounded-r-sm"></div>
                                </div>

                                {/* Panoramic Photo centered crossing gutter */}
                                <div className="absolute left-[8%] right-[8%] top-[10%] bottom-[10%] bg-stone-100 border border-stone-200/60 shadow-lg z-10 overflow-hidden flex items-center justify-center">
                                  <div className={`absolute inset-0 ${
                                    photoStyle === "bw" 
                                      ? "bg-gradient-to-br from-stone-300 via-stone-400 to-stone-500 grayscale" 
                                      : "bg-gradient-to-br from-amber-100/40 via-orange-100/30 to-amber-900/10"
                                  } opacity-50 mix-blend-multiply z-10`}></div>
                                  <svg className="w-10 h-10 opacity-30 text-stone-600 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              </>
                            )}

                            {/* Protruding cover edges (stacked pile simulation) */}
                            {books.map((book, idx) => {
                              const bSwatch = SWATCHES.find(s => s.id === book.swatch) || SWATCHES[0];
                              const borderOffset = idx * 2.5; // Offset each book downward slightly
                              const leftRightOffset = idx * 1.5;
                              return (
                                <div 
                                  key={book.id}
                                  style={{ 
                                    backgroundColor: bSwatch.hex,
                                    bottom: `${-3 - borderOffset}px`,
                                    left: `${2 + leftRightOffset}px`,
                                    right: `${2 + leftRightOffset}px`,
                                    height: '3px',
                                    zIndex: 30 - idx
                                  }} 
                                  className="absolute shadow-sm rounded-b-sm border-t border-black/10 transition-all duration-300"
                                ></div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                    </div>

                    {/* Generate trigger */}
                    <div className="mt-6 flex flex-col items-center">
                      <button
                        onClick={handleGenerateImage}
                        className="flex items-center gap-2 bg-[#1F2022] hover:bg-[#1f2022]/90 text-[#D7CEBE] px-6 py-3 rounded text-xs uppercase tracking-widest font-bold shadow-md transition-all hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 text-[#C5A059]" />
                        <span>Generate Photorealistic Art</span>
                      </button>
                      <p className="text-[9px] opacity-60 mt-2 text-center max-w-xs font-serif italic">
                        "Trigger the server-side Imagen core to compile these dynamic materials into a final gallery photograph."
                      </p>
                    </div>
                  </>
                ) : (
                  /* PHOTO MODE: Loading state, success view, or error view */
                  <div className="w-full max-w-xl bg-[#FAF8F5] p-6 rounded border border-[#1F2022]/10 shadow-lg relative flex flex-col items-center justify-center min-h-[340px] text-center">
                    {isGenerating ? (
                      <div className="flex flex-col items-center justify-center text-center p-8">
                        <div className="w-10 h-10 border-2 border-[#1F2022]/10 border-t-[#C5A059] rounded-full animate-spin mb-6"></div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#1F2022]/60 font-semibold mb-2">
                          AI Director Rendering Phase
                        </p>
                        <h3 className="font-serif italic text-sm text-[#1F2022] animate-pulse duration-[3000ms] min-h-[48px] max-w-md flex items-center justify-center">
                          "{LOADING_QUOTES[loadingQuoteIndex]}"
                        </h3>
                        <div className="w-48 h-[1px] bg-gradient-to-r from-transparent via-[#C5A059]/40 to-transparent mt-4"></div>
                        <p className="text-[9px] text-[#1F2022]/40 font-mono mt-3 uppercase tracking-wider">
                          Engaged model: gemini-2.5-flash-image
                        </p>
                      </div>
                    ) : generationError ? (
                      <div className="flex flex-col items-center justify-center text-center p-6 max-w-md">
                        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4">
                          <AlertCircle className="w-6 h-6" />
                        </div>
                        <h3 className="font-serif text-lg text-red-950 mb-2 font-bold">Generation Refused</h3>
                        <p className="text-xs text-red-700/80 mb-6 font-serif italic">
                          {generationError}
                        </p>
                        <div className="flex gap-4">
                          <button
                            onClick={handleGenerateImage}
                            className="bg-[#1F2022] hover:bg-[#1f2022]/90 text-[#D7CEBE] px-4 py-2 rounded text-[10px] uppercase tracking-widest font-bold transition-all cursor-pointer"
                          >
                            Retry Generation
                          </button>
                          <button
                            onClick={() => setViewMode("draft")}
                            className="bg-stone-200 hover:bg-stone-300 text-stone-700 px-4 py-2 rounded text-[10px] uppercase tracking-widest font-bold transition-all cursor-pointer"
                          >
                            Back to Draft
                          </button>
                        </div>
                      </div>
                    ) : generatedImageUrl ? (
                      <div className="flex flex-col items-center w-full">
                        <div className="relative border-4 border-white shadow-2xl rounded-sm overflow-hidden bg-stone-100 max-h-[300px] flex items-center justify-center select-none">
                          <img
                            src={generatedImageUrl}
                            alt="Vellum & Vestige Generated Artwork Mockup"
                            referrerPolicy="no-referrer"
                            className="max-h-[290px] object-contain transition-all duration-500 hover:scale-105"
                          />
                          <div className="absolute top-2 right-2 bg-black/60 text-[#D7CEBE] text-[8px] px-2 py-0.5 rounded backdrop-blur-sm uppercase tracking-widest font-mono">
                            {PLATFORMS.find(p => p.id === platform)?.ratio} Art
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex gap-4 mt-6">
                          <a
                            href={generatedImageUrl}
                            download={`vellum_vestige_${selectedVolume}.png`}
                            className="bg-[#1F2022] hover:bg-[#1f2022]/90 text-[#D7CEBE] px-4 py-2 rounded text-[10px] uppercase tracking-widest font-bold transition-all hover:scale-105 cursor-pointer flex items-center gap-1.5 shadow-sm"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download Masterpiece</span>
                          </a>
                          <button
                            onClick={() => setViewMode("draft")}
                            className="bg-stone-200 hover:bg-stone-300 text-stone-700 px-4 py-2 rounded text-[10px] uppercase tracking-widest font-bold transition-all cursor-pointer"
                          >
                            Modify Settings
                          </button>
                        </div>

                        <p className="text-[9px] text-[#1F2022]/50 font-serif italic mt-3 text-center max-w-sm">
                          "Successfully compiled by Google GenAI. Note: you can use 'Modify Settings' to alter cover, materials, backdrop or themes, and generate a new photorealistic photo."
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center p-8">
                        <Sparkles className="w-10 h-10 text-[#C5A059] mb-4 animate-pulse" />
                        <h3 className="font-serif text-base text-[#1F2022] mb-1 font-bold">Unrendered Masterpiece</h3>
                        <p className="text-xs text-stone-500 font-serif italic mb-6 max-w-xs">
                          No masterpiece has been rendered yet. Click below to compile your settings.
                        </p>
                        <button
                          onClick={handleGenerateImage}
                          className="bg-[#1F2022] hover:bg-[#1F2022]/90 text-[#D7CEBE] px-5 py-2.5 rounded text-[10px] uppercase tracking-widest font-bold transition-all cursor-pointer"
                        >
                          Generate Now
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Perspective shadow */}
                <div className="w-80 h-10 bg-black/5 blur-3xl rounded-full mt-4"></div>
              </div>

              {/* Code / Compiled Directive Output */}
              <div className="bg-[#1F2022] text-[#D7CEBE] rounded-sm p-5 font-mono text-xs relative shadow-lg">
                <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                    <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-[#C5A059]">
                      Compiled Prompt Output
                    </span>
                  </div>
                  <button 
                    id="copy-prompt-btn"
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold transition-all cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-[#C5A059]" />}
                    <span>{copied ? "Copied!" : "Copy Markdown"}</span>
                  </button>
                </div>

                {/* Core Generated Text Block */}
                <div className="bg-[#17181A] p-4 rounded border border-white/5 max-h-[120px] overflow-y-auto text-[11px] leading-relaxed select-all scrollbar-thin">
                  <p className="text-[#C5A059] font-bold mb-1">// Compiled V&V Art Director Directive</p>
                  <p className="opacity-90">{getCompiledPrompt()}</p>
                </div>

                {/* 3-Bullet Ledger */}
                <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap gap-x-6 gap-y-2 text-[9px] uppercase tracking-widest text-white/50">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]"></span>
                    {getLedger().swatch}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]"></span>
                    {getLedger().platform}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]"></span>
                    {getLedger().state}
                  </span>
                </div>
              </div>

              {/* History Gallery Section */}
              {historyList.length > 0 && (
                <div className="mt-8 pt-6 border-t border-[#1F2022]/10">
                  <div className="flex items-center gap-2 mb-3">
                    <History className="w-4 h-4 text-[#C5A059]" />
                    <h3 className="text-[10px] uppercase tracking-widest font-bold text-[#1F2022]">
                      Art Director Generation History ({historyList.length})
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {historyList.map(item => (
                      <div 
                        key={item.id}
                        onClick={() => handleLoadHistory(item)}
                        className="group relative bg-[#FCFAF7] border border-[#1F2022]/10 rounded p-1.5 cursor-pointer hover:border-[#1F2022] hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div className="aspect-square bg-stone-100 rounded-sm overflow-hidden mb-1 relative flex items-center justify-center">
                          <img 
                            src={item.imageUrl} 
                            alt="History thumbnail" 
                            className="object-cover w-full h-full group-hover:scale-115 transition-all duration-300"
                          />
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-[7.5px] font-mono text-stone-500">{item.timestamp}</span>
                          <button
                            onClick={(e) => handleDeleteHistoryItem(item.id, e)}
                            className="opacity-0 group-hover:opacity-100 hover:text-red-600 transition-all p-0.5 text-stone-400"
                            title="Delete Item"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </section>
          </>
        )}

        {/* TAB 2: Brand Guide Guardrails */}
        {activeTab === "brand_guide" && (
          <section className="flex-1 bg-[#FCFAF7] p-6 md:p-12 overflow-y-auto max-h-[calc(100vh-140px)] scrollbar-thin">
            <div className="max-w-4xl mx-auto">
              <div className="border-b border-[#1F2022]/10 pb-6 mb-8">
                <span className="text-[10px] tracking-[0.3em] uppercase bg-[#1F2022] text-[#D7CEBE] px-3 py-1 font-semibold rounded-sm">
                  Official Brand Guide Rules (Revised)
                </span>
                <h2 className="text-4xl font-serif uppercase tracking-tight text-[#1F2022] mt-4 font-normal font-semibold">
                  Vellum & Vestige Brand Guardrails
                </h2>
                <p className="text-sm font-serif italic text-stone-600 mt-2">
                  "Unyielding boundaries establishing physical, mechanical, and color compliance."
                </p>
              </div>

              {/* Compliance Checker Visual Report */}
              <div className="mb-10 bg-[#1F2022]/5 p-6 rounded-sm border border-[#1F2022]/10">
                <h3 className="font-serif text-lg font-normal mb-4 text-[#1F2022] flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
                  <span>Real-time Brand Audit Ledger</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {compliance.rules.map(rule => (
                    <div key={rule.id} className="bg-[#FCFAF7] p-3 border border-stone-200 rounded flex items-start gap-3">
                      {rule.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      )}
                      <div>
                        <p className={`text-[11px] uppercase tracking-wider font-bold ${rule.passed ? 'text-stone-800' : 'text-amber-800'}`}>
                          {rule.label}
                        </p>
                        <p className="text-[10px] text-stone-500 leading-tight mt-0.5">{rule.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div className="space-y-6">
                  
                  {/* Rule 1 */}
                  <div className="border-l-2 border-[#C5A059] pl-4">
                    <h3 className="font-serif uppercase text-xs tracking-wider font-bold text-[#1F2022]">
                      1. Physical Portraiture & Ratio
                    </h3>
                    <p className="text-stone-700 mt-1.5 text-[13px]">
                      The monograph must be explicitly presented with a premium structural ratio of 12" vertical height by 9" width. It must possess a thick, substantial, high-density book block with clean-cut, perfectly stacked straight edges.
                    </p>
                  </div>

                  {/* Rule 2 */}
                  <div className="border-l-2 border-[#C5A059] pl-4">
                    <h3 className="font-serif uppercase text-xs tracking-wider font-bold text-[#1F2022]">
                      2. The Blank Spine Rule
                    </h3>
                    <p className="text-stone-700 mt-1.5 text-[13px]">
                      Under no circumstances may text, foil, or markings appear on the book spine. The spine must always be described as "completely blank, smooth, and solid-toned cover material with zero printing."
                    </p>
                  </div>

                  {/* Rule 3 */}
                  <div className="border-l-2 border-[#C5A059] pl-4">
                    <h3 className="font-serif uppercase text-xs tracking-wider font-bold text-[#1F2022]">
                      3. Authorized Color Palettes
                    </h3>
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      {SWATCHES.map(s => (
                        <div key={s.id} className="flex items-center gap-2 p-1.5 bg-[#FAF8F5] rounded border border-stone-200">
                          <span style={{ backgroundColor: s.hex }} className="w-5 h-5 rounded border border-black/10 block"></span>
                          <div className="text-[10px]">
                            <p className="font-bold">{s.name}</p>
                            <p className="text-[8px] font-mono text-stone-500">{s.hex}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rule 7 */}
                  <div className="border-l-2 border-[#C5A059] pl-4">
                    <h3 className="font-serif uppercase text-xs tracking-wider font-bold text-[#1F2022]">
                      7. Pristine Unprinted Pages
                    </h3>
                    <p className="text-stone-700 mt-1.5 text-[13px]">
                      Under no circumstances may printed words, titles, captions, page numbers, or watermark labels appear on interior spread pages. The pages must remain completely blank, clean, and silent, leaving the photographs as the sole visual content.
                    </p>
                  </div>

                  {/* Rule 9 */}
                  <div className="border-l-2 border-[#C5A059] pl-4">
                    <h3 className="font-serif uppercase text-xs tracking-wider font-bold text-[#1F2022]">
                      9. Adults-Only Photographic Content
                    </h3>
                    <p className="text-stone-700 mt-1.5 text-[13px]">
                      All photographic imagery printed on the interior pages of the open spreads must feature only adults and strictly contain no children, kids, toddlers, or babies. This guarantees full compatibility with downstream AI animation and reel tools.
                    </p>
                  </div>

                </div>

                <div className="space-y-6">
                  
                  {/* Rule 4 */}
                  <div className="border-l-2 border-[#C5A059] pl-4">
                    <h3 className="font-serif uppercase text-xs tracking-wider font-bold text-[#1F2022]">
                      4. Upper-Third Title & Bottom-Centered Logo
                    </h3>
                    <p className="text-stone-700 mt-1.5 text-[13px]">
                      The volume label title must sit exactly **one-third (1/3) of the way from the top** of the book cover. The elegant 'VV' monogram logo hallmark must sit centered **near the bottom edge** of the front cover with 'VELLUM & VESTIGE' underneath.
                    </p>
                  </div>

                  {/* Rule 5 */}
                  <div className="border-l-2 border-[#C5A059] pl-4">
                    <h3 className="font-serif uppercase text-xs tracking-wider font-bold text-[#1F2022]">
                      5. Directional Ambient Sunlight
                    </h3>
                    <p className="text-stone-700 mt-1.5 text-[13px]">
                      Every setting must feature natural, daylight-balanced, directional illumination. Prompts must request "sharp, defined diagonal rays of morning sunlight casting long geometric shadows from the side," catching physical cover textures.
                    </p>
                  </div>

                  {/* Rule 6 */}
                  <div className="border-l-2 border-[#C5A059] pl-4">
                    <h3 className="font-serif uppercase text-xs tracking-wider font-bold text-[#1F2022]">
                      6. Display Surfaces & Props
                    </h3>
                    <p className="text-stone-700 mt-1.5 text-[13px]">
                      Volume must be grounded on organic matte surfaces such as travertine patios, concrete, dark walnut, oak, linen beds, or exhibition pedestals. Keep styling props minimalist (dried eucalyptus, raw brass bookmarks, hand-thrown ceramics).
                    </p>
                  </div>

                  {/* Rule 8 */}
                  <div className="border-l-2 border-[#C5A059] pl-4">
                    <h3 className="font-serif uppercase text-xs tracking-wider font-bold text-[#1F2022]">
                      8. Editorial Spread Composition
                    </h3>
                    <p className="text-stone-700 mt-1.5 text-[13px]">
                      The pages must display either textured Hahnemühle Art Paper or smooth semi-matte Giclée paper, always cut perfectly straight with clean edges. Each page can contain at most one photo, and the entire spread can have at most two photos, with layout options ranging from standard, asymmetric, full-bleed, to panoramic gutter-spanning.
                    </p>
                  </div>

                </div>
              </div>
            </div>
          </section>
        )}

        {/* TAB 3: Visual Director Notes */}
        {activeTab === "visual_director" && (
          <section className="flex-1 bg-[#FCFAF7] p-6 md:p-12 overflow-y-auto max-h-[calc(100vh-140px)] scrollbar-thin">
            <div className="max-w-4xl mx-auto">
              <div className="border-b border-[#1F2022]/10 pb-6 mb-8">
                <span className="text-[10px] tracking-[0.3em] uppercase bg-[#1F2022] text-[#D7CEBE] px-3 py-1 font-semibold rounded-sm">
                  Director Archives
                </span>
                <h2 className="text-4xl font-serif uppercase tracking-tight text-[#1F2022] mt-4 font-normal font-semibold font-serif">
                  Creative Intent & Narrative Theory
                </h2>
                <p className="text-sm font-serif italic text-stone-600 mt-2">
                  "Understanding the soul behind Vellum & Vestige: A synthesis of tactile luxury and heartwarming humanity."
                </p>
              </div>

              <div className="space-y-8 text-sm leading-relaxed text-stone-800">
                <div>
                  <h3 className="font-serif uppercase text-xs tracking-wider font-bold text-[#1F2022] mb-2 font-serif">
                    The Layout Hierarchy (User Reference Aligned)
                  </h3>
                  <p>
                    A standard monograph cover requires a balance of weight. Centering the volume title in the upper-third ($1/3$ from the top edge) aligns with traditional typography and publication layout. Leaving the spine completely silent creates humble elegance, while placing the 'VV' brand insignia near the bottom anchors the physical monograph, reinforcing its presence and authority.
                  </p>
                </div>

                <div>
                  <h3 className="font-serif uppercase text-xs tracking-wider font-bold text-[#1F2022] mb-2 font-serif">
                    Backdrop Settings & Tactile Contrast
                  </h3>
                  <p className="mb-3">
                    We select display surfaces that offer organic tactile density to contrast with the linen and gold foils:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-[13px] text-stone-700">
                    <li>
                      <strong>Travertine & Concrete:</strong> Raw architectural textures. Travertine adds warm sandy pitting, while concrete offers raw industrial grey contrasts.
                    </li>
                    <li>
                      <strong>Dark Walnut & Oak:</strong> Fine furniture grains. Dark walnut adds rich, dark wood contrasts, while light oak offers a clean, modern Scandinavian feel.
                    </li>
                    <li>
                      <strong>Wrinkled Linen Bedding:</strong> Soft, humanized household setting. Warm natural shadow folds and soft light play off the heavy linen bedding fabric.
                    </li>
                  </ul>
                </div>

                <div className="bg-[#1F2022] text-[#D7CEBE] p-6 rounded-sm">
                  <h4 className="font-serif uppercase text-xs tracking-widest text-[#C5A059] mb-2 font-serif font-semibold">
                    Lighting Doctrine: The Diagonal Rule
                  </h4>
                  <p className="text-[13px] opacity-95 leading-relaxed">
                    We never use studio softbox light or overhead flat light. Ambient morning sunlight coming diagonally from the side (at approximately 25 degrees) creates long geometric shadow lines that trace the linen fabric weave and gold foil elevations, providing realistic relief and photographic truth.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

      </div>

      {/* Footer Meta Details */}
      <footer className="bg-[#1F2022] text-[#D7CEBE] px-6 md:px-12 py-5 flex flex-col sm:flex-row justify-between items-center text-[10px] tracking-widest uppercase border-t border-[#D7CEBE]/10 gap-3 font-semibold">
        <span>Vellum & Vestige © 2026</span>
        <div className="flex flex-wrap justify-center gap-6">
          <span>Compliance: 100% Guaranteed</span>
          <span>Ratio: 12" x 9" Structural</span>
          <span>Edge: Precisely Cut Borders</span>
        </div>
      </footer>
    </div>
  );
}
