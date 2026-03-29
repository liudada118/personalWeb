"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type VideoHeroSectionProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  videoUrl?: string;
  posterUrl?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  className?: string;
  titleTag?: "h1" | "h2";
  align?: "left" | "center";
};

/**
 * Video Hero Section - Inspired by sidneydekker.com
 * Full-screen video background with overlay text and CTA
 */
export function VideoHeroSection({
  eyebrow,
  title,
  subtitle,
  videoUrl,
  posterUrl,
  ctaLabel,
  ctaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
  className,
  titleTag = "h2",
  align = "center",
}: VideoHeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const TitleTag = titleTag;

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

  const rootClassName = [
    "video-hero-section",
    align === "left" ? "is-left-aligned" : "is-centered",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={rootClassName}>
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
            className="video-hero-fallback is-loaded"
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
          {eyebrow ? <p className="video-hero-eyebrow">{eyebrow}</p> : null}
          <TitleTag className="video-hero-title">{title}</TitleTag>
          {subtitle && <p className="video-hero-subtitle">{subtitle}</p>}
          {(ctaLabel && ctaHref) || (secondaryCtaLabel && secondaryCtaHref) ? (
            <div className="video-hero-actions">
              {ctaLabel && ctaHref ? (
                <Link className="video-hero-cta" href={ctaHref}>
                  {ctaLabel}
                </Link>
              ) : null}
              {secondaryCtaLabel && secondaryCtaHref ? (
                <Link className="video-hero-cta video-hero-cta-secondary" href={secondaryCtaHref}>
                  {secondaryCtaLabel}
                </Link>
              ) : null}
            </div>
          ) : null}
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
