# Advanced Search Implementation Plan for CyAds

## Current Limitations
- Basic text search only
- No filtering capabilities
- No geospatial search optimization
- No search result ranking

## Implementation Strategy

### 1. Search Backend Enhancements
1. **Supabase Full-Text Search**:
   ```js
   // lib/api.js
   export async function searchAds(query, filters = {}) {
     let queryBuilder = supabase
       .from('ads')
       .select('*')
       .textSearch('fts', query, {
         type: 'websearch',
         config: 'english'
       });

     // Apply filters
     if (filters.category) {
       queryBuilder = queryBuilder.eq('category_id', filters.category);
     }
     if (filters.location) {
       queryBuilder = queryBuilder.eq('location_id', filters.location);
     }
     if (filters.price_min) {
       queryBuilder = queryBuilder.gte('price', filters.price_min);
     }
     if (filters.price_max) {
       queryBuilder = queryBuilder.lte('price', filters.price_max);
     }

     const { data, error } = await queryBuilder;
     return { data, error };
   }
   ```

2. **Geospatial Search**:
   ```js
   export async function searchNearby(lat, lng, radiusKm = 10) {
     const { data, error } = await supabase.rpc('nearby_ads', {
       lat,
       lng,
       radius: radiusKm * 1000
     });
     return { data, error };
   }
   ```

### 2. Frontend Components
1. **Search Filters Component**:
   ```jsx
   const SearchFilters = ({ categories, locations, onFilter }) => {
     const [filters, setFilters] = useState({
       category: '',
       location: '',
       price_min: '',
       price_max: ''
     });

     const handleChange = (e) => {
       setFilters({...filters, [e.target.name]: e.target.value});
     };

     return (
       <div className="search-filters">
         <Select 
           name="category"
           value={filters.category}
           onChange={handleChange}
           options={categories}
         />
         <Select 
           name="location"
           value={filters.location}
           onChange={handleChange}
           options={locations}
         />
         <Input 
           type="number"
           name="price_min"
           placeholder="Min Price"
           value={filters.price_min}
           onChange={handleChange}
         />
         <Input 
           type="number"
           name="price_max"
           placeholder="Max Price"
           value={filters.price_max}
           onChange={handleChange}
         />
         <Button onClick={() => onFilter(filters)}>Apply Filters</Button>
       </div>
     );
   };
   ```

2. **Map Integration for Location Search**:
   ```jsx
   const LocationSearch = ({ onLocationSelect }) => {
     const [mapVisible, setMapVisible] = useState(false);
     const [selectedLocation, setSelectedLocation] = useState(null);

     const handleMapClick = (e) => {
       setSelectedLocation({
         lat: e.latlng.lat,
         lng: e.latlng.lng
       });
     };

     return (
       <div>
         <Button onClick={() => setMapVisible(!mapVisible)}>
           {mapVisible ? 'Hide Map' : 'Search by Location'}
         </Button>
         {mapVisible && (
           <Map 
             center={[35.1856, 33.3823]} // Cyprus center
             zoom={8}
             onClick={handleMapClick}
           >
             {selectedLocation && (
               <Marker position={[selectedLocation.lat, selectedLocation.lng]} />
             )}
           </Map>
         )}
         {selectedLocation && (
           <Button onClick={() => onLocationSelect(selectedLocation)}>
             Search Near This Location
           </Button>
         )}
       </div>
     );
   };
   ```

### 3. Database Preparation
1. **Create PostgreSQL Function**:
   ```sql
   CREATE OR REPLACE FUNCTION nearby_ads(lat float, lng float, radius integer)
   RETURNS SETOF ads AS $$
     SELECT *
     FROM ads
     WHERE ST_DWithin(
       coordinates,
       ST_MakePoint(lng, lat)::geography,
       radius
     )
     AND status = 'published'
   $$ LANGUAGE SQL;
   ```

2. **Add Indexes**:
   ```sql
   CREATE INDEX idx_ads_coordinates ON ads USING GIST(coordinates);
   CREATE INDEX idx_ads_fts ON ads USING GIN(to_tsvector('english', title || ' ' || description));
   ```

## Implementation Timeline
1. Phase 1 (1 week): Backend search functions and database preparation
2. Phase 2 (1 week): Frontend filter components
3. Phase 3 (1 week): Map integration and geospatial search
4. Phase 4 (1 week): Testing and optimization
