import pandas as pd


def process_crime_data():
    file_path = "data/crime_data.xlsx"
    df = pd.read_excel(file_path)

    df['coordenada_y'] = pd.to_numeric(df['coordenada_y'], errors='coerce')
    df['coordenada_x'] = pd.to_numeric(df['coordenada_x'], errors='coerce')

    
    df = df.dropna(subset=['coordenada_y', 'coordenada_x'])

    # Define the coordinates as a list of lists
    coordinates = df[['coordenada_y', 'coordenada_x']].values.tolist()

    return coordinates

   
