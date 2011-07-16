package com.wavemaker.tools.data;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.sql.Connection;
import java.sql.SQLException;

import javax.sql.DataSource;

import org.acegisecurity.Authentication;
import org.acegisecurity.context.SecurityContextHolder;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.ConnectionProxy;
import org.springframework.jdbc.datasource.DelegatingDataSource;
import org.springframework.util.Assert;

/**
 * DataSource proxy implementation that will allow impersonation of the currently authenticated user 
 * on MS SQLServer when executing JDBC statements.
 * 
 * <p>
 * Impersonation of the current user is achieved by executing a SQLServer-specific <code>EXECUTE AS USER='{username}'</code>
 * statement, where {username} is the username for the currently authenticated user as provided by the {@link SecurityContext}.  
 * For this to work successfully, the user must be a valid ActiveDirectory LDAP user.
 * 
 * <p>
 * The <code>EXECUTE AS</code> statement will only be run when a connection is first requested at the 
 * start of a Spring-managed transaction.  When the transaction is completed and the connection is closed, 
 * a compensating <code>REVERT</code> statement will be executed that will return the connection to 
 * its original state.
 * 
 * @author Jeremy Grelle
 */
public class SqlServerUserImpersonatingDataSourceProxy extends DelegatingDataSource {

	private JdbcTemplate template;
	
	public SqlServerUserImpersonatingDataSourceProxy() {
		super();
	}

	public SqlServerUserImpersonatingDataSourceProxy(DataSource targetDataSource) {
		super(targetDataSource);
		this.template = new JdbcTemplate(targetDataSource);
	}

	public Connection getConnection() throws SQLException {
		DataSource ds = getTargetDataSource();
		Assert.state(ds != null, "'targetDataSource' is required");
		prepareConnection();
		return getAuditingConnectionProxy(getTargetDataSource().getConnection());
	}

	@Override
	public void setTargetDataSource(DataSource targetDataSource) {
		super.setTargetDataSource(targetDataSource);
		this.template = new JdbcTemplate(targetDataSource);
	}

	private void prepareConnection() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth != null) {
			template.execute("EXECUTE AS USER='"+auth.getName()+"'");
		}
	}

	private Connection getAuditingConnectionProxy(Connection connection) {
		return (Connection) Proxy.newProxyInstance(
				ConnectionProxy.class.getClassLoader(),
				new Class[] {ConnectionProxy.class},
				new AuditingInvocationHandler(connection));
	}
	
	private class AuditingInvocationHandler implements InvocationHandler {

		private final Connection target;

		public AuditingInvocationHandler(Connection targetConnection) {
			this.target = targetConnection;
		}

		public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
			// Invocation on ConnectionProxy interface coming in...

			if (method.getName().equals("equals")) {
				// Only consider equal when proxies are identical.
				return (proxy == args[0]);
			}
			else if (method.getName().equals("hashCode")) {
				// Use hashCode of PersistenceManager proxy.
				return System.identityHashCode(proxy);
			}
			else if (method.getName().equals("unwrap")) {
				if (((Class<?>) args[0]).isInstance(proxy)) {
					return proxy;
				}
			}
			else if (method.getName().equals("isWrapperFor")) {
				if (((Class<?>) args[0]).isInstance(proxy)) {
					return true;
				}
			}
			else if (method.getName().equals("close")) {
				Authentication auth = SecurityContextHolder.getContext().getAuthentication();
				if (auth != null) {
					template.execute("REVERT");
				}
			}
			else if (method.getName().equals("isClosed")) {
				return false;
			}
			else if (method.getName().equals("getTargetConnection")) {
				// Handle getTargetConnection method: return underlying Connection.
				return this.target;
			}

			// Invoke method on target Connection.
			try {
				return method.invoke(this.target, args);
			}
			catch (InvocationTargetException ex) {
				throw ex.getTargetException();
			}
		}
	}
}
