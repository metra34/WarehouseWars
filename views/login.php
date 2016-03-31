<!-- name of password variable = logPass
name of username variable = user
using post method for form to submit to index.php -->
<html>
<head>
</head>
<body>
<table width="300" border="0" align="center" cellpadding="0" cellspacing="1">
<tr>
<form name="form1" method="post">
<td>
<table width="100%" border="0" cellpadding="3" cellspacing="1">
<tr>
<td colspan="3"><h3>Member Login</h3></td>
</tr>
<tr>
<td>Username</td>
<td>:</td>
<td><input name="user" type="text" value=<?php if(!empty($_REQUEST['user']))echo ($_REQUEST['user']);?> ></td>
</tr>
<tr>
<td>Password</td>
<td>:</td>
<td><input name="logPass" type="password"></td>
</tr>
<tr>
<td>&nbsp;</td>
<td>&nbsp;</td>
<td><input type="submit" name="actionL" value="Login"></td> <td><input type="submit" name="actionL" value="Cancel"></td>
</tr>
</table>
</td>
</form>
</tr>
</table>
<center>
<?php echo(view_errors($errors)); ?>
</center>
</body>
</html>