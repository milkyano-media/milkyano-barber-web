/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useSprings, animated, to as interpolate } from '@react-spring/web'
import { useDrag } from 'react-use-gesture'

import styles from '@/styles/card.module.css'

import card1 from '@/assets/card-stack/1.png';
import card2 from '@/assets/card-stack/2.png';
import card3 from '@/assets/card-stack/3.jpg';

const cards = [card3, card1, card2,];

const to = (i: number, opacity: number = 1) => ({
  opacity,
  x: i * -50,
  y: i * 1,
  scale: 1,
  rot: 10 + i * -10,
  delay: i * 100,
})
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const from = (_i: number) => ({ x: 0, rot: 0, scale: 1.5, y: -1000 })
const trans = (r: number, s: number) =>
  `perspective(1500px) rotateX(0deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`

function CardStack() {
  const [gone] = useState(() => new Set())

  const [lastDraggedIndex, setLastDraggedIndex] = useState(2); // Initialize to 0

  const [props, api] = useSprings(cards.length, i => ({
    ...to(i),
    from: from(i),
    opacity: 1 // Add this line
  }))

    const bind = useDrag(({
      args: [index], down, movement: [mx], direction: [xDir], velocity,
    }: any) => {

    const trigger = velocity > 0.1
    const dir = xDir < 0 ? -1 : 1
    if (!down && trigger) gone.add(index)
    api.start(i => {
      if (index !== i) return
      const isGone = gone.has(index)
      const x = isGone ? (300 + window.innerWidth / 2) * dir : down ? mx : 0; 
      const rot = mx / 50 + (isGone ? dir * 5 * velocity : 0);
      const scale = down ? 1.1 : 1
      // Calculate the opacity based on the x value
      let opacity;
      if (x <= -50) {
        opacity = Math.max(0, 1 + x / 10);
      } else if (x > 50) {
        opacity = Math.max(0, 1 - x / 10);
      }
      // Reset opacity to 1 if all cards are gone
      if (gone.size === cards.length) {
        opacity = 1;
      }
      return {
        x,
        rot,
        scale,
        opacity,
        delay: undefined,
        config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 },
      }
    })
    if (!down && gone.size === cards.length)
      setTimeout(() => {
        setLastDraggedIndex(2);
        gone.clear()
        api.start(i => to(i))
      }, 600)


    if (!down && trigger) {
      // console.log([`Swiped card with index: ${index}`]); // Add this line
      setLastDraggedIndex(index); // Update lastDraggedIndex when a card is swiped
      gone.add(index);
    }
  })


  return (
    <>
      {props.map(({ x, y, rot, scale, opacity }: any, i) => {

        const isNextCard = i === cards.length - 1 - lastDraggedIndex;

        return (
          <animated.div className={styles.deck} key={i} style={{ x, y }}>
            <animated.div
              {...bind(i)}

              style={{
                opacity,
                transform: interpolate([rot, scale], trans),
                backgroundImage: `url(${cards[i]})`,
                filter: `blur(${isNextCard ? 10 : 0}px) brightness(${isNextCard ? 30 : 100}%)`,
              }}
            />
          </animated.div>
        );
      })}
    </>
  )
}

export default CardStack
