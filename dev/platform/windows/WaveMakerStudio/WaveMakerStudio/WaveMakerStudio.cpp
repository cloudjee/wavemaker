// WaveMakerStudio.cpp : Defines the entry point for the console application.
//

#include "stdafx.h"
/** Function Declarations */
void HandleError(LPCTSTR lpszFunction, LPCTSTR lpszError);
DWORD HandleSystemError(LPCTSTR lpszFunction);
LPTSTR FindWaveMakerPath();
DWORD LaunchTomcatProcess(LPCTSTR tomcatRootPath);
DWORD StartTomcatService();
DWORD ValidateTomcatProcess(LPCTSTR url);
// DWORD ValidateTomcatProcess(URL_COMPONENTS &url);
DWORD LaunchBrowser(LPCTSTR url);
VOID LogMessage(LPCTSTR message);

/** Constants */
#define DEFAULT_WAVEMAKER_URL TEXT("http://localhost:8094/studio/static/turbo09/studio/")
#define TOMCAT_SERVICE_NAME		TEXT("WaveMakerServer")
#define WAVEMAKER_AGENT_NAME	TEXT("WaveMakerLauncher")
#define VALIDATION_RETRY_COUNT	100
#define VALIDATION_RETRY_SLEEP	100

#define WM_MSG_STARTUP			TEXT("WaveMaker AJAX Studio is starting up.\nPlease bear with us, this process may take as long as ten to fifteen seconds.")
#define WM_MSG_SERVICECHECK		TEXT("   Initializing Tomcat web application server...")
#define WM_MSG_SERVICESTART		TEXT("      Waiting for Tomcat web application server to start...")
#define WM_MSG_SERVICETIMEOUT	TEXT("   Tomcat server is not responding.\n")
#define WM_MSG_SERVICEFAILED	TEXT("   Unable to launch Tomcat server. WaveMaker Studio start up is aborting.")
#define WM_MSG_SERVICEREADY		TEXT("      Tomcat server started.")
#define WM_MSG_VALIDATECHECK	TEXT("   Initializing WaveMaker application server.")
#define WM_MSG_VALIDATEFAILED	TEXT("   The WaveMaker application server failed to start.\nPlease contact technical support for help at http://dev.wavemaker.com")
#define WM_MSG_VALIDATEREADY	TEXT("      WaveMaker application server is ready.")
#define WM_MSG_BROWSERSTART		TEXT("Launching browser: WaveMaker Studio will automatically load in your default browser.")

/** Globals */
// Handles
HANDLE	gServiceError	= INVALID_HANDLE_VALUE;	// Handle to the error output file
HMODULE gWinInetModule	= NULL;					// Handle to the WinInet.dll for error messages

/** Functions */
int _tmain(int argc, _TCHAR* argv[])
{
	DWORD status = ERROR_SUCCESS;
	LPCTSTR waveMakerUrl = DEFAULT_WAVEMAKER_URL;

	// Read Command Args
	if(argc >= 2)
	{
		// Check args for URL
		if(CompareString(LOCALE_USER_DEFAULT, NORM_IGNORECASE, argv[1], 7, TEXT("http://"), 7) == CSTR_EQUAL)
		{
			waveMakerUrl = argv[1];
		}
	}

	LogMessage(WM_MSG_STARTUP);
	// Start Tomcat
	status = LaunchTomcatProcess(NULL);
	if(status != ERROR_SUCCESS)
	{
		LogMessage(WM_MSG_SERVICEFAILED);
		return 1;
	}

	// Validate Tomcat
	status = ValidateTomcatProcess(waveMakerUrl);
	if(status == ERROR_SUCCESS)
	{
		// Start Browser
		LaunchBrowser(waveMakerUrl);
	}
	else
	{
		// Error Launching Studio app
		LogMessage(WM_MSG_VALIDATEFAILED);
	}

    // If we loaded a message source, unload it.
    if(gWinInetModule != NULL)
	{
		FreeLibrary(gWinInetModule);
	}

	return status;
}

void HandleError(LPCTSTR lpszFunction, LPCTSTR lpszError)
{
	return;
}

/** HandleSystenError
 * Translates and prints Windows Error Codes into a MessageBox
 */
DWORD HandleSystemError(LPCTSTR errorMessage)
{
	DWORD dwLastError = GetLastError();
	LPTSTR messageBuffer;
    DWORD dwBufferLength;
    DWORD dwFormatFlags = FORMAT_MESSAGE_ALLOCATE_BUFFER | FORMAT_MESSAGE_IGNORE_INSERTS | FORMAT_MESSAGE_FROM_SYSTEM;

    // If dwLastError is in the WinHTTP range, load the message source.
    if(dwLastError >= 12000 && dwLastError < 13000)
	{
		if(gWinInetModule == NULL)
		{
			gWinInetModule = LoadLibraryEx(TEXT("wininet.dll"), NULL, LOAD_LIBRARY_AS_DATAFILE);
		}
        if(gWinInetModule != NULL)
		{
			dwFormatFlags |= FORMAT_MESSAGE_FROM_HMODULE;
		}
    }

    // Call FormatMessage() to allow to get message from the system or from the supplied module handle.
    if(dwBufferLength = FormatMessage
		(
			dwFormatFlags,
			gWinInetModule, // module to get message from (NULL == system)
			dwLastError,
			MAKELANGID(LANG_NEUTRAL, SUBLANG_DEFAULT), // default language
			(LPTSTR) &messageBuffer,
			0,
			NULL
        )
	)
    {
		// Display the error message and exit the process
		LPTSTR displayBuffer = (LPTSTR)LocalAlloc(LMEM_ZEROINIT, (lstrlen(messageBuffer)+lstrlen(errorMessage)+40)*sizeof(TCHAR));
		StringCchPrintf(displayBuffer, LocalSize(displayBuffer) / sizeof(TCHAR), TEXT("%s failed with error %d: %s"), 
			errorMessage, dwLastError, messageBuffer);

	    // Output message string on stderr.
		DWORD dwBytesWritten;
        WriteFile(GetStdHandle(STD_ERROR_HANDLE), displayBuffer, dwBufferLength, &dwBytesWritten, NULL);
		// Display Error Message Box
		MessageBox(NULL, displayBuffer, TEXT("Error"), MB_OK); 
        // Free the buffer allocated by the system.
        LocalFree(messageBuffer);
		LocalFree(displayBuffer);
    }
	return dwLastError;
}

VOID LogMessage(LPCTSTR message)
{
	if(gServiceError != INVALID_HANDLE_VALUE)
	{
		/**
		// Write Report Buffer to ASCII
		CHAR writeBuffer[8192] = "";
		size_t writeSize = 8192;
		size_t lineLength = 0;
		lineLength = wcstombs(writeBuffer, message, writeSize);
		*/
		// Write Report Buffer in Native Encoding
		size_t lineLength = 0;
		StringCbLength(message, STRSAFE_MAX_CCH * sizeof(TCHAR), &lineLength);
		LPVOID writeBuffer = (LPVOID)message;
		// Write Report Buffer to File
		DWORD bytesWritten = 0;
		WriteFile(gServiceError, writeBuffer, (DWORD)lineLength, &bytesWritten, NULL);
	}
	else
	{
		_putts(message);
	}

	return;
}

/** Find WaveMaker
 * Returns the WaveMaker\ directory path either by using the current working
 *    directory, the registry, or the environment (AGHOME or WMHOME).
 * Notes:
 * The returned buffer is allocated using malloc and should be released with free()
 */
LPTSTR FindWaveMakerPath()
{
	LPTSTR path = NULL;
	// First try current working directory
	path = _tgetcwd(NULL, 0);
	if(path == NULL)
	{
		// Error
		HandleSystemError(TEXT("Unable to read the current working directory."));
	}
	// Detect if the path has a terminating '\'
	INT length = lstrlen((LPCTSTR)path);
	if(path[length/sizeof(TCHAR)] != '\\')
	{
		INT tempLength = length + sizeof(TCHAR);
		LPTSTR temp = (LPTSTR)malloc(tempLength);
		if(temp == NULL)
		{
			// Insufficient Memory
			HandleError(TEXT("FindWaveMakerPath"), TEXT("Insufficient Memory to copy the current working directory"));
		}
		StringCchCat(temp, tempLength, path);
		StringCchCat(temp, tempLength, TEXT("\\"));
	}
	return path;
}

// Launch Tomcat
DWORD LaunchTomcatProcess(LPCTSTR tomcatRootPath)
{
	DWORD status = ERROR_SUCCESS;
	// Use SCM Interface
	status = StartTomcatService();

	// Launch via stand-alone process
	return status;
}

// Validate Tomcat
DWORD ValidateTomcatProcess(LPCTSTR url)
{
	LogMessage(WM_MSG_VALIDATECHECK);
	DWORD status = ERROR_SUCCESS;
	// Initialize Sockets
	HINTERNET session = InternetOpen(WAVEMAKER_AGENT_NAME, INTERNET_OPEN_TYPE_DIRECT, NULL, NULL, 0);
	if(session == NULL)
	{
		status = HandleSystemError(TEXT("Unable to initialize Windows Sockets."));
		return status;
	}
	// Poll Server
	TCHAR errorMessage[8192] = TEXT("");
	DWORD errorLength = 0;
	DWORD errorCode = 0;
	HINTERNET request = NULL;
	for(DWORD retryCount = VALIDATION_RETRY_COUNT - 1; retryCount != 0; retryCount--)
	{
		// Open URL
		request = InternetOpenUrl(session, url, NULL, 0, INTERNET_FLAG_RELOAD | INTERNET_FLAG_NO_UI | INTERNET_FLAG_PRAGMA_NOCACHE, NULL);
		if(request == NULL)
		{
			status = GetLastError();
			errorLength = sizeof(errorMessage) / sizeof(TCHAR);
			if(!InternetGetLastResponseInfo(&errorCode, errorMessage, &errorLength))
			{
				HandleSystemError(TEXT("Error retrieving error response information."));
			}
			switch(status)
			{
				case ERROR_INTERNET_ITEM_NOT_FOUND:				// 12028 - The requested item could not be located.
				case ERROR_INTERNET_CANNOT_CONNECT:				// 12029 - The attempt to connect to the server failed.
				case ERROR_INTERNET_REQUEST_PENDING:			// 12026 - The required operation could not be completed because one or more requests are pending.
				case ERROR_INTERNET_TIMEOUT:					// 12002 - The request has timed out.
				{
					break;
				}
				case ERROR_INTERNET_OUT_OF_HANDLES:				// 12001 - No more handles could be generated at this time.
				case ERROR_INTERNET_EXTENDED_ERROR:				// 12003 - An extended error was returned from the server. This is typically a string or buffer containing a verbose error message. Call InternetGetLastResponseInfo to retrieve the error text.
				case ERROR_INTERNET_INTERNAL_ERROR:				// 12004 - An internal error has occurred.
				case ERROR_INTERNET_INVALID_URL:				// 12005 - The URL is invalid.
				case ERROR_INTERNET_UNRECOGNIZED_SCHEME:		// 12006 - The URL scheme could not be recognized or is not supported.
				case ERROR_INTERNET_NAME_NOT_RESOLVED:			// 12007 - The server name could not be resolved.
				case ERROR_INTERNET_PROTOCOL_NOT_FOUND:			// 12008 - The requested protocol could not be located.
				case ERROR_INTERNET_INVALID_OPTION:				// 12009 - A request to InternetQueryOption or InternetSetOption specified an invalid option value.
				case ERROR_INTERNET_BAD_OPTION_LENGTH:			// 12010 - The length of an option supplied to InternetQueryOption or InternetSetOption is incorrect for the type of option specified.
				case ERROR_INTERNET_OPTION_NOT_SETTABLE:		// 12011 - The request option cannot be set, only queried.
				case ERROR_INTERNET_SHUTDOWN:					// 12012 - The Win32 Internet function support is being shut down or unloaded.
				case ERROR_INTERNET_INCORRECT_USER_NAME:		// 12013 - The request to connect and log on to an FTP server could not be completed because the supplied user name is incorrect.
				case ERROR_INTERNET_INCORRECT_PASSWORD:			// 12014 - The request to connect and log on to an FTP server could not be completed because the supplied password is incorrect.
				case ERROR_INTERNET_LOGIN_FAILURE:				// 12015 - The request to connect to and log on to an FTP server failed.
				case ERROR_INTERNET_INVALID_OPERATION:			// 12016 - The requested operation is invalid.
				case ERROR_INTERNET_OPERATION_CANCELLED:		// 12017 - The operation was canceled, usually because the handle on which the request was operating was closed before the operation completed.
				case ERROR_INTERNET_INCORRECT_HANDLE_TYPE:		// 12018 - The type of handle supplied is incorrect for this operation.
				case ERROR_INTERNET_INCORRECT_HANDLE_STATE:		// 12019 - The requested operation cannot be carried out because the handle supplied is not in the correct state.
				case ERROR_INTERNET_NOT_PROXY_REQUEST:			// 12020 - The request cannot be made via a proxy.
				case ERROR_INTERNET_REGISTRY_VALUE_NOT_FOUND:	// 12021 - A required registry value could not be located.
				case ERROR_INTERNET_BAD_REGISTRY_PARAMETER:		// 12022 - A required registry value was located but is an incorrect type or has an invalid value.
				case ERROR_INTERNET_NO_DIRECT_ACCESS:			// 12023 - Direct network access cannot be made at this time.
				case ERROR_INTERNET_NO_CONTEXT:					// 12024 - An asynchronous request could not be made because a zero context value was supplied.
				case ERROR_INTERNET_NO_CALLBACK:				// 12025 - An asynchronous request could not be made because a callback function has not been set.
				case ERROR_INTERNET_INCORRECT_FORMAT:			// 12027 - The format of the request is invalid.
				case ERROR_INTERNET_CONNECTION_ABORTED:			// 12030 - The connection with the server has been terminated.
				case ERROR_INTERNET_CONNECTION_RESET:			// 12031 - The connection with the server has been reset.
				case ERROR_INTERNET_FORCE_RETRY:				// 12032 - Calls for the Win32 Internet function to redo the request.
				case ERROR_INTERNET_INVALID_PROXY_REQUEST:		// 12033 - The request to the proxy was invalid.
				case ERROR_INTERNET_HANDLE_EXISTS:				// 12036 - The request failed because the handle already exists.
				case ERROR_INTERNET_SEC_CERT_DATE_INVALID:		// 12037 - SSL certificate date that was received from the server is bad. The certificate is expired.
				case ERROR_INTERNET_SEC_CERT_CN_INVALID:		// 12038 - SSL certificate common name (host name field) is incorrect. For example, if you entered www.server.com and the common name on the certificate says www.different.com.
				case ERROR_INTERNET_HTTP_TO_HTTPS_ON_REDIR:		// 12039 - The application is moving from a non-SSL to an SSL connection because of a redirect.
				case ERROR_INTERNET_HTTPS_TO_HTTP_ON_REDIR:		// 12040 - The application is moving from an SSL to an non-SSL connection because of a redirect.
				case ERROR_INTERNET_MIXED_SECURITY:				// 12041 - Indicates that the content is not entirely secure. Some of the content being viewed may have come from unsecured servers.
				case ERROR_INTERNET_CHG_POST_IS_NON_SECURE:		// 12042 - The application is posting and attempting to change multiple lines of text on a server that is not secure.
				case ERROR_INTERNET_POST_IS_NON_SECURE:			// 12043 - The application is posting data to a server that is not secure.
				case ERROR_FTP_TRANSFER_IN_PROGRESS:			// 12110 - The requested operation cannot be made on the FTP session handle because an operation is already in progress.
				case ERROR_FTP_DROPPED:							// 12111 - The FTP operation was not completed because the session was aborted.
				case ERROR_GOPHER_PROTOCOL_ERROR:				// 12130 - An error was detected while parsing data returned from the gopher server.
				case ERROR_GOPHER_NOT_FILE:						// 12131 - The request must be made for a file locator.
				case ERROR_GOPHER_DATA_ERROR:					// 12132 - An error was detected while receiving data from the gopher server.
				case ERROR_GOPHER_END_OF_DATA:					// 12133 - The end of the data has been reached.
				case ERROR_GOPHER_INVALID_LOCATOR:				// 12134 - The supplied locator is not valid.
				case ERROR_GOPHER_INCORRECT_LOCATOR_TYPE:		// 12135 - The type of the locator is not correct for this operation.
				case ERROR_GOPHER_NOT_GOPHER_PLUS:				// 12136 - The requested operation can only be made against a Gopher+ server or with a locator that specifies a Gopher+ operation.
				case ERROR_GOPHER_ATTRIBUTE_NOT_FOUND:			// 12137 - The requested attribute could not be located.
				case ERROR_GOPHER_UNKNOWN_LOCATOR:				// 12138 - The locator type is unknown.
				case ERROR_HTTP_HEADER_NOT_FOUND:				// 12150 - The requested header could not be located.
				case ERROR_HTTP_DOWNLEVEL_SERVER:				// 12151 - The server did not return any headers.
				case ERROR_HTTP_INVALID_SERVER_RESPONSE:		// 12152 - The server response could not be parsed.
				case ERROR_HTTP_INVALID_HEADER:					// 12153 - The supplied header is invalid.
				case ERROR_HTTP_INVALID_QUERY_REQUEST:			// 12154 - The request made to HttpQueryInfo is invalid.
				case ERROR_HTTP_HEADER_ALREADY_EXISTS:			// 12155 - The header could not be added because it already exists.
				case ERROR_HTTP_REDIRECT_FAILED:				// 12156 - The redirection failed because either the scheme changed (for example, HTTP to FTP) or all attempts made to redirect failed (default is five attempts).
				default:
				{
					status = HandleSystemError(TEXT("Unable to send HTTP request."));
					InternetCloseHandle(session);
					return status;
				}
			}
			// Validate Tomcat Service is still running
			status = StartTomcatService();
			if(status != ERROR_SUCCESS)
			{
				// Tomcat stopped.
				HandleSystemError(TEXT("Tomcat Service Failed; check the log files for details."));
				InternetCloseHandle(session);
				return status;
			}
			continue;
		}
		// Query Response Code
		DWORD responseCode;
		DWORD bufferSize = sizeof(responseCode);
		if(!HttpQueryInfo(request, HTTP_QUERY_STATUS_CODE | HTTP_QUERY_FLAG_NUMBER, &responseCode, &bufferSize, NULL))
		{
			HandleSystemError(TEXT("Unable to query HTTP result code."));
		}
		// Validate 200 Response
		if(responseCode == 200)
		{
			// App Loaded
			LogMessage(WM_MSG_VALIDATEREADY);
			status = ERROR_SUCCESS;
			break;
		}
		Sleep(VALIDATION_RETRY_SLEEP);
	}
	// Clean-up
	InternetCloseHandle(session);
	return status;
}

/*
// Validate Tomcat
DWORD ValidateTomcatProcess(URL_COMPONENTS &url)
{
	DWORD status = ERROR_SUCCESS;
	// Initialize Sockets
	HINTERNET session = InternetOpen(WAVEMAKER_AGENT_NAME, INTERNET_OPEN_TYPE_DIRECT, NULL, NULL, 0);
	if(session == NULL)
	{
		status = HandleSystemError(TEXT("Unable to initialize Windows Sockets."));
		return status;
	}
	// Open Socket
	HINTERNET socket = InternetConnect(session, url.lpszHostName, url.nPort, NULL, NULL, url.nScheme, 0, NULL);
	if(socket == NULL)
	{
		status = HandleSystemError(TEXT("Unable to create socket to server."));
		InternetCloseHandle(session);
		return status;
	}
	// Create HTTP Request
	HINTERNET request = HttpOpenRequest(socket, TEXT("GET"), url.lpszUrlPath, NULL, NULL, NULL, INTERNET_FLAG_RELOAD | INTERNET_FLAG_NO_UI | INTERNET_FLAG_PRAGMA_NOCACHE, NULL);
	if(request == NULL)
	{
		status = HandleSystemError(TEXT("Unable to create HTTP request."));
		InternetCloseHandle(socket);
		InternetCloseHandle(session);
		return status;
	}
	// Poll Server
	for(DWORD retryCount = VALIDATION_RETRY_COUNT - 1; retryCount != 0; retryCount--)
	{
		// Send HTTP Request
		if(!HttpSendRequest(request, NULL, NULL, NULL, NULL))
		{
			status = GetLastError();
			switch(status)
			{
				case 12002: // ERROR_WINHTTP_TIMEOUT: Server not ready.
					break;
				default:
				{
					status = HandleSystemError(TEXT("Unable to send HTTP request."));
					InternetCloseHandle(request);
					InternetCloseHandle(socket);
					InternetCloseHandle(session);
					return status;
				}
			}
			// Validate Tomcat Service is still running
			status = StartTomcatService();
			if(status != ERROR_SUCCESS)
			{
				// Tomcat stopped.
				HandleSystemError(TEXT("Tomcat Service Failed; check the log files for details."));
				return status;
			}
			continue;
		}
		// Query Response Code
		DWORD responseCode;
		DWORD bufferSize = sizeof(responseCode);
		if(!HttpQueryInfo(request, HTTP_QUERY_STATUS_CODE | HTTP_QUERY_FLAG_NUMBER, &responseCode, &bufferSize, NULL))
		{
			HandleSystemError(TEXT("Unable to query HTTP result code."));
		}
		// Validate 200 Response
		if(responseCode == 200)
		{
			// App Loaded
			break;
		}
		Sleep(VALIDATION_RETRY_SLEEP);
	}
	return status;
}
*/

// Launch PostGRES
// Validate PostGRES
// Launch Browser
DWORD LaunchBrowser(LPCTSTR url)
{
	DWORD status = ERROR_SUCCESS;
	// Use Default Browser
	LogMessage(WM_MSG_BROWSERSTART);
	HINSTANCE hBrowser = ShellExecute(NULL, TEXT("open"), url, NULL, NULL, SW_SHOWNORMAL);
	return status;
}

/** Start Tomcat Service
 */
DWORD StartTomcatService()
{
	LogMessage(WM_MSG_SERVICECHECK);
	DWORD status = ERROR_SUCCESS;
	// Get a handle to the service control manager.
	SC_HANDLE scm = OpenSCManager(
		NULL,					// local computer
		NULL,					// servicesActive database
		//GENERIC_READ			// Query access
		SC_MANAGER_ALL_ACCESS	// full access rights
	);
	if(scm == NULL)
	{
		_tprintf(TEXT("OpenSCManager failed (%d)\n"), GetLastError());
		status = HandleSystemError(TEXT("Unable to open Service Control Manager(SCM) handle."));
		return status;
	}

	// Get a handle to the service.
	SC_HANDLE service = OpenService(scm, TOMCAT_SERVICE_NAME, GENERIC_EXECUTE|GENERIC_READ);
	if(service == NULL)
	{ 
		_tprintf(TEXT("OpenService failed (%d)\n"), GetLastError());
		status = HandleSystemError(TEXT("Unable to open service handle."));
		CloseServiceHandle(scm);
		return status;
	}

	// Check the status in case the service is not stopped.
	SERVICE_STATUS_PROCESS serviceStatus;
	DWORD dwOldCheckPoint;
	DWORD dwStartTickCount;
	DWORD dwWaitTime;
	DWORD dwBytesNeeded;
	if (!QueryServiceStatusEx(
			service,						// handle to service 
			SC_STATUS_PROCESS_INFO,			// information level
			(LPBYTE) &serviceStatus,		// address of structure
			sizeof(SERVICE_STATUS_PROCESS),	// size of structure
			&dwBytesNeeded ) )				// size needed if buffer is too small
	{
		_tprintf(TEXT("QueryServiceStatusEx failed (%d)\n"), GetLastError());
		status = HandleSystemError(TEXT("Unable to read current service status."));
		CloseServiceHandle(service);
		CloseServiceHandle(scm);
		return status;
	}

	// Check if the service is already running.
	if(serviceStatus.dwCurrentState != SERVICE_STOPPED && serviceStatus.dwCurrentState != SERVICE_STOP_PENDING)
	{
		// Clean up
		CloseServiceHandle(service); 
		CloseServiceHandle(scm);
		return status; // Success
	}

	// Wait for the service to stop before attempting to start it.
	while (serviceStatus.dwCurrentState == SERVICE_STOP_PENDING)
	{
		// Save the tick count and initial checkpoint.
		dwStartTickCount = GetTickCount();
		dwOldCheckPoint = serviceStatus.dwCheckPoint;

		// Do not wait longer than the wait hint. A good interval is 
		// one-tenth of the wait hint but not less than 1 second  
		// and not more than 10 seconds. 
		dwWaitTime = serviceStatus.dwWaitHint / 10;
		if(dwWaitTime < 1000)
		{
			dwWaitTime = 1000;
		}
		else if(dwWaitTime > 10000)
		{
			dwWaitTime = 10000;
		}
		Sleep(dwWaitTime);
		// Check the status until the service is no longer stop pending.
		if(!QueryServiceStatusEx( 
				service,						// handle to service 
				SC_STATUS_PROCESS_INFO,			// information level
				(LPBYTE) &serviceStatus,		// address of structure
				sizeof(SERVICE_STATUS_PROCESS),	// size of structure
				&dwBytesNeeded ) )				// size needed if buffer is too small
		{
			_tprintf(TEXT("QueryServiceStatusEx failed (%d)\n"), GetLastError());
			status = HandleSystemError(TEXT("Unable to read current service status."));
			CloseServiceHandle(service); 
			CloseServiceHandle(scm);
			return status; 
		}
		if(serviceStatus.dwCheckPoint > dwOldCheckPoint)
		{
			// Continue to wait and check.
			dwStartTickCount = GetTickCount();
			dwOldCheckPoint = serviceStatus.dwCheckPoint;
		}
		else
		{
			if(GetTickCount()-dwStartTickCount > serviceStatus.dwWaitHint)
			{
				LogMessage(WM_MSG_SERVICETIMEOUT);
				status = ERROR_SERVICE_REQUEST_TIMEOUT;
				CloseServiceHandle(service); 
				CloseServiceHandle(scm);
				return status; 
			}
		}
	}

	// Attempt to start the service.
	if(!StartService(service, 0, NULL))
	{
		_tprintf(TEXT("StartService failed (%d)\n"), GetLastError());
		status = HandleSystemError(TEXT("Unable to start service."));
		CloseServiceHandle(service);
		CloseServiceHandle(scm);
		return status;
	}
	else
	{
		LogMessage(WM_MSG_SERVICESTART);
	}
	// Check the status until the service is no longer start pending.
	if(!QueryServiceStatusEx( 
			service,						// handle to service 
			SC_STATUS_PROCESS_INFO,			// info level
			(LPBYTE) &serviceStatus,		// address of structure
			sizeof(SERVICE_STATUS_PROCESS),	// size of structure
			&dwBytesNeeded ) )				// if buffer too small
	{
		_tprintf(TEXT("QueryServiceStatusEx failed (%d)\n"), GetLastError());
		status = HandleSystemError(TEXT("Unable to read current service status."));
		CloseServiceHandle(service);
		CloseServiceHandle(scm);
		return status;
	}

    // Save the tick count and initial checkpoint.
	dwStartTickCount = GetTickCount();
	dwOldCheckPoint = serviceStatus.dwCheckPoint;
	while(serviceStatus.dwCurrentState == SERVICE_START_PENDING) 
	{ 
		// Do not wait longer than the wait hint. A good interval is 
		// one-tenth the wait hint, but no less than 1 second and no 
		// more than 10 seconds.
		dwWaitTime = serviceStatus.dwWaitHint / 10;
		if(dwWaitTime < 1000)
		{
			dwWaitTime = 1000;
		}
		else if(dwWaitTime > 10000)
		{
			dwWaitTime = 10000;
		}
		Sleep(dwWaitTime);
		// Check the status again.
		if(!QueryServiceStatusEx( 
				service,						// handle to service 
				SC_STATUS_PROCESS_INFO,			// info level
				(LPBYTE) &serviceStatus,		// address of structure
				sizeof(SERVICE_STATUS_PROCESS),	// size of structure
				&dwBytesNeeded ) )				// if buffer too small
		{
			_tprintf(TEXT("QueryServiceStatusEx failed (%d)\n"), GetLastError());
			HandleSystemError(TEXT("Unable to read current service status."));
			break;
		}
		if(serviceStatus.dwCheckPoint > dwOldCheckPoint)
		{
			// Continue to wait and check.
			dwStartTickCount = GetTickCount();
			dwOldCheckPoint = serviceStatus.dwCheckPoint;
		}
		else
		{
			if(GetTickCount()-dwStartTickCount > serviceStatus.dwWaitHint)
			{
				// No progress made within the wait hint.
				break;
			}
		}
	}

	// Determine whether the service is running.
	if(serviceStatus.dwCurrentState == SERVICE_RUNNING)
	{
		LogMessage(WM_MSG_SERVICEREADY);
		status = ERROR_SUCCESS;
	}
	else
	{
		LogMessage(TEXT("\t\tService not started. \n"));
		_tprintf(TEXT("\t\t   Current State: %d\n"), serviceStatus.dwCurrentState);
		_tprintf(TEXT("\t\t   Exit Code: %d\n"), serviceStatus.dwWin32ExitCode);
		_tprintf(TEXT("\t\t   Check Point: %d\n"), serviceStatus.dwCheckPoint);
		_tprintf(TEXT("\t\t   Wait Hint: %d\n"), serviceStatus.dwWaitHint);
	}

	// Clean-up
	CloseServiceHandle(service);
	CloseServiceHandle(scm);

	return status;
}
