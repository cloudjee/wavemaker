
package com.wavemaker.runtime.data.sqlserver;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;

import javax.sql.DataSource;

import org.acegisecurity.Authentication;
import org.acegisecurity.context.SecurityContext;
import org.acegisecurity.context.SecurityContextHolder;
import org.springframework.jdbc.datasource.ConnectionProxy;
import org.springframework.jdbc.datasource.DelegatingDataSource;
import org.springframework.jdbc.support.JdbcUtils;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

/**
 * DataSource proxy implementation that will allow impersonation of the currently authenticated user on MS SQLServer
 * when executing JDBC statements.
 * 
 * <p>
 * Impersonation of the current user is achieved by executing a SQLServer-specific
 * <code>EXECUTE AS USER='{username}'</code> statement, where {username} is the username for the currently authenticated
 * user as provided by the {@link SecurityContext}. For this to work successfully, the user must be a valid
 * ActiveDirectory LDAP user. Optionally, an Active Directory Domain name may be configured that will be prepended to
 * the username. If the {@link #setActiveDirectoryDomain(String) activeDirectoryDomain} property is set with a non-empty
 * value, the statement executed to prepare the connection will be in the form of
 * <code>EXECUTE AS USER='{activeDirectoryDomain}\{username}'</code>.
 * 
 * <p>
 * The <code>EXECUTE AS</code> statement will only be run when a connection is first requested at the start of a
 * Spring-managed transaction. When the transaction is completed and the connection is closed, (or released back to a
 * pool) a compensating <code>REVERT</code> statement will be executed that will return the connection to its original
 * state.
 * 
 * @author Jeremy Grelle
 */
public class SqlServerUserImpersonatingDataSourceProxy extends DelegatingDataSource {

    private String activeDirectoryDomain = "";

    public SqlServerUserImpersonatingDataSourceProxy() {
        super();
    }

    public SqlServerUserImpersonatingDataSourceProxy(DataSource targetDataSource) {
        super(targetDataSource);
    }

    @Override
    public Connection getConnection() throws SQLException {
        DataSource ds = getTargetDataSource();
        Assert.state(ds != null, "'targetDataSource' is required");
        return getAuditingConnectionProxy(getTargetDataSource().getConnection());
    }

    /**
     * Sets an Active Directory Domain name to be used as a prefix to the username when running an
     * <code>EXECUTE AS</code> statement to prepare a connection.
     * 
     * @param activeDirectoryDomain the Active Directory Domain name
     */
    public void setActiveDirectoryDomain(String activeDirectoryDomain) {
        this.activeDirectoryDomain = activeDirectoryDomain;
    }

    @Override
    public void setTargetDataSource(DataSource targetDataSource) {
        super.setTargetDataSource(targetDataSource);
    }

    private Connection getAuditingConnectionProxy(Connection connection) throws SQLException {
        return (Connection) Proxy.newProxyInstance(ConnectionProxy.class.getClassLoader(), new Class[] { ConnectionProxy.class },
            new AuditingInvocationHandler(connection));
    }

    private class AuditingInvocationHandler implements InvocationHandler {

        private final Connection target;

        public AuditingInvocationHandler(Connection targetConnection) throws SQLException {
            this.target = targetConnection;
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null) {
                StringBuilder query = new StringBuilder();
                query.append("EXECUTE AS USER='");
                if (StringUtils.hasText(SqlServerUserImpersonatingDataSourceProxy.this.activeDirectoryDomain)) {
                    query.append(SqlServerUserImpersonatingDataSourceProxy.this.activeDirectoryDomain + "\\");
                }
                query.append(auth.getName() + "'");
                executeStatement(query.toString());
            }
        }

        public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
            // Invocation on ConnectionProxy interface coming in...

            if (method.getName().equals("equals")) {
                // Only consider equal when proxies are identical.
                return proxy == args[0];
            } else if (method.getName().equals("hashCode")) {
                // Use hashCode of PersistenceManager proxy.
                return System.identityHashCode(proxy);
            } else if (method.getName().equals("unwrap")) {
                if (((Class<?>) args[0]).isInstance(proxy)) {
                    return proxy;
                }
            } else if (method.getName().equals("isWrapperFor")) {
                if (((Class<?>) args[0]).isInstance(proxy)) {
                    return true;
                }
            } else if (method.getName().equals("close")) {
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                if (auth != null) {
                    executeStatement("REVERT");
                }
            } else if (method.getName().equals("getTargetConnection")) {
                // Handle getTargetConnection method: return underlying Connection.
                return this.target;
            }

            // Invoke method on target Connection.
            try {
                return method.invoke(this.target, args);
            } catch (InvocationTargetException ex) {
                throw ex.getTargetException();
            }
        }

        private void executeStatement(String sql) throws SQLException {
            Statement statement = null;
            try {
                statement = this.target.createStatement();
                statement.execute(sql);
            } finally {
                JdbcUtils.closeStatement(statement);
            }
        }
    }
}
