import styles from './MultiSelectFilter.module.css';

interface MultiSelectFilterProps {
  items: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  allValue: string;
  icon: string;
  label: string;
}

export default function MultiSelectFilter({
  items,
  selected,
  onChange,
  allValue,
  icon,
  label
}: MultiSelectFilterProps) {
  const handleClick = (item: string) => {
    if (item === allValue) {
      onChange([allValue]);
    } else {
      const newSelected = selected.filter(i => i !== allValue);

      if (selected.includes(item)) {
        const filtered = newSelected.filter(i => i !== item);
        onChange(filtered.length === 0 ? [allValue] : filtered);
      } else {
        onChange([...newSelected, item]);
      }
    }
  };

  const isSelected = (item: string) => selected.includes(item);

  return (
    <div className={styles.container}>
      <h3 className={styles.header}>
        <span className={styles.icon}>{icon}</span> {label}
      </h3>
      <div className={styles.buttonContainer}>
        {items.map(item => (
          <button
            key={item}
            onClick={() => handleClick(item)}
            className={`${styles.button} ${isSelected(item) ? styles.selected : ''}`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
