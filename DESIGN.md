---
name: Oceanic Luxury
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#404848'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#717978'
  outline-variant: '#c0c8c8'
  surface-tint: '#3b6566'
  primary: '#001c1d'
  on-primary: '#ffffff'
  primary-container: '#003334'
  on-primary-container: '#719c9d'
  inverse-primary: '#a3cfcf'
  secondary: '#735c00'
  on-secondary: '#ffffff'
  secondary-container: '#fed65b'
  on-secondary-container: '#745c00'
  tertiary: '#111a19'
  on-tertiary: '#ffffff'
  tertiary-container: '#252f2e'
  on-tertiary-container: '#8c9795'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#beebeb'
  primary-fixed-dim: '#a3cfcf'
  on-primary-fixed: '#002020'
  on-primary-fixed-variant: '#224d4e'
  secondary-fixed: '#ffe088'
  secondary-fixed-dim: '#e9c349'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#dae5e3'
  tertiary-fixed-dim: '#bec9c7'
  on-tertiary-fixed: '#141d1d'
  on-tertiary-fixed-variant: '#3e4948'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-xl:
    fontFamily: Montserrat
    fontSize: 64px
    fontWeight: '500'
    lineHeight: '1.1'
    letterSpacing: 0.25em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '500'
    lineHeight: '1.1'
    letterSpacing: 0.2em
  headline-md:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.2em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '2'
    letterSpacing: 0.05em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '2'
    letterSpacing: 0.05em
  label-caps:
    fontFamily: Montserrat
    fontSize: 11px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.3em
  label-tiny:
    fontFamily: Montserrat
    fontSize: 10px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.3em
spacing:
  unit: 8px
  gutter: 32px
  margin-edge: 64px
  section-gap: 128px
  container-max: 1440px
---

## Brand & Style
The brand identity is rooted in **Modern Mediterranean Luxury**, evoking an emotional response of serenity, exclusivity, and high-end artisanal quality. It targets an affluent, wellness-conscious audience that values the intersection of nature and science.

The visual style is a sophisticated blend of **Minimalism** and **Glassmorphism**. It utilizes expansive white space, a restricted but rich color palette, and translucent layers that mimic the clarity of water. The aesthetic is defined by extreme cinematic elegance, using high-contrast typography and subtle golden accents to signal a premium "batch-exclusive" narrative.

## Colors
The palette is inspired by a high-noon coastal landscape. 
- **Primary (Ocean Deep):** A deep, near-black teal used for structural elements and core branding to ground the design.
- **Secondary (Gold Leaf):** A metallic gradient gold used sparingly for highlights and hero typography to signify luxury.
- **Backgrounds:** Predominantly ultra-light grays and whites to maintain a clean, airy feel.
- **Functional Accents:** Soft sea-foam teals are used for subtle background glows and tertiary highlights, maintaining the aquatic theme without sacrificing readability.

## Typography
The typographic system relies on extreme tracking (letter-spacing) to convey a sense of breathability and high-fashion editorial style. 

**Montserrat** is used for all headlines and labels, strictly in uppercase. This creates a rigid, architectural feel. **Inter** provides a functional, highly legible contrast for body copy, utilizing generous line heights (2.0) to ensure the text feels light and uncrowded. All headings should prioritize the wide letter-spacing to maintain the brand's premium character.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy with expansive margins. 
- **Horizontal Flow:** Content is centered within a 1440px container, with significant edge margins (64px) to create a "frame" effect.
- **Vertical Rhythm:** Sections are separated by massive gaps (128px), allowing each content block to be viewed as a standalone piece of art.
- **Internal Padding:** Components like cards and glass panels use generous internal padding (64px) to reinforce the airy, luxurious theme.

## Elevation & Depth
Depth is achieved through **Glassmorphism** and tonal layering rather than traditional heavy shadows.
- **The Glass Panel:** Uses a semi-transparent white background (`rgba(255, 255, 255, 0.6)`) with a high-intensity backdrop blur (20px). The border is a 1px gradient simulating gold foil.
- **Tonal Layers:** The background is a flat surface, while interactive elements sit on the glass layer.
- **Soft Glows:** Instead of drop shadows, use large, extremely diffused radial gradients (blur 3xl) in primary or secondary colors behind key content blocks to create a subtle ambient light effect.

## Shapes
The shape language is strictly **Sharp (0px)**. Rectilinear forms are used to mirror the precision of luxury packaging and architectural minimalism. Any use of rounding is reserved exclusively for decorative background elements (like the soft glow circles), while all functional UI components (buttons, inputs, panels) must maintain 90-degree corners to preserve the sophisticated, high-end editorial look.

## Components
- **Buttons:** Sharp-edged, solid blocks. Primary buttons use the `ocean-deep` color with white text and extreme letter-spacing. Hover states involve a slow transition (500ms) to a container-variant color.
- **Input Fields:** Minimalist "ghost" style. Only a bottom border is visible. Placeholders are centered and uppercase with high tracking. Focus states should transition the bottom border from a light gray to the primary teal.
- **Glass Panels:** The core container for important information. Must include a 20px backdrop blur and a delicate gold gradient border.
- **Navigation:** Fixed to the top, utilizing the glassmorphism effect. Navigation links are uppercase labels with a thin underline for the active state.
- **Typography Accents:** "Gold Text" should be applied sparingly to main headers using a linear gradient from `#D4AF37` to `#B8860B`.
- **Dividers:** Ultra-thin (1px) lines, often using gradients that fade to transparent at the edges to maintain a light visual weight.

## Visual Narrative
The design tells a story of artisanal craftsmanship and natural ingredients. The "Batch-Exclusive" narrative is supported by the raw, textural quality of the product photography, which emphasizes the hand-poured nature of the lotion.   

## Hero Section 
Background: Island beach with soft ocean waves and beautiful blue sky with a few clouds.
Headline: "Lotion From The Ocean" in Gold Leaf typography.
Subheadline: "Ocean-Powered Hydration in A Bottle."
Call to Action: "Join the Waitlist" button.

## Story Section  
This lotion is made in small batches using the best ingredients nature has to offer.  We only use sustainable ingredients that are good for the ocean and good for your skin.  We are launching  BATCH 001 early in 2027. Limited quantities will be available.