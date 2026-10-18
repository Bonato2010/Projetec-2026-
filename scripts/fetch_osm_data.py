import json
import urllib.request
import urllib.parse
import os

# Overpass QL query to get data for Realengo, Bangu, and Campo Grande
# We use a bounding box covering roughly the Zona Oeste region we want
# BBox: [south, west, north, east] -> [-22.95, -43.60, -22.80, -43.40] roughly
OVERPASS_URL = "http://overpass-api.de/api/interpreter"
OVERPASS_QUERY = """
[out:json][timeout:60];
// Define the bounding box for Zona Oeste (Bangu, Realengo, Campo Grande)
(
  // Hospitals and Healthcare
  node["amenity"="hospital"](-22.95,-43.60,-22.80,-43.40);
  way["amenity"="hospital"](-22.95,-43.60,-22.80,-43.40);
  relation["amenity"="hospital"](-22.95,-43.60,-22.80,-43.40);

  node["amenity"="clinic"](-22.95,-43.60,-22.80,-43.40);
  way["amenity"="clinic"](-22.95,-43.60,-22.80,-43.40);

  // Major Roads
  way["highway"~"primary|secondary|tertiary|trunk|motorway"](-22.95,-43.60,-22.80,-43.40);

  // Parks / Green Areas
  way["leisure"="park"](-22.95,-43.60,-22.80,-43.40);
  relation["leisure"="park"](-22.95,-43.60,-22.80,-43.40);
);
out center;
"""

def fetch_data():
    print("Fetching data from Overpass API (this might take a minute)...")
    data = urllib.parse.urlencode({'data': OVERPASS_QUERY}).encode('utf-8')
    req = urllib.request.Request(OVERPASS_URL, data=data)

    try:
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            return result
    except Exception as e:
        print(f"Error fetching data: {e}")
        return None

def process_data(osm_data):
    if not osm_data or 'elements' not in osm_data:
        return {}

    processed = {
        'hospitals': [],
        'roads': [],
        'parks': [],
        'bounds': {
            'minLat': 90, 'maxLat': -90,
            'minLon': 180, 'maxLon': -180
        }
    }

    elements = osm_data['elements']

    for el in elements:
        # Determine coordinates (out center gives us a center lat/lon even for ways/relations)
        lat = el.get('lat')
        lon = el.get('lon')
        if not lat or not lon:
            if 'center' in el:
                lat = el['center'].get('lat')
                lon = el['center'].get('lon')
            elif 'geometry' in el and len(el['geometry']) > 0:
                lat = el['geometry'][0]['lat']
                lon = el['geometry'][0]['lon']

        if lat and lon:
            # Update bounds
            processed['bounds']['minLat'] = min(processed['bounds']['minLat'], lat)
            processed['bounds']['maxLat'] = max(processed['bounds']['maxLat'], lat)
            processed['bounds']['minLon'] = min(processed['bounds']['minLon'], lon)
            processed['bounds']['maxLon'] = max(processed['bounds']['maxLon'], lon)

        tags = el.get('tags', {})

        if 'amenity' in tags and tags['amenity'] in ['hospital', 'clinic']:
            processed['hospitals'].append({
                'id': el['id'],
                'name': tags.get('name', 'Unidade de Saúde'),
                'type': tags['amenity'],
                'lat': lat,
                'lon': lon
            })
        elif 'highway' in tags:
            processed['roads'].append({
                'id': el['id'],
                'type': tags['highway'],
                'name': tags.get('name', 'Via sem nome'),
                'lat': lat,
                'lon': lon
            })
        elif 'leisure' in tags and tags['leisure'] == 'park':
            processed['parks'].append({
                'id': el['id'],
                'name': tags.get('name', 'Área Verde'),
                'lat': lat,
                'lon': lon
            })

    print(f"Processed {len(processed['hospitals'])} hospitals/clinics, {len(processed['roads'])} roads, and {len(processed['parks'])} parks.")
    return processed

if __name__ == "__main__":
    output_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'eco-city', 'public', 'data', 'city_data.json')

    # If the API is flaky, provide fallback mock data representing the region
    fallback_data = {
        'hospitals': [
            {'id': 1, 'name': 'Hospital Municipal Albert Schweitzer', 'type': 'hospital', 'lat': -22.8791, 'lon': -43.4300},
            {'id': 2, 'name': 'UPA Bangu', 'type': 'clinic', 'lat': -22.8750, 'lon': -43.4650},
            {'id': 3, 'name': 'Hospital Rocha Faria', 'type': 'hospital', 'lat': -22.9022, 'lon': -43.5583}
        ],
        'roads': [
            {'id': 10, 'name': 'Avenida Brasil', 'type': 'trunk', 'lat': -22.85, 'lon': -43.45},
            {'id': 11, 'name': 'Avenida Santa Cruz', 'type': 'primary', 'lat': -22.88, 'lon': -43.48}
        ],
        'parks': [
            {'id': 20, 'name': 'Parque Estadual da Pedra Branca (borda)', 'lat': -22.92, 'lon': -43.45},
            {'id': 21, 'name': 'Praça Guilherme da Silveira', 'lat': -22.875, 'lon': -43.45}
        ],
        'bounds': {
            'minLat': -22.95, 'maxLat': -22.80,
            'minLon': -43.60, 'maxLon': -43.40
        }
    }

    raw_data = fetch_data()
    processed_data = process_data(raw_data) if raw_data else {}

    if not processed_data or len(processed_data.get('hospitals', [])) == 0:
        print("Using fallback geographic data (Zone Oeste - RJ) due to API failure or empty results.")
        processed_data = fallback_data

    # Ensure directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(processed_data, f, ensure_ascii=False, indent=2)
    print(f"Data saved to {output_path}")
