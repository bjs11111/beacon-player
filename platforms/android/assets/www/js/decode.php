	var sr = base64DecToArr(device.scanRecord);
	
	var str = Array.prototype.map.call(sr, function(n) {
		 var s = n.toString(16);
		 if(s.length == 1) {
		 s = '0'+s;
		 }
		 return s;
	}).join(' ');
	
	device.mfDatat	: str.substr(21,5);
	device.mfUuid	: str.substr(27,48);
	device.major	: str.substr(75,5);
	device.minor	: str.substr(80,5);

<?
function interprete_beacon($arr_adv_packet){
	
		global $arr_beacons_detected;
	
		if($arr_adv_packet[0] < 10) return -1;
		//Get Advertising Timestamp
				$str_timestamp=$arr_adv_packet[0];
				//Check if timestamp has plausible value
				
				if(substr($str_timestamp, 0, 2)!="20") return -1;

		/*
		 * Igess the whole advertisement data are stored in $arr_adv_packet[1] as string 
		 * i gess the string is not groupod by 2numbers and seperatet with " " (00 00 00 00 00)
		 * i hope it looks like this (0000000)
		 */
		
				
		//Get Beacon Address
			
				$str_beaconaddress=substr($arr_adv_packet[1]  , 21 , 17  );
				$str_beaconaddress= str_replace(" ", "", $str_beaconaddress);
		
		//Get RSSI
				$str_rssi=substr($arr_adv_packet[1]  , -3,2);
				$str_rssi=-256+hexdec($str_rssi);
		
		//Get Manufacturer Specific Data
				$str_adv_packen_no_address=substr($arr_adv_packet[1], 39);
				$remaining_lenght_of_advertising_packet=hexdec(substr($str_adv_packen_no_address, 0, 2));
				
				for($ifor=3;$ifor <= $remaining_lenght_of_advertising_packet*3; $ifor+=3){
					//Getting Lenght of Subblock
						$len_subblock=hexdec(substr($str_adv_packen_no_address, $ifor, 2));
						
						//Getting Type of A/D Subblock
						if($len_subblock!=0){
							$type_subblock=substr($str_adv_packen_no_address, $ifor+3, 2);
						
							switch ($type_subblock){
								case "FF": // Manufacturer Specific Data
									$manufacturer_specific_data=substr($str_adv_packen_no_address, $ifor+6, 3*$len_subblock-4);
									break;
								
								default:
									//TODO: Implement other A/D Type Interpretation
							}
						
						
						
						}
					
						$ifor += $len_subblock*3;
				}
				
		//Check if Beacon contains a known Type
		$arr_manufacturer_specific_data = explode(" ", $manufacturer_specific_data);
		if($arr_manufacturer_specific_data[0]=="EE" && $arr_manufacturer_specific_data[1]=="FF"){
			//Tokencube v3 Temperature Sensor
			$temperature= 0.00390625 * hexdec($arr_manufacturer_specific_data[3] . $arr_manufacturer_specific_data[2]) ;
			$battery_voltage=0;
			
			addToBeaconArray($str_beaconaddress,$str_timestamp,$battery_voltage,$temperature,$str_rssi);
			/*
			//To not overload the DB just take 1 Value for every Gateway dump
			if(!in_array ( $str_beaconaddress , $arr_beacons_detected)){
					$arr_beacons_detected[] =$str_beaconaddress;
					saveToDatabaseTemperature($idUser, $str_beaconaddress, $str_timestamp, $temperature, $battery_voltage, $str_rssi, $con);		
			}*/
		}
		else if($arr_manufacturer_specific_data[0]=="5A" && $arr_manufacturer_specific_data[1]=="00"){
			//EM Beacon
			$temperature = hexdec($arr_manufacturer_specific_data[4]) +  hexdec($arr_manufacturer_specific_data[5]) * 0.01 ;
			$battery_voltage=0;
			$battery_voltage=hexdec(substr($arr_manufacturer_specific_data[6],0,1))*10 + hexdec(substr($arr_manufacturer_specific_data[6],1,1));
			
			addToBeaconArray($str_beaconaddress,$str_timestamp,$battery_voltage,$temperature,$str_rssi);
			
			/*
			//To not overload the DB just take 1 Value for every Gateway dump
			if(!in_array ( $str_beaconaddress , $arr_beacons_detected)){
					$arr_beacons_detected[] =$str_beaconaddress;
					saveToDatabaseTemperature($idUser, $str_beaconaddress, $str_timestamp, $temperature, $battery_voltage, $str_rssi, $con);		
			}*/
		}
		//TODO: Implement other Sensors		
		
				

		
	}
	
	
	
	?>