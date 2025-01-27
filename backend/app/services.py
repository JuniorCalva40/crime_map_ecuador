import pandas as pd
import functools



@functools.lru_cache(maxsize=2)
def load_cached_data(file_path):
    columns_needed = ['fecha_infraccion', 'coordenada_y', 'coordenada_x', 'sexo', 'arma', 'edad',
                     'presun_motiva_observada', 'probable_causa_motivada']
    df = pd.read_excel(file_path, usecols=columns_needed)
    
    # Preprocesar todas las conversiones de una vez
    df['fecha_infraccion'] = pd.to_datetime(df['fecha_infraccion'], format='%Y-%m-%d', errors='coerce')
    df[['coordenada_y', 'coordenada_x']] = df[['coordenada_y', 'coordenada_x']].apply(pd.to_numeric, errors='coerce')
    return df

def process_crime_data(gender, weapon, age_min, age_max, year=None):
    file_path = "data/data_crime_ecuador.xlsx"
    df = load_cached_data(file_path)
    
    # Aplicar filtros usando query() que es más rápido para múltiples condiciones
    query_conditions = []
    if gender:
        query_conditions.append(f"sexo == '{gender}'")
    if weapon:
        query_conditions.append(f"arma == '{weapon}'")
    if age_min:
        query_conditions.append(f"edad >= {age_min}")
    if age_max:
        query_conditions.append(f"edad <= {age_max}")
    if year:
        query_conditions.append(f"fecha_infraccion.dt.year == {year}")
    
    if query_conditions:
        filtered_df = df.query(' and '.join(query_conditions))
    else:
        filtered_df = df
    
    total_victims = len(filtered_df)
    
    valid_coordinates = filtered_df[
        filtered_df['coordenada_y'].notna() & 
        filtered_df['coordenada_x'].notna() & 
        ((filtered_df['coordenada_y'] != 0) | (filtered_df['coordenada_x'] != 0))
    ]
    
    victims_with_coordinates = len(valid_coordinates)
    
    return {
        "statistics": {
            "total_victims": total_victims,
            "victims_with_coordinates": victims_with_coordinates,
            "victims_without_coordinates": total_victims - victims_with_coordinates
        },
        "coordinates": valid_coordinates[['coordenada_y', 'coordenada_x']].values.tolist()
    }

def get_location_details(latitude, longitude):
    file_path = "data/data_crime_ecuador.xlsx"
    df = load_cached_data(file_path)
    
    
    crimes_at_location = df.query(f"coordenada_y == {latitude} and coordenada_x == {longitude}")
    
    if crimes_at_location.empty:
        return {
            "message": "No se encontraron datos en esta ubicación",
            "coordenadas_buscadas": {
                "latitud": latitude,
                "longitud": longitude
            }
        }
    
    crimes_list = crimes_at_location.apply(
        lambda x: {
            "motivation": x['presun_motiva_observada'],
            "weapon_type": x['arma'],
            "probable_cause": x['probable_causa_motivada'],
            "date": x['fecha_infraccion'].strftime('%Y-%m-%d') if pd.notna(x['fecha_infraccion']) else None,
            "gender": x['sexo'],
            "age": x['edad']
        }, axis=1
    ).tolist()
    
    return {
        "total_crimes": len(crimes_at_location),
        "shown_results": len(crimes_list),
        "details": crimes_list
    }

   
