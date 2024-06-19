import React, { useCallback, useEffect, useRef,  } from 'react'
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
} from './EmblaCarouselArrowButtons'

import { useMediaQuery } from 'react-responsive';

const TWEEN_FACTOR_BASE = 0.52

import video1 from '../assets/videos/josh/tiktok_1.mp4';
import video2 from '../assets/videos/josh/tiktok_2.mp4';
import video3 from '../assets/videos/josh/tiktok_3.mp4';
import video4 from '../assets/videos/josh/tiktok_1.mp4';
import video5 from '../assets/videos/josh/tiktok_2.mp4';
import video6 from '../assets/videos/josh/tiktok_3.mp4';

const videos = [
    video1,
    video2,
    video3,
    video4,
    video5,
    video6,
];

const numberWithinRange = (number: number, min: number, max: number): number =>
    Math.min(Math.max(number, min), max)

type PropType = {
    slides: number[]
    options?: EmblaOptionsType
}

const EmblaCarousel: React.FC<PropType> = (props) => {
    const {  options } = props
    const [emblaRef, emblaApi] = useEmblaCarousel(options)
    const tweenFactor = useRef(0)
    const tweenNodes = useRef<HTMLElement[]>([])
    const prevButtonRef = useRef<HTMLButtonElement | null>(null);
    const nextButtonRef = useRef<HTMLButtonElement | null>(null);

    const isMobileDevice = useMediaQuery({
        query: '(max-width: 768px)'
    });

    const {
        prevBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaApi)

    const setTweenNodes = useCallback((emblaApi: EmblaCarouselType): void => {
        tweenNodes.current = emblaApi.slideNodes().map((slideNode) => {
            return slideNode.querySelector('.embla__slide__number') as HTMLElement
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

            const observer = new IntersectionObserver(() => {
                // entries.forEach(entry => {
                //     console.log(entry.target, entry.intersectionRatio);
                // });
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

                    // Calculate a blur value based on the tween value
                    const blur = (1 - tweenValue) * 10

                    const scale = isMobileDevice
                        ? numberWithinRange(tweenValue, 0.8, 1).toString()
                        : numberWithinRange(tweenValue, 0, 1).toString();
                    // const scale = numberWithinRange(tweenValue, 0.8, 1).toString()
                    const tweenNode = tweenNodes.current[slideIndex]

                    tweenNode.style.transform = `scale(${scale})`
                    tweenNode.style.filter = `blur(${blur}px)`

                    // console.log(slideIndex, "slideIndex slideIndex")
                    // console.log(tweenNode, "tweenNode")

                    // Get the video element for the current slide
                    const video = tweenNode.querySelector('video') as HTMLVideoElement;

                    // Get the index of the currently selected slide
                    const selectedIndex = emblaApi.selectedScrollSnap();


                    
                    let nextButtonRect;

                    if (nextButtonRef.current) {
                        nextButtonRect = nextButtonRef.current.getBoundingClientRect();
                    } else {
                        nextButtonRect = { top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 };
                    }

                    let prevButtonRect;

                    if (prevButtonRef.current) {
                        prevButtonRect = prevButtonRef.current.getBoundingClientRect();
                    } else {
                        prevButtonRect = { top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 };
                    }


                    const videoRect = video.getBoundingClientRect();
                    // console.log(videoRect, "videoRect")
                    // Check if the elements intersect
                    const intersectionCheckNext = !(
                        videoRect.right < nextButtonRect.left ||
                        videoRect.left > nextButtonRect.right ||
                        videoRect.bottom < nextButtonRect.top ||
                        videoRect.top > nextButtonRect.bottom
                    );
                    const intersectionCheck = !(
                        videoRect.right < prevButtonRect.left ||
                        videoRect.left > prevButtonRect.right ||
                        videoRect.bottom < prevButtonRect.top ||
                        videoRect.top > prevButtonRect.bottom
                    );

                    // console.log(video, "video")

                    // setDoTheyIntersect(intersectionCheck);


                 
                    if (prevButtonRef.current && nextButtonRef.current) {
                        if (intersectionCheck && slideIndex === selectedIndex) {
                            prevButtonRef.current.style.opacity = "0";
                            nextButtonRef.current.style.opacity = "1";
                        } else if (intersectionCheckNext && slideIndex === selectedIndex) {
                            prevButtonRef.current.style.opacity = "1";
                            nextButtonRef.current.style.opacity = "0";
                        } else {
                            prevButtonRef.current.style.opacity = "1";
                            nextButtonRef.current.style.opacity = "1";
                        }
                    }

                    // If the slide is in view and the tween value is 1 (i.e., the slide is in the center), play the video
                    if (slideIndex === selectedIndex) {
                        video.play();
                    } else {
                        video.pause();
                    }
                })

                // Clean up observer
                return () => {
                    if (prevButtonRef.current) {
                        observer.unobserve(prevButtonRef.current);
                    }
                };
            })

        },
        [isMobileDevice]
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
        <div className="embla">
            <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container">
                    {videos.map((video, index) => (
                        <div className="embla__slide" key={index}>
                            <div className="embla__slide__number">
                                <video autoPlay muted loop playsInline className="w-full rounded-3xl relative z-0" ref={videoRef => {
                                    if (videoRef && !videoRef.src) {
                                        videoRef.src = video;
                                    }
                                }}>
                                    <source type="video/mp4" />
                                </video>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="embla__controls transition-opacity duration-300" >
                <div className="embla__buttons">
                    <PrevButton ref={prevButtonRef} style={{ transition: 'opacity 0.2s ease-in-out' }} onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
                    <NextButton ref={nextButtonRef} style={{ transition: 'opacity 0.2s ease-in-out' }} onClick={onNextButtonClick} disabled={prevBtnDisabled} />
                </div>
            </div>
        </div>
    )
}

export default EmblaCarousel
