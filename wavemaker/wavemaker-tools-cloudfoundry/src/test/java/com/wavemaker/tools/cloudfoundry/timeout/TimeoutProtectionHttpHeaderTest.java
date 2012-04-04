package com.wavemaker.tools.cloudfoundry.timeout;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

import org.junit.Test;

/**
 * Tests for {@link TimeoutProtectionHttpHeader}.
 * 
 * @author Phillip Webb
 */
public class TimeoutProtectionHttpHeaderTest {

	@Test
	public void shouldHaveInitialRequest() {
		assertThat(TimeoutProtectionHttpHeader.INITIAL_REQUEST, is("x-cloudfoundry-timeout-protection-initial-request"));
	}

	@Test
	public void shouldHavePollRequest() throws Exception {
		assertThat(TimeoutProtectionHttpHeader.POLL, is("x-cloudfoundry-timeout-protection-poll"));
	}

}
