import { Action, Settings } from '../types';

export type SettingsActions = {
  update: (data: Partial<Settings>) => Settings;
};

export const createSettingsActions: Action<SettingsActions> = (state, updateState) => ({
  /**
   * Updates settings.
   */
  update: (data) => {
    const settings: Settings = {
      ...state.settings,
      ...data,
    };
    updateState({ settings });
    return settings;
  },
});
