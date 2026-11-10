import { serializeJsonLd } from '@/lib/jsonld';

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // Safe: serializeJsonLd escapes "<", and the data is built from our own config.
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
