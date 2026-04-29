export const templates = [
  {
    id: 'template_1',
    name: 'Hook',
    description: 'Grab attention',
    content: `<!DOCTYPE html>
<html class="scroll-smooth" data-variant="A">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>{{meta_title}}</title>

<script src="https://cdn.tailwindcss.com"></script>

<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@700;800&display=swap" rel="stylesheet">

<!-- =========================
     🎨 THEME TOKENS (OVERRIDABLE)
========================= -->
<script>
window.theme = {
  primary: "{{color_primary}}",
  background: "{{color_background}}",
  surface: "{{color_surface}}",
  accent: "{{color_accent}}",
  muted: "{{color_muted}}",
  gold: "{{color_gold}}",
  textPrimary: "{{color_text_primary}}",
  textSecondary: "{{color_text_secondary}}"
}

tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        background: "var(--background)",
        surface: "var(--surface)",
        accent: "var(--accent)",
        muted: "var(--muted)",
        gold: "var(--gold)",
        textPrimary: "var(--textPrimary)",
        textSecondary: "var(--textSecondary)"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Montserrat", "sans-serif"],
      },
    }
  }
}
</script>

<style>
:root {
  --primary: {{color_primary}};
  --background: {{color_background}};
  --surface: {{color_surface}};
  --accent: {{color_accent}};
  --muted: {{color_muted}};
  --gold: {{color_gold}};
  --textPrimary: {{color_text_primary}};
  --textSecondary: {{color_text_secondary}};
}

/* =========================
   SYSTEM RULES (LOCKED)
========================= */

body {
  background: var(--background);
  color: var(--textPrimary);
}

/* Layout constraints (ANTI-BREAK) */
h1 {
  max-width: 900px;
  margin: auto;
}

p {
  max-width: 600px;
  margin: auto;
}

/* Section system */

.section {
  padding: 4rem 1.25rem;
}
@media (min-width: 768px) {
  .section { padding: 6rem 3rem; }
}


/* Card system */
.card {
  background: var(--surface);
  border-radius: 1.25rem;
  border: 1px solid rgba(255,255,255,0.08);
  padding: 2rem;
}

/* Button system */
.btn-primary {
  background: var(--primary);
  color: black;
  font-weight: bold;
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  transition: all 0.3s;
}

.btn-primary:hover {
  filter: brightness(1.1);
  transform: translateY(-2px);
}

/* Gradient system */
.gradient-primary {
  background: linear-gradient(180deg, var(--primary) 0%, transparent 100%);
}

.hover-scale:hover {
  transform: scale(1.05);
  transition: all 0.3s ease;
}

</style>
</head>

<body class="font-sans antialiased overflow-x-hidden">

<!-- =========================
   HERO (Editable)
========================= -->
<section id="hero" class="relative py-24 md:py-32 px-6 flex items-center justify-center bg-background text-textPrimary overflow-hidden border-b border-white/5" data-editable="hero">
<div class="absolute inset-0 z-0 opacity-20 pointer-events-none">
   <div class="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10"></div>
   <img src="AD_IMAGE_URL_PLACEHOLDER" class="w-full h-full object-cover blur-3xl opacity-50" />
</div>
<div class="max-w-7xl w-full mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10 text-center md:text-left">
  <div class="space-y-6 flex flex-col items-center md:items-start text-center md:text-left">

<h1 class="font-display text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
      {{hero_headline}}
    </h1>
    <p class="text-lg md:text-xl text-textSecondary mx-auto md:mx-0 max-w-xl">
      {{hero_subheadline}}
    </p>
    <div class="pt-4 w-full md:w-auto">
      <button class="btn-primary hover-scale w-full md:w-auto text-lg py-4 px-10">
        {{hero_cta}}
      </button>
    </div>

  </div>
  <div class="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-white/5 p-2 lg:p-4 backdrop-blur-sm">
    <img src="AD_IMAGE_URL_PLACEHOLDER" class="w-full h-[300px] md:h-[500px] object-contain rounded-2xl" />
  </div>
</div>
</section>

<!-- =========================
   FEATURES (Editable)
========================= -->
<section id="features" class="section bg-white text-black" data-editable="features">

<div class="text-center mb-16">

<h2 class="font-display text-4xl font-bold mb-4">
  {{features_title}}
</h2>

<p class="text-gray-600">
  {{features_subtitle}}
</p>

</div>

<div class="grid md:grid-cols-3 gap-8">

<div class="card hover-scale">
  <h3 class="text-textPrimary text-xl font-bold mb-2">{{feature_1_title}}</h3>
  <p class="text-textSecondary">{{feature_1_desc}}</p>
</div>

<div class="card hover-scale">
  <h3 class="text-textPrimary text-xl font-bold mb-2">{{feature_2_title}}</h3>
  <p class="text-textSecondary">{{feature_2_desc}}</p>
</div>

<div class="card hover-scale">
  <h3 class="text-textPrimary text-xl font-bold mb-2">{{feature_3_title}}</h3>
  <p class="text-textSecondary">{{feature_3_desc}}</p>
</div>

</div>

</section>

<!-- =========================
   VALUE (Editable)
========================= -->
<section id="value" class="section bg-background text-center" data-editable="value">

<h2 class="font-display text-4xl font-bold mb-6">
  {{value_title}}
</h2>

<p class="text-textSecondary mb-8">
  {{value_description}}
</p>

</section>

<!-- =========================
   TRUST (Editable)
========================= -->
<section id="trust" class="section bg-muted text-white text-center" data-editable="trust">

<h2 class="font-display text-3xl font-bold mb-4">
  {{trust_title}}
</h2>

<p>
  {{trust_metrics}}
</p>

</section>

<!-- =========================
   CTA (Editable)
========================= -->
<section id="cta" class="section bg-accent text-black text-center" data-editable="cta">

<h2 class="text-5xl font-black mb-8">
  {{final_cta_title}}
</h2>

<button class="btn-primary">
  {{final_cta_button}}
</button>

</section>

<!-- =========================
   FOOTER (LOCKED)
========================= -->
<footer id="footer" class="py-12 text-center text-gray-500 bg-background" data-editable="false">
  © {{year}} {{brand_name}}
</footer>

</body>
</html>`
  },
  {
    id: 'template_2',
    name: 'Funnel',
    description: 'Explain product',
    content: `<!DOCTYPE html>
<html lang="en" data-variant="B">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>{{meta_title}}</title>

<script src="https://cdn.tailwindcss.com"></script>

<!-- =========================
   🎨 THEME INJECTION SYSTEM
========================= -->
<script>
window.theme = {
  primary: "{{color_primary}}",
  accent: "{{color_accent}}",
  background: "{{color_background}}",
  surface: "{{color_surface}}",
  border: "{{color_border}}",
  textPrimary: "{{color_text_primary}}",
  textSecondary: "{{color_text_secondary}}"
};

Object.entries(window.theme).forEach(([k,v])=>{
  document.documentElement.style.setProperty(\`--\${k}\`, v);
});

tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        accent: "var(--accent)",
        background: "var(--background)",
        surface: "var(--surface)",
        border: "var(--border)",
        textPrimary: "var(--textPrimary)",
        textSecondary: "var(--textSecondary)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      }
    }
  }
}
</script>

<style>
:root {
  --primary: {{color_primary}};
  --accent: {{color_accent}};
  --background: {{color_background}};
  --surface: {{color_surface}};
  --border: {{color_border}};
  --textPrimary: {{color_text_primary}};
  --textSecondary: {{color_text_secondary}};
}

body {
  background: var(--background);
  color: var(--textPrimary);
}

/* Layout constraints */
h1 { max-width: 700px; }
p { max-width: 500px; }

/* Section system */

.section { padding: 4rem 1.25rem; }
@media (min-width: 768px) {
  .section { padding: 6rem 2rem; }
}

.container { max-width: 1100px; margin: auto; }

/* Grid system */
.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

@media (max-width: 768px) {
  .grid-2 { grid-template-columns: 1fr; }
}

/* Card */
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 1.5rem;
}

/* Button */
.btn-primary {
  background: var(--primary);
  color: white;
  padding: 14px 24px;
  border-radius: 10px;
  font-weight: 700;
  transition: all 0.25s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
}

/* Metrics */
.metric {
  font-size: 32px;
  font-weight: 800;
  color: var(--primary);
}
</style>
</head>

<body class="font-sans">

<!-- =========================
   HERO (Editable)
========================= -->
<section id="hero" class="section" data-editable="hero">
<div class="container grid-2 items-center">

<div>
<h1 class="text-4xl md:text-5xl font-extrabold mb-4">
  {{hero_headline}}
</h1>
<p class="text-textSecondary mb-6 text-lg">
  {{hero_subheadline}}
</p>
<button class="btn-primary">
  {{hero_cta}}
</button>
</div>

<div class="card p-2 bg-surface shadow-xl w-full border border-border">
<div class="bg-muted/10 rounded-lg overflow-hidden flex items-center justify-center relative">
   <img src="AD_IMAGE_URL_PLACEHOLDER" class="w-full max-h-[300px] md:max-h-[450px] object-contain"/>
</div>
</div>

</div>
</section>

<!-- =========================
   METRICS (Editable)
========================= -->
<section id="metrics" class="section bg-surface text-center" data-editable="metrics">
<div class="container grid grid-cols-1 md:grid-cols-3 gap-6">

<div>
  <div class="metric">{{metric_1_value}}</div>
  <p class="text-textSecondary">{{metric_1_label}}</p>
</div>

<div>
  <div class="metric">{{metric_2_value}}</div>
  <p class="text-textSecondary">{{metric_2_label}}</p>
</div>

<div>
  <div class="metric">{{metric_3_value}}</div>
  <p class="text-textSecondary">{{metric_3_label}}</p>
</div>

</div>
</section>

<!-- =========================
   FEATURES (Editable)
========================= -->
<section id="features" class="section text-center" data-editable="features">
<div class="container">
<h2 class="text-3xl font-bold mb-10">{{features_title}}</h2>
<div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">

<div class="card hover:-translate-y-1 transition-transform">
  <h3 class="font-bold text-xl mb-2">{{feature_1_title}}</h3>
  <p class="text-textSecondary">{{feature_1_desc}}</p>
</div>

<div class="card hover:-translate-y-1 transition-transform">
  <h3 class="font-bold text-xl mb-2">{{feature_2_title}}</h3>
  <p class="text-textSecondary">{{feature_2_desc}}</p>
</div>

<div class="card hover:-translate-y-1 transition-transform">
  <h3 class="font-bold text-xl mb-2">{{feature_3_title}}</h3>
  <p class="text-textSecondary">{{feature_3_desc}}</p>
</div>

</div>
</div>
</section>

<!-- =========================
   STEPS (Editable)
========================= -->
<section id="steps" class="section bg-surface" data-editable="steps">
<div class="container text-center">
<h2 class="text-3xl font-bold mb-10">
  {{steps_title}}
</h2>
<div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">

<div class="card border-l-4 border-l-primary pt-6">
  <div class="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mb-4">1</div>
  <h3 class="font-bold mb-2">{{step_1_title}}</h3>
  <p class="text-textSecondary text-sm">{{step_1}}</p>
</div>

<div class="card border-l-4 border-l-primary pt-6">
  <div class="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mb-4">2</div>
  <h3 class="font-bold mb-2">{{step_2_title}}</h3>
  <p class="text-textSecondary text-sm">{{step_2}}</p>
</div>

<div class="card border-l-4 border-l-primary pt-6">
  <div class="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mb-4">3</div>
  <h3 class="font-bold mb-2">{{step_3_title}}</h3>
  <p class="text-textSecondary text-sm">{{step_3}}</p>
</div>

</div>
</div>
</section>

<!-- =========================
   CTA (Editable)
========================= -->
<section id="cta" class="section text-center" data-editable="cta">
<h2 class="text-3xl font-bold mb-6 max-w-2xl mx-auto">
  {{cta_title}}
</h2>
<button class="btn-primary text-lg px-8 py-4">
  {{cta_button}}
</button>
</section>

<!-- =========================
   FOOTER (LOCKED)
========================= -->
<footer class="text-center py-10 text-textSecondary bg-surface border-t border-border" data-editable="false">
  © {{year}} {{brand_name}}
</footer>

</body>
</html>`
  },
  {
    id: 'template_3',
    name: 'Trust',
    description: 'Build belief',
    content: `<!DOCTYPE html>
<html lang="en" data-variant="C">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>{{meta_title}}</title>

<script src="https://cdn.tailwindcss.com"></script>

<!-- =========================
   🎨 THEME SYSTEM
========================= -->
<script>
window.theme = {
  primary: "{{color_primary}}",
  accent: "{{color_accent}}",
  background: "{{color_background}}",
  surface: "{{color_surface}}",
  border: "{{color_border}}",
  textPrimary: "{{color_text_primary}}",
  textSecondary: "{{color_text_secondary}}"
};

Object.entries(window.theme).forEach(([k,v])=>{
  document.documentElement.style.setProperty(\`--\${k}\`, v);
});

tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        accent: "var(--accent)",
        background: "var(--background)",
        surface: "var(--surface)",
        border: "var(--border)",
        textPrimary: "var(--textPrimary)",
        textSecondary: "var(--textSecondary)",
      }
    }
  }
}
</script>

<style>
:root {
  --primary: {{color_primary}};
  --accent: {{color_accent}};
  --background: {{color_background}};
  --surface: {{color_surface}};
  --border: {{color_border}};
  --textPrimary: {{color_text_primary}};
  --textSecondary: {{color_text_secondary}};
}

body {
  background: var(--background);
  color: var(--textPrimary);
}

h1 { max-width: 700px; margin: auto; }
p { max-width: 650px; margin: auto; }

.section { padding: 4rem 1.25rem; }
@media (min-width: 768px) {
  .section { padding: 6rem 2rem; }
}

.container { max-width: 900px; margin: auto; }

.story-card {
  background: var(--surface);
  border-radius: 1rem;
  padding: 2.5rem;
  border: 1px solid var(--border);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.quote {
  font-size: 24px;
  font-weight: 600;
  line-height: 1.5;
  color: var(--primary);
  font-style: italic;
}

.metric {
  font-size: 36px;
  font-weight: 800;
  color: var(--primary);
  margin-bottom: 0.5rem;
}

.btn-primary {
  background: var(--primary);
  color: white;
  padding: 16px 32px;
  border-radius: 9999px; /* Pill shape */
  font-weight: 700;
  transition: all 0.25s ease;
  display: inline-block;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  filter: brightness(1.1);
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--border);
}
</style>
</head>

<body class="font-sans leading-relaxed">

<section id="hero" class="section text-center bg-surface border-b border-border" data-editable="hero">
<h1 class="text-4xl md:text-5xl font-extrabold mb-6 leading-tight tracking-tight">
  {{hero_headline}}
</h1>
<p class="text-xl text-textSecondary mb-8 max-w-2xl mx-auto font-medium">
  {{hero_subheadline}}
</p>
<button class="btn-primary text-lg">
  {{hero_cta}}
</button>
</section>

<!-- =========================
   STORY (USER PROOF)
 ========================= -->
<section id="story" class="px-4 md:px-8 py-12 md:py-20 -mt-10" data-editable="story">
<div class="container mx-auto max-w-6xl">
  <div class="grid md:grid-cols-2 gap-8 items-center bg-white rounded-3xl shadow-xl border border-border overflow-hidden">
    <div class="h-[300px] md:h-full min-h-[450px] bg-slate-50 p-4 md:p-8 flex items-center justify-center relative border-b md:border-b-0 md:border-r border-border">
      <img src="AD_IMAGE_URL_PLACEHOLDER" class="w-full h-full object-cover rounded-xl shadow-lg" alt="Creative Narrative Image"/>
    </div>
    <div class="p-6 md:p-12 text-center md:text-left">
      <div class="text-6xl text-primary/20 mb-[-20px] font-serif leading-none inline-block">"</div>
      <p class="quote mb-6 text-xl md:text-3xl leading-relaxed text-gray-900 font-bold tracking-tight italic">
        {{user_quote}}
      </p>
      <div class="text-textSecondary text-base md:text-lg mb-8 leading-relaxed max-w-lg mx-auto md:mx-0 font-medium">
        {{story_problem}}<br/><br/>
        {{story_action}}<br/><br/>
        <strong class="text-gray-900">{{story_result}}</strong>
      </div>
      <div class="inline-flex flex-col md:flex-row items-center md:items-start bg-surface px-6 py-4 rounded-2xl border border-border text-center md:text-left shadow-sm gap-4">
        <div>
          <p class="text-base font-extrabold text-primary">
            {{user_name}}
          </p>
          <p class="text-xs text-textSecondary mt-1 font-bold tracking-widest uppercase">
            {{user_context}}
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
</section>

<section id="proof" class="section text-center" data-editable="proof">
<div class="container">
<h2 class="text-3xl font-bold mb-12">{{proof_title}}</h2>
<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
<div class="p-6">
  <div class="metric">{{proof_1_value}}</div>
  <p class="text-textSecondary font-medium tracking-wide uppercase text-sm font-bold">{{proof_1_label}}</p>
</div>
<div class="p-6">
  <div class="metric">{{proof_2_value}}</div>
  <p class="text-textSecondary font-medium tracking-wide uppercase text-sm font-bold">{{proof_2_label}}</p>
</div>
<div class="p-6">
  <div class="metric">{{proof_3_value}}</div>
  <p class="text-textSecondary font-medium tracking-wide uppercase text-sm font-bold">{{proof_3_label}}</p>
</div>
</div>
</div>
</section>

<section id="steps" class="section bg-surface border-y border-border" data-editable="steps">
<div class="container text-center">
<h2 class="text-3xl font-bold mb-12">
  {{steps_title}}
</h2>
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
<div class="story-card bg-white hover:-translate-y-1 transition-transform">
  <div class="text-3xl mb-4">✨</div>
  <h3 class="font-bold text-lg mb-2">{{step_1_title}}</h3>
  <p class="text-textSecondary text-sm">{{step_1}}</p>
</div>
<div class="story-card bg-white hover:-translate-y-1 transition-transform">
  <div class="text-3xl mb-4">🚀</div>
  <h3 class="font-bold text-lg mb-2">{{step_2_title}}</h3>
  <p class="text-textSecondary text-sm">{{step_2}}</p>
</div>
<div class="story-card bg-white hover:-translate-y-1 transition-transform">
  <div class="text-3xl mb-4">🎉</div>
  <h3 class="font-bold text-lg mb-2">{{step_3_title}}</h3>
  <p class="text-textSecondary text-sm">{{step_3}}</p>
</div>
</div>
</div>
</section>

<section id="cta" class="section text-center" data-editable="cta">
<h2 class="text-4xl font-extrabold mb-8 max-w-2xl mx-auto">
  {{final_cta_title}}
</h2>
<button class="btn-primary text-xl px-10 py-5">
  {{final_cta_button}}
</button>
<p class="mt-4 text-sm text-textSecondary">{{final_cta_guarantee}}</p>
</section>

<footer class="text-center py-8 text-sm text-textSecondary bg-surface border-t border-border" data-editable="false">
  © {{year}} {{brand_name}}. All rights reserved.
</footer>

</body>
</html>`
  },
  {
    id: 'template_4',
    name: 'Decision',
    description: 'Close user',
    content: `<!DOCTYPE html>
<html lang="en" data-variant="D">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>{{meta_title}}</title>

<script src="https://cdn.tailwindcss.com"></script>

<!-- =========================
   🎨 THEME SYSTEM
========================= -->
<script>
window.theme = {
  primary: "{{color_primary}}",
  accent: "{{color_accent}}",
  background: "{{color_background}}",
  surface: "{{color_surface}}",
  border: "{{color_border}}",
  textPrimary: "{{color_text_primary}}",
  textSecondary: "{{color_text_secondary}}"
};

Object.entries(window.theme).forEach(([k,v])=>{
  document.documentElement.style.setProperty(\`--\${k}\`, v);
});

tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        accent: "var(--accent)",
        background: "var(--background)",
        surface: "var(--surface)",
        border: "var(--border)",
        textPrimary: "var(--textPrimary)",
        textSecondary: "var(--textSecondary)",
      }
    }
  }
}
</script>

<style>
:root {
  --primary: {{color_primary}};
  --accent: {{color_accent}};
  --background: {{color_background}};
  --surface: {{color_surface}};
  --border: {{color_border}};
  --textPrimary: {{color_text_primary}};
  --textSecondary: {{color_text_secondary}};
}

body {
  background: var(--background);
  color: var(--textPrimary);
}

h1 { max-width: 800px; margin: auto; }
p { max-width: 600px; margin: auto; }

.section { padding: 4rem 1.25rem; }
@media (min-width: 768px) {
  .section { padding: 6rem 2rem; }
}

.container { max-width: 1000px; margin: auto; }

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.compare {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  border: 1px solid var(--border);
}

.compare th {
  background: var(--surface);
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.875rem;
  letter-spacing: 0.05em;
  color: var(--textSecondary);
}

.compare th, .compare td {
  padding: 18px;
  border-bottom: 1px solid var(--border);
  text-align: center;
}

.compare tr:last-child td {
  border-bottom: none;
}

.highlight {
  background: rgba(22,163,74,0.05);
  font-weight: 700;
  color: var(--primary);
  border-left: 2px solid var(--primary);
  border-right: 2px solid var(--primary);
}
.compare th.highlight {
  background: var(--primary);
  color: white;
}

.btn-primary {
  background: var(--primary);
  color: white;
  padding: 16px 32px;
  border-radius: 12px;
  font-weight: 700;
  transition: all 0.25s ease;
  display: inline-block;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  filter: brightness(1.1);
}

.faq-card {
  text-align: left;
}
.faq-q {
  font-weight: 700;
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
  color: var(--textPrimary);
}
.faq-a {
  color: var(--textSecondary);
  line-height: 1.6;
}
</style>
</head>

<body class="font-sans bg-surface">

<section id="hero" class="section text-center bg-surface border-b border-border pb-24" data-editable="hero">
<div class="container">
<h1 class="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
  {{hero_headline}}
</h1>
<p class="text-xl text-textSecondary mb-10 max-w-2xl mx-auto font-medium">
  {{hero_subheadline}}
</p>
<button class="btn-primary text-lg">
  {{hero_cta}}
</button>
<div class="mt-12 w-full max-w-5xl mx-auto bg-muted/5 rounded-3xl p-3 md:p-6 shadow-2xl border border-border">
  <div class="bg-surface rounded-2xl overflow-hidden border border-border/10 shadow-sm flex items-center justify-center pt-4">
    <img src="AD_IMAGE_URL_PLACEHOLDER" class="w-full h-auto max-h-[350px] md:max-h-[550px] object-contain p-2 md:p-4" />
  </div>
</div>
</div>
</section>

<section id="comparison" class="section -mt-16" data-editable="comparison">
<div class="container">
<div class="bg-white rounded-2xl shadow-xl border border-border p-8">
<h2 class="text-3xl font-bold text-center mb-10">
  {{comparison_title}}
</h2>

<div class="overflow-x-auto max-w-full pb-4">
<table class="compare min-w-[600px]">
<tr>
  <th class="text-left w-1/3">Features</th>
  <th class="highlight w-1/3">{{brand_name}}</th>
  <th class="w-1/3">{{competitor_name}}</th>
</tr>
<tr>
  <td class="text-left font-medium">{{comp_1_feature}}</td>
  <td class="highlight">✨ Yes</td>
  <td class="text-textSecondary">No</td>
</tr>
<tr>
  <td class="text-left font-medium">{{comp_2_feature}}</td>
  <td class="highlight">✨ Yes</td>
  <td class="text-textSecondary">No</td>
</tr>
<tr>
  <td class="text-left font-medium">{{comp_3_feature}}</td>
  <td class="highlight">✨ Yes</td>
  <td class="text-textSecondary">No</td>
</tr>
<tr class="bg-surface/50">
  <td class="text-left font-bold py-6">The Verdict</td>
  <td class="highlight py-6"><button class="btn-primary px-6 py-2 text-sm">Choose {{brand_name}}</button></td>
  <td class="py-6 text-textSecondary text-sm">Miss out</td>
</tr>
</table>
</div>
</div>
</div>
</section>

<section id="difference" class="section bg-white border-y border-border" data-editable="difference">
<div class="container text-center">
<h2 class="text-3xl font-bold mb-12">
  {{difference_title}}
</h2>
<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
<div class="card bg-surface hover:border-primary transition-colors text-left">
  <div class="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4 font-bold text-xl">1</div>
  <h3 class="font-bold text-lg mb-2">{{diff_1_title}}</h3>
  <p class="text-textSecondary">{{diff_1}}</p>
</div>
<div class="card bg-surface hover:border-primary transition-colors text-left">
  <div class="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4 font-bold text-xl">2</div>
  <h3 class="font-bold text-lg mb-2">{{diff_2_title}}</h3>
  <p class="text-textSecondary">{{diff_2}}</p>
</div>
<div class="card bg-surface hover:border-primary transition-colors text-left">
  <div class="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4 font-bold text-xl">3</div>
  <h3 class="font-bold text-lg mb-2">{{diff_3_title}}</h3>
  <p class="text-textSecondary">{{diff_3}}</p>
</div>
</div>
</div>
</section>

<section id="objections" class="section" data-editable="objections">
<div class="container max-w-3xl">
<h2 class="text-3xl font-bold text-center mb-12">
  {{objection_title}}
</h2>
<div class="space-y-6">
<div class="card faq-card bg-white">
  <h4 class="faq-q">{{objection_1_q}}</h4>
  <p class="faq-a">{{objection_1_a}}</p>
</div>
<div class="card faq-card bg-white">
  <h4 class="faq-q">{{objection_2_q}}</h4>
  <p class="faq-a">{{objection_2_a}}</p>
</div>
<div class="card faq-card bg-white">
  <h4 class="faq-q">{{objection_3_q}}</h4>
  <p class="faq-a">{{objection_3_a}}</p>
</div>
</div>
</div>
</section>

<section id="cta" class="section text-center bg-white border-t border-border" data-editable="cta">
<h2 class="text-4xl font-extrabold mb-8 max-w-2xl mx-auto">
  {{final_cta_title}}
</h2>
<button class="btn-primary text-xl px-12 py-5 shadow-xl shadow-primary/20">
  {{final_cta_button}}
</button>
<p class="mt-4 text-textSecondary font-medium">Risk-free. Cancel anytime.</p>
</section>

<footer class="text-center py-10 text-textSecondary bg-surface border-t border-border" data-editable="false">
  © {{year}} {{brand_name}}
</footer>

</body>
</html>`
  },
  {
    id: 'template_5',
    name: 'Dynamic',
    description: 'General Purpose (Jupiter Variant)',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{meta_title}}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/framer-motion/10.12.16/framer-motion.js"></script>
    <script>
      window.theme = {
        primary: "{{color_primary}}",
        primaryLight: "{{color_primary_light}}",
        textPrimary: "{{color_text_primary}}",
        textSecondary: "{{color_text_secondary}}",
        background: "{{color_background}}",
        surface: "{{color_surface}}"
      };
      
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              brand: {
                DEFAULT: window.theme.primary,
                light: window.theme.primaryLight,
              },
              body: window.theme.background,
              surface: window.theme.surface,
              text: {
                primary: window.theme.textPrimary,
                secondary: window.theme.textSecondary,
              }
            },
            fontFamily: {
              inter: ['Inter', 'sans-serif'],
            }
          }
        }
      }
    </script>
    <style>
        body { font-family: 'Inter', sans-serif; scroll-behavior: smooth; background-color: var(--background); color: var(--textPrimary); }
        :root {
          --primary: {{color_primary}};
          --primary-light: {{color_primary_light}};
          --background: {{color_background}};
          --surface: {{color_surface}};
          --textPrimary: {{color_text_primary}};
          --textSecondary: {{color_text_secondary}};
        }
        .text-brand { color: var(--primary); }
        .bg-brand { background-color: var(--primary); }
        .bg-brand-light { background-color: var(--primary-light); }
        .glass-card { background: var(--surface); backdrop-filter: blur(10px); border: 1px solid var(--border); }
        .hero-gradient { background: linear-gradient(135deg, var(--background) 0%, var(--surface) 100%); }
        .surface-bg { background-color: var(--surface); }
    </style>
</head>
<body class="bg-body text-text-primary">

    <!-- Navbar -->
    <nav class="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-brand rounded-lg flex items-center justify-center font-bold text-white text-xl italic">{{brand_initial}}</div>
                <span class="text-xl font-bold tracking-tight text-slate-900">{{brand_name}}</span>
            </div>
            <a href="#" class="bg-brand text-white px-6 py-2 rounded-full font-semibold hover:opacity-90 transition-all">{{nav_cta}}</a>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="pt-32 pb-20 hero-gradient overflow-hidden">
        <div class="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
            <div class="space-y-8">
                <span class="inline-block bg-brand-light text-brand px-4 py-1 rounded-full text-sm font-bold tracking-wide uppercase">{{hero_badge}}</span>
                <h1 class="text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight text-slate-900">
                    {{hero_headline_part1}} <span class="text-brand">{{hero_headline_part2}}</span>
                </h1>
                <p class="text-xl text-text-secondary max-w-lg leading-relaxed">
                    {{hero_subheadline}}
                </p>
                <div class="flex flex-col sm:flex-row gap-4">
                    <button class="bg-brand text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:scale-105 transition-transform">{{hero_cta_primary}}</button>
                    <button class="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-colors">{{hero_cta_secondary}}</button>
                </div>
            </div>
            <div class="relative w-full mt-10 md:mt-0">
                <div class="rounded-3xl overflow-hidden shadow-2xl transform lg:rotate-2 hover:rotate-0 transition-transform duration-700 bg-white p-3 border border-gray-100">
                    <div class="relative bg-slate-50 rounded-2xl overflow-hidden flex items-center justify-center w-full">
                      <img src="AD_IMAGE_URL_PLACEHOLDER" alt="Creative" class="w-full max-h-[350px] md:max-h-[550px] object-contain hover:scale-105 transition-transform duration-700">
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Features Grid -->
    <section class="py-24 bg-body">
        <div class="max-w-7xl mx-auto px-6">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold text-slate-900">{{features_main_title}}</h2>
                <div class="h-1 w-20 bg-brand mx-auto mt-4 rounded-full"></div>
            </div>
            <div class="grid md:grid-cols-3 gap-8">
                <div class="p-8 rounded-3xl bg-surface border border-slate-100 hover:shadow-xl transition-shadow group">
                    <div class="w-16 h-16 bg-brand-light rounded-2xl flex items-center justify-center mb-6">
                        <svg class="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                    </div>
                    <h3 class="text-2xl font-bold mb-4 text-slate-900">{{feature_1_title}}</h3>
                    <p class="text-text-secondary">{{feature_1_desc}}</p>
                </div>
                
                <div class="p-8 rounded-3xl bg-surface border border-slate-100 hover:shadow-xl transition-shadow">
                    <div class="w-16 h-16 bg-brand-light rounded-2xl flex items-center justify-center mb-6">
                        <svg class="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                    </div>
                    <h3 class="text-2xl font-bold mb-4 text-slate-900">{{feature_2_title}}</h3>
                    <p class="text-text-secondary">{{feature_2_desc}}</p>
                </div>

                <div class="p-8 rounded-3xl bg-surface border border-slate-100 hover:shadow-xl transition-shadow">
                    <div class="w-16 h-16 bg-brand-light rounded-2xl flex items-center justify-center mb-6">
                        <svg class="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                    </div>
                    <h3 class="text-2xl font-bold mb-4 text-slate-900">{{feature_3_title}}</h3>
                    <p class="text-text-secondary">{{feature_3_desc}}</p>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 px-6 bg-body">
        <div class="max-w-5xl mx-auto bg-brand rounded-[2.5rem] p-12 text-center text-white relative overflow-hidden">
            <div class="relative z-10">
                <h2 class="text-4xl md:text-5xl font-extrabold mb-6">{{final_cta_title}}</h2>
                <p class="text-xl opacity-90 mb-10 max-w-2xl mx-auto">{{final_cta_desc}}</p>
                <button class="bg-white text-brand px-10 py-5 rounded-2xl font-bold text-xl hover:bg-orange-50 transition-colors shadow-2xl">{{final_cta_button}}</button>
            </div>
            <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div class="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="py-12 border-t border-slate-100 bg-surface">
        <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <div class="flex items-center space-x-2">
                <div class="w-6 h-6 bg-brand rounded flex items-center justify-center font-bold text-white text-xs italic">{{brand_initial}}</div>
                <span class="font-bold text-slate-900">{{brand_domain}}</span>
            </div>
            <p class="text-slate-500 text-sm">© {{year}} {{brand_name}}. All rights reserved.</p>
        </div>
    </footer>

</body>
</html>`
  }
];
