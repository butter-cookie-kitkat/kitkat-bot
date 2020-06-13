export const AUTO_LEAVE_DEBOUNCE = Symbol('AUTO_LEAVE_DEBOUNCE');

export const JOBS = {
  CRP: 'Carpenter',
  BSM: 'Blacksmith',
  ARM: 'Armourer',
  GSM: 'Goldsmith',
  LTW: 'Leatherworker',
  WVR: 'Weaver',
  ALC: 'Alchemist',
  CUL: 'Culinarian',
};

export const REVERSE_JOBS = Object.entries(JOBS).reduce((output, [abbrev, name]) => ({
  ...output,
  [name]: abbrev,
}), {});
