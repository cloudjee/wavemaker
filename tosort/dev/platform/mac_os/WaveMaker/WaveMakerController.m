#import "WaveMakerController.h"

@implementation WaveMakerController

- (void)awakeFromNib {
	[myLaunchWindow orderOut:self];
}

- (IBAction)startServer:(id)sender{
	[myOutlet1 startAnimation:sender];
	[myLaunchWindow orderFront:sender];
	
	/*
	 //local settings for matt testing
	 NSString *launchPath = @"/Users/mmcnulty/ActiveGrid/tomcat/apache-tomcat-5.5.23/bin/startup.sh";
	 NSString *tomcatLogPath = @"/Users/mmcnulty/ActiveGrid/tomcat/apache-tomcat-5.5.23/logs/catalina.out";
	 NSString *catalinaHomePath = @"/Users/mmcnulty/ActiveGrid/tomcat/apache-tomcat-5.5.23";
	 NSString *studioURL = @"http://localhost:8080/studio/static/turbo09/studio/";
	 */
	
	//actual build settings - change shutdown path below as well!!
	NSString *launchPath = @"/Applications/WaveMaker.app/bin/wavemaker.sh";
	NSString *tomcatLogDirPath = @"/Applications/WaveMaker.app/tomcat/logs";
	NSString *tomcatLogPath = @"/Applications/WaveMaker.app/tomcat/logs/catalina.out";
	NSString *catalinaHomePath = @"/Applications/WaveMaker.app/tomcat";
	NSString *studioURL = @"http://localhost:8094/wavemaker/";
	
	
	NSString *wrongLocMsg = @"This beta requires that the application be located at ‘/Applications/WaveMaker.app’. Please move the WaveMaker application to the /Applications directory and try again.";
	NSString *logNotWriteableMsg = @"WaveMaker is unable to write to the ‘/Applications/WaveMaker.app/tomcat/logs/Catalina.out’ file. Please delete the file and/or verify the permissions on the file and try again.";
	NSString *unableToExecuteMsg = @"WaveMaker is unable to execute the file ‘/Applications/WaveMaker.app/bin/wavemaker.sh’. Please verify the permissions on the file and try again.";
	
	NSFileManager *myFileManager = [NSFileManager defaultManager];
	
	Boolean isInstalledCorrectLoc = false;
	Boolean isLogFileWriteable = false;
	Boolean isStartupExecutable = false;
	
	if ([myFileManager fileExistsAtPath: launchPath]) isInstalledCorrectLoc = true;
	if ([myFileManager isWritableFileAtPath: tomcatLogDirPath])
	{
		if([myFileManager fileExistsAtPath: tomcatLogPath])
		{
			if ([myFileManager isWritableFileAtPath: tomcatLogPath]) isLogFileWriteable = true;
		}
		else
		{
			isLogFileWriteable = true;
		}
	}
	
	if ([myFileManager isExecutableFileAtPath: launchPath])  isStartupExecutable = true;
	
	if (isInstalledCorrectLoc && isLogFileWriteable && isStartupExecutable) {
		
		NSArray *keys = [NSArray arrayWithObjects:@"CATALINA_HOME", nil];
		NSArray *objects = [NSArray arrayWithObjects: catalinaHomePath, nil];
		NSDictionary *dictionary = [NSDictionary dictionaryWithObjects:objects forKeys:keys];
		NSTask *setEnv;
		setEnv = [[NSTask alloc] init];
		[setEnv setEnvironment:dictionary];
		[setEnv release];
		
		NSTask *startWM;
		startWM = [[NSTask alloc] init];
		[startWM setLaunchPath: launchPath];
		NSString *startCommand = @"start";
		[startWM setArguments:
		 [NSArray arrayWithObject: startCommand]];
		[startWM launch];
		[startWM release];
		// Sleep for Tomcat Initialization
		NSTimeInterval sleepTime = 5.00;
		[NSThread sleepForTimeInterval: sleepTime];
		
		// Launch Browser
		NSTask *launchBrowser;
		launchBrowser = [[NSTask alloc] init];
		[launchBrowser setLaunchPath:@"/usr/bin/open"];
		[launchBrowser setArguments:
		 [NSArray arrayWithObject: studioURL]];
		[launchBrowser launch]; 
		[launchBrowser release];
	} else {
		//something screwy happened
		if ([myLaunchWindow isVisible])
			[myLaunchWindow orderOut:sender];
		[myOutlet1 stopAnimation:sender];
		if (!isInstalledCorrectLoc) [errorLabel setStringValue: wrongLocMsg];
		else if (!isLogFileWriteable) [errorLabel setStringValue: logNotWriteableMsg];
		else if (!isStartupExecutable)  [errorLabel setStringValue: unableToExecuteMsg];
		else  [errorLabel setStringValue: @"Unknown error. Please report the issue on our forums at dev.wavemaker.com"];
	}
	if ([myLaunchWindow isVisible])
		[myLaunchWindow orderOut:sender];
	[myOutlet1 stopAnimation:sender];
}

- (IBAction)stopServer:(id)sender {
	//NSString *shutdownPath = @"/Users/mmcnulty/ActiveGrid/tomcat/apache-tomcat-5.5.23/bin/shutdown.sh";
	NSString *shutdownPath = @"/Applications/WaveMaker.app/bin/wavemaker.sh";
	NSTask *stopWM;
	stopWM = [[NSTask alloc] init];
	[stopWM setLaunchPath:shutdownPath];
	NSString *stopCommand = @"stop";
	[stopWM setArguments:
	 [NSArray arrayWithObject: stopCommand]];
	[stopWM launch];
	[stopWM release];
}

- (IBAction)openBrowser:(id)sender {
	
}

- (IBAction)openHelp:(id)sender {
	NSString *helpURL = @"http://www.wavemaker.com/usg22026.html";
	//Launch Browser
	NSTask *launchBrowser;
	launchBrowser = [[NSTask alloc] init];
	[launchBrowser setLaunchPath:@"/usr/bin/open"];
	[launchBrowser setArguments:
	 [NSArray arrayWithObject: helpURL]];
	[launchBrowser launch]; 
	[launchBrowser release];
	
}

- (IBAction)testAnimate:(id)sender {
	//[piOutlet startAnimation];
}

-(void)wait:(double)seconds
{
    NSTimeInterval theInterval = 0;
    NSDate *date = [NSDate date];
	
    while (theInterval <= seconds)
    {
        theInterval = [[NSDate date] timeIntervalSinceDate:date];
    }
}


@end
