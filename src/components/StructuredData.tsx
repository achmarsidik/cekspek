// src/components/StructuredData.tsx
// Structured Data untuk membantu Google memahami content website

import Script from 'next/script';

// 1. Website/Organization Schema
export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'CekSpek.id',
    url: 'https://cekspek.vercel.app',
    logo: 'https://cekspek.vercel.app/logo.png',
    description: 'Database spesifikasi smartphone terlengkap di Indonesia',
    sameAs: [
      'https://facebook.com/cekspekid',
      'https://twitter.com/cekspekid',
      'https://instagram.com/cekspekid',
    ],
  };

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// 2. Website Schema
export function WebsiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CekSpek.id',
    url: 'https://cekspek.vercel.app',
    description: 'Database spesifikasi smartphone terlengkap di Indonesia',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://cekspek.vercel.app/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// 3. Product Schema (untuk halaman detail HP)
interface ProductSchemaProps {
  name: string;
  brand: string;
  image: string;
  description: string;
  price: number;
  rating?: number;
  reviewCount?: number;
  releaseDate?: string;
}

export function ProductSchema({
  name,
  brand,
  image,
  description,
  price,
  rating = 4.5,
  reviewCount = 0,
  releaseDate,
}: ProductSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    brand: {
      '@type': 'Brand',
      name: brand,
    },
    image,
    description,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'IDR',
      lowPrice: price,
      highPrice: price * 1.2,
      offerCount: 5,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: rating,
      reviewCount: reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    releaseDate: releaseDate,
  };

  return (
    <Script
      id="product-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// 4. Breadcrumb Schema
interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Cara pakai:
// Di layout.tsx tambahkan:
// <OrganizationSchema />
// <WebsiteSchema />

// Di halaman detail HP:
// <ProductSchema
//   name="Samsung Galaxy S24"
//   brand="Samsung"
//   image="/phones/samsung-s24.jpg"
//   description="..."
//   price={12000000}
//   rating={4.7}
//   reviewCount={150}
// />

// Di halaman dengan breadcrumb:
// <BreadcrumbSchema
//   items={[
//     { name: 'Home', url: 'https://cekspek.vercel.app' },
//     { name: 'Phones', url: 'https://cekspek.vercel.app/phones' },
//     { name: 'Samsung', url: 'https://cekspek.vercel.app/phones/samsung-s24' },
//   ]}
// />