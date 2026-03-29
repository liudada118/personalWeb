"use client";

import Link from "next/link";

type ServiceItem = {
  icon?: string;
  title: string;
  description: string;
  href?: string;
};

type ServicesGridProps = {
  items: ServiceItem[];
  eyebrow?: string;
  title?: string;
};

/**
 * Services Grid - Inspired by sidneydekker.com
 * 6-column grid of service cards with icons
 */
export function ServicesGrid({ items, eyebrow, title }: ServicesGridProps) {
  return (
    <section className="services-grid-section">
      {(eyebrow || title) && (
        <div className="services-grid-header">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          {title && <h2 className="services-grid-title">{title}</h2>}
        </div>
      )}
      <div className="services-grid">
        {items.map((item, index) => (
          <article className="service-card" key={item.title}>
            {item.icon && (
              <div className="service-card-icon">
                <img alt={item.title} height="48" src={item.icon} width="48" />
              </div>
            )}
            <h3 className="service-card-title">
              {item.href ? (
                <Link href={item.href}>{item.title}</Link>
              ) : (
                item.title
              )}
            </h3>
            <p className="service-card-description">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
