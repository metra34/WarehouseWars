<?php
//should dbconn be local or global?
$dbconn = pg_connect("host=localhost dbname=clemen47 user=clemen47 password=13222") or die('Could not connect: ' . pg_last_error());


function check_login(){
	
	global $dbconn; // reference $dbconn from global scope vs create a new local
	
	$is_valid = false;
	$result = pg_prepare($dbconn, "myQuery1", "select username from userinfo WHERE username=$1 AND password1=$2;"); 
	# check result 
	$result = pg_execute($dbconn, "myQuery1", array($_REQUEST['user'], $_REQUEST['logPass']));
	$row = pg_fetch_array($result);
	if($row!=null) {
		$_SESSION['username'] = $_REQUEST['user'];
		$is_valid = true;
	}
	
	pg_free_result($result);
	
	return $is_valid;
	
}

function check_registration(){
	global $dbconn;
	
	$is_valid = false;
	$result = pg_prepare($dbconn, "myQuery2", "select * from userinfo where username=$1 or email=$2;");
	$result = pg_execute($dbconn, "myQuery2", array($_REQUEST['usern'], $_REQUEST['email']));
	
	$row = pg_fetch_array($result);
	
	if ($row != null){
		if ($row['username']==$_REQUEST['usern']){
			$errors[] = "username already exists";
		} else {
			$errors[] = "email already exists";
		}
	} else {
		$result2 = pg_prepare($dbconn, "myQuery3", "insert into userinfo values($1, $2, $3, $4);");
		$result2 = pg_execute($dbconn, "myQuery3", array($_REQUEST['usern'], $_REQUEST['name'], $_REQUEST['email'], $_REQUEST['pass']));
		$_SESSION['username'] = $_REQUEST['usern'];
		$is_valid= true;
		pg_free_result($result2);
	}
	
	pg_free_result($result);
	
	return $is_valid;
}

function get_top_scores(){
	global $dbconn;
	
	$query = 'select * from scores order by score desc limit 10;';
	$result = pg_query($query) or die('Query failed: ' . pg_last_error());
	
	echo("<table width='400' cellspacing='5' cellpadding='15' border='10'>\n");
	echo "<tbody>\n";
	echo "<tr><td colspan='2'><font size='6'>High Scores</font></td></tr>";
	$result = pg_query($query) or die('Query failed: ' . pg_last_error());
	while ($row = pg_fetch_array($result, null, PGSQL_ASSOC)) {
    		echo "\t<tr>\n";
    		foreach ($row as $col_value) {
			echo "<center>\n";
        		echo "\t\t<td>$col_value</td>\n";
			echo "</center>\n";
    		}
    		echo "\t</tr>\n";
	}
	echo "</tbody>\n";
	echo "</table>\n";
	
}

function update_scores(){
	
	global $dbconn;
	
	if ($_SESSION['username']=="" || empty($_REQUEST['score1'])){
			return false;
	}
	
	$result2 = pg_prepare($dbconn, "myQuery4", "insert into scores values($1, $2);");
	$result = pg_execute($dbconn, "myQuery4", array($_SESSION['username'], $_REQUEST['score1']));
	pg_free_result($result2);
	return true;
}

?>

	
