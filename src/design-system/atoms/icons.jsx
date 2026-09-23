import styles from './Icon.module.css';

// Íconos SVG inline, sin dependencias. Heredan color con currentColor.
function createIcon(name, paths, strokeWidth = 1.4) {
  const Icon = (props) => (
    <svg
      className={styles.ico}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      aria-hidden="true"
      {...props}
    >
      {paths}
    </svg>
  );
  Icon.displayName = name;
  return Icon;
}

export const IconOrders = createIcon('IconOrders', (
  <>
    <path d="M2.5 4.5h11v8a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1v-8Z" />
    <path d="M2 2.5h12v2H2zM6.5 7.5h3" />
  </>
));

export const IconCatalog = createIcon('IconCatalog', (
  <>
    <path d="M8 2 2.5 5v6L8 14l5.5-3V5L8 2Z" />
    <path d="M2.5 5 8 8l5.5-3M8 8v6" />
  </>
));

export const IconHome = createIcon('IconHome', (
  <path d="M2.5 7.5 8 3l5.5 4.5V13a.5.5 0 0 1-.5.5H9.5V10h-3v3.5H3a.5.5 0 0 1-.5-.5V7.5Z" />
));

export const IconSearch = createIcon('IconSearch', (
  <>
    <circle cx="7" cy="7" r="4.5" />
    <path d="m10.5 10.5 3 3" />
  </>
));

export const IconClose = createIcon('IconClose', <path d="m4 4 8 8M12 4l-8 8" />, 1.5);
export const IconPlus = createIcon('IconPlus', <path d="M8 3v10M3 8h10" />, 1.5);
export const IconRefresh = createIcon('IconRefresh', <path d="M13 3.5V7H9.5M3 12.5V9h3.5M12.6 7A5 5 0 0 0 3.7 5.5M3.4 9a5 5 0 0 0 8.9 1.5" />);
export const IconLogout = createIcon('IconLogout', <path d="M6.5 2.5h-3v11h3M10 5l3 3-3 3M13 8H6.5" />);
export const IconGrid = createIcon('IconGrid', <path d="M2.5 2.5h4.5v4.5H2.5zM9 2.5h4.5v4.5H9zM2.5 9h4.5v4.5H2.5zM9 9h4.5v4.5H9z" />);
export const IconList = createIcon('IconList', <path d="M5.5 4h8M5.5 8h8M5.5 12h8M2.5 4h1M2.5 8h1M2.5 12h1" />);
