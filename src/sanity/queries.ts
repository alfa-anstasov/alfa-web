/**
 * PUBLIC GROQ queries and fragments: the only GROQ the site's pages may run.
 *
 * RULES (enforced by tests/hidden-price.test.ts):
 *  1. The private price field must never appear in this file, not even in a comment.
 *  2. No spread operator, and no bare `*[filter]` query without an explicit projection: a spread or a bare
 *     document returns EVERY field of the document, including the private price.
 *  3. List every public field by name.
 *
 * The only code allowed to read the private price is src/sanity/server/price.ts.
 */

/** Pick the value for `$lang` in a plugin-generated internationalized array, falling back to bg. */
const loc = (field: string, path = '') =>
  `coalesce(${field}[_key == $lang][0].value${path}, ${field}[_key == "bg"][0].value${path})`;

export const monumentCardFragment = `{
  _id,
  "name": ${loc('name')},
  "slug": ${loc('slug', '.current')},
  category,
  subcategory,
  styleTags,
  priceRange,
  isNew,
  isFeatured,
  isAvailable,
  "photo": photos[0]
}`;

export const monumentPageFragment = `{
  _id,
  "name": ${loc('name')},
  "slug": ${loc('slug', '.current')},
  category,
  subcategory,
  "material": ${loc('material')},
  dimensions,
  "dimensionsNote": ${loc('dimensionsNote')},
  photos,
  styleTags,
  "description": ${loc('description')},
  priceRange,
  isNew,
  isFeatured,
  isAvailable,
  "seoTitle": ${loc('seoTitle')},
  "seoDescription": ${loc('seoDescription')}
}`;

export const locationFragment = `{
  _id,
  "name": ${loc('name')},
  "slug": ${loc('slug', '.current')},
  locationType,
  isActive,
  openedYear,
  "address": ${loc('address')},
  coordinates,
  googleMapsEmbedUrl,
  googlePlaceId,
  phone,
  email,
  hours,
  photos
}`;

export const siteSettingsQuery = `*[_type == "siteSettings"][0]{
  "siteName": ${loc('siteName')},
  "siteTagline": ${loc('siteTagline')},
  mainPhone,
  viberNumber,
  mainEmail,
  googlePlaceId,
  socialLinks
}`;

export const activeLocationsQuery = `*[_type == "location" && isActive == true] | order(openedYear asc) ${locationFragment}`;

export const featuredMonumentsQuery = `*[_type == "monument" && isFeatured == true && isAvailable == true][0..5] ${monumentCardFragment}`;

export const monumentsByCategoryQuery = `*[_type == "monument" && isAvailable == true && ($category == "" || category == $category)] | order(publishedAt desc) ${monumentCardFragment}`;

export const monumentBySlugQuery = `*[_type == "monument" && $slug in slug[].value.current][0] ${monumentPageFragment}`;
