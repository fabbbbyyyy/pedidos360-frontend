import { useEffect, useRef } from 'react';
import { IconSearch, Kbd } from '../atoms';
import styles from './SearchInput.module.css';

// Campo de búsqueda. La tecla "/" enfoca el campo desde cualquier parte de la página.
export function SearchInput({ value, onChange, placeholder, label }) {
  const inputRef = useRef(null);

  useEffect(() => {
    const onKeyDown = (event) => {
      const tag = document.activeElement?.tagName;
      if (event.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <label className={styles.search}>
      <IconSearch />
      <input
        ref={inputRef}
        placeholder={placeholder}
        aria-label={label ?? placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <Kbd>/</Kbd>
    </label>
  );
}
