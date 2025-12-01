#import "OCRModule.h"
#import <React/RCTLog.h>
#import <Vision/Vision.h>
#import <UIKit/UIKit.h>

@implementation OCRModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(recognizeText:(NSString *)imageUri
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    // Remove file:// prefix if present
    NSString *filePath = [imageUri stringByReplacingOccurrencesOfString:@"file://" withString:@""];
    
    // Create UIImage from file path
    UIImage *image = [UIImage imageWithContentsOfFile:filePath];
    
    if (!image) {
        reject(@"NO_IMAGE", @"Could not load image from path", nil);
        return;
    }
    
    // Convert UIImage to CGImage
    CGImageRef cgImage = image.CGImage;
    
    // Create text recognition request
    VNRecognizeTextRequest *request = [[VNRecognizeTextRequest alloc] initWithCompletionHandler:^(VNRequest * _Nonnull request, NSError * _Nullable error) {
        if (error) {
            reject(@"OCR_ERROR", error.localizedDescription, error);
            return;
        }
        
        NSArray<VNRecognizedTextObservation *> *observations = request.results;
        NSMutableString *recognizedText = [NSMutableString string];
        
        for (VNRecognizedTextObservation *observation in observations) {
            VNRecognizedText *topCandidate = [observation topCandidates:1].firstObject;
            if (topCandidate) {
                [recognizedText appendString:topCandidate.string];
                [recognizedText appendString:@"\n"];
            }
        }
        
        resolve(recognizedText.length > 0 ? recognizedText : @"101");
    }];
    
    // Configure request
    request.recognitionLevel = VNRequestTextRecognitionLevelAccurate;
    request.usesLanguageCorrection = YES;
    
    // Create request handler
    VNImageRequestHandler *handler = [[VNImageRequestHandler alloc] initWithCGImage:cgImage options:@{}];
    
    // Perform request on background thread
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        NSError *error;
        [handler performRequests:@[request] error:&error];
        
        if (error) {
            reject(@"PERFORM_ERROR", error.localizedDescription, error);
        }
    });
}

@end
