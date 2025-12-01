import { Platform, PermissionsAndroid, NativeModules } from 'react-native';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import TextRecognition, {
  TextRecognitionScript,
} from '@react-native-ml-kit/text-recognition';
import { Buffer } from 'buffer';
import { showToastable } from 'react-native-toastable';
const { OCRModule } = NativeModules;
const ALGORITHM = 'aes-256-cbc';
const SECRET_KEY = Buffer.from('12345678901234567890123456789012'); // 32 bytes for AES-256
export const IMAGE_BASE_URL =
  'https://d1q3b2dp06ua7r.cloudfront.net/development_gruner_dev_media/';
// export const IMAGE_BASE_URL =
//   'https://d1q3b2dp06ua7r.cloudfront.net/development_gruner_qa_media/';
export const requestMediaPermission = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'ios') {
      const camera = await request(PERMISSIONS.IOS.CAMERA);
      const photos = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
      return camera === RESULTS.GRANTED && photos === RESULTS.GRANTED;
    } else if (Platform.OS === 'android') {
      const camera = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );

      const gallery =
        Platform.Version >= 33
          ? await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
            )
          : await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            );

      return (
        camera === PermissionsAndroid.RESULTS.GRANTED &&
        gallery === PermissionsAndroid.RESULTS.GRANTED
      );
    } else {
      return false;
    }
  } catch (error) {
    console.error('Permission error:', error);
    return false;
  }
};

// OCR recognition function
// export const recognizeText = async (imageUri: string) => {

//     try {
//         const cleanUri = imageUri.replace('file://', '');
//         let text = "";
//         if (Platform.OS === "android") {
//              try {
//               let  resultAndroid  = await TextRecognition.recognize("file://"+cleanUri);
//               text = resultAndroid.text
//                 //console.log(text);
//             } catch (e) {
//                 console.error('Text recognition failed:', e);
//                 return [];
//             }
//         } else {
//             text = await OCRModule.recognizeText(cleanUri);
//         }
//         return text;
//     } catch (error) {
//         //console.log('OCR Error:', error);
//         throw error;
//     }
// };

export const extractCardDetails = async (
  cardType: string,
  imageUri: string,
  cardPart: string,
) => {
  try {
    const cleanUri = imageUri.replace('file://', '');
    let text = '';

    if (Platform.OS === 'android') {
      try {
        const resultAndroid = await TextRecognition.recognize(
          'file://' + cleanUri,
        );

        //   TextRecognition.recognizeText('file://' + cleanUri)
        // .then((text: TextRecognitionResult) => {
        //   //console.log("Recognized text:xxxxxx", text);
        // })
        // .catch((err: Error) => {
        //   console.error("Recognition error:", err);
        // });

        text = resultAndroid.text;
        for (let block of resultAndroid.blocks) {
          //console.log('Block text:', block.text);
          //console.log('Block frame:', block.frame);

          for (let line of block.lines) {
            //console.log('Line text:', line.text);
            //console.log('Line frame:', line.frame);
          }
        }
      } catch (e) {
        console.error('Text recognition failed:', e);
        showToastable({
          message: 'Text recognition failed. Please try again.',
          status: 'danger',
        });
        return [];
      }
    } else {
      text = await OCRModule.recognizeText(cleanUri);
      if (text === '101') {
        showToastable({
          message: 'Could not read details. Please enter manually.',
          status: 'danger',
        });
        return [];
      }
    }
    //console.log('text======================', text);

    const normalizedText = text
      .replace(/\n/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .toUpperCase();
    const normalizedType = cardType.toLowerCase();
    let extracted: any = {};

    switch (normalizedType) {
      // -----------------------------------------------------
      // 🗳️ VOTER ID (All India)
      // -----------------------------------------------------
      case 'voter id':
        const cleanText = text
          .replace(/\n/g, ' ')
          .replace(/\s{2,}/g, ' ')
          .replace(/[^A-Z0-9 ,.\-\/:]/gi, '')
          .toUpperCase();

        const rawName =
          cleanText.match(/NAME\s*[:\-]?\s*([A-Z ]{2,})/)?.[1]?.trim() || null;
        const name = rawName ? rawName.split(' ').slice(0, 2).join(' ') : null;
        const genderMatch = cleanText.match(/\b(MALE|FEMALE|M|F)\b/i);
        const gender = genderMatch
          ? genderMatch[0].toUpperCase() === 'M'
            ? 'Male'
            : genderMatch[0].toUpperCase() === 'F'
              ? 'Female'
              : genderMatch[0].charAt(0) + genderMatch[0].slice(1).toLowerCase()
          : null;
        extracted = {
          cardType: 'Voter ID',
          idNumber:
            cleanText.match(
              /\b[A-Z]{3}[0-9]{7}\b|\b[A-Z]{2}[0-9]{8}[A-Z]?\b/g,
            )?.[0] || null,
          name: name,
          fatherName:
            cleanText.match(/FATHER\s*[:\-]?\s*([A-Z ]{2,})/)?.[1]?.trim() ||
            null,
          birthDate:
            cleanText.match(/\d{2}[\/\-\.]\d{2}[\/\-\.]\d{4}/)?.[0] || null,
          address:
            cleanText
              .match(/ADDRESS\s*[:\-]?\s*([A-Z0-9 ,\-\/]+)/)?.[1]
              ?.trim() || null,
          pincode: cleanText.match(/\b\d{6}\b/)?.[0] || null,
          gender: gender,
        };
        break;

      // -----------------------------------------------------
      // 🧾 RATION CARD (All India)
      // -----------------------------------------------------
      case 'ration card': {
        // Most ration cards are 12 digits, some states vary but 12-digit pattern works generally
        const idNumber = normalizedText.match(/\b\d{12}\b/)?.[0] || null;

        const nameMatch =
          normalizedText.match(/NAME[:\-]?\s*([A-Z ]{3,})/)?.[1]?.trim() ||
          null;

        const fatherMatch =
          normalizedText.match(/FATHER[:\-]?\s*([A-Z ]{3,})/)?.[1]?.trim() ||
          null;

        const addressMatch =
          normalizedText
            .match(/ADDRESS[:\-]?\s*([A-Z0-9 ,\-\/]+)/)?.[1]
            ?.trim() || null;

        const cityMatch =
          normalizedText.match(/DISTRICT[:\-]?\s*([A-Z ]{3,})/)?.[1]?.trim() ||
          null;

        const pincodeMatch = normalizedText.match(/\b\d{6}\b/)?.[0] || null;

        extracted = {
          cardType: 'Ration Card',
          idNumber,
          name: nameMatch,
          fatherName: fatherMatch,
          address: addressMatch,
          city: cityMatch,
          pincode: pincodeMatch,
        };
        break;
      }

      // -----------------------------------------------------
      // 👨‍🌾 KISAN / FARMER CARD (All India)
      // -----------------------------------------------------
      case 'kisan card': {
        // Farmer ID can be numeric or alphanumeric
        const idNumber =
          normalizedText.match(/\b\d{8,15}\b/)?.[0] || // purely numeric IDs (8–15 digits)
          normalizedText.match(/\b(KISAN|FARMER)[A-Z0-9]{3,}\b/)?.[0] ||
          null;

        const nameMatch =
          normalizedText.match(/NAME[:\-]?\s*([A-Z ]{3,})/)?.[1]?.trim() ||
          null;

        const fatherMatch =
          normalizedText.match(/FATHER[:\-]?\s*([A-Z ]{3,})/)?.[1]?.trim() ||
          null;

        const birthDateMatch =
          normalizedText.match(/\d{2}[\/\-\.]\d{2}[\/\-\.]\d{4}/)?.[0] || null;

        const genderMatch = normalizedText.match(/\b(MALE|FEMALE|M|F)\b/i);
        const gender = genderMatch
          ? genderMatch[0].toUpperCase() === 'M'
            ? 'Male'
            : genderMatch[0].toUpperCase() === 'F'
              ? 'Female'
              : genderMatch[0].charAt(0) + genderMatch[0].slice(1).toLowerCase()
          : null;

        const addressMatch =
          normalizedText
            .match(/ADDRESS[:\-]?\s*([A-Z0-9 ,\-\/]+)/)?.[1]
            ?.trim() || null;

        const pincodeMatch = normalizedText.match(/\b\d{6}\b/)?.[0] || null;

        extracted = {
          cardType: 'Farmer Card',
          idNumber,
          name: nameMatch,
          fatherName: fatherMatch,
          birthDate: birthDateMatch,
          gender,
          address: addressMatch,
          pincode: pincodeMatch,
        };
        break;
      }

      // -----------------------------------------------------
      // 🚗 DRIVING LICENCE (All India)
      // -----------------------------------------------------
      case 'driver license': {
        const normalizedText = text
          .replace(/\n/g, ' ')
          .replace(/\s{2,}/g, ' ')
          .replace(/[|]/g, ' ')
          .toUpperCase();

        // ✅ 1. Driving Licence Number (handles DL NO, DLN, MH03, MHO3, etc.)
        const dlNumberMatch = normalizedText.match(
          /\b(?:DL\s*NO[:\-]?\s*)?([A-Z]{2,3}[0O]\d{1,2}\s?\d{4,11})\b/,
        );
        const idNumber = dlNumberMatch
          ? dlNumberMatch[1].replace(/[O]/g, '0').replace(/\s+/g, '')
          : null;

        // ✅ 2. Name (handles NAME BABU KHAN / NAME: BABU KHAN / NAME- BABU KHAN)
        const nameMatch =
          normalizedText
            .match(
              /NAME[:\-]?\s*([A-Z ]{3,})(?=\s*(DATE OF BIRTH|DOB|BERTH|SON|DAUGHTER|WIFE|S\/?O|D\/?O|W\/?O|SOW|DOW|WOW))/,
            )?.[1]
            ?.trim() ||
          // fallback: if next words look like a name
          normalizedText
            .match(/NAME[:\-]?\s*([A-Z]{2,}\s+[A-Z]{2,})/)?.[1]
            ?.trim() ||
          null;

        // ✅ 3. Father / Husband Name (handles “S/O”, “SOW”, “SON OF”, etc.)
        const fatherMatch =
          normalizedText
            .match(
              /(?:S\/?O|D\/?O|W\/?O|SOW|DOW|WOW|SON OF|DAUGHTER OF|WIFE OF)[:\-]?\s*([A-Z ]{3,})(?=\s*(DOB|DATE|ADDRESS|VALIDITY|BLOOD|$))/,
            )?.[1]
            ?.trim() || null;

        // ✅ 4. Date of Birth
        const birthDateMatch =
          normalizedText.match(
            /(?:DOB|DATE OF BIRTH|BERTH)[:\-]?\s*(\d{1,2}[-\/\.]\d{1,2}[-\/\.]\d{2,4})/,
          )?.[1] || null;

        // ✅ 5. Address (between ADDRESS and next section)
        const addressMatch =
          normalizedText
            .match(
              /ADDRESS[:\-]?\s*([A-Z0-9 ,.\-\/]+?)(?=\s*(DATE|VALIDITY|ISSUE|BLOOD|PIN|$))/,
            )?.[1]
            ?.trim() ||
          // fallback: capture line after name if it looks like address
          normalizedText
            .match(
              /(?:S\/?O|D\/?O|W\/?O|SOW|DOW|WOW|SON OF|DAUGHTER OF|WIFE OF)\s*[A-Z ]+\s*([A-Z0-9 ,.\-\/]{10,})(?=\s*(DOB|DATE|BLOOD|$))/,
            )?.[1]
            ?.trim() ||
          null;

        // ✅ 6. Pincode
        const pincodeMatch = normalizedText.match(/\b\d{6}\b/)?.[0] || null;

        extracted = {
          cardType: 'Driving Licence',
          idNumber,
          name: nameMatch,
          fatherName: fatherMatch,
          birthDate: birthDateMatch,
          address: addressMatch,
          pincode: pincodeMatch,
        };

        break;
      }

      // -----------------------------------------------------
      // ❌ DEFAULT
      // -----------------------------------------------------
      default:
        extracted = {
          error:
            'Invalid card type. Use voter | ration | kisan | driver license',
        };
        break;
    }

    //console.log('Extracted Details:', extracted);
    return extracted;
  } catch (err: any) {
    console.error('OCR Error:', err);
    showToastable({
      message: 'OCR failed. Please try again.',
      status: 'danger',
    });
    return {};
  }
};
