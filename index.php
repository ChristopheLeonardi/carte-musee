<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="js/jquery.js"></script>


    <link href="css/map.css" rel="stylesheet">
    <title>Carte Musée</title>
</head>
<body>

<link rel="stylesheet" type="text/css" href="/ui/plug-in/integration/libraries/accessible-slick/accessible-slick-theme.min.css">
<link rel="stylesheet" type="text/css" href="/ui/plug-in/integration/libraries/accessible-slick/slick.min.css">
<script type="text/javascript" src="/ui/plug-in/integration/libraries/accessible-slick/slick.min.js"></script>

<script src="https://d3js.org/d3.v7.min.js" type="text/javascript"></script>
<script src="/ui/plug-in/integration/libraries/topojson/topojson.js"></script>
<link rel="stylesheet" href="/ui/plug-in/integration/libraries/leaflet-1.9.3/leaflet.css"/>
<script src="/ui/plug-in/integration/libraries/leaflet-1.9.3/leaflet.js" type="text/javascript"></script>
<link rel="stylesheet" href="/ui/plug-in/integration/libraries/Leaflet.markercluster-1.4.1/dist/MarkerCluster.css" />
<link rel="stylesheet" href="/ui/plug-in/integration/libraries/Leaflet.markercluster-1.4.1/dist/MarkerCluster.Default.css" />
<script src="/ui/plug-in/integration/libraries/Leaflet.markercluster-1.4.1/dist/leaflet.markercluster.js" type="text/javascript"></script>

<script src="/ui/plug-in/integration/libraries/custom-scrollbar/custom_scrollbar.js" type="text/javascript"></script>
<link rel="stylesheet" href="/ui/plug-in/integration/libraries/custom-scrollbar/custom_scrollbar.css" />
<!-- <script src="/ui/plug-in/integration/libraries/custom-select/custom-select.js" type="text/javascript"></script>
<link rel="stylesheet" href="/ui/plug-in/integration/libraries/custom-select/custom-select.css" />
 -->
<script src="/ui/plug-in/integration/libraries/selectize/selectize.min.js" type="text/javascript"></script>
<link rel="stylesheet" href="/ui/plug-in/integration/libraries/selectize/selectize.default.css" />
<link rel="stylesheet" href="/ui/plug-in/integration/libraries/selectize/selectize.css" />



<!-- <link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/selectize.js/0.15.2/css/selectize.default.min.css"
  integrity="sha512-pTaEn+6gF1IeWv3W1+7X7eM60TFu/agjgoHmYhAfLEU8Phuf6JKiiE8YmsNC0aCgQv4192s4Vai8YZ6VNM6vyQ=="
  crossorigin="anonymous"
  referrerpolicy="no-referrer"
/>
<script
  src="https://cdnjs.cloudflare.com/ajax/libs/selectize.js/0.15.2/js/selectize.min.js"
  integrity="sha512-IOebNkvA/HZjMM7MxL0NYeLYEalloZ8ckak+NDtOViP7oiYzG5vn6WVXyrJDiJPhl4yRdmNAG49iuLmhkUdVsQ=="
  crossorigin="anonymous"
  referrerpolicy="no-referrer"
></script> -->


<link href="css/map.css" rel="stylesheet" />
<section id="mapMuseeContainer">
    <h2>Carte des collections du musée</h2>
    <div>
    <aside id="mapFilter">
        <div>
            <h3>Filtres</h3>
            <p id="nb-items"></p>
        </div>
        <form class="search-bar" action="">
        <fieldset id="record-search">
            <label for="with-records">Instruments enregistrés</label>
            <input type="checkbox" id="with-records" name="with-records" />
        </fieldset>
        <div id="button-field">
            <button id="reset-button" class="btn btn-default" type="button">Réinitialiser les filtres</button>
            <button id="access-button" class="btn btn-default btn-accessible" type="button">Version accessible</button>
        </div>
        <div id="search-field">
            <input type="text" id="seeker" placeholder="Nom, Type, Facteur..." />
            <button id="search" class="btn btn-default" type="submit" aria-label="Rechercher">
                <img src="img/search.svg" alt="Rechercher"/>
            </button>
        </div>
        </form>

        <h3>Localisation</h3>
        <div class="custom-select">
            <select name="localisation" id="loc-select" placeholder="Choisissez une localisation">
            </select>
        </div>
        <h3>Types d'Objets</h3>
        <fieldset class="types" id="types-filter"></fieldset>

    </aside>

    <div id="mapMusee"></div>
    <div class="loader"></div>
    </div>
</section>

<script src="js/map_config.js" type="text/javascript"></script>
<script src="js/map.js" type="text/javascript"></script>
<script src="js/cartel.js" type="text/javascript"></script>
<script src="js/filters.js" type="text/javascript"></script>

</body>
</html>