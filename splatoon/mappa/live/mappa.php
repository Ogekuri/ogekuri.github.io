<html>

<head>
  <meta charset="utf-8">
  <title>Splatoon - Italian players map</title>
  <meta name="author" content="Francesco Rolando">
  <meta name="description" content="Splatoon - Italian players map">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <link href="css/style.css" rel="stylesheet" type="text/css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
  <script src="js/script.js"></script>
</head>

<body onload="PopolateMap()">

<?php
$conn = mysqli_connect("localhost", "splatoon_map", "Splatoon2", "splatoon_map") or die("Connection Error: " . mysqli_error($conn));
?>

<?php

/* insert new nickname into tables */
function getIfSet(&$value, $default = null)
{
    return isset($value) ? $value : $default;
}

$region_id = getIfSet($_REQUEST['region_id']);
$nick = getIfSet($_REQUEST['nick']);
$twitter = getIfSet($_REQUEST['twitter']);

if ( $region_id != '' && $nick != '' ) {
  mysqli_query($conn, "insert into nicks(region_id,nick,twitter) values ( '$region_id', '$nick', '$twitter' )") or die("Connection Error: " . mysqli_error($conn));
}
?>

<h3>Splatoon - Italian players map</h3>

<div id="userform" >

<form action="mappa.php" method="post">

<table>
<tr><td>Provincia</td>
<td>Nickname</td>
<!--<td>Twitter</td>-->
</tr>
<tr>
<td>
<select name="region_id">
<?php
/* popolate option with regions */
$result = mysqli_query($conn, "SELECT id,region FROM regions");
while($row = mysqli_fetch_array($result)) {
?>
<option value="<?=$row["id"];?>"><?=$row["region"];?></option>
<?php
}
mysqli_close($conn);
?>

</select>
</td>
<td><input type="text" name="nick" size="10"></td>
<!--<td><input type="text" name="twitter" size="15"></td>-->
<td><input type="submit" value="Aggiungi"></td>
</tr>
</table>

</div>


<div class="map">
<svg
   id="svgmap"
   height="1500"
   width="1200"
  <metadata
     id="metadatamap">
    <rdf:RDF>
      <cc:Work
         rdf:about="">
        <dc:format>image/svg+xml</dc:format>
        <dc:type
           rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
        <dc:title />
      </cc:Work>
    </rdf:RDF>
  </metadata>
  <defs>
     id="defs"
    <marker id="arrow" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto" markerUnits="strokeWidth" viewBox="0 0 20 20">
      <path d="M0,0 L0,6 L9,3 z" fill="#f00" />
    </marker>
  </defs>

  <image onclick='clicked(evt)' width="1200" height="1500" xlink:href="images/Italian_regions_provinces.png"></image>
 
  <g
     id="MapLabels">
  </g>
</svg>
</div>


</body>
</html>

