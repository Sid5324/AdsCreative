const fs = require('fs');

let t = fs.readFileSync('src/templates.ts', 'utf8');

// 1. Template 1 (Hook) - Layout fix for Hero
t = t.replace(
  /<section id="hero" class="section gradient-primary min-h-screen flex flex-col justify-center text-center" data-editable="true">([\s\S]*?)<\/section>/m,
  `<section id="hero" class="relative py-24 md:py-32 px-6 flex items-center justify-center bg-background text-textPrimary overflow-hidden border-b border-white/5" data-editable="true">
<div class="absolute inset-0 z-0 opacity-20 pointer-events-none">
   <div class="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10"></div>
   <img src="AD_IMAGE_URL_PLACEHOLDER" class="w-full h-full object-cover blur-3xl opacity-50" />
</div>
<div class="max-w-7xl w-full mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10 text-center md:text-left">
  <div class="space-y-6 flex flex-col items-center md:items-start text-center md:text-left">$1  </div>
  <div class="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-white/5 p-2 lg:p-4 backdrop-blur-sm">
    <img src="AD_IMAGE_URL_PLACEHOLDER" class="w-full h-[300px] md:h-[500px] object-contain rounded-2xl" />
  </div>
</div>
</section>`
);

// We need to fix the extracted $1 so it doesn't have the <button> floating strangely, we'll just rewrite it
t = t.replace(
  /<h1 class="font-display text-5xl md:text-7xl font-extrabold mb-6">\s*\{\{hero_headline\}\}\s*<\/h1>\s*<p class="text-xl text-textSecondary mb-10">\s*\{\{hero_subheadline\}\}\s*<\/p>\s*<button class="btn-primary hover-scale">\s*\{\{hero_cta\}\}\s*<\/button>/m,
  `<h1 class="font-display text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
      {{hero_headline}}
    </h1>
    <p class="text-lg md:text-xl text-textSecondary mx-auto md:mx-0 max-w-xl">
      {{hero_subheadline}}
    </p>
    <div class="pt-4 w-full md:w-auto">
      <button class="btn-primary hover-scale w-full md:w-auto text-lg py-4 px-10">
        {{hero_cta}}
      </button>
    </div>`
);


// 2. Template 2 (Funnel) - Remove caption and fix image cropping
t = t.replace(
  /<div class="card p-2 bg-white shadow-xl">\s*<img src="AD_IMAGE_URL_PLACEHOLDER"[^>]*>\s*<p[^>]*>\s*\{\{hero_image_caption\}\}\s*<\/p>\s*<\/div>/m,
  `<div class="card p-2 bg-white shadow-xl w-full border border-border">
<div class="bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center relative">
   <img src="AD_IMAGE_URL_PLACEHOLDER" class="w-full max-h-[300px] md:max-h-[450px] object-contain"/>
</div>
</div>`
);

// 3. Template 3 (Trust) - Improve the Story/Hero section
t = t.replace(
  /<section id="story" class="section -mt-10" data-editable="story">\s*<div class="container story-card text-center relative z-10 bg-white">\s*<img src="AD_IMAGE_URL_PLACEHOLDER" class="avatar mx-auto mb-6 shadow-md"\/>\s*<p class="quote mb-6">\s*“\{\{user_quote\}\}”\s*<\/p>\s*<p class="text-textSecondary text-lg mb-6 max-w-2xl mx-auto">\s*\{\{user_story\}\}\s*<\/p>\s*<div class="inline-block bg-surface px-4 py-2 rounded-full border border-border">\s*<p class="text-sm font-semibold text-primary">\s*\{\{user_name\}\}\s*<\/p>\s*<p class="text-xs text-textSecondary">\s*\{\{user_context\}\}\s*<\/p>\s*<\/div>\s*<\/div>\s*<\/section>/m,
  `<!-- =========================
   STORY (USER PROOF)
========================= -->
<section id="story" class="px-4 md:px-8 py-12 md:py-20 -mt-10" data-editable="story">
<div class="container mx-auto max-w-6xl">
  <div class="grid md:grid-cols-2 gap-8 items-center bg-white rounded-3xl shadow-xl border border-border overflow-hidden">
    <div class="h-[300px] md:h-full min-h-[400px] bg-slate-50 p-4 md:p-8 flex items-center justify-center relative border-b md:border-b-0 md:border-r border-border">
      <img src="AD_IMAGE_URL_PLACEHOLDER" class="w-full h-full max-h-[500px] object-contain drop-shadow-lg"/>
    </div>
    <div class="p-6 md:p-12 text-center md:text-left">
      <div class="text-6xl text-primary/20 mb-[-20px] font-serif leading-none inline-block">"</div>
      <p class="quote mb-6 text-xl md:text-3xl leading-relaxed text-gray-900 font-bold tracking-tight">
        {{user_quote}}
      </p>
      <p class="text-textSecondary text-base md:text-lg mb-8 leading-relaxed max-w-lg mx-auto md:mx-0">
        {{user_story}}
      </p>
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
</section>`
);

// 4. Template 4 (Decision)
t = t.replace(
  /<div class="mt-12 max-w-4xl mx-auto">\s*<img src="AD_IMAGE_URL_PLACEHOLDER" class="w-full h-\[400px\] object-cover rounded-2xl shadow-2xl border border-border" \/>\s*<\/div>/m,
  `<div class="mt-12 w-full max-w-5xl mx-auto bg-slate-50 rounded-3xl p-3 md:p-6 shadow-2xl border border-border">
  <div class="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex items-center justify-center pt-4">
    <img src="AD_IMAGE_URL_PLACEHOLDER" class="w-full h-auto max-h-[350px] md:max-h-[550px] object-contain p-2 md:p-4" />
  </div>
</div>`
);

// 5. Template 5 (Dynamic)
t = t.replace(
  /<div class="relative">\s*<div class="rounded-3xl overflow-hidden shadow-2xl transform lg:rotate-3 hover:rotate-0 transition-transform duration-700 bg-white">\s*<img src="AD_IMAGE_URL_PLACEHOLDER" alt="Creative" class="w-full h-\[600px\] object-cover">\s*<div class="absolute inset-0 bg-gradient-to-t from-black\/60 to-transparent flex items-end p-8">\s*<p class="text-white font-medium">\{\{image_caption\}\}<\/p>\s*<\/div>\s*<\/div>\s*<\/div>/m,
  `<div class="relative w-full mt-10 md:mt-0">
                <div class="rounded-3xl overflow-hidden shadow-2xl transform lg:rotate-2 hover:rotate-0 transition-transform duration-700 bg-white p-3 border border-gray-100">
                    <div class="relative bg-slate-50 rounded-2xl overflow-hidden flex items-center justify-center w-full">
                      <img src="AD_IMAGE_URL_PLACEHOLDER" alt="Creative" class="w-full max-h-[350px] md:max-h-[550px] object-contain hover:scale-105 transition-transform duration-700">
                    </div>
                </div>
            </div>`
);

// Finally, tweak section paddings for all templates globally
t = t.replace(/\.section \{ padding: 5rem 1\.5rem; \}/g, `
.section { padding: 4rem 1.25rem; }
@media (min-width: 768px) {
  .section { padding: 6rem 2rem; }
}
`);
t = t.replace(/\.section \{\n  padding: 6rem 2rem;\n\}/g, `
.section {
  padding: 4rem 1.25rem;
}
@media (min-width: 768px) {
  .section { padding: 6rem 3rem; }
}
`);

// Add responsive container fix for Template 4 Table
t = t.replace(
  /<div class="overflow-x-auto">\s*<table class="compare">/m,
  `<div class="overflow-x-auto max-w-full pb-4">
<table class="compare min-w-[600px]">`
);


fs.writeFileSync('src/templates.ts', t);
