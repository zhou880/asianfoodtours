import styles from './Sidebar.module.css';
import MultiSelectFilter from './MultiSelectFilter';

interface SidebarProps {
  cuisineTypes: string[];
  locations: string[];
  selectedCuisines: string[];
  selectedLocations: string[];
  onCuisineChange: (cuisines: string[]) => void;
  onLocationChange: (locations: string[]) => void;
  resultsCount: number;
}

export default function Sidebar({
  cuisineTypes,
  locations,
  selectedCuisines,
  selectedLocations,
  onCuisineChange,
  onLocationChange,
  resultsCount
}: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.resultsCount}>
        {resultsCount} restaurant{resultsCount !== 1 ? 's' : ''} found
      </div>

      <MultiSelectFilter
        items={cuisineTypes}
        selected={selectedCuisines}
        onChange={onCuisineChange}
        allValue="All"
        icon="🍜"
        label="Cuisine"
      />

      <MultiSelectFilter
        items={locations}
        selected={selectedLocations}
        onChange={onLocationChange}
        allValue="All Locations"
        icon="📍"
        label="Location"
      />
    </aside>
  );
}
