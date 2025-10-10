'use client';

import * as React from 'react';
import useMeasure from 'react-use-measure';

import { cn } from '#utils/utils';
import {
  type MotionValue,
  type SpringOptions,
  type UseInViewOptions,
  motion,
  useInView,
  useSpring,
  useTransform,
} from 'motion/react';

// Default transition object - created once to prevent object recreation
const defaultTransition: SpringOptions = {
  stiffness: 200,
  damping: 20,
  mass: 0.4,
};

type SlidingNumberRollerProps = {
  prevValue: number;
  value: number;
  place: number;
  transition: SpringOptions;
};

// Memoized component to prevent unnecessary re-renders
const SlidingNumberRoller = React.memo<SlidingNumberRollerProps>(
  function SlidingNumberRoller({ prevValue, value, place, transition }) {
    const startNumber = Math.floor(prevValue / place) % 10;
    const targetNumber = Math.floor(value / place) % 10;
    const animatedValue = useSpring(startNumber, transition);

    React.useEffect(() => {
      animatedValue.set(targetNumber);
    }, [targetNumber, animatedValue]);

    const [measureRef, { height }] = useMeasure();

    // Memoize the displays array to prevent recreation
    const displays = React.useMemo(
      () =>
        Array.from({ length: 10 }, (_, i) => (
          <SlidingNumberDisplay
            key={i}
            motionValue={animatedValue}
            number={i}
            height={height}
            transition={transition}
          />
        )),
      [animatedValue, height, transition],
    );

    return (
      <span
        ref={measureRef}
        data-slot='sliding-number-roller'
        className='relative inline-block w-[1ch] overflow-y-clip overflow-x-visible tabular-nums leading-none'
      >
        <span className='invisible'>0</span>
        {displays}
      </span>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison function for efficient memoization
    return (
      prevProps.prevValue === nextProps.prevValue &&
      prevProps.value === nextProps.value &&
      prevProps.place === nextProps.place &&
      prevProps.transition.stiffness === nextProps.transition.stiffness &&
      prevProps.transition.damping === nextProps.transition.damping &&
      prevProps.transition.mass === nextProps.transition.mass
    );
  },
);

type SlidingNumberDisplayProps = {
  motionValue: MotionValue<number>;
  number: number;
  height: number;
  transition: SpringOptions;
};

// Memoized component with proper comparison to prevent unnecessary re-renders
const SlidingNumberDisplay = React.memo<SlidingNumberDisplayProps>(
  function SlidingNumberDisplay({ motionValue, number, height, transition }) {
    // useTransform must be called at top level, not inside useMemo
    const y = useTransform(motionValue, (latest) => {
      if (!height) return 0;
      const currentNumber = latest % 10;
      const offset = (10 + number - currentNumber) % 10;
      let translateY = offset * height;
      if (offset > 5) translateY -= 10 * height;
      return translateY;
    });

    // Memoize transition object to prevent recreation
    const stableTransition = React.useMemo(
      () => ({ ...transition, type: 'spring' as const }),
      [transition],
    );

    if (!height) {
      return <span className='invisible absolute'>{number}</span>;
    }

    return (
      <motion.span
        data-slot='sliding-number-display'
        style={{ y }}
        className='absolute inset-0 flex items-center justify-center'
        transition={stableTransition}
      >
        {number}
      </motion.span>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison function for efficient memoization
    return (
      prevProps.motionValue === nextProps.motionValue &&
      prevProps.number === nextProps.number &&
      prevProps.height === nextProps.height &&
      prevProps.transition.stiffness === nextProps.transition.stiffness &&
      prevProps.transition.damping === nextProps.transition.damping &&
      prevProps.transition.mass === nextProps.transition.mass
    );
  },
);

type SlidingNumberProps = React.ComponentProps<'span'> & {
  number: number | string;
  inView?: boolean;
  inViewMargin?: UseInViewOptions['margin'];
  inViewOnce?: boolean;
  padStart?: boolean;
  decimalSeparator?: string;
  decimalPlaces?: number;
  transition?: SpringOptions;
};

function SlidingNumber({
  ref,
  number,
  className,
  inView = false,
  inViewMargin = '0px',
  inViewOnce = true,
  padStart = false,
  decimalSeparator = '.',
  decimalPlaces = 0,
  transition = defaultTransition,
  ...props
}: SlidingNumberProps) {
  const localRef = React.useRef<HTMLSpanElement>(null);
  React.useImperativeHandle(ref, () => localRef.current!);

  const inViewResult = useInView(localRef, {
    once: inViewOnce,
    margin: inViewMargin,
  });
  const isInView = !inView || inViewResult;

  const prevNumberRef = React.useRef<number>(0);

  const effectiveNumber = React.useMemo(
    () => (!isInView ? 0 : Math.abs(Number(number))),
    [number, isInView],
  );

  const formatNumber = React.useCallback(
    (num: number) => (decimalPlaces != null ? num.toFixed(decimalPlaces) : num.toString()),
    [decimalPlaces],
  );

  const numberStr = formatNumber(effectiveNumber);
  const [newIntStrRaw, newDecStrRaw = ''] = numberStr.split('.');
  const newIntStr = padStart && newIntStrRaw?.length === 1 ? '0' + newIntStrRaw : newIntStrRaw;

  const prevFormatted = formatNumber(prevNumberRef.current);
  const [prevIntStrRaw = '', prevDecStrRaw = ''] = prevFormatted.split('.');
  const prevIntStr = padStart && prevIntStrRaw.length === 1 ? '0' + prevIntStrRaw : prevIntStrRaw;

  const adjustedPrevInt = React.useMemo(() => {
    return prevIntStr.length > (newIntStr?.length ?? 0)
      ? prevIntStr.slice(-(newIntStr?.length ?? 0))
      : prevIntStr.padStart(newIntStr?.length ?? 0, '0');
  }, [prevIntStr, newIntStr]);

  const adjustedPrevDec = React.useMemo(() => {
    if (!newDecStrRaw) return '';
    return prevDecStrRaw.length > newDecStrRaw.length
      ? prevDecStrRaw.slice(0, newDecStrRaw.length)
      : prevDecStrRaw.padEnd(newDecStrRaw.length, '0');
  }, [prevDecStrRaw, newDecStrRaw]);

  React.useEffect(() => {
    if (isInView) prevNumberRef.current = effectiveNumber;
  }, [effectiveNumber, isInView]);

  const intDigitCount = newIntStr?.length ?? 0;
  const intPlaces = React.useMemo(
    () => Array.from({ length: intDigitCount }, (_, i) => Math.pow(10, intDigitCount - i - 1)),
    [intDigitCount],
  );
  const decPlaces = React.useMemo(
    () =>
      newDecStrRaw
        ? Array.from({ length: newDecStrRaw.length }, (_, i) =>
            Math.pow(10, newDecStrRaw.length - i - 1),
          )
        : [],
    [newDecStrRaw],
  );

  const newDecValue = newDecStrRaw ? Number.parseInt(newDecStrRaw, 10) : 0;
  const prevDecValue = adjustedPrevDec ? Number.parseInt(adjustedPrevDec, 10) : 0;

  // Memoize parsed integer values to prevent recreation
  const parsedPrevInt = React.useMemo(
    () => Number.parseInt(adjustedPrevInt, 10),
    [adjustedPrevInt],
  );

  const parsedNewInt = React.useMemo(() => Number.parseInt(newIntStr ?? '0', 10), [newIntStr]);

  // Memoize the integer rollers to prevent recreation
  const integerRollers = React.useMemo(
    () =>
      intPlaces.map((place) => (
        // This component does not handle spaces as thousand separator so margins are manually added to compensate
        <div
          key={`int-${place}`}
          className={Math.log10(place) % 3 === 0 ? 'me-1' : Math.log10(place).toString()}
        >
          <SlidingNumberRoller
            key={`int-${place}`}
            prevValue={parsedPrevInt}
            value={parsedNewInt}
            place={place}
            transition={transition}
          />
        </div>
      )),
    [intPlaces, parsedPrevInt, parsedNewInt, transition],
  );

  // Memoize the decimal rollers to prevent recreation
  const decimalRollers = React.useMemo(
    () =>
      newDecStrRaw ? (
        <>
          <span>{decimalSeparator}</span>
          {decPlaces.map((place) => (
            <SlidingNumberRoller
              key={`dec-${place}`}
              prevValue={prevDecValue}
              value={newDecValue}
              place={place}
              transition={transition}
            />
          ))}
        </>
      ) : null,
    [newDecStrRaw, decimalSeparator, decPlaces, prevDecValue, newDecValue, transition],
  );

  return (
    <span
      ref={localRef}
      data-slot='sliding-number'
      className={cn('flex items-center', className)}
      {...props}
    >
      {isInView && Number(number) < 0 && <span className='mr-1'>-</span>}
      {integerRollers}
      {decimalRollers}
    </span>
  );
}

export { SlidingNumber, type SlidingNumberProps };
