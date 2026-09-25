import styles from './FilterSelect.module.css';

export function FilterSelect({ label, options, value, onChange, compact = false }) {
  return (
    <label className={`${styles.filter} ${compact ? styles.compact : ''}`}>
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option.key} value={option.key}>
            {option.label}{option.count !== undefined ? ` (${option.count})` : ''}
          </option>
        ))}
      </select>
    </label>
  );
}