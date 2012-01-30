<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="s"%>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ page session="false"%>
<html>
<head>
	<title>WaveMaker</title>
	<link href="<c:url value="/resources/form.css" />" rel="stylesheet"  type="text/css" />
	
    <script type="text/javascript" src="jquery/jquery-1.6.4.js"></script>
    <script type="text/javascript" src="jquery/jquery.atmosphere.js"></script>
    
	<script type="text/javascript">
        $(document).ready(function() {
			function callback(response) {
				if (response.status == 200 && !(response.responseBody === "")) {
					responseBodyLocation = response.responseBody;
					$.atmosphere.unsubscribe();
					window.location = responseBodyLocation;
				}
			}
		 	deployUrl = "<c:url value='/deploy'/>";
        	var callbackAdded = false;
        	$.atmosphere.subscribe(deployUrl, !callbackAdded ? callback : null, $.atmosphere.request = { transport: 'long-polling' });
        	callbackAdded = true;
        	$.atmosphere.response.push(deployUrl, null, $.atmosphere.request = {data: ''});
        });
	</script>
			
</head>
<body>
	<div id="formsContent">
		<h2>WaveMaker</h2>
		<p>Deploying wavemaker, please wait...</p>
		<img src="<c:url value="/resources/ajax-loader.gif" />"/>
	</div>
</body>
</html>
