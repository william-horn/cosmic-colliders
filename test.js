
const nasaAPI = {
    closestObjects: "https://ssd-api.jpl.nasa.gov/cad.api?dist-max=10LD&date-min=2018-01-01&sort=dist",
    images: "",
}

async function getRequest(url) {
    const response = await fetch(url);
    const responseData = await response.json();

    return responseData;
}

function getClosestObjectData() {
     

}

