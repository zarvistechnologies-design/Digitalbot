const fs = require('fs');
const path = require('path');

// ============================================================
// REVERT: Restore per-page theme colors in solution pages
// From: everything orange → To: per-page solid colors
// Also restore: font sizes, blob opacity, gradient text
// ============================================================

const baseDir = path.join(__dirname, 'app', 'solutions');

// Per-page: primary color, gradient from, gradient to
const pages = {
  'recruitment':        { p: 'sky',     f: 'sky',     t: 'blue' },
  'education':          { p: 'blue',    f: 'blue',    t: 'cyan' },
  'car-dealership':     { p: 'orange',  f: 'orange',  t: 'amber' },
  'real-estate':        { p: 'green',   f: 'green',   t: 'emerald' },
  'healthcare':         { p: 'emerald', f: 'emerald', t: 'teal' },
  'insurance':          { p: 'teal',    f: 'teal',    t: 'cyan' },
  'ecommerce':          { p: 'orange',  f: 'orange',  t: 'red' },
  'coaching':           { p: 'purple',  f: 'purple',  t: 'violet' },
  'consulting':         { p: 'indigo',  f: 'indigo',  t: 'blue' },
  'marketing':          { p: 'pink',    f: 'pink',    t: 'rose' },
  'bpo':                { p: 'rose',    f: 'rose',    t: 'pink' },
  'financial-services': { p: 'emerald', f: 'emerald', t: 'green' },
  'automobile':         { p: 'red',     f: 'red',     t: 'orange' },
  'saas':               { p: 'violet',  f: 'violet',  t: 'purple' },
  'accounting-legal':   { p: 'amber',   f: 'amber',   t: 'yellow' },
  'it-services':        { p: 'cyan',    f: 'cyan',    t: 'blue' },
};

// Tailwind utility prefixes
const utilPrefixes = 'text|bg|border|shadow|ring|ring-offset|divide|from|to|via|fill|stroke|accent|caret|decoration|outline|placeholder';

for (const [slug, { p, f, t }] of Object.entries(pages)) {
  const filePath = path.join(baseDir, slug, 'page.tsx');
  if (!fs.existsSync(filePath)) { console.log(`Skipped: ${slug}`); continue; }

  let c = fs.readFileSync(filePath, 'utf-8');

  // ============================
  // STEP 1: RESTORE PER-PAGE COLORS (orange → per-page)
  // ============================
  // Replace all orange-{shade} with {p}-{shade} for all utility prefixes
  // Be careful: only replace in modifier chains + utility patterns
  const colorRegex = new RegExp(
    `((?:[a-zA-Z0-9-]+:)*(?:${utilPrefixes})-)orange(-\\d+(?:\\/\\d+)?)`,
    'g'
  );
  c = c.replace(colorRegex, `$1${p}$2`);

  // ============================
  // STEP 2: RESTORE GRADIENT TEXT IN HEADINGS
  // ============================
  // Hero h1 colored span: text-{p}-500 → bg-gradient-to-r from-{f}-400 to-{t}-400 bg-clip-text text-transparent
  // Find span inside h1 with text-{p}-500
  c = c.replace(
    /(<h1[^>]*>[\s\S]*?<span className=")text-[a-z]+-500(">[^<]+<\/span>[\s\S]*?<\/h1>)/g,
    (match, before, after) => {
      return before + `bg-gradient-to-r from-${f}-400 to-${t}-400 bg-clip-text text-transparent` + after;
    }
  );

  // Section h2 "Our AI" span: text-{p}-500 → bg-gradient-to-r from-{f}-400 to-{t}-400 bg-clip-text text-transparent
  c = c.replace(
    /Advantages of Using <span className="text-[a-z]+-500">Our AI<\/span>/g,
    `Advantages of Using <span className="bg-gradient-to-r from-${f}-400 to-${t}-400 bg-clip-text text-transparent">Our AI</span>`
  );

  // "vs" span in competitive edge
  c = c.replace(
    /You With AI <span className="text-[a-z]+-500">vs<\/span>/g,
    `You With AI <span className="bg-gradient-to-r from-${f}-400 to-${t}-400 bg-clip-text text-transparent">vs</span>`
  );

  // ============================
  // STEP 3: RESTORE FONT SIZES
  // ============================
  // h1: text-3xl sm:text-4xl lg:text-5xl → text-4xl sm:text-5xl lg:text-6xl
  c = c.replace(/<h1([^>]*?)text-3xl sm:text-4xl lg:text-5xl/g, '<h1$1text-4xl sm:text-5xl lg:text-6xl');
  
  // h2: text-2xl sm:text-3xl lg:text-4xl → text-3xl sm:text-4xl lg:text-5xl
  c = c.replace(/(<h2[^>]*?)text-2xl sm:text-3xl lg:text-4xl/g, '$1text-3xl sm:text-4xl lg:text-5xl');

  // ============================
  // STEP 4: RESTORE BLOB OPACITY
  // ============================
  // Advantages section blobs
  c = c.replace(/bg-[a-z]+-50\/15 rounded-full blur-2xl/g, `bg-${p}-100/40 rounded-full blur-2xl`);
  c = c.replace(/bg-[a-z]+-100\/10 rounded-full blur-3xl/g, `bg-${p}-200/30 rounded-full blur-3xl`);
  c = c.replace(/bg-[a-z]+-50\/10 rounded-full blur-3xl/g, `bg-${p}-200/20 rounded-full blur-3xl`);
  
  // Advantages background
  c = c.replace(new RegExp(`bg-${p}-50\\/15"`, 'g'), `bg-gradient-to-b from-${p}-50/60 via-white to-white"`);
  
  // Competitive edge background
  c = c.replace(new RegExp(`bg-${p}-50\\/20"`, 'g'), `bg-gradient-to-b from-white via-${p}-50/20 to-white"`);

  // ============================
  // STEP 5: RESTORE GRADIENT ELEMENTS (icon boxes, banners, etc.)
  // ============================
  // Icon boxes: bg-{p}-500 rounded-2xl flex items-center → bg-gradient-to-br from-{f}-400 to-{t}-400 rounded-2xl flex items-center
  c = c.replace(
    new RegExp(`bg-${p}-500 rounded-2xl flex items-center justify-center mb-6`, 'g'),
    `bg-gradient-to-br from-${f}-400 to-${t}-400 rounded-2xl flex items-center justify-center mb-6`
  );

  // Card hover glow: bg-{p}-400 rounded-3xl opacity-0 → bg-gradient-to-r from-{f}-400 to-{t}-400 rounded-3xl opacity-0
  c = c.replace(
    new RegExp(`bg-${p}-400 rounded-3xl opacity-0`, 'g'),
    `bg-gradient-to-r from-${f}-400 to-${t}-400 rounded-3xl opacity-0`
  );

  // Bot banner: bg-{p}-500 rounded-3xl p-8 → bg-gradient-to-r from-{f}-400 to-{t}-400 rounded-3xl p-8
  c = c.replace(
    new RegExp(`bg-${p}-500 rounded-3xl p-8`, 'g'),
    `bg-gradient-to-r from-${f}-400 to-${t}-400 rounded-3xl p-8`
  );

  // Table header: bg-{p}-500 text-center → bg-gradient-to-r from-{f}-400 to-{t}-400 text-center
  c = c.replace(
    new RegExp(`bg-${p}-500 text-center`, 'g'),
    `bg-gradient-to-r from-${f}-400 to-${t}-400 text-center`
  );

  // Row number badges: bg-{p}-500 rounded-lg flex → bg-gradient-to-br from-{f}-400 to-{t}-400 rounded-lg flex
  c = c.replace(
    new RegExp(`bg-${p}-500 rounded-lg flex items-center justify-center text-white`, 'g'),
    `bg-gradient-to-br from-${f}-400 to-${t}-400 rounded-lg flex items-center justify-center text-white`
  );

  // Problems top bar: bg-{p}-400" (was gradient) → bg-gradient-to-r from-{p}-400 via-{p}-300 to-{t}-400
  // Only the single top bar line
  c = c.replace(
    /w-full h-1 bg-[a-z]+-400"/g,
    `w-full h-1 bg-gradient-to-r from-${f}-400 via-${f}-300 to-${t}-400"`
  );

  // Bottom hover bar: bg-{p}-400 transform scale-x-0 → bg-gradient-to-r from-{f}-400 to-{t}-400 transform scale-x-0
  c = c.replace(
    new RegExp(`bg-${p}-400 transform scale-x-0`, 'g'),
    `bg-gradient-to-r from-${f}-400 to-${t}-400 transform scale-x-0`
  );

  fs.writeFileSync(filePath, c);
  console.log(`Reverted: ${slug} → ${p}/${f}-${t}`);
}

console.log('\n✅ Solution pages reverted to per-page theme colors with gradients.');
