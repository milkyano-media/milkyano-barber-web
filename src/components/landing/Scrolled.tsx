/* eslint-disable @typescript-eslint/no-explicit-any */

import useEmblaCarousel from 'embla-carousel-react'
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styles from '@/styles/EmblaCarousel.module.css';

const EmblaCarouselComponent = ({ children, options }: { children: React.ReactNode, options?: object }) => {
  const carouselRef = useRef(null);

  const [isFullyInView, setIsFullyInView] = useState(false);
  const tweenFactor = useRef<number>(1);


  const tweenNodes = useRef<Array<HTMLElement>>([]);
  const numberWithinRange = (number: number, min: number, max: number): number => {
    return Math.min(Math.max(number, min), max);
  }


  const setTweenNodes = useCallback((embla: any) => {
    tweenNodes.current = embla.slideNodes().map((slideNode: any) => {
      return slideNode.querySelector('#embla__slide__number');
    });
  }, []);

  const [emblaRef, embla] = useEmblaCarousel(options || { loop: true, skipSnaps: true, }, [
    WheelGesturesPlugin({
    }),
  ])

  const tweenScale = useCallback(
    (embla: any) => {
      const engine = embla.internalEngine();
      const scrollProgress = embla.scrollProgress();
      const slidesInView = embla.slidesInView();
      embla.scrollSnapList().forEach((scrollSnap: any, snapIndex: any) => {
        let diffToTarget = scrollSnap - scrollProgress;
        const slidesInSnap = engine.slideRegistry[snapIndex];

        slidesInSnap.forEach((slideIndex: any) => {
          if (!slidesInView.includes(slideIndex)) return;

          if (engine.options.loop) {
            engine.slideLooper.loopPoints.forEach((loopItem: any) => {
              const target = loopItem.target();

              if (slideIndex === loopItem.index && target !== 0) {
                const sign = Math.sign(target);

                if (sign === -1) {
                  diffToTarget = scrollSnap - (1 + scrollProgress);
                }
                if (sign === 1) {
                  diffToTarget = scrollSnap + (1 - scrollProgress);
                }
              }
            });
          }

          tweenFactor.current = 4; // Increase the tweenFactor.current to make the tweenValue lower
          const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current);

          const scale = numberWithinRange(tweenValue, 0.1, 1).toString();
          const tweenNode = tweenNodes.current[slideIndex];

          tweenNode.style.transform = `scale(${scale})`;
        });
      });
    },
    []
  );

  useEffect(() => {
    const intersectionCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // The carousel is in view
          setIsFullyInView(true);
          // console.log('Carousel is fully in view');
        } else {
          // The carousel is not in view
          setIsFullyInView(false);
          // console.log('Carousel is not fully in view');
        }
      });
    };

    const options = { threshold: 0.5 }; // 100% of the target are visible
    const intersectionObserver = new IntersectionObserver(intersectionCallback, options);

    if (carouselRef.current) {
      intersectionObserver.observe(carouselRef.current);
    }

    return () => {
      if (carouselRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        intersectionObserver.unobserve(carouselRef.current);
      }
    };
  }, []);

  const setTweenFactor = useCallback((embla: any) => {
    // Update the tweenFactor based on some condition
    if (embla.scrollProgress() > 0.5) {
      tweenFactor.current = 0;
    } else {
      tweenFactor.current = 1;
    }
    // console.log(tweenFactor.current, "set tween factor");  // Add this line
  }, []);

  useEffect(() => {
    if (!embla) return;

    setTweenNodes(embla);
    setTweenFactor(embla);
    tweenScale(embla);

    embla
      .on('reInit', setTweenNodes)
      .on('reInit', setTweenFactor)
      .on('reInit', tweenScale)
      .on('scroll', tweenScale)


    let isAnimating = false;
    let carouselContainer: HTMLElement;

    if (isFullyInView && !isAnimating) {
      isAnimating = true;

      // Reset the blur effect and other transformations
      tweenScale(embla);
      carouselContainer = embla.containerNode();



      carouselContainer.style.transition = 'transform .5s ease-in-out, backdrop-filter .5s ease-in-out'; // Add ease-in-out transition
      // carouselContainer.style.backdropFilter = 'blur(0px)'; // Remove blur effect

      // Reset the scale to normal
      carouselContainer.style.transform = 'scale(1)';

      // First animation
      carouselContainer.style.transform = `translate3d(35px, 0px, 0px)`;
      setTimeout(() => {

        carouselContainer.style.transform = `translate3d(72px, 0px, 0px)`;
        setTimeout(() => {
          // Second animation
          carouselContainer.style.transform = `translate3d(35px, 0px, 0px)`;
          setTimeout(() => {
            carouselContainer.style.transform = `translate3d(72px, 0px, 0px)`;
            setTimeout(() => {
              carouselContainer.style.transition = ''; // Reset the transition
              carouselContainer.style.backdropFilter = ''; // Reset the blur effect
              // embla.scrollTo(0); // Reset the carousel to the first slide
              embla.reInit({ loop: true, slidesToScroll: 1, containScroll: "trimSnaps" }); // Reset slide settings
            }, 500); // 500ms = 0.5 second
          }, 1000); // 1000ms = 1 second
        }, 500); // 500ms = 0.5 second
      }, 1000); // 1000ms = 1 second
    } else {
      // If the slide is not fully in view, scroll to the first slide
      embla.scrollTo(0);
    }

    embla.on('pointerDown', () => {

      if (isAnimating) {
        // Stop all animations
        carouselContainer.style.transition = '';
        carouselContainer.style.transform = '';
        carouselContainer.style.backdropFilter = '';

        // Reset the carousel to the first slide
        // embla.scrollTo(0);
        embla.reInit({ loop: false, containScroll: "trimSnaps" });

        isAnimating = false;
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [embla, isFullyInView, tweenScale]);

  return (
    <>
      <div

        className={`relative w-screen overflow-hidden ${styles.embla}`} ref={carouselRef}>

        <div ref={emblaRef} className={styles.embla__viewport}>
          <div className={styles.embla__container}>
            {React.Children.map(children, (Child, index) => (
              <div className={styles.embla__slide} key={index}>
                <div className={styles.embla__slide__inner}>
                  <div className='flex justify-center items-center flex-col' id={"embla__slide__number"}>
                    {Child}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Hidden div for Intersection Observer */}
        <div className='h-12 bottom-0' ref={carouselRef} style={{ position: 'absolute', left: '50%', visibility: 'hidden' }}>
          anjay
        </div>
      </div>
    </>
  )
}

type ImageType = {
  src: string;
  name: string;
};

type ScrolledProps = {
  cutsImages: ImageType[];
};

const Srolled: React.FC<ScrolledProps> = ({ cutsImages }) => {
  console.log(cutsImages)
  const observers = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    observers.current.forEach((observerInstance) => {
      if (observerInstance) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            // Set the opacity to 1 when the element is in the viewport
            if (entry.isIntersecting) {
              observerInstance.style.opacity = '1';
              // console.log('Element is fully in view:', entry.target);
            } else {
              // Set the opacity back to 0 when the element is not in the viewport
              observerInstance.style.opacity = '0';
            }
          },
          {
            // Trigger the observer when the element is 50% in the viewport
            threshold: 0.8,
          }
        );

        observer.observe(observerInstance);
        observerInstance.style.opacity = '0';

        return () => {
          // Clean up the observer when the component is unmounted
          observer.unobserve(observerInstance);
        };
      }
    });
  }, []);
  return (
    <div className='text-stone-50 relative z-20 overflow-hidden w-full' >
      <h3 className="relative z-10 text-3xl md:text-6xl font-poppins font-extrabold  text-center my-10 text-transparent bg-gradient-to-r from-[#19F456] via-[#44D140] to-[#A1FF80] bg-clip-text overflow-hidden w-full">Transformation</h3>
      <div className="content flex flex-col justify-center w-full items-center overflow-hidden py-12">
        <EmblaCarouselComponent>
          {cutsImages.map((image, index) => (
            <div className="flex justify-center flex-col items-center w-full md:w-[30rem]" key={index}>
              <img key={index} src={image.src} alt={`Cut image ${index + 1}`} className="object-cover rounded-2xl w-full md:w-9/12" />
              <h3 ref={ref => observers.current[index] = ref ?? null} id='carousel-item' className='text-xl md:text-3xl py-8 font-extrabold w-8/12 text-center transition-opacity duration-500 ease-in-out'>
                {image.name}
              </h3>
            </div>
          ))}
        </EmblaCarouselComponent>
      </div>

    </div>
  )
}

export default Srolled

