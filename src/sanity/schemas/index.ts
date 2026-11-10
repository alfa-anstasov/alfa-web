import { blogPost } from './blogPost';
import { faqItem } from './faqItem';
import { formSubmission } from './formSubmission';
import { funeralProduct } from './funeralProduct';
import { graveSiteExample } from './graveSiteExample';
import { location } from './location';
import { maintenancePlan } from './maintenancePlan';
import { monument } from './monument';
import { service } from './service';
import { siteSettings } from './siteSettings';
import { teamMember } from './teamMember';
import { testimonial } from './testimonial';
import { portableText } from './shared';

/**
 * The content (document) types defined in the spec, section 5.1-5.12.
 * NOTE: the spec's section 5 defines 12 types; the owner's brief says 13. See README "Open decisions".
 */
export const documentTypes = [
  location,
  teamMember,
  service,
  monument,
  funeralProduct,
  graveSiteExample,
  maintenancePlan,
  faqItem,
  testimonial,
  blogPost,
  formSubmission,
  siteSettings,
];

export const schemaTypes = [...documentTypes, portableText];

export const singletonTypes = ['siteSettings'] as const;
