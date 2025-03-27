import pandas as pd
import functools
import numpy as np



@functools.lru_cache(maxsize=2)
def load_cached_data(file_path):
    columns_needed = ['fecha_infraccion', 'coordenada_y', 'coordenada_x', 'sexo', 'arma', 'edad',
                     'presun_motiva_observada', 'probable_causa_motivada','provincia']
    df = pd.read_excel(file_path, usecols=columns_needed)
    df['provincia'] = df['provincia'].replace(
        'STO DGO DE LOS TSACHILAS', 
        'SANTO DOMINGO DE LOS TSACHILAS'
    )
    df['fecha_infraccion'] = pd.to_datetime(df['fecha_infraccion'], format='%Y-%m-%d', errors='coerce')
    df[['coordenada_y', 'coordenada_x']] = df[['coordenada_y', 'coordenada_x']].apply(pd.to_numeric, errors='coerce')
    return df

@functools.lru_cache(maxsize=2)
def load_cached_cense_data(file_path):
    df = pd.read_excel(file_path)
    df.columns = df.columns.astype(str)

    df['2010'] = pd.to_numeric(df['2010'], errors='coerce')
    df['2022'] = pd.to_numeric(df['2022'], errors='coerce')
    
    return df

def process_crime_data(gender, weapon, province, age_min, age_max,year=None ):
    file_path = "data/data_crime_ecuador.xlsx"
    df = load_cached_data(file_path)
    cense_file_path = "data/data_poblacion_censos_ecuador.xlsx"
    df_cense = load_cached_cense_data(cense_file_path)
    # Aplicar filtros usando query() que es más rápido para múltiples condiciones
    query_conditions = []
    if gender:
        query_conditions.append(f"sexo == '{gender}'")
    if weapon:
        query_conditions.append(f"arma == '{weapon}'")
    if province:
        query_conditions.append(f"provincia == '{province}'")
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
    
    #info resumida por provincia
    provinces_consolidated = filtered_df.groupby("provincia").size().reset_index(name="incidencias")
    provinces_consolidated["incidencias"] = provinces_consolidated["incidencias"].astype(int)

    def calculate_tasa(row):
        #Para calculo de Tasa Cada 100mil habitantes usa el dato oficial segun el censo 2010 o 2022 segun sea el caso
        try:
            provincia = row['provincia']
            censo_year = '2022' if year and int(year) >= 2022 else '2010'
            
            poblacion = df_cense.loc[df_cense['provincia'] == provincia, censo_year].iloc[0]
            
            #verificación para zona no delimitada
            if pd.isna(poblacion) or poblacion <= 0:
                print(f"Población inválida para provincia {provincia}: {poblacion}")
                return 0.0
            
            incidencias = float(row['incidencias'])
            if pd.isna(incidencias):
                return 0.0
            
            tasa = (incidencias / poblacion) * 100000
            
            if pd.isna(tasa) or np.isinf(tasa):
                print(f"Tasa inválida calculada para provincia {provincia}: {tasa}")
                return 0.0
            
            return round(tasa, 2)
        
        except (KeyError, IndexError, ZeroDivisionError, ValueError) as e:
            print(f"Error calculando tasa para provincia {row.get('provincia', 'desconocida')}: {str(e)}")
            return 0.0
        except Exception as e:
            print(f"Error inesperado calculando tasa: {str(e)}")
            return 0.0

    provinces_consolidated['tasa'] = provinces_consolidated.apply(calculate_tasa, axis=1)

    return {
        "statistics": {
            "total_victims": total_victims,
            "victims_with_coordinates": victims_with_coordinates,
            "victims_without_coordinates": total_victims - victims_with_coordinates
        },
        "coordinates": valid_coordinates[['coordenada_y', 'coordenada_x']].values.tolist(),
        "provinces_resumed": provinces_consolidated.to_dict(orient="records")
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

   
