package org.jvnet.ws.wadl.xslt;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertThat;

import java.io.IOException;
import java.io.StringWriter;

import javax.xml.transform.Result;
import javax.xml.transform.Source;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.jvnet.ws.wadl.xslt.WadlXsltUtils;
import org.mockito.runners.MockitoJUnit44Runner;
import org.w3c.dom.Node;

@RunWith(MockitoJUnit44Runner.class)
public class WadlXsltUtilsTest {

	@Test
	public void shouldParseCorrectly() {
		Node node = WadlXsltUtils.parse("ab/{cd}/ef");
		assertThat(node.getChildNodes().item(0).getChildNodes().getLength(),
				equalTo(3));
		assertThat(node.getChildNodes().item(0).getNodeName(),
				equalTo("path"));
		assertThat(node.getChildNodes().item(0).getChildNodes().item(0)
				.getNodeName(), equalTo("text"));
		assertThat(node.getChildNodes().item(0).getChildNodes().item(1)
				.getNodeName(), equalTo("param"));
		assertThat(node.getChildNodes().item(0).getChildNodes().item(2)
				.getNodeName(), equalTo("text"));
	}

	@Test
	public void shouldBeUsefulInStylesheet()
			throws TransformerException, IOException {
		TransformerFactory factory = TransformerFactory.newInstance(); 
		Source xsltSource = new StreamSource(this.getClass().getClassLoader().getResourceAsStream("test.xsl"));
		Source xmlSource = new StreamSource(this.getClass()
				.getResourceAsStream("/search.wadl"));
		Transformer transformer = factory.newTransformer(xsltSource);
		StringWriter writer = new StringWriter();
		Result result = new StreamResult(writer);
		assertNotNull(xsltSource);
		assertNotNull(xmlSource);
		assertNotNull(transformer);
		transformer.transform(xmlSource, result);
		String out = writer.toString();
		assertThat(out, equalTo("projects/{id}: [text: 'projects/'][param: 'id']"));
	}

}
