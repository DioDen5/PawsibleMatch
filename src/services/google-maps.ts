/**
 * Represents a geographical location with latitude and longitude coordinates.
 */
export interface Location {
  /**
   * The latitude of the location.
   */
  lat: number;
  /**
   * The longitude of the location.
   */
  lng: number;
}

/**
 * Asynchronously retrieves shelter location information for a given location.
 *
 * @param location The location for which to retrieve shelter data.
 * @returns A promise that resolves to a list of locations of nearby shelters
 */
export async function getNearbyShelters(location: Location): Promise<Location[]> {
  // TODO: Implement this by calling an API.

  return [
    {
      lat: 34.052235,
      lng: -118.243683,
    },
    {
      lat: 34.052235,
      lng: -118.243683,
    },
  ];
}
