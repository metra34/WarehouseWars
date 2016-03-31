<?php
	session_save_path("sess");
	session_start();
	ini_set('display_errors', 'On'); //for debugging, remove later
	
	require_once "model/db_access.php";
	
	//array stores the errors, to be printed at every new page view.
	$errors=array();
	$view="";

	if(!isset($_SESSION['state'])){
		$_SESSION['state']="main";
	}
	if(!isset($_SESSION['username'])){
		$_SESSION['username']="";
	}
	
	switch($_SESSION['state']){
		case "main":
			$view = "views/main.php";
			//call function get_top_scores() to return result

			if (!empty($_REQUEST["doThis"]) && $_REQUEST["doThis"]=="Login"){
				$view = "views/login.php";
				$_SESSION['state']="login";
			} elseif (!empty($_REQUEST["doThis"]) && $_REQUEST["doThis"]=="Sign Up"){
				$view = "views/register.php";
				$_SESSION['state']="register";
			}
			break;
		
		case "register":
			$view = "views/register.php";
			if (!empty($_REQUEST['action']) && $_REQUEST['action']=="signUp"){
				if (empty($_REQUEST['name'])){
					$errors[]=("Name required");
				} else {
					if (strlen($_REQUEST['name']>30) || strlen($_REQUEST['name'])<2){
						$errors[] = ("Name must be between 2 and 30 characters long");
					} else if (!ctype_alpha($_REQUEST['name'])){
						$errors[] = ("Invalid name");
					}
				}
				if (empty($_REQUEST['email'])){
					$errors[]=("Email required");
				} else {
					if (!filter_var($_REQUEST['email'], FILTER_VALIDATE_EMAIL)) {
						$errors[] = "Invalid email"; 
					}
				}
				if (empty($_REQUEST['usern'])){
					$errors[]=("Username required");
				} else {
					if (strlen($_REQUEST['usern'])<2 || strlen($_REQUEST['usern']>20)){
						$errors[] = ("Username must be between 2 and 20 characters long");
					} else if (!ctype_alnum($_REQUEST['usern'])){
						$errors[] = ("Invalid username, only letters and numbers allowed");
					}
				}
				if (empty($_REQUEST['pass'])){
					 $errors[]=("Password required");
				} else {
					if (strlen($_REQUEST['pass'])<6 || strlen($_REQUEST['pass'])>16){
						$errors[]=("Password must be between 6 and 16 characters");
					}
				}
				
				if (!empty($errors))break;
				
				if (check_registration()){
					$view = "views/ww.php";
					$_SESSION['state']="game";
				}
				if (!empty($errors))break;
				
			} elseif(!empty($_REQUEST['action']) && $_REQUEST['action']=="cancel"){
				$view = "views/main.php";
				$_SESSION['state']="main";
				break;
			}
			break;
			
		
		case "login":
			$view = "views/login.php";
			if (!empty($_REQUEST['actionL']) && $_REQUEST['actionL']=="Login"){
				if(empty($_REQUEST['user']))$errors[]='user is required';
				if(empty($_REQUEST['logPass']))$errors[]='password is required';
				if(!empty($errors))break;
				
				if (check_login()){
					$_SESSION['state']='game';
					$view="views/ww.php";
				} else {
					$errors[]="invalid login";
				}
				
			} elseif (!empty($_REQUEST['actionL']) && $_REQUEST['actionL']=="Cancel"){
				$view = "views/main.php";
				$_SESSION['state']="main";
				break;
			}
			
			break;
			
		case "game":
			$view="views/ww.php";
			if ($_SESSION['username']==""){
				$view="views/main.php";
				$_SESSION['state']="main";
			}
			if (!empty($_REQUEST['score1'])){
				$_SESSION['state']="win";
				$view="views/win.php";
				//update highscores
				update_scores();
				break;
			}
			break;
			
		case "win":
			$view="views/win.php";
			if (!empty($_REQUEST['playAgain'])){
				$_SESSION['state']="game";
				$view="views/ww.php";
				break;
			}
			break;
			
	}
	require_once "views/view_lib.php";
	require_once "$view";
	if ($_SESSION['state']=='main' || $_SESSION['state']=='win'){
		echo "<center>\n";
		get_top_scores();
		echo "</center>\n";
	}
?>
