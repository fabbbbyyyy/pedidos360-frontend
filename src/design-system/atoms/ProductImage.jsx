import styles from './ProductImage.module.css';

export function ProductImage({ src, alt, className }) {
  if (!src) return <div className={`${styles.placeholder} ${className ?? ''}`} aria-hidden="true" />;
  return <img className={`${styles.image} ${className ?? ''}`} src={src} alt={alt} loading="lazy" />;
}
