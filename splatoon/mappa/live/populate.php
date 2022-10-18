<?php
$conn = mysqli_connect("localhost", "splatoon_map", "Splatoon2", "splatoon_map") or die("Connection Error: " . mysqli_error($conn));


$result_regions = mysqli_query($conn, "SELECT id,region,x,y,x2,y2 FROM regions WHERE id IN ( SELECT region_id FROM nicks )" );

$response = array();
$info=array();

if (mysqli_num_rows($result_regions) != 0) {
while($region = mysqli_fetch_array($result_regions)) {
    $region['nicks']=array();
    $result_nicks = mysqli_query($conn, "SELECT nick FROM nicks WHERE region_id = " . $region['id'] );
    if (mysqli_num_rows($result_nicks) != 0) {
	while($nick = mysqli_fetch_array($result_nicks)) {
	    array_push($region['nicks'],$nick['nick']);
	}
	array_push($info,$region);
    }
}

$conn->close();
}

// create json response
if (count($info) > 0)
{
    $response["Result"] = 1;
    $response["regions"] = $info;
} else {
    $response["Result"] = 0;
    $response["regions"] = "No data";
}

echo json_encode($response);

?>
