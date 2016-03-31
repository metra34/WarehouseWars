<html lang=eng>
<head>
	<meta charset="utf-8">
	<title>Scores Page</title>
	<style>
	td,th {
  		text-align: center;
	} 
	</style>
</head>
<body>
	
	<center>
		<strong><H1>WAREHOUSE WARS</H1></strong>
		<hr/>
		Your Score: <span id="number" style="color:blue"> <?php if (!empty($_REQUEST['score1']))echo $_REQUEST['score1']; ?> </span>
		<form>
		<input type="submit" name="playAgain" value="Play Again">
		</form>
	</center>

</body>
</html>