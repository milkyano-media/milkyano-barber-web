import React, { useCallback, useEffect, useRef, } from 'react'
import {
  EmblaCarouselType,
  EmblaEventType,
  EmblaOptionsType
} from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import {
  NextButton,
  PrevButton,
  usePrevNextButtons
} from './EmblaCarouselArrowButtonsCarauselGallery'

import image1 from '@/assets/our-works/1.png';
import image2 from '@/assets/our-works/2.png';
import image3 from '@/assets/our-works/3.png';
import image4 from '@/assets/our-works/4.png';
import image5 from '@/assets/our-works/5.png';

const galleryImages = [
  image1,
  image2,
  image3,
  image4,
  image5
];
import styles from '@/styles/CarauselGallery.module.css';

const TWEEN_FACTOR_BASE = 0.52

type PropType = {
  slides: number[]
  options?: EmblaOptionsType
}

const CarauselGallery: React.FC<PropType> = (props) => {
  const { options } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options)
  const tweenFactor = useRef(0)
  const tweenNodes = useRef<HTMLElement[]>([])
  const prevButtonRef = useRef<HTMLButtonElement | null>(null);
  const nextButtonRef = useRef<HTMLButtonElement | null>(null);

  const {
    prevBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  const setTweenNodes = useCallback((emblaApi: EmblaCarouselType): void => {
    tweenNodes.current = emblaApi.slideNodes().map((slideNode) => {
      return slideNode.querySelector('.carausel-gallery-slide-number') as HTMLElement
    })
  }, [])

  const setTweenFactor = useCallback((emblaApi: EmblaCarouselType) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length
  }, [])

  const tweenScale = useCallback(
    (emblaApi: EmblaCarouselType, eventName?: EmblaEventType) => {
      const engine = emblaApi.internalEngine()
      const scrollProgress = emblaApi.scrollProgress()
      const slidesInView = emblaApi.slidesInView()
      const isScrollEvent = eventName === 'scroll'
      const observerOptions = {
        root: null, // relative to document viewport 
        rootMargin: '-500px', // margin around root. Values are similar to css property. Unitless values not allowed
        threshold: 0.9 // visible amount of item shown in relation to root
      };

      const observer = new IntersectionObserver(entries => {
        entries.forEach(() => {
          // console.log(entry.target, entry.intersectionRatio);

        });
      }, observerOptions);

      if (prevButtonRef.current) {
        observer.observe(prevButtonRef.current);

      }
      if (nextButtonRef.current) {
        observer.observe(nextButtonRef.current);

      }
      emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
        let diffToTarget = scrollSnap - scrollProgress
        const slidesInSnap = engine.slideRegistry[snapIndex]
        // console.log(slidesInSnap, "slidesInSnap")
        slidesInSnap.forEach((slideIndex) => {
          if (isScrollEvent && !slidesInView.includes(slideIndex)) return

          if (engine.options.loop) {
            engine.slideLooper.loopPoints.forEach((loopItem) => {
              const target = loopItem.target();

              if (slideIndex === loopItem.index && target !== 0) {
                const sign = Math.sign(target)

                if (sign === -1) {
                  diffToTarget = scrollSnap - (1 + scrollProgress)
                }
                if (sign === 1) {

                  diffToTarget = scrollSnap + (1 - scrollProgress)
                }
              }
            })
          }

          const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current)
          const SecondtweenValue = 1.3 - Math.abs(diffToTarget * tweenFactor.current)

          // Calculate a blur value based on the tween value
          const blur = (1 - tweenValue) * 10
          // Calculate an opacity value based on the tween value
          const opacity = SecondtweenValue;

          // const scale = numberWithinRange(tweenValue, 0.8, 1).toString()
          const tweenNode = tweenNodes.current[slideIndex]
          // console.log(tweenNode, "tweenNode")
          // tweenNode.style.transform = `scale(${scale})`
          tweenNode.style.filter = `blur(${blur}px)`
          tweenNode.style.opacity = opacity.toString();
        })

        // Clean up observer
        return () => {
          if (prevButtonRef.current) {
            observer.unobserve(prevButtonRef.current);
          }
        };
      })

    },
    []
  )

  useEffect(() => {
    if (!emblaApi) return
    setTweenNodes(emblaApi)
    setTweenFactor(emblaApi)
    tweenScale(emblaApi)
    emblaApi
      .on('reInit', setTweenNodes)
      .on('reInit', setTweenFactor)
      .on('reInit', tweenScale)
      .on('scroll', tweenScale)
  }, [emblaApi, setTweenFactor, setTweenNodes, tweenScale])


  return (
    <div className={styles.embla}>
      <div className={styles.embla__viewport} ref={emblaRef}>
        <div className={styles.embla__container}>
          {galleryImages.map((image, index) => (
            <div className={styles.embla__slide} key={index}>
              <div className={`${styles.embla__slide__number} carausel-gallery-slide-number`}>
                <img src={image} alt={`Gallery ${index + 1}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`${styles.embla__controls} transition-opacity duration-300`} >
        <div className={styles.embla__buttons}>
          <PrevButton ref={prevButtonRef} style={{ transition: 'opacity 0.2s ease-in-out' }} onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton ref={nextButtonRef} style={{ transition: 'opacity 0.2s ease-in-out' }} onClick={onNextButtonClick} disabled={prevBtnDisabled} />
        </div>
      </div>
    </div>
  )
}

export default CarauselGallery
