<html lang=eng>
	<head>
		<meta charset="utf-8">
		<title>registration page</title>
	</head>
	<body>
	<H1>WAREHOUSE WARS</H1>
	<hr/>
	<H3>REGISTRATION</H3>
	<form method="post">
	<pre>
	<br/><label for="n">Name    :</label> <input id="n" type="text" name="name" size="25" value= <?php if(!empty($_REQUEST['name']))echo ($_REQUEST['name']); ?> >
	<br/><label for="e">Email<br/>Address :</label> <input id="e" type="email" name="email" size="25" value= <?php if(!empty($_REQUEST['email']))echo ($_REQUEST['email']); ?> >
	<br/><label for="u">Username:</label> <input id="u" type="text" name="usern" size="25" value= <?php if(!empty($_REQUEST['usern']))echo ($_REQUEST['usern']); ?> >
	<br/><label for="p">Password:</label> <input id="p" type="password" name="pass" size="25" />
	</pre>
	<input type="submit" name='action' value="signUp">    <input type="submit" name='action' value="cancel"> 
	</form>
	<center>
	<?php echo(view_errors($errors)); ?>
	</center>
	</body>
	
</html>
