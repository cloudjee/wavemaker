package org.jvnet.ws.wadl.xslt;

import nu.xom.Document;
import nu.xom.Element;
import nu.xom.converters.DOMConverter;

import org.apache.xerces.dom.DOMImplementationImpl;
import org.w3c.dom.Node;

/**
 * A collection of helper utilities for dealing with WADL artifacts in an XSLT transformation.
 */
public class WadlXsltUtils {

	/**
	 * Parses the path, and returns a snippet of XML identifying all fragments.
	 * <p>
	 * Example:
	 * </p>
	 * <p>
	 * When passing in "{ab}/cd/{ef}", this operation will return an XML fragment like this:
	 * </p>
	 * <pre>
	 * &lt;path&gt;
	 * &lt;param&gt;ab&lt;/param&gt;
	 * &lt;text&gt;/cd/&lt;/text&gt;
	 * &lt;param&gt;ef&lt;/param&gt;
	 * &lt;/path&gt;
	 * </pre>  
	 * 
	 * @param path
	 * @return
	 */
	public static Node parse(String path) {
		final Document document = buildDocument(path.toString());
		return DOMConverter.convert(document, new DOMImplementationImpl());
	}

	public static Document buildDocument(String template) {
		final Element element = new Element("path");
		final Document document = new Document(element);
		UriTemplateParser.parse(template, new UriTemplateParser.Handler() {
			public void handleParam(String param) {
				Element child = new Element("param");
				child.appendChild(param);
				element.appendChild(child);
			}

			public void handleText(String text) {
				Element child = new Element("text");
				child.appendChild(text);
				element.appendChild(child);
			}
		});
		return document;
	}

}
