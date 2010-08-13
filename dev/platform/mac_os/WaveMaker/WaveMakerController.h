#import <Cocoa/Cocoa.h>

@interface WaveMakerController : NSObject {
    IBOutlet NSProgressIndicator *myOutlet1;
	IBOutlet NSProgressIndicator *piOutlet;
	IBOutlet id myLabel;
	IBOutlet id myLaunchWindow;
	IBOutlet NSTextField *errorLabel;
}

- (IBAction)startServer:(id)sender;
- (IBAction)stopServer:(id)sender;
- (IBAction)openBrowser:(id)sender;
- (IBAction)openHelp:(id)sender;
- (IBAction)testAnimate:(id)sender;

@end
