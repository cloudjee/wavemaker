<?xml version="1.0"?>
<!DOCTYPE hibernate-mapping PUBLIC 
	"-//Hibernate/Hibernate Mapping DTD 3.0//EN"
	"http://hibernate.sourceforge.net/hibernate-mapping-3.0.dtd">

<!-- Generated ${agcontext.date}

Queries for entity: ${agcontext.entityName}.

@design.generated: Marks a generated query.

-->

<hibernate-mapping>

    <query 
        name="get${agcontext.entityName}ById"
        comment="Example HQL Query
                 @design.generated">
                 
        <query-param name="id" type="${agcontext.idType}"/>

            from ${agcontext.entityName} _a where _a.id=:id 

    </query>

</hibernate-mapping>
