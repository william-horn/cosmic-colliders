// fetch('https://fakestoreapi.com/products').then((data)=>{
//     // console.log(data) json format
//     return data.json();
// }).then((objectData)=>{
//     console.log(objectData[0].title);
//     let tableData="";
//     objectData.map((values)=>{
//         tableData+=`<tr>
//         <td>${values.title}</td>
//         <td>${values.description}</td>
//         <td>${values.price}</td>
//         <td><img src="${values.image}"/></td>
//     </tr>`;
//     });
//            document.getElementById("table_body").innerHTML = tableData;
// }).catch((err)=>{
//     console.log(err);
// })
//https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=dxwjycipNYHVG5GFEqsuu5FUnCwarfVqN0Qmc6R0


/*
fetch('https://noahs-server-proj1.herokuapp.com/https://ssd-api.jpl.nasa.gov/cad.api?dist-max=10LD&date-min=2018-01-01&sort=dist').then((data)=>{
     console.log(data) 
    return data.json();
}).then((objectData)=>{
    console.log(objectData);
    let tableData="";
    objectData.photos.map((values)=>{
        tableData+=`<tr>
        <td><img src="${values.img_src}"/></td>
        <td>${values.id}</td>
        <td>${values.rover.name}
    </tr>`;
    });
           document.getElementById("table_body").innerHTML = tableData;
}).catch((err)=>{
    console.log(err);
})

*/

const searchSettings = {
    
}

const nasaAPI = {
    closestObjects: "https://ssd-api.jpl.nasa.gov/cad.api?dist-max=10LD&date-min=2018-01-01&sort=dist",
    images: "https://api.nasa.gov/planetary/apod?count=100&api_key=mk9inSh4h7X81NqSrvsafOyi2wEFix6zKEMbhYql",
}

async function getRequest(url, useDarkMagic) {
    const response = await fetch((useDarkMagic? "https://noahs-server-proj1.herokuapp.com/" : "") + url);
    const responseData = await response.json();

    return responseData;
}

function formatImageData(responseData2) {
    const imageMaps = [
        
    ]
}

// does cool table stuff that gives field keys to values of object data
function formatClosestObjects(responseData) {
    const dataMaps = [
        // map 1
            // key: value
            // key: value
    ];

    const dataFields = responseData.fields;
    const closestObjects = responseData.data;

    for (let i = 0; i < 10; i++) {
        const relevantData = {};
        for (let k = 0; k < dataFields.length; k++) {
            relevantData[dataFields[k]] = closestObjects[i][k];
        }
        dataMaps[i] = relevantData;
    }

    return dataMaps;
}

// start loading bar animation
const progressBar = $(".loading-bar");
$(progressBar).addClass("loading-bar-anim");

// get nasa api request for close objects
getRequest(nasaAPI.closestObjects, true).then(closestObjects => {
    closestObjects = formatClosestObjects(closestObjects)
    console.log(closestObjects)
    let tableData=""
    closestObjects.forEach(closestObject => {
        tableData+=`<tr>
        <td>${closestObject.des}</td>
        <td>${Math.round(closestObject.dist*149597870.7)}</td>
        <td>${closestObject.cd}</td>
        </tr>`
        $("#table_body").html(tableData);
    })

    // once request is recieved and data is displayed, remove loading bar animation class
    progressBar.removeClass("loading-bar-anim")

})

// "https://api.nasa.gov/planetary/apod?count=100&api_key=mk9inSh4h7X81NqSrvsafOyi2wEFix6zKEMbhYql"

getRequest(nasaAPI.images, true).then(images => {
    console.log(images)        
        let tableData2=""
        images.map((values)=>{
        tableData2+=`<tr>
        <td>${values.title}</td>
        <td>${values.date}</td>
        <td><a href="${values.url}"><img src="${values.url}"/></a></td>
        <td><p>${values.explanation}<p></td>
        </tr>`
        $("#table_body2").html(tableData2);
        })
    
})

