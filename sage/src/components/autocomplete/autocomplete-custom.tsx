import React, { useEffect, useState, useCallback, FormEvent, Dispatch, SetStateAction } from "react";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";

interface Props {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
}

// This is a custom built autocomplete component using the "Autocomplete Service" for predictions
// and the "Places Service" for place details
export const AutocompleteCustom = ({ onPlaceSelect, inputValue, setInputValue }: Props) => {
  const map = useMap();
  const places = useMapsLibrary("places");

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
      const bounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(24.765952, 46.575952), // Southwest corner (lat, lng)
        new google.maps.LatLng(24.769406, 46.577438) // Northeast corner (lat, lng)
      );
      const requests = [
        {
          input: inputValue,
          sessionToken,
          componentRestrictions: { country: "sa" },
        },
        {
          input: inputValue,
          sessionToken,
          componentRestrictions: { country: "uk" },
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

        setPredictionResults(mergedPredictions);
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
    <div className="autocomplete-container">
      <input
        value={inputValue}
        onInput={(event: FormEvent<HTMLInputElement>) => onInputChange(event)}
        placeholder="Search for a place"
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
