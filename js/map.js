$(document).ready(function() {

    var promises = []
    //promises.push((d3.tsv("data/data-carte_2023-07-13.csv")))
    promises.push((d3.csv("data/data-carte-collections_2023-07-20.csv")))
    promises.push((d3.json("data/amerique.json")))
    promises.push((d3.json("data/reste.json")))
    promises.push((d3.json("data/config.json")))

    $(".loader").show()
    data_loader(mapMusee, promises) 

 
})

const data_loader = (callback, promises) => {

    // Patch Syracuse, Boucle permettant de s'assurer que les datas soient chargées
    const loader = setInterval(() => {
        if ($("#svg_container").length == 0) {
            Promise.all(promises)
                .then(data => {
                    callback(data)
                })
                .catch((e) => {
                    console.log(e)
                })
            clearInterval(loader)
        }
    }, 1000)
}  

const mapMusee = (data) => {
    const instruments_data = data[0]
    let countries_data = [{ "data" : data[1], "name" : "amerique" },{ "data" : data[2], "name" : "reste" }]

    window["continent_infos"]  = data[3].continents_infos
    window["object_type"] = data[3].object_type
    window["c_data"] = createDataObject(instruments_data)
    
    console.log(instruments_data)


    /* Initialize Map */
    const map = L.map('mapMusee', { 
        scrollWheelZoom: true, 
        maxBoundsViscosity: 0.9,
        minZoom :  2,
        maxZoom: 12,
    }).setView([20, 155], 2.25);

    window["map"] = map
    map.setMaxBounds([ [-65, -25], [85, 330] ])

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    // Create markers for each continent
    createContinentMarkers(c_data)

    /* Create Countries layers */
    window["countries_layers"] = []
    window["topojson_data"] = []
    
    createCountriesLayers(countries_data)

    // Remove Duplicate countries
    window["topojson_data"] = window.utils.removeDuplicateObject(window["topojson_data"].flat(), "ISO_A2_EH")
    window["country_markers"] = L.layerGroup().addTo(map)


    /* Reset map when reach primary zoom level */
    map.on('moveend', function() {
        if(map.getZoom() <= 2.5) {
            window.continents_popups.forEach(popup => { map.openPopup(popup) })

            window.utils.resetMarkers()
            window.utils.resetclusters()
        }

    })

    /* Center on popup when open */
    map.on('popupopen', function(e) {
        var px = map.project(e.target._popup._latlng); // find the pixel location on the map where the popup anchor is
        px.y -= e.target._popup._container.clientHeight/2; // find the height of the popup container, divide by 2, subtract from the Y axis of marker location
        map.panTo(map.unproject(px),{animate: true}); // pan to new center
    });


    /* Filters */
    window.filters.createOptionsLocalisation(c_data)
    window.filters.populatefilters(c_data)


    $(".loader").hide();

    window.filters.filtersActions()
}

const createContinentMarkers = c_data => {

    // Remove old popups
    if (window["continents_popups"]){
        window["continents_popups"].forEach(popup => {
            map.removeLayer(popup)
        })
    }

    window["continents_popups"] = []
    Object.keys(c_data.continents).map(key => {

        var popup = new L.popup({closeButton: false, closeOnClick:false, autoClose:false})
                        .setLatLng(c_data.continents[key].latlng)
                        .setContent(window.utils.createPopupContinent(c_data.continents[key], popup))
                        .openOn(map)

        map.addLayer(popup)
        window["continents_popups"].push(popup)
    })
}

const createCountriesLayers = data => {
    data.map( dataset => {
        let topo = topojson.feature(dataset.data, dataset.data.objects[dataset.name])
        window["countries_layers"].push(L.geoJson(topo, { onEachFeature: window.utils.onEachTopojson, style: window.utils.style }).addTo(map))
    })
}

/* PROCESS DATA */
const createDataObject = instruments_data => {
    // Get number by continent 
    const c_data = { "pays" : [], "continents" : {}, "count_by_type" : {}, "raw_data" : instruments_data}

    const continents = [...new Set(instruments_data.map(item => item.Continent))]
    continents.map(continent => { 
        if (continent == ""){ continent = "unknown"}
        c_data.continents[continent] = { 
            "count" : 0, 
            "name_en" : window.continent_infos[continent].name_en,
            "name" : continent,
            "latlng" : window.continent_infos[continent].latlng, 
            "zoom_level": window.continent_infos[continent].zoom_level } })

    window["object_type"].map(type => {
        c_data.count_by_type[type.label] = 0
    })

    instruments_data.map(item => {
        if (item.Continent == ""){ item.Continent = "unknown"}
        // Décompte des notices par continent
        c_data.continents[item.Continent].count = c_data.continents[item.Continent].count ? c_data.continents[item.Continent].count + 1 : 1
        
        // Liste des pays par continents
        if (typeof c_data.continents[item.Continent]["liste_pays"] == 'undefined') {
            c_data.continents[item.Continent]["liste_pays"] = []
        }

        if(!c_data.continents[item.Continent]["liste_pays"].includes(item["Code ISO-2"])){
            c_data.continents[item.Continent].liste_pays.push(item["Code ISO-2"])
        }
        
        // Liste des notices par continents par pays
        if (typeof c_data.continents[item.Continent]["notices"] == 'undefined') {
            c_data.continents[item.Continent]["notices"] = []
        }

        if (typeof c_data.continents[item.Continent]["notices"][item["Code ISO-2"]] == 'undefined') {
            c_data.continents[item.Continent].notices[item["Code ISO-2"]] = {}
            c_data.continents[item.Continent].notices[item["Code ISO-2"]]["count"] = 0
            c_data.continents[item.Continent].notices[item["Code ISO-2"]]["cities"] = []
        }
        if (typeof c_data.continents[item.Continent]["notices"][item["Code ISO-2"]]["cities"][item.Ville] == 'undefined') {
            c_data.continents[item.Continent].notices[item["Code ISO-2"]]["cities"][item.Ville] = {}
            c_data.continents[item.Continent].notices[item["Code ISO-2"]]["cities"][item.Ville]["count"] = 0
            c_data.continents[item.Continent].notices[item["Code ISO-2"]]["cities"][item.Ville]["notices"] = []
        }

        //c_data.continents[item.Continent].notices[item["Code ISO-2"]].push(item)
        c_data.continents[item.Continent].notices[item["Code ISO-2"]]["count"] = ( c_data.continents[item.Continent].notices[item["Code ISO-2"]]["count"] || 0) + 1 
        c_data.continents[item.Continent].notices[item["Code ISO-2"]]["cities"][item.Ville]["count"] = ( c_data.continents[item.Continent].notices[item["Code ISO-2"]]["cities"][item.Ville]["count"] || 0) + 1 
        c_data.continents[item.Continent].notices[item["Code ISO-2"]]["cities"][item.Ville]["notices"].push(item)

        // Liste totale des pays
        if(!c_data.pays.includes(item["Code ISO-2"])){
            c_data.pays.push(item["Code ISO-2"])
        }
        c_data.count_by_type[item["Type d'objet"]] += 1      
    })
    return c_data
}

window["process_data"] = {
    "createDataObject":createDataObject
}