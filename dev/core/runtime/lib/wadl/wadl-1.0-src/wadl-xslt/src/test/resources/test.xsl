<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"
                xmlns:wadl-utils="xalan://org.jvnet.ws.wadl.xslt.WadlXsltUtils"
                xmlns:wadl="http://wadl.dev.java.net/2009/02"
                exclude-result-prefixes="wadl-utils">

  <xsl:output method="text"/>

  <xsl:template match="/">
    <xsl:for-each select="//wadl:resource[@path]">
      <xsl:value-of select="@path"/>
      <xsl:text>: </xsl:text>
      <xsl:for-each select="wadl-utils:parse(@path)/path/*">
        <xsl:text>[</xsl:text>
        <xsl:value-of select="local-name(.)"/>
        <xsl:text>: '</xsl:text>
        <xsl:value-of select="text()"/>
        <xsl:text>']</xsl:text>
      </xsl:for-each> 
    </xsl:for-each>
  </xsl:template>
  
</xsl:stylesheet>