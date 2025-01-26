import pandas as pd


def process_crime_data(gender, weapon, age_min, age_max, year=None):
    print(gender, weapon, age_min, age_max, year)
    file_path = "data/crime_data.xlsx"
    df = pd.read_excel(file_path)

    # Convertir fecha_infraccion a datetime
    df['fecha_infraccion'] = pd.to_datetime(df['fecha_infraccion'], errors='coerce')
    df['coordenada_y'] = pd.to_numeric(df['coordenada_y'], errors='coerce')
    df['coordenada_x'] = pd.to_numeric(df['coordenada_x'], errors='coerce')

    # Aplicar filtros al DataFrame completo
    filtered_df = df.copy()
    if gender:
        filtered_df = filtered_df[filtered_df['sexo'] == gender]
    if weapon:
        filtered_df = filtered_df[filtered_df['arma'] == weapon]
    if age_min:
        filtered_df = filtered_df[filtered_df['edad'] >= age_min]
    if age_max:
        filtered_df = filtered_df[filtered_df['edad'] <= age_max]
    if year:
        filtered_df = filtered_df[filtered_df['fecha_infraccion'].dt.year == year]
    
    total_victims = len(filtered_df)
    
    # Filtrar coordenadas válidas (no nulas y no 0,0)
    valid_coordinates = filtered_df[
        (filtered_df['coordenada_y'].notna()) & 
        (filtered_df['coordenada_x'].notna()) & 
        ((filtered_df['coordenada_y'] != 0) | (filtered_df['coordenada_x'] != 0))
    ]
    
    victims_with_coordinates = len(valid_coordinates)
    victims_without_coordinates = total_victims - victims_with_coordinates

    # Obtener solo las coordenadas válidas
    coordinates = valid_coordinates[['coordenada_y', 'coordenada_x']].values.tolist()

    return {
        "statistics": {
            "total_victims": total_victims,
            "victims_with_coordinates": victims_with_coordinates,
            "victims_without_coordinates": victims_without_coordinates
        },
        "coordinates": coordinates
    }

def get_location_details(latitude, longitude):
    file_path = "data/crime_data.xlsx"
    df = pd.read_excel(file_path)
    
    # Buscar crímenes en las coordenadas exactas
    crimes_at_location = df[
        (df['coordenada_y'] == latitude) & 
        (df['coordenada_x'] == longitude)
    ]
    
    if crimes_at_location.empty:
        return {
            "message": "No se encontraron datos en esta ubicación",
            "coordenadas_buscadas": {
                "latitud": latitude,
                "longitud": longitude
            }
        }
    
    
    crimes_list = []
    for _, crime in crimes_at_location.iterrows():
        crimes_list.append({
            "motivation": crime.get('presun_motiva_observada'),
            "weapon_type": crime.get('arma'),
            "probable_cause": crime.get('probable_causa_motivada'),
            "date": crime.get('fecha_infraccion').strftime('%Y-%m-%d') if pd.notna(crime.get('fecha_infraccion')) else None,
            "gender": crime.get('sexo'),
            "age": crime.get('edad')
        })
    print(crimes_list)
    return {
        "total_crimes": len(crimes_at_location),
        "shown_results": len(crimes_list),
        "details": crimes_list
    }

   
