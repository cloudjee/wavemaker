<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="s"%>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ page session="false"%>
<c:if test="${!ajaxRequest}">
<html>
	<head>
		<title>WaveMaker</title>
		<link href="<c:url value="/resources/form.css" />" rel="stylesheet"  type="text/css" />
		
		<script src="http://ajax.googleapis.com/ajax/libs/dojo/1.6.0/dojo/dojo.xd.js"
					data-dojo-config="isDebug: true,parseOnLoad: true">
		</script>
		
		<!--  
		<script type="text/javascript" src="<c:url value='/dojo/dojo.js.uncompressed.js'/>"></script>
		-->
		
		<script>
			function attachFormHandler() {
			    
			    var form = dojo.byId("form");
			    var formContent = dojo.byId("formContent");

		        dojo.connect(form, "onsubmit", function(event) {

		            dojo.stopEvent(event);
		            
		            
		            timeout = setTimeout(function() {
				        dojo.style("loading", "opacity", "0");
				        dojo.style("loading", "visibility", "visible");
				        dojo.fadeIn({
				            node:"loading",
				            duration:700
				        }).play();
		            }, 2000);
		            
		            dojo.xhrPost({
						form: form,
						handle: function(data, ioargs) {
						    clearTimeout(timeout);
						    if(ioargs.xhr.status === 204 && ioargs.xhr.getResponseHeader("X-Ajax-Redirect")) {
								window.location = ioargs.xhr.getResponseHeader("X-Ajax-Redirect"); 					        
						    } else {
				                dojo.style("loading", "visibility", "hidden");
							    formContent.innerHTML = data;
							    attachFormHandler();
						    }
						}
					});
		        });
		    }
			
			dojo.addOnLoad(attachFormHandler);
		</script>
	</head>
	<body>
	
		<div id="loading" style="visibility:hidden;"></div>

		<h2>WaveMaker</h2>
</c:if>
		<div id="formContent">
			<form:form id="form" method="post" modelAttribute="loginCredentialsBean" cssClass="cleanform">
				<div id="header">
					<s:bind path="*">
						<c:if test="${(status.error) or (not empty message)}">
							<div id="message" class="error">
								<c:if test="${not empty message}">${message}</c:if>							
								<c:if test="${empty message}">Form has errors</c:if>							
							</div>
						</c:if>
					</s:bind>
				</div>
				
				<fieldset>
					<legend>Login</legend>
				
					<!-- Username -->
					<form:label path="username">Username: <form:errors path="username" cssClass="error"/></form:label>
					<form:input path="username" />
				
					<!-- Password -->
					<form:label path="password">Password: <form:errors path="password" cssClass="error"/></form:label>
					<form:password path="password" />
				</fieldset>
				<p>
					<button type="submit">Submit</button>
				</p>
			</form:form>
		</div>		
<c:if test="${!ajaxRequest}">
	</body>
</html>
</c:if>
