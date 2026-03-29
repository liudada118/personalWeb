"use client";

import { useEffect, useRef, useState } from "react";

type VideoHeroSectionProps = {
  title: string;
  subtitle?: string;
  videoUrl?: string;
  posterUrl?: string;
  ctaLabel: string;
  ctaHref: string;
};

/**
 * Video Hero Section - Inspired by sidneydekker.com
 * Full-screen video background with overlay text and CTA
 */
export function VideoHeroSection({
  title,
  subtitle,
  videoUrl,
  posterUrl,
  ctaLabel,
  ctaHref,
}: VideoHeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay was prevented, that's fine
      });
    }
  }, []);

  return (
    <section className="video-hero-section">
      {/* Video Background */}
      <div className="video-hero-background">
        {videoUrl ? (
          <video
            autoPlay
            className={`video-hero-video ${isLoaded ? "is-loaded" : ""}`}
            loop
            muted
            onCanPlay={() => setIsLoaded(true)}
            playsInline
            poster={posterUrl}
            ref={videoRef}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : (
          <div
            className="video-hero-fallback"
            style={posterUrl ? { backgroundImage: `url(${posterUrl})` } : undefined}
          />
        )}
        {/* Gradient Overlays */}
        <div className="video-hero-overlay" />
        <div className="video-hero-vignette" />
      </div>

      {/* Content */}
      <div className="video-hero-content">
        <div className="video-hero-stage">
          <h2 className="video-hero-title">{title}</h2>
          {subtitle && <p className="video-hero-subtitle">{subtitle}</p>}
          <a className="video-hero-cta" href={ctaHref}>
            {ctaLabel}
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className={`video-hero-scroll ${isScrolled ? "is-hidden" : ""}`}>
        <span>Scroll</span>
        <svg height="24" viewBox="0 0 24 24" width="24">
          <path d="M12 16l-6-6h12z" fill="currentColor" />
        </svg>
      </div>
    </section>
  );
}
