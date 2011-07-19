<?xml version="1.0"?>

<!-- Generated ${agcontext.date}

Configuration for '${agcontext.serviceName}' database service

-->

<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:util="http://www.springframework.org/schema/util"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-2.0.xsd http://www.springframework.org/schema/util http://www.springframework.org/schema/util/spring-util-2.0.xsd">


    <bean 
        id="${agcontext.serviceName}"
        class="${agcontext.serviceClass}"
        scope="singleton"
        lazy-init="true">
        <property name="dataServiceManager">
            <ref bean="${agcontext.serviceName}DataService"/>
        </property>
        <property name="taskManager">
            <ref bean="${agcontext.serviceName}TaskMgr"/>
        </property>
    </bean>


    <bean 
        class="com.wavemaker.runtime.data.spring.WMPropertyPlaceholderConfigurer">
        <property name="ignoreUnresolvablePlaceholders" value="true"/>
        <property name="locations">
            <list>
                <value>classpath:${agcontext.serviceName}.properties</value>
            </list>
        </property>
    </bean>

<#if agcontext.impersonateUser>
    <bean 
        id="${agcontext.serviceName}DataSource"
        class="com.wavemaker.runtime.data.sqlserver.SqlServerUserImpersonatingDataSourceProxy"
        lazy-init="true">
        <constructor-arg ref="${agcontext.serviceName}TargetDataSource"/>
        <property name="activeDirectoryDomain" value="${agcontext.activeDirectoryDomain}"/>
    </bean>
    
    <bean 
        id="${agcontext.serviceName}TargetDataSource"
<#else>
    <bean 
        id="${agcontext.serviceName}DataSource"
</#if> 
        class="org.springframework.jdbc.datasource.DriverManagerDataSource" 
        lazy-init="true">
        <property name="driverClassName" value="${agcontext.propref}${agcontext.serviceName}.driverClassName}"/>
        <property name="url" value="${agcontext.propref}${agcontext.serviceName}.connectionUrl}"/>
        <property name="username" value="${agcontext.propref}${agcontext.serviceName}.username}"/>
        <property name="password" value="${agcontext.propref}${agcontext.serviceName}.password}"/>
    </bean>


    <bean 
        id="${agcontext.serviceName}TxMgr" 
        class="org.springframework.orm.hibernate3.HibernateTransactionManager"
        lazy-init="true">
        <property name="sessionFactory">
            <ref bean="${agcontext.serviceName}SessionFactory"/>
        </property>
    </bean>


    <bean 
        id="${agcontext.serviceName}HibernateTemplate"
        class="org.springframework.orm.hibernate3.HibernateTemplate"
        lazy-init="true">
        <property name="sessionFactory"> 
            <ref bean="${agcontext.serviceName}SessionFactory"/>
        </property>
    </bean>  


    <bean 
        id="${agcontext.serviceName}SessionFactory" 
        class="com.wavemaker.runtime.data.spring.ConfigurationAndSessionFactoryBean"
        lazy-init="true">

        <!-- A unique name for this SessionFactory's configuration -->
        <property name="name" value="${agcontext.serviceName}"/>
        <property name="dataSource" ref="${agcontext.serviceName}DataSource"/>

        <property name="hibernateProperties">
            <props>
                <prop key="hibernate.dialect">${agcontext.propref}${agcontext.serviceName}.dialect}</prop>
                <prop key="hibernate.transaction.factory_class">
                    org.hibernate.transaction.JDBCTransactionFactory
                </prop>
                <prop key="hibernate.current_session_context_class">thread</prop>
            </props> 
        </property>

        <property name="mappingResources">
            <list>

${agcontext.hbmFiles}

${agcontext.queryFiles}

            </list>
        </property>

    </bean>


    <!-- the data service bean instance is injected into the service bean -->
    <bean 
        id="${agcontext.serviceName}DataService" 
        class="com.wavemaker.runtime.data.spring.SpringDataServiceManager"
        lazy-init="true">
        <constructor-arg>
            <!-- the value of the "name" property of the SessionFactory -->
            <value>${agcontext.serviceName}</value>
        </constructor-arg>
        <constructor-arg>
            <ref bean="${agcontext.serviceName}HibernateTemplate"/>
        </constructor-arg>
        <constructor-arg>
            <ref bean="${agcontext.serviceName}TxMgr"/>
        </constructor-arg>
        <constructor-arg>
            <ref bean="${agcontext.serviceName}TaskMgr"/>
        </constructor-arg>
        <constructor-arg>
            <map>
                <entry key="useIndividualCRUDOperations" value="${agcontext.useIndividualCRUDOperations}"/>
                <entry key="refreshEntities" value=""/> 
            </map>
        </constructor-arg>
    </bean>


    <bean 
        id="${agcontext.serviceName}TaskMgr"
        class="com.wavemaker.runtime.data.DefaultTaskManager"
        lazy-init="true"/>

    <bean class="com.wavemaker.runtime.service.events.EventWire"
        lazy-init="false">
        <property name="serviceWire" ref="${agcontext.serviceName}ServiceWire"/>
        <property name="eventListener">
            <bean class="com.wavemaker.runtime.data.DataServiceEventListener"/>
        </property>
    </bean>

    <bean id="${agcontext.serviceName}ServiceWire"
        class="com.wavemaker.runtime.service.reflect.ReflectServiceWire"
        lazy-init="false" scope="singleton">
        <property name="serviceId" value="${agcontext.serviceName}"/>
        <property name="serviceType" ref="DataService"/>
    </bean>

</beans>
