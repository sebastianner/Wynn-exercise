Full-Stack Developer  |  Next.js + Contentful + Netlify 

# **Technical Interview Requirements** 

Build a content-managed website using Next.js, Contentful, and Netlify that demonstrates component-driven architecture and CMS-driven page composition. 

## **1.  Account Setup & Prerequisites** [Before coding] 

- Sign up for a Contentful trial account — note your Space ID and Content Delivery API key 

- Sign up for a Netlify account and connect your GitHub/GitLab repo for continuous deployment 

- Scaffold a new Next.js project using create-next-app with TypeScript enabled 

- Reference: https://www.encorebostonharbor.com/experiences/mothers-day-at-encore 

## **2.  Contentful Content Model** [CMS schema] 

Define the following content types in Contentful. Field names should use camelCase. 

### **Global Content Types** 

|**Content Type**|**Fields**|
|---|---|
|**Page**|title (Short text), slug (Short text, unique), components (References, many)|
|**Header**|logo (Asset — image), siteName (Short text)|
|**Footer**|links (Short text, list), copyrightText (Short text)|
|**Navigation**|items: Home, About, Contact Us (Short text, list)|



### **Page Component Content Types (referenced in Page)** 

|**Content Type**|**Fields**|
|---|---|
|**Hero**|heading (Short text), subheading (Short text), backgroundImage (Asset)|
|**Promo**|image (Asset), title (Short text), description (Long text), ctaLabel (Short text),<br>ctaUrl (Short text), imagePosition (left | right)|



## **3.  Promo Component — Two Variants** [Key deliverable] 

The Promo component is the primary deliverable. It must render in two layout variants, controlled by the imagePosition field set in Contentful — no code changes should be needed to switch between them. 

- Variant A — Image Left: Image fills the left column; title, description, and CTA button appear on the right 

- Variant B — Image Right: Text content appears on the left; image fills the right column 

Reference: See the attached screenshot (Wynn Resorts Responsible Gaming block) as the visual reference for the Promo layout pattern. 

## **4.  Next.js Implementation** [Code] 

- Install the contentful SDK and configure environment variables (CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN) 

- Write a data-fetching utility that retrieves a Page entry by slug, with all nested component references resolved 

- Create a dynamic route [slug]/page.tsx using generateStaticParams for all published slugs 

- Build a ComponentRenderer that maps Contentful content type IDs to React components (hero → <Hero>, promo → <Promo>) 

- Implement <Header>, <Navigation>, and <Footer> as layout components fetching their own Contentful entries 

- TypeScript: define interfaces for every Contentful content type — no any types 

**Tech stack:** Next.js 14+  |  TypeScript  |  Contentful SDK  |  App Router  |  SSG 

## **5.  Deployment** [Netlify] 

- Push code to GitHub and connect the repo to Netlify 

- Add Contentful credentials as Netlify environment variables (not committed to repo) 

- Configure build command (next build) and publish directory (.next) in Netlify settings 

- Confirm live URL resolves pages correctly before the interview review 

## **6.  Acceptance Criteria — What Will Be Evaluated** [Must pass] 

1. Create a new Page in Contentful CMS with a custom title and slug — it must appear at the correct URL on the live site 

2. Add a Hero component to the page from within Contentful — no code changes needed 

3. Add a Promo component and toggle imagePosition between left and right — the layout must reflect the change 

4. Publish content in Contentful — published changes must appear on the deployed Netlify URL 

## **7.  Nice to have** 

404 error page when page is not found 

