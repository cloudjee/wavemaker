package org.jvnet.ws.wadl.xslt;

/**
 * A simple parser for URI templates.
 * 
 */
public class UriTemplateParser {

	private enum State {
		InsideParam, OutsideParam;
	}

	/**
	 * Parses the template, calling back on the handler for every component in
	 * the template.
	 * 
	 * @param template The URI template.
	 * @param handler The object receiving call backs.
	 */
	public static void parse(String template, Handler handler) {
		assert template != null;
		assert handler != null;
		int pos = 0;
		final int length = template.length();
		State state = State.OutsideParam;
		StringBuilder builder = new StringBuilder();
		while (pos < length) {
			char c = template.charAt(pos++);
			switch (state) {
			case InsideParam: {
				if (c == '}') {
					if (builder.length() > 0) {
						handler.handleParam(builder.toString());
						builder.setLength(0);
					}
					state = State.OutsideParam;
				}
				else {
					builder.append(c);
				}
				break;
			}
			case OutsideParam: {
				if (c == '{') {
					if (builder.length() > 0) {
						handler.handleText(builder.toString());
						builder.setLength(0);
					}
					state = State.InsideParam;
				}
				else {
					builder.append(c);
				}
				break;
			}
			}
		}
		if (builder.length() > 0) {
			switch (state) {
			case InsideParam:
				handler.handleParam(builder.toString());
				break;
			case OutsideParam:
				handler.handleText(builder.toString());
				break;
			}
		}
	}

	/**
	 * The interface that will receive callbacks.
	 * 
	 */
	public interface Handler {

		/**
		 * Called for text in the template.
		 */
		void handleText(String text);

		/**
		 * Called for parameters in the template.
		 * 
		 * @param param The name of the parameter.
		 */
		void handleParam(String param);

	}

}
