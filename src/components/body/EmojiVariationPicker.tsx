import clsx from 'clsx';
import * as React from 'react';
import { useEmojiStyleConfig } from '../../config/useConfig';
import { asEmoji } from '../../dataUtils/asEmoji';
import {
  emojiHasVariations,
  emojiUnified,
  emojiVariations
} from '../../dataUtils/emojiSelectors';
import {
  buttonFromEmoji,
  elementHeight,
  emojiTrueOffsetTop,
  emojiTruOffsetLeft
} from '../../DomUtils/selectors';
import {
  useAnchoredEmojiRef,
  useBodyRef,
  useSetAnchoredEmojiRef
} from '../context/ElementRefContext';
import { useEmojiVariationPickerState } from '../context/PickerContext';
import { Emoji } from '../emoji/Emoji';
import './EmojiVariationPicker.css';

export function EmojiVariationPicker() {
  const VariationPickerRef = React.useRef<HTMLDivElement>(null);
  const [emoji] = useEmojiVariationPickerState();
  const emojiStyle = useEmojiStyleConfig();
  const { getTop, getMenuDirection } = useVariationPickerTop(
    VariationPickerRef
  );
  const setAnchoredEmojiRef = useSetAnchoredEmojiRef();
  const getPointerStyle = usePointerStyle(VariationPickerRef);

  const visible = emoji && emojiHasVariations(emoji);
  let top, pointerStyle;

  if (!visible) {
    setAnchoredEmojiRef(null);
  } else {
    top = getTop();
    pointerStyle = getPointerStyle();
  }

  const safeEmoji = asEmoji(emoji);

  return (
    <div
      ref={VariationPickerRef}
      className={clsx('epr-emoji-variation-picker', {
        visible
      })}
      style={{ top }}
    >
      {visible
        ? [emojiUnified(safeEmoji)]
            .concat(emojiVariations(safeEmoji))
            .slice(0, 6)
            .map(unified => (
              <Emoji
                key={unified}
                emoji={safeEmoji}
                unified={unified}
                emojiStyle={emojiStyle}
                showVariations={false}
              />
            ))
        : null}
      <div
        className={clsx('epr-emoji-pointer', {
          ['pointing-up']: getMenuDirection() === Direction.Down
        })}
        style={pointerStyle}
      />
    </div>
  );
}

function usePointerStyle(VariationPickerRef: React.RefObject<HTMLElement>) {
  const AnchoredEmojiRef = useAnchoredEmojiRef();
  return function getPointerStyle() {
    const style: React.CSSProperties = {};
    if (!VariationPickerRef.current) {
      return style;
    }

    if (AnchoredEmojiRef.current) {
      const button = buttonFromEmoji(AnchoredEmojiRef.current);

      const offsetLeft = emojiTruOffsetLeft(button);

      if (!button) {
        return style;
      }

      // half of the button
      style.left = offsetLeft + button?.clientWidth / 2 - 12;
    }

    return style;
  };
}

function useVariationPickerTop(
  VariationPickerRef: React.RefObject<HTMLElement>
) {
  const AnchoredEmojiRef = useAnchoredEmojiRef();
  const BodyRef = useBodyRef();
  let direction = Direction.Up;

  return {
    getMenuDirection,
    getTop
  };

  function getMenuDirection() {
    return direction;
  }

  function getTop() {
    direction = Direction.Up;
    let emojiOffsetTop = 0;

    if (!VariationPickerRef.current) {
      return 0;
    }

    const height = elementHeight(VariationPickerRef.current);

    if (AnchoredEmojiRef.current) {
      const bodyRef = BodyRef.current;
      const button = buttonFromEmoji(AnchoredEmojiRef.current);

      const buttonHeight = elementHeight(button);

      emojiOffsetTop = emojiTrueOffsetTop(button);

      let scrollTop = bodyRef?.scrollTop ?? 0;

      if (scrollTop > emojiOffsetTop - height) {
        direction = Direction.Down;
        emojiOffsetTop += buttonHeight + height;
      }
    }

    return emojiOffsetTop - height;
  }
}

enum Direction {
  Up,
  Down
}
