export interface CrimeData {
  statistics: {
    total_victims: number;
    victims_with_coordinates: number;
    victims_without_coordinates: number;
  };
  coordinates: [number, number][];
}
