import { useState, useEffect, useCallback, type ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

interface CarouselProps {
  children: ReactNode[];
  itemsPerView?: { mobile: number; tablet: number; desktop: number };
  className?: string;
  desktopClassName?: string;
  autoplay?: boolean;
  gap?: number;
  mobileOnly?: boolean;
  loop?: boolean;
}

export default function Carousel({
  children,
  itemsPerView = { mobile: 1, tablet: 2, desktop: 3 },
  className = "",
  desktopClassName = "",
  autoplay = false,
  gap = 24,
  mobileOnly = false,
  loop = true
}: CarouselProps) {
  const [currentItemsPerView, setCurrentItemsPerView] = useState(itemsPerView.mobile);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [isDesktop, setIsDesktop] = useState(false);

  const plugins = autoplay ? [Autoplay({ delay: 4000, stopOnInteraction: false })] : [];

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop,
      align: "start",
      slidesToScroll: 1,
      containScroll: "trimSnaps"
    },
    plugins
  );

  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
      setIsDesktop(width >= 1024);
      if (width >= 1024) {
        setCurrentItemsPerView(itemsPerView.desktop);
      } else if (width >= 640) {
        setCurrentItemsPerView(itemsPerView.tablet);
      } else {
        setCurrentItemsPerView(itemsPerView.mobile);
      }
    };
    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, [itemsPerView]);

  // Reindex when screen size changes
  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit();
      setScrollSnaps(emblaApi.scrollSnapList());
    }
  }, [emblaApi, currentItemsPerView]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  // На десктопе показываем грид если mobileOnly
  if (mobileOnly && isDesktop) {
    return <div className={desktopClassName || className}>{children}</div>;
  }

  const slideWidth = `calc(${100 / currentItemsPerView}% - ${(gap * (currentItemsPerView - 1)) / currentItemsPerView}px)`;

  return (
    <div className="relative group">
      {/* Carousel viewport */}
      <div className="overflow-hidden py-2" ref={emblaRef}>
        <div className="flex">
          {children.map((child, index) => (
            <div
              key={index}
              className="flex-shrink-0"
              style={{
                flex: `0 0 ${slideWidth}`,
                paddingRight: `${gap}px`
              }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={scrollPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 w-12 h-12 rounded-full bg-surface/90 backdrop-blur border border-primary/30 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-primary/30 hover:border-accent/50 hover:scale-110 z-10"
        aria-label="Previous"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 w-12 h-12 rounded-full bg-surface/90 backdrop-blur border border-primary/30 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-primary/30 hover:border-accent/50 hover:scale-110 z-10"
        aria-label="Next"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots indicator */}
      <div className="flex justify-center gap-2 mt-8">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === selectedIndex
                ? "bg-accent w-8"
                : "bg-primary/40 w-2 hover:bg-primary/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
