import * as React from 'react';
import { CategoriesConfig } from '../../config/categoryConfig';
import {
  basePickerConfig,
  EmojiStyle,
  mergeConfig,
  PickerConfig,
  PickerConfigInternal
} from '../../config/config';
import { SkinTones } from '../../data/skinToneVariations';
import { EmojiClickData } from '../../hooks/useMouseDownHandlers';

type Props = PickerConfig &
  Readonly<{
    children: React.ReactNode;
  }>;

const ConfigContext = React.createContext<PickerConfigInternal>(
  basePickerConfig()
);

export function PickerConfigProvider({ children, ...config }: Props) {
  return (
    <ConfigContext.Provider value={mergeConfig(config)}>
      {children}
    </ConfigContext.Provider>
  );
}

export function usePickerConfig() {
  return React.useContext(ConfigContext);
}

export function useSearchPlaceHolderConfig(): string {
  const { searchPlaceHolder } = usePickerConfig();
  return searchPlaceHolder;
}

export function useDefaultSkinToneConfig(): SkinTones {
  const { defaultSkinTone } = usePickerConfig();
  return defaultSkinTone;
}

export function useSkinTonesDisabledConfig(): boolean {
  const { skinTonesDisabled } = usePickerConfig();
  return skinTonesDisabled;
}

export function useEmojiStyleConfig(): EmojiStyle {
  const { emojiStyle } = usePickerConfig();
  return emojiStyle;
}

export function useAutoFocusSearchConfig(): boolean {
  const { autoFocusSearch } = usePickerConfig();
  return autoFocusSearch;
}

export function useCategoriesConfig(): CategoriesConfig {
  const { categories } = usePickerConfig();
  return categories;
}

export function useOnEmojiClickConfig(): (
  event: MouseEvent,
  emoji: EmojiClickData
) => void {
  const { onEmojiClick } = usePickerConfig();
  return onEmojiClick;
}

export function useShowPreviewConfig(): boolean {
  const { showPreview } = usePickerConfig();
  return showPreview;
}

export function useThemeConfig(): string {
  const { theme } = usePickerConfig();
  return theme;
}
