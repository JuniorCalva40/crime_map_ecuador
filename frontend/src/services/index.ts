
const URL = `${import.meta.env.VITE_API_BACKEND}`

export const getCrimeDataFilteredByParams = async (params:URLSearchParams) => {
    try{ 
        const response = await fetch(
            `${URL}/crime-data?${params}`
          );
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    }catch(e){
        throw new Error(`Fail in comunnication with server${e}`);
    }
    
}

export const getCrimeDataForPreciseLocation = async (lat:number, lng:number) => {
    try{
        const response = await fetch(
            `${URL}/crime-data/details-by-location?latitude=${lat}&longitude=${lng}`
        );
        if (!response.ok) throw new Error('Network response was not ok');
        return  await response.json();
    }catch(e){
        throw new Error(`Fail in comunnication with server${e}`);
    }
}

