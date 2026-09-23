import { Chip } from '../atoms';
import styles from './FilterChips.module.css';

// options: [{ key, label, dot?, count? }]
export function FilterChips({ label, options, value, onChange }) {
  return (
    <div className={styles.filters} role="group" aria-label={label}>
      {options.map((option) => (
        <Chip
          key={option.key}
          pressed={value === option.key}
          dot={option.dot}
          count={option.count}
          onClick={() => onChange(option.key)}
        >
          {option.label}
        </Chip>
      ))}
    </div>
  );
}
