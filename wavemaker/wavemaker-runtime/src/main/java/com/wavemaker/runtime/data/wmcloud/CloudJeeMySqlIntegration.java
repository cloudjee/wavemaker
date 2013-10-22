package com.wavemaker.runtime.data.wmcloud;

import com.wavemaker.common.WMRuntimeException;
import com.wavemaker.runtime.data.util.JDBCUtils;
import org.springframework.orm.hibernate3.LocalSessionFactoryBean;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

/**
 *
 * @Author: Sowmya
 */
public class CloudJeeMySqlIntegration extends LocalSessionFactoryBean {
    /*
     * The test is the default database available in CJ Mysql database which is running at 3306
     */
    private static final String SCHEMA_URL = "jdbc:mysql://localhost:3306/test";
    private String username;
    private String password;
    private String url;
    private String driverClassName;
    private String schemaName;

    public CloudJeeMySqlIntegration(){

    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getDriverClassName() {
        return driverClassName;
    }

    public void setDriverClassName(String driverClassName) {
        this.driverClassName = driverClassName;
    }

    public String getSchemaName() {
        return schemaName;
    }

    public void setSchemaName(String schemaName) {
        this.schemaName = schemaName;
    }

    private void ensureDBNameExists() throws WMRuntimeException{
        Connection con = null;
        Statement st = null;
        try{
            Class.forName(this.getDriverClassName());
            con = DriverManager.getConnection(this.SCHEMA_URL, this.getUsername(), this.getPassword());
            st = con.createStatement();
            st.executeUpdate(" CREATE DATABASE IF NOT EXISTS " + this.getSchemaName());
        }catch (Exception e){
            throw new WMRuntimeException("Failed to create Database "+this.getSchemaName() , e);
        }
        finally {
            if(con != null){
                try {
                    st.close();
                } catch (SQLException ignore) {
                }
                try {

                    con.close();
                } catch (SQLException ignore) {

                }
            }
        }
    }


    @Override
    public void afterPropertiesSet() throws Exception {
        String schemaNameExtract = JDBCUtils.getMySQLDatabaseName(this.getUrl());
        setSchemaName(schemaNameExtract);
        ensureDBNameExists();
    }

}
