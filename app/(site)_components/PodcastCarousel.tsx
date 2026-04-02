"use client";

import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import styles from "./podcast-carousel.module.css";

interface PodcastCard {
  episodeCode: string;
  title: string;
  summary: string;
  duration?: string;
  releasedAt?: string;
}

interface PodcastCarouselProps {
  cards: PodcastCard[];
}

export function PodcastCarousel({ cards }: PodcastCarouselProps) {
  const cardToneClasses = [styles.cardToneLead, styles.cardToneCore, styles.cardToneEcho];
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
    skipSnaps: false,
    containScroll: "trimSnaps",
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    // Init
    setSelectedIndex(emblaApi.selectedScrollSnap());

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  // Dots represent scroll snap pages; each snap may show 1 or more cards
  const totalDots = emblaApi ? emblaApi.scrollSnapList().length : cards.length;

  return (
    <div className={styles.carouselRoot}>
      <div className={styles.viewportWrapper}>
        <div className={styles.viewport} ref={emblaRef}>
          <div className={styles.track}>
            {cards.map((card, index) => (
              <div className={styles.slide} key={`${card.episodeCode}-${index}`}>
                <article className={`${styles.card} ${cardToneClasses[index % cardToneClasses.length]}`}>
                  <div className={styles.cardThumb}>
                    <div className={styles.cardThumbInner}>
                      <span className={styles.cardThumbLabel}>Featured Audio</span>
                      <span aria-hidden="true" className={styles.cardThumbIndex}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.cardMeta}>
                      <span className={styles.cardCode}>{card.episodeCode}</span>
                      {card.duration && (
                        <span className={styles.cardDuration}>{card.duration}</span>
                      )}
                    </div>
                    <strong className={styles.cardTitle}>{card.title}</strong>
                    <p className={styles.cardSummary}>{card.summary}</p>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>

        <button
          aria-label="Previous episode"
          className={`${styles.arrow} ${styles.arrowPrev}`}
          onClick={scrollPrev}
          type="button"
        >
          ‹
        </button>

        <button
          aria-label="Next episode"
          className={`${styles.arrow} ${styles.arrowNext}`}
          onClick={scrollNext}
          type="button"
        >
          ›
        </button>
      </div>

      <div className={styles.dots} aria-hidden="true">
        {Array.from({ length: totalDots }).map((_, index) => (
          <button
            aria-label={`Go to episode group ${index + 1}`}
            className={`${styles.dot} ${index === selectedIndex ? styles.dotActive : ""}`}
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            type="button"
          />
        ))}
      </div>
    </div>
  );
}
