import { addmachinaryDetails } from './../redux/slices/authSlice';
import { store } from './../redux/store';
import { Double } from 'react-native/Libraries/Types/CodegenTypes';
import apiClient from './apiClient';
import { endpoints } from '../utils/endpoints';
import { Buffer } from 'buffer'; // Available in React Native via polyfill

export interface SendOtpPayload {
  phoneNumber: string;
  role: string;
  type: string;
}
export interface SendOtpResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
  };
}

export interface OtpVerifiedResponse {
  statusCode: number;
  success: boolean;
  message: string;
}
export interface VerifyOtpPayload {
  otp: string;
}

export interface RegisterUsernamePayload {
  username: string;
  password: string;
  latitude: Double;
  longitude: Double;
}
export interface ResetPassword {
  newPassword: string;
}
export interface RegisterUserNameResponse {
  statusCode: number;
  message: string;
  data: {
    user: {
      id: string;
    };
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

export interface LoginWithCredentialsPayload {
  role: string;
  username: string;
  password: string;
}
export interface LoginWithCredentialsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
    };
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

export interface SendOtpLoginPayload {
  phoneNumber: string;
  role: string;
}
export interface Step1FarmerProfilePayload {
  step: string;
  supervisorStaffId: string;
  documentType: string;
  encryptedDocumentNumber: string;
  fullName: string;
  gender: string;
  dob: string;
}

export interface SendOtpLoginResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
  };
}

export interface LandListResponse {
  statusCode: number;
  message: string;
  data: {
    lands: {
      landId: string;
      totalCrops: number;
      landType: string;
      area: number;
      areaUnit: string;
      landName: string;
      landCode: string;
    }[];
    totalEntries: number;
    totalOwnedLand: number;
    totalLeasedLand: number;
    unit: string;
    pagination: {
      page: number;
      limit: number;
      totalPages: number;
      totalCount: number;
    };
  };
}
export interface FarmerDetailsResponse {
  statusCode: number;
  message: string;
  data: {
    id: string;
    name: string;
    phoneNumber: string;
    profilePhotoUrl: string;
    memberId: string;
    gender: string;
    profileCompletionPercentage: number;
    kisaniDidi: {
      name: string;
      phoneNumber: string;
    };
    kycDocuments: {
      id: string;
      documentType: string;
      documentNumber: string;
    }[];
  };
}
export interface ProfileSetupStep1Response {
  statusCode: number;
  success: boolean;
  message: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
  };
}
export interface userNameExist {
  username: string;
  role: string;
}
export interface UserNameExistResponse {
  statusCode: number;
  message: string;
  data: {};
}
export interface LanguageResponse {
  statusCode: number;
  message: string;
  data: {};
}
export interface KisaniDidiResponse {
  statusCode: number;
  message: string;
  data: any[];
}

export interface ResetPasswordResponse {
  statusCode: number;
  message: string;
  data: {};
}

export interface ProfileSetup1Response {
  statusCode: number;
  message: string;
  data: {};
}

export interface Step1AddLandsPayload {
  step: string;
  landName: string;
  landType: string;
  area: string;
  areaUnit: string;
}

export interface UpdateMachineryPayload {
  machineryData: any[]; // Adjust this interface based on actual payload structure
}

export interface UpdateMachineryResponse {
  statusCode: number;
  message: string;
  data: {}; // Adjust this interface based on actual response structure
}

export interface DeleteMachineryResponse {
  statusCode: number;
  message: string;
  data: {};
}

export interface DeleteLivestockResponse {
  statusCode: number;
  message: string;
  data: {};
}

export interface ViewProfileData {
  name: string;
  phoneNumber: string;
  alternateMobile: string;
  email: string;
  gender: string;
  dob: string;
  profilePhotoUrl: string;
  guardianName: string;
  education: string;
  supervisorStaffId: string;
  pincode: string;
  village: string;
  mandalId: string;
  districtId: string;
  stateId: string;
}

export interface ViewProfileResponse {
  statusCode: number;
  message: string;
  data: {};
}

export interface FamilyMembersResponse {
  statusCode: number;
  message: string;
  data: {
    adults: number;
    children: number;
  };
}

export interface UpdateFamilyMembersPayload {
  adults: number;
  children: number;
}

export interface UpdateFarmerProfilePayload {
  fullName: string;
  gender: string;
  dob: string;
  profilePhotoUrl?: any; // File type for form-data
}

const authService = {
  sendOtpSignup: (
    payload: SendOtpPayload,
    customHeaders?: Record<string, string>,
  ): Promise<SendOtpResponse> => {
    return apiClient.post2<SendOtpResponse>(
      endpoints.auth.sendOtpSignup,
      payload,
      { headers: customHeaders },
    );
  },

  // OtpVerify: (payload: VerifyOtpPayload): Promise<OtpVerifiedResponse> => {
  //   return apiClient.post2<OtpVerifiedResponse>(
  //     endpoints.auth.verifyOtp,
  //     payload,
  //   );
  // },

  OtpVerify: (
    payload: VerifyOtpPayload,
    customHeaders?: Record<string, string>, // 👈 add this optional param
  ): Promise<OtpVerifiedResponse> => {
    return apiClient.post2<OtpVerifiedResponse>(
      endpoints.auth.verifyOtp,
      payload,
      { headers: customHeaders }, // 👈 pass here
    );
  },
  RegisterUserName: (
    payload: RegisterUsernamePayload,
    customHeaders?: Record<string, string>, // 👈 add this optional param
  ): Promise<RegisterUserNameResponse> => {
    return apiClient.post2<RegisterUserNameResponse>(
      endpoints.auth.signup,
      payload,
      { headers: customHeaders }, // 👈 pass here
    );
  },
  checkuserNameExist: (
    payload: userNameExist,
    customHeaders?: Record<string, string>, // 👈 add this optional param
  ): Promise<UserNameExistResponse> => {
    return apiClient.post2<UserNameExistResponse>(
      endpoints.auth.userExistCheck,
      payload,
      { headers: customHeaders }, // 👈 pass here
    );
  },

  loginWithCredentials: (
    payload: LoginWithCredentialsPayload,
    customHeaders?: Record<string, string>, // 👈 add this optional param
  ): Promise<LoginWithCredentialsResponse> => {
    return apiClient.post2<LoginWithCredentialsResponse>(
      endpoints.auth.loginWithCredentials,
      payload,
      { headers: customHeaders }, // 👈 pass here
    );
  },

  sendOtpLogin: (
    payload: SendOtpLoginPayload,
    customHeaders?: Record<string, string>,
  ): Promise<SendOtpLoginResponse> => {
    return apiClient.post2<SendOtpLoginResponse>(
      endpoints.auth.sendOtpLogin,
      payload,
      { headers: customHeaders },
    );
  },

  refreshToken: (
    refreshToken: string,
    customHeaders?: Record<string, string>,
  ): Promise<{ accessToken: string; refreshToken: string }> => {
    return apiClient.post2(
      endpoints.auth.refreshToken,
      { refreshToken },
      { headers: customHeaders },
    );
  },
  getSupportedLanguages: (
    payload: {},
    customHeaders?: Record<string, string>,
  ): Promise<LanguageResponse> => {
    return apiClient.get2<LanguageResponse>(
      endpoints.auth.languages,
      {
        headers: {
          ...customHeaders,
        },
      },
      payload,
    );
  },
  resetPasswordUser: (
    payload: ResetPassword,
    customHeaders?: Record<string, string>, // 👈 add this optional param
  ): Promise<ResetPasswordResponse> => {
    return apiClient.post2<ResetPasswordResponse>(
      endpoints.auth.resetPassword,
      payload,
      { headers: customHeaders }, // 👈 pass here
    );
  },
  getKisaniDidi: (
    payload: { page: number; limit: number },
    customHeaders?: Record<string, string>,
  ): Promise<KisaniDidiResponse> => {
    return apiClient.get2<KisaniDidiResponse>(
      `${endpoints.user.kisaniDidiList}?page=${payload.page}&limit=${payload.limit}`,
      { headers: { ...customHeaders } },
    );
  },

  step1FarmerProfile: (
    payload: Step1FarmerProfilePayload,
    customHeaders?: Record<string, string>, // 👈 add this optional param
  ): Promise<ProfileSetup1Response> => {
    return apiClient.post2<ProfileSetup1Response>(
      endpoints.user.kisanProfileSetupStep1,
      payload,
      { headers: customHeaders }, // 👈 pass here
    );
  },

  getLocationList: (
    payload: {
      page: number;
      limit: number;
      type: string;
      parentId?: string;
      name?: string;
    },
    customHeaders?: Record<string, string>,
  ): Promise<KisaniDidiResponse> => {
    const { page, limit, type, parentId, name } = payload;

    // Build base URL
    let url = `${endpoints.user.locations}?page=${page}&limit=${limit}&type=${type}`;

    // Add parentId only if it exists
    if (parentId) {
      url += `&parentId=${parentId}`;
    }

    if (name) {
      url += `&name=${name}`;
    }

    return apiClient.get2<KisaniDidiResponse>(url, {
      headers: { ...customHeaders },
    });
  },

  getFarmerDetails: (
    customHeaders?: Record<string, string>,
  ): Promise<FarmerDetailsResponse> => {
    return apiClient.get2<FarmerDetailsResponse>(endpoints.user.farmerDetails, {
      headers: customHeaders,
    });
  },

  getLandList: (
    payload: { page: number; limit: number },
    customHeaders?: Record<string, string>,
  ): Promise<LandListResponse> => {
    const { page, limit } = payload;
    return apiClient.get2<LandListResponse>(
      `${endpoints.user.landList}?page=${page}&limit=${limit}`,
      { headers: customHeaders },
    );
  },

  addLand: (
    payload: Step1AddLandsPayload,
    customHeaders?: Record<string, string>, // 👈 add this optional param
  ): Promise<ProfileSetup1Response> => {
    return apiClient.post2<ProfileSetup1Response>(
      endpoints.user.addLand,
      payload,
      { headers: customHeaders }, // 👈 pass here
    );
  },

  addMachinary: (
    payload: {},
    customHeaders?: Record<string, string>, // 👈 add this optional param
  ): Promise<ProfileSetup1Response> => {
    return apiClient.post2<ProfileSetup1Response>(
      endpoints.user.machinaryAdd,
      payload,
      { headers: customHeaders }, // 👈 pass here
    );
  },

  getCropTypeList: (
    payload: { page: number; limit: number; type: string; parentId?: string },
    customHeaders?: Record<string, string>,
  ): Promise<KisaniDidiResponse> => {
    const { page, limit, type, parentId } = payload;

    // Build base URL
    let url = `${endpoints.user.cropType}?page=${page}&limit=${limit}`;

    // Add parentId only if it exists
    if (parentId) {
      url += `&parentId=${parentId}`;
    }

    return apiClient.get2<KisaniDidiResponse>(url, {
      headers: { ...customHeaders },
    });
  },

  getLandCropList: (
    payload: { page: number; limit: number; landId: string },
    customHeaders?: Record<string, string>,
  ): Promise<KisaniDidiResponse> => {
    const { page, limit, landId } = payload;

    // Build base URL
    let url = `${endpoints.user.cropList}${landId}?page=${page}&limit=${limit}`;

    return apiClient.get2<KisaniDidiResponse>(url, {
      headers: { ...customHeaders },
    });
  },
  getCropTypeVarietyList: (
    payload: {
      page: number;
      limit: number;
      type: string;
      parentId?: string;
      cropTypeId?: string;
    },
    customHeaders?: Record<string, string>,
  ): Promise<KisaniDidiResponse> => {
    const { page, limit, type, parentId, cropTypeId } = payload;

    // Build base URL
    let url = `${endpoints.user.cropTypeVariety}?page=${page}&limit=${limit}&cropTypeId=${cropTypeId}`;

    // Add parentId only if it exists
    if (parentId) {
      url += `&parentId=${parentId}`;
    }

    return apiClient.get2<KisaniDidiResponse>(url, {
      headers: { ...customHeaders },
    });
  },

  getCropTypeVarietySeedList: (
    payload: {
      page: number;
      limit: number;
      type: string;
      parentId?: string;
      cropTypeId?: string;
      cropVarietyId?: string;
    },
    customHeaders?: Record<string, string>,
  ): Promise<KisaniDidiResponse> => {
    const { page, limit, type, parentId, cropTypeId, cropVarietyId } = payload;
    //console.log();

    // Build base URL
    let url = `${endpoints.user.cropTypeVarietySeed}?page=${page}&limit=${limit}&cropTypeId=${cropTypeId}&cropVarietyId=${cropVarietyId}`;

    // Add parentId only if it exists
    if (parentId) {
      url += `&parentId=${parentId}`;
    }
    //console.log('url==== ', url);

    return apiClient.get2<KisaniDidiResponse>(url, {
      headers: { ...customHeaders },
    });
  },

  addCropStep3: (
    payload: Step1AddLandsPayload,
    customHeaders?: Record<string, string>, // 👈 add this optional param
  ): Promise<ProfileSetup1Response> => {
    return apiClient.post2<ProfileSetup1Response>(
      endpoints.user.addCropStep3,
      payload,
      { headers: customHeaders }, // 👈 pass here
    );
  },

  deleteMachinery: (
    machineryRecordId: string,
    customHeaders?: Record<string, string>,
  ): Promise<DeleteMachineryResponse> => {
    return apiClient.delete<DeleteMachineryResponse>(
      `${endpoints.user.machinery}/${machineryRecordId}`,
      { headers: customHeaders },
    );
  },

  updateMachinery: (
    payload: UpdateMachineryPayload,
    customHeaders?: Record<string, string>,
  ): Promise<UpdateMachineryResponse> => {
    return apiClient.patch<UpdateMachineryResponse>(
      endpoints.user.machinery, // Assuming this endpoint is for updating machinery
      payload,
      { headers: customHeaders },
    );
  },

  deleteLivestock: (
    livestockRecordId: string,
    customHeaders?: Record<string, string>,
  ): Promise<DeleteLivestockResponse> => {
    return apiClient.delete<DeleteLivestockResponse>(
      `${endpoints.user.livestock}/${livestockRecordId}`,
      { headers: customHeaders },
    );
  },

  getLandDetails: (
    payload: { id: string },
    customHeaders?: Record<string, string>,
  ): Promise<LandListResponse> => {
    const { id } = payload;
    return apiClient.get2<LandListResponse>(
      `${endpoints.user.landDetails}${id}`,
      { headers: customHeaders },
    );
  },
  viewProfile: (
    customHeaders?: Record<string, string>,
  ): Promise<ViewProfileResponse> => {
    return apiClient.get2<ViewProfileResponse>(endpoints.user.viewProfile, {
      headers: {
        ...customHeaders,
      },
    });
  },

  getFamilyMembers: (
    customHeaders?: Record<string, string>,
  ): Promise<FamilyMembersResponse> => {
    return apiClient.get2<FamilyMembersResponse>(endpoints.user.familyMembers, {
      headers: customHeaders,
    });
  },

  updateFamilyMembers: (
    payload: UpdateFamilyMembersPayload,
    customHeaders?: Record<string, string>,
  ): Promise<FamilyMembersResponse> => {
    return apiClient.post2<FamilyMembersResponse>(
      endpoints.user.familyMembers,
      payload,
      { headers: customHeaders },
    );
  },

  updateLiveStockData: (
    payload: {},
    customHeaders?: Record<string, string>,
  ): Promise<ViewProfileResponse> => {
    return apiClient.patch2<ViewProfileResponse>(
      endpoints.user.livestock,
      payload,
      { headers: customHeaders },
    );
  },
  updateFarmerProfile: (
    payload: FormData, // Use FormData directly for form-data
    customHeaders?: Record<string, string>,
  ): Promise<ViewProfileResponse> => {
    // Assuming it returns updated profile
    return apiClient.patch2<ViewProfileResponse>(
      endpoints.user.updateProfile, // PATCH /user/api/v1/farmers/profile
      payload,
      {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for form-data
          ...customHeaders,
        },
      },
    );
  },
  updateLandAddress(payload: any, customHeaders?: Record<string, string>) {
    // const landId = payload.get("landId"); // NOW VALID
    // if (landId) payload.delete("landId");
    //console.log("Api=========== ",endpoints.user.landDetails + global.landId);
    //console.log("payload=========== ",payload);

    return apiClient.patch2(
      endpoints.user.landDetails + global.landId,
      payload,
      {
        headers: {
          // "Content-Type": "multipart/form-data",
          ...customHeaders,
        },
      },
    );
  },
  updateCropDetails: (
    payload: {},
    customHeaders?: Record<string, string>,
  ): Promise<ViewProfileResponse> => {
    return apiClient.patch2<ViewProfileResponse>(
      endpoints.user.cropListUpdate + global.cropId,
      payload,
      { headers: customHeaders },
    );
  },

  deleteCropDetails: (
    payload: { id: string },
    customHeaders?: Record<string, string>,
  ): Promise<ViewProfileResponse> => {
    const { id } = payload;
    return apiClient.delete2<ViewProfileResponse>(
      endpoints.user.cropListUpdate + id,
      {},
      { headers: customHeaders },
    );
  },
};

export default authService;
