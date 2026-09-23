import styles from './Avatar.module.css';

export function Avatar({ initials }) {
  return <span className={styles.avatar} aria-hidden="true">{initials}</span>;
}
