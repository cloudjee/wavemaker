
package com.wavemaker.runtime.data.sqlserver;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.atMost;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;

import javax.sql.DataSource;

import org.acegisecurity.Authentication;
import org.acegisecurity.context.SecurityContext;
import org.acegisecurity.context.SecurityContextHolder;
import org.acegisecurity.context.SecurityContextImpl;
import org.acegisecurity.providers.UsernamePasswordAuthenticationToken;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.classic.Session;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;
import org.springframework.jdbc.datasource.ConnectionProxy;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.jdbc.datasource.DataSourceUtils;
import org.springframework.orm.hibernate3.HibernateTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionStatus;

public class TestSqlServerUserImpersonatingDataSourceProxy {

    @Mock
    private DataSource targetDataSource;

    @Mock
    private Connection connection;

    @Mock
    private Statement statement;

    @Mock
    private SessionFactory sessionFactory;

    @Mock
    private Session session;

    @Mock
    private Transaction tx;

    @Before
    public void setUp() throws SQLException {
        MockitoAnnotations.initMocks(this);
        when(this.targetDataSource.getConnection()).thenReturn(this.connection);
        when(this.connection.createStatement()).thenReturn(this.statement);
        when(this.sessionFactory.openSession()).thenReturn(this.session);
        when(this.session.getTransaction()).thenReturn(this.tx);
        when(this.session.beginTransaction()).thenReturn(this.tx);
    }

    @After
    public void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    public void testGetConnectionWithDataSourceTxMgr() throws SQLException {
        SecurityContext context = new SecurityContextImpl();
        Authentication auth = new UsernamePasswordAuthenticationToken("foo", "bar");
        context.setAuthentication(auth);
        SecurityContextHolder.setContext(context);
        DataSource proxy = new SqlServerUserImpersonatingDataSourceProxy(this.targetDataSource);
        PlatformTransactionManager txManager = new DataSourceTransactionManager(proxy);
        TransactionStatus status = txManager.getTransaction(null);
        Connection conn = DataSourceUtils.getConnection(proxy);
        assertNotNull(conn);
        assertTrue(conn instanceof ConnectionProxy);
        verify(this.statement).execute("EXECUTE AS USER='foo'");
        txManager.commit(status);
        verify(this.statement).execute("REVERT");
    }

    @SuppressWarnings("deprecation")
    @Test
    public void testGetConnectionWithHibernateTxMgr() throws SQLException {
        SecurityContext context = new SecurityContextImpl();
        Authentication auth = new UsernamePasswordAuthenticationToken("foo", "bar");
        context.setAuthentication(auth);
        SecurityContextHolder.setContext(context);
        DataSource proxy = new SqlServerUserImpersonatingDataSourceProxy(this.targetDataSource);
        ConnectionAnswer answer = new ConnectionAnswer(proxy);
        when(this.session.connection()).thenAnswer(answer);
        HibernateTransactionManager txManager = new HibernateTransactionManager(this.sessionFactory);
        txManager.setDataSource(proxy);
        TransactionStatus status = txManager.getTransaction(null);
        when(this.session.isConnected()).thenReturn(Boolean.TRUE);
        Connection conn = DataSourceUtils.getConnection(proxy);
        assertNotNull(conn);
        assertTrue(conn instanceof ConnectionProxy);
        verify(this.statement).execute("EXECUTE AS USER='foo'");
        when(this.session.close()).thenAnswer(new CloseAnswer(proxy));
        txManager.commit(status);
        verify(this.statement).execute("REVERT");
    }

    @Test
    public void testGetConnectionUnauthenticated() throws SQLException {
        DataSource proxy = new SqlServerUserImpersonatingDataSourceProxy(this.targetDataSource);
        PlatformTransactionManager txManager = new DataSourceTransactionManager(proxy);
        TransactionStatus status = txManager.getTransaction(null);
        Connection conn = DataSourceUtils.getConnection(proxy);
        assertNotNull(conn);
        assertTrue(conn instanceof ConnectionProxy);
        verify(this.statement, atMost(0)).execute("EXECUTE AS USER='foo'");
        txManager.commit(status);
        verify(this.statement, atMost(0)).execute("REVERT");
    }

    private static final class ConnectionAnswer implements Answer<Connection> {

        private Connection connection = null;

        private final DataSource dataSource;

        public ConnectionAnswer(DataSource dataSource) {
            this.dataSource = dataSource;
        }

        @Override
        public Connection answer(InvocationOnMock invocation) throws Throwable {
            if (this.connection == null) {
                this.connection = this.dataSource.getConnection();
            }
            return this.connection;
        }
    }

    private static final class CloseAnswer implements Answer<Connection> {

        private final DataSource dataSource;

        public CloseAnswer(DataSource dataSource) {
            this.dataSource = dataSource;
        }

        @Override
        public Connection answer(InvocationOnMock invocation) throws Throwable {
            Connection connection = DataSourceUtils.getConnection(this.dataSource);
            DataSourceUtils.releaseConnection(connection, this.dataSource);
            return connection;
        }
    }
}
