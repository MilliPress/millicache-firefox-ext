// Detect dark mode and use appropriate icon
const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const iconPath = isDarkMode ? "../icons/icon48-dark.png" : "../icons/icon48.png";

browser.devtools.panels.create(
  "MilliCache",
  iconPath,
  "../panel/panel.html"
);
