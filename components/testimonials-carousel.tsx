"use client";

import { useEffect, useState } from "react";

type Testimonial = {
  quote: string;
  author: string;
  role?: string;
  date?: string;
};

type TestimonialsCarouselProps = {
  testimonials: Testimonial[];
  autoPlay?: boolean;
  interval?: number;
};

/**
 * Testimonials Carousel - Inspired by sidneydekker.com
 * Sliding testimonials with navigation
 */
export function TestimonialsCarousel({
  testimonials,
  autoPlay = true,
  interval = 6000,
}: TestimonialsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!autoPlay || isPaused || testimonials.length < 2) return;

    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, isPaused, testimonials.length, interval]);

  if (!testimonials.length) return null;

  const current = testimonials[activeIndex];

  return (
    <section
      className="testimonials-carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="testimonials-content">
        <blockquote className="testimonial-quote">
          &ldquo;{current.quote}&rdquo;
        </blockquote>
        <div className="testimonial-meta">
          <cite className="testimonial-author">{current.author}</cite>
          {current.role && <span className="testimonial-role">{current.role}</span>}
          {current.date && <span className="testimonial-date">{current.date}</span>}
        </div>
      </div>

      {/* Navigation */}
      <div className="testimonials-nav">
        <button
          aria-label="Previous testimonial"
          className="testimonial-nav-btn prev"
          onClick={() => setActiveIndex((i) => (i - 1 + testimonials.length) % testimonials.length)}
          type="button"
        >
          <svg height="24" viewBox="0 0 24 24" width="24">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor" />
          </svg>
        </button>
        <div className="testimonials-dots">
          {testimonials.map((_, index) => (
            <button
              aria-label={`Go to testimonial ${index + 1}`}
              className={`testimonial-dot ${index === activeIndex ? "is-active" : ""}`}
              key={index}
              onClick={() => setActiveIndex(index)}
              type="button"
            />
          ))}
        </div>
        <button
          aria-label="Next testimonial"
          className="testimonial-nav-btn next"
          onClick={() => setActiveIndex((i) => (i + 1) % testimonials.length)}
          type="button"
        >
          <svg height="24" viewBox="0 0 24 24" width="24">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor" />
          </svg>
        </button>
      </div>
    </section>
  );
}
