import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState
} from 'react'
import { EmblaCarouselType } from 'embla-carousel'

type UsePrevNextButtonsType = {
  prevBtnDisabled: boolean
  nextBtnDisabled: boolean
  onPrevButtonClick: () => void
  onNextButtonClick: () => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const usePrevNextButtons = (
  emblaApi: EmblaCarouselType | undefined,
  onButtonClick?: (emblaApi: EmblaCarouselType) => void
): UsePrevNextButtonsType => {
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true)

  const onPrevButtonClick = useCallback(() => {
    if (!emblaApi) return
    emblaApi.scrollPrev()
    if (onButtonClick) onButtonClick(emblaApi)
  }, [emblaApi, onButtonClick])

  const onNextButtonClick = useCallback(() => {
    if (!emblaApi) return
    emblaApi.scrollNext()
    if (onButtonClick) onButtonClick(emblaApi)
  }, [emblaApi, onButtonClick])

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev())
    setNextBtnDisabled(!emblaApi.canScrollNext())
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    onSelect(emblaApi)
    emblaApi.on('reInit', onSelect)
    emblaApi.on('select', onSelect)
  }, [emblaApi, onSelect])

  return {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  }
}

type PropType = PropsWithChildren<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
>


export const PrevButton = React.forwardRef<HTMLButtonElement, PropType>((props, ref) => {
  const { children, ...restProps } = props

  return (
    <button
      ref={ref}
      aria-label='Previous'
      className="embla__button embla__button--prev "
      type="button"
      {...restProps}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="embla__button__svg " width="20" height="20" viewBox="0 0 20 20">
        <path d="M10,20A10,10,0,1,0,0,10,10,10,0,0,0,10,20ZM11.289,4.3,12.711,5.7l-4.3,4.344L12.7,14.289,11.3,15.711,5.586,10.063Z" />
      </svg>
      {children}
    </button>
  )
})

PrevButton.displayName = 'PrevButton';

export const NextButton = React.forwardRef<HTMLButtonElement, PropType>((props, ref) => {
  const { children, ...restProps } = props

  return (
    <button
      ref={ref}
      aria-label='Next'
      className="embla__button embla__button--next"
      type="button"
      {...restProps}
    >


      <svg width="20" height="20" viewBox="0 0 20 20" className="embla__button__svg " xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_1_4)">
          <path d="M10 -2.94047e-06C8.02219 -2.76756e-06 6.08879 0.586488 4.4443 1.6853C2.7998 2.78412 1.51808 4.3459 0.761203 6.17316C0.00432637 8.00042 -0.193707 10.0111 0.192146 11.9509C0.577998 13.8907 1.53041 15.6725 2.92893 17.0711C4.32746 18.4696 6.10929 19.422 8.0491 19.8078C9.98891 20.1937 11.9996 19.9957 13.8268 19.2388C15.6541 18.4819 17.2159 17.2002 18.3147 15.5557C19.4135 13.9112 20 11.9778 20 10C20 7.34783 18.9464 4.80429 17.0711 2.92893C15.1957 1.05356 12.6522 -3.17233e-06 10 -2.94047e-06ZM8.711 15.7L7.289 14.3L11.589 9.956L7.3 5.711L8.7 4.289L14.414 9.937L8.711 15.7Z" fill="inherit" />
        </g>
        <defs>
          <clipPath id="clip0_1_4">
            <rect width="20" height="20" fill="white" transform="translate(20 20) rotate(180)" />
          </clipPath>
        </defs>
      </svg>

      {children}
    </button>
  )
})

NextButton.displayName = 'NextButton';