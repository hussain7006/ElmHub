import React, {
  useEffect,
  useState,
  useCallback,
  FormEvent,
  useRef,
  
} from "react";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
type RectangleBounds = {
  start_point: { lat: number; lng: number };
  end_point: { lat: number; lng: number };
};
interface Props {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
  rectangle: RectangleBounds | null;
}
interface AutocompletePredictionWithGeometry
  extends google.maps.places.AutocompletePrediction {
  geometry?: google.maps.places.PlaceGeometry; // Optional geometry field
}
// This is a custom built autocomplete component using the "Autocomplete Service" for predictions
// and the "Places Service" for place details
export const AutocompleteCustomBounds = ({
  onPlaceSelect,
  rectangle,
}: Props) => {
  const map = useMap();
  const places = useMapsLibrary("places");
  const bounds = useRef<google.maps.LatLngBounds | null>(null);
  // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompleteSessionToken
  const [sessionToken, setSessionToken] =
    useState<google.maps.places.AutocompleteSessionToken>();

  // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service
  const [autocompleteService, setAutocompleteService] =
    useState<google.maps.places.AutocompleteService | null>(null);

  // https://developers.google.com/maps/documentation/javascript/reference/places-service
  const [placesService, setPlacesService] =
    useState<google.maps.places.PlacesService | null>(null);

  const [predictionResults, setPredictionResults] = useState<
    Array<google.maps.places.AutocompletePrediction>
  >([]);

  const [inputValue, setInputValue] = useState<string>("");
  useEffect(() => {
    if (rectangle && rectangle != null) {
      bounds.current = new google.maps.LatLngBounds(
        new google.maps.LatLng(
          rectangle.end_point.lat,
          rectangle.start_point.lng
        ), // Southwest corner (lat, lng)
        new google.maps.LatLng(
          rectangle.start_point.lat,
          rectangle.end_point.lng
        ) // Northeast corner (lat, lng)
      );
    }
  }, [rectangle]);
  useEffect(() => {
    if (!places || !map) return;

    setAutocompleteService(new places.AutocompleteService());
    setPlacesService(new places.PlacesService(map));
    setSessionToken(new places.AutocompleteSessionToken());

    return () => setAutocompleteService(null);
  }, [map, places]);

  const fetchPredictions = useCallback(
    async (inputValue: string) => {
      if (!autocompleteService || !inputValue) {
        setPredictionResults([]);
        return;
      }
      // const bounds = new google.maps.LatLngBounds(
      //   new google.maps.LatLng(24.765952, 46.575952), // Southwest corner (lat, lng)
      //   new google.maps.LatLng(24.769406, 46.577438)  // Northeast corner (lat, lng)
      // );

      const requests = [
        {
          input: inputValue,
          sessionToken,
          componentRestrictions: { country: "sa" },
          locationRestriction: bounds.current,
        },
        {
          input: inputValue,
          sessionToken,
          componentRestrictions: { country: "uk" },
          locationRestriction: bounds.current,
        },
      ];
      // const response = await autocompleteService.getPlacePredictions(request);

      // setPredictionResults(response.predictions);
      try {
        const responses = await Promise.all(
          requests.map((request) =>
            autocompleteService.getPlacePredictions(request)
          )
        );

        // Merge the predictions from both responses
        const mergedPredictions = responses
          .flatMap((response) => response?.predictions || [])
          .filter(
            (prediction, index, self) =>
              index ===
              self.findIndex((p) => p.place_id === prediction.place_id) // Remove duplicates
          );

        // Now fetch place details for each prediction to get the geometry
        const detailedPredictions = await Promise.all(
          mergedPredictions.map(async (prediction) => {
            const detailRequestOptions = {
              placeId: prediction.place_id,
              fields: ["geometry", "place_id", "name", "formatted_address"],
              sessionToken,
            };

            return new Promise<AutocompletePredictionWithGeometry | null>(
              (resolve) => {
                placesService?.getDetails(
                  detailRequestOptions,
                  (placeDetails) => {
                    if (placeDetails && placeDetails.geometry) {
                      // Check if the place is within the bounds
                      const location = placeDetails.geometry.location;
                      if (bounds.current?.contains(location)) {
                        resolve({
                          ...prediction,
                          geometry: placeDetails.geometry, // Attach geometry to prediction
                        });
                      } else {
                        resolve(null); // Place is outside bounds, discard it
                      }
                    } else {
                      resolve(null); // No geometry found
                    }
                  }
                );
              }
            );
          })
        );

        // Filter out any null values and update the predictions
        setPredictionResults(
          detailedPredictions.filter(
            (item) => item !== null
          ) as AutocompletePredictionWithGeometry[]
        );
      } catch (error) {
        console.error("Error fetching predictions:", error);
        setPredictionResults([]);
      }
    },
    [autocompleteService, sessionToken]
  );

  const onInputChange = useCallback(
    (event: FormEvent<HTMLInputElement>) => {
      const value = (event.target as HTMLInputElement)?.value;

      setInputValue(value);
      fetchPredictions(value);
    },
    [fetchPredictions]
  );

  const handleSuggestionClick = useCallback(
    (placeId: string) => {
      if (!places) return;

      const detailRequestOptions = {
        placeId,
        fields: ["place_id", "geometry", "name", "formatted_address"],
        sessionToken,
      };

      const detailsRequestCallback = (
        placeDetails: google.maps.places.PlaceResult | null
      ) => {
        onPlaceSelect(placeDetails);
        setPredictionResults([]);
        setInputValue(placeDetails?.formatted_address ?? "");
        setSessionToken(new places.AutocompleteSessionToken());
        console.log(placeDetails);
      };

      placesService?.getDetails(detailRequestOptions, detailsRequestCallback);
    },
    [onPlaceSelect, places, placesService, sessionToken]
  );

  return (
    <div
      className="autocomplete-container"
      // style={{ display: bounds.current == null ? "none" : "" }}
    >
      <input
        value={inputValue}
        onInput={(event: FormEvent<HTMLInputElement>) => onInputChange(event)}
        placeholder="Search for a sub place"
      />

      {predictionResults.length > 0 && (
        <ul className="custom-list">
          {predictionResults.map(({ place_id, description }) => {
            return (
              <li
                key={place_id}
                className="custom-list-item"
                onClick={() => handleSuggestionClick(place_id)}
              >
                {description}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
