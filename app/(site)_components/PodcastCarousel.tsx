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

  return (
    <div className={styles.carouselRoot}>
      <div className={styles.viewportWrapper}>
        <button
          aria-label="Previous episode"
          className={`${styles.arrow} ${styles.arrowPrev}`}
          onClick={scrollPrev}
          type="button"
        >
          ‹
        </button>

        <div className={styles.viewport} ref={emblaRef}>
          <div className={styles.track}>
            {cards.map((card, index) => (
              <div className={styles.slide} key={`${card.episodeCode}-${index}`}>
                <article className={styles.card}>
                  <div className={styles.cardThumb} />
                  <div className={styles.cardBody}>
                    <span className={styles.cardCode}>{card.episodeCode}</span>
                    <strong className={styles.cardTitle}>{card.title}</strong>
                    <p className={styles.cardSummary}>{card.summary}</p>
                    {card.duration && (
                      <span className={styles.cardDuration}>{card.duration}</span>
                    )}
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>

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
        {cards.map((_, index) => (
          <button
            aria-label={`Go to episode ${index + 1}`}
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
