/*
 * Copyright (C) 2008-2011 VMWare, Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

package com.wavemaker.desktop.launcher;

import java.io.IOException;
import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

/**
 * Command line interface to run a server in a console.
 * 
 * @author small
 * @version $Rev$ - $Date: 2008-09-18 14:31:51 -0700 (Thu, 18 Sep 2008)
 *          $
 */
public class Server {

	private static final String NO_STDOUT_REDIRECT = "--no-stdout-redirect";
	public static final int DEFAULT_FIRSTPORT = 8000;
	public static final int DEFAULT_LASTPORT = 9000;

	private static void usage() {
		System.out.println("Server usage: [-h] [" + NO_STDOUT_REDIRECT + "]");
		System.out.println("\t-h: print usage and exit");
		System.out.println("\t" + NO_STDOUT_REDIRECT
				+ ": don't redirect stdout");
	}

	public static void main(String[] args) throws IOException,
			URISyntaxException {

		boolean noStdoutRedirect = false;

		List<String> argsList = new ArrayList<String>();
		argsList.add("start");
		for (String arg : args) {
			if (arg.equals("-h")) {
				usage();
				return;
			} else if (arg.equals(NO_STDOUT_REDIRECT)) {
				noStdoutRedirect = true;
			} else {
				argsList.add(arg);
			}
		}
		Main.start(argsList.toArray(new String[argsList.size()]),
				noStdoutRedirect);
	}

	public static void ValidateConfig(TomcatConfig config)
			throws InvalidServerConfigurationException {
		ValidateConfig(config, DEFAULT_FIRSTPORT, DEFAULT_LASTPORT);
	}

	public static void ValidateConfig(TomcatConfig config, int firstPort,
			int lastPort) throws InvalidServerConfigurationException {
		// Validate Server Ports
		// shutdown port
		Main.printlnToLog("\tScanning for Shutdown Port:");
		int shutdownPort = FindOpenPort(config.getShutdownPort(), firstPort,
				lastPort);
		if (shutdownPort == -1) {
			throw new InvalidServerConfigurationException(
					InvalidServerConfigurationException.Parameter.SHUTDOWN_PORT,
					"Unable to locate an available port.");
		}
		Main.printlnToLog("\tSelected Shutdown Port: " + shutdownPort);

		// service port
		Main.printlnToLog("\tScanning for Service Port: ");
		int servicePort = FindOpenPort(config.getServicePort(), firstPort,
				lastPort, new int[] { shutdownPort });
		if (servicePort == -1) {
			throw new InvalidServerConfigurationException(
					InvalidServerConfigurationException.Parameter.SERIVCE_PORT,
					"Unable to locate an available port.");
		}
		Main.printlnToLog("\tSelected Service Port: " + servicePort);

		// Update Config
		config.setShutdownPort(shutdownPort);
		config.setServicePort(servicePort);

		return;
	}

	public static int FindOpenPort(int preferred, int minPort, int maxPort) {
		return FindOpenPort(preferred, minPort, maxPort, new int[] {});
	}

	public static int FindOpenPort(int preferred, int minPort, int maxPort,
			int[] exclude) {
		int result = preferred;
		int scanCount = 0;
		boolean isValid = true;
		ServerSocket test = null;
		Socket test2 = null;
		while (scanCount <= 1) {
			// Avoid Exclusions
			for (int i = 0; i < exclude.length; i++) {
				if (result == exclude[i]) {
					isValid = false;
				}
			}
			// Test Current Port
			if (isValid) {
				try {
					// Test the port for bind access
					Main.printlnToLog("\t\tTesting port: " + result);
					test = new ServerSocket(result, 1, InetAddress.getByName("127.0.0.1"));
					try{test.close();}catch(IOException e){}
					// Test the port for connect access
					try
					{
						test2 = new Socket("127.0.0.1", result);
					}
					catch(IOException e){
						// Passes both tests
						Main.printlnToLog("\t\tPort " + result + " is available.");
						// Return current port
						break;
					}
					finally{
						if(test2 != null){
							try
							{
								test2.close();
							}
							catch(IOException e){}
							test2 = null;
						}
					}
				} catch (IOException e) {
				} finally {
					if (test != null) {
						try {
							test.close();
						} catch (IOException e) {
						}
						test = null;
					}
				}
			}
			// Select Next Port To Test
			isValid = true;
			if(result >= maxPort){
				result = minPort;
				scanCount++;
			}
			else
			{
				result++;
			}
		}
		// Check if port found
		if (scanCount > 1) {
			result = -1;
		}
		return result;
	}
}