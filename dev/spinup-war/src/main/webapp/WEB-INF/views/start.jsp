<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="s"%>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ page session="false"%>
<html>
<head>
	<title>WaveMaker</title>
	<link href="<c:url value="/resources/form.css" />" rel="stylesheet"  type="text/css" />		
</head>
<body>
	<div id="formsContent">
		<h2>WaveMaker</h2>
		<form:form id="form" method="post" modelAttribute="loginCredentialsBean" cssClass="cleanform">
			<div class="header">
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
</body>
</html>
