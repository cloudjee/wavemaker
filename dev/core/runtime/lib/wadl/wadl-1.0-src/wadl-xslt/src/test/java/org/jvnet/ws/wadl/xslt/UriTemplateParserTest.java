package org.jvnet.ws.wadl.xslt;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.jvnet.ws.wadl.xslt.UriTemplateParser;
import org.jvnet.ws.wadl.xslt.UriTemplateParser.Handler;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnit44Runner;

@RunWith(MockitoJUnit44Runner.class)
public class UriTemplateParserTest {
	
	@Mock
	private Handler handler;
	
	@Test
	public void shouldParseParameterFirst() {
		UriTemplateParser.parse("{a}/bc", handler);
		verify(handler).handleParam("a");
		verify(handler).handleText("/bc");
		verifyNoMoreInteractions(handler);
	}
	
	@Test
	public void shouldParseParameterLast() {
		UriTemplateParser.parse("bc/{a}", handler);
		verify(handler).handleText("bc/");
		verify(handler).handleParam("a");
		verifyNoMoreInteractions(handler);
	}
	
	@Test
	public void shouldParseMultipleParameters() {
		UriTemplateParser.parse("bc/{a}{b}", handler);
		verify(handler).handleText("bc/");
		verify(handler).handleParam("a");
		verify(handler).handleParam("b");
		verifyNoMoreInteractions(handler);
	}
	
	@Test
	public void shouldParseEmpty() {
		UriTemplateParser.parse("", handler);
		verifyNoMoreInteractions(handler);
	}

}
