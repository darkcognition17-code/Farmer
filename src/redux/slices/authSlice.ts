import {
  FamilyMembersResponse,
  FarmerDetailsResponse,
  LandListResponse,
  RegisterUserNameResponse,
  ResetPassword,
  Step1FarmerProfilePayload,
  UpdateFamilyMembersPayload,
  userNameExist,
  ViewProfileResponse,
} from './../../services/authService';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import authService, {
  RegisterUsernamePayload,
  SendOtpPayload,
  SendOtpResponse,
  VerifyOtpPayload,
  LoginWithCredentialsPayload,
  LoginWithCredentialsResponse,
  SendOtpLoginPayload,
  SendOtpLoginResponse,
} from '../../services/authService';
import { endpoints } from '../../utils/endpoints';
import { Buffer } from 'buffer'; // Available in React Native via polyfill

interface AuthState {
  loading: boolean;
  otpResponse: SendOtpResponse | null;
  registerUserNameResponce: RegisterUserNameResponse | null;
  accessToken: string | null;
  refreshToken: string | null;
  error: string | null;
  isAuthenticated: boolean;
  loginWithCredentialsResponse: LoginWithCredentialsResponse | null; // New state for login with credentials
  sendOtpLoginResponse: SendOtpLoginResponse | null; // New state for send OTP login
  tempToken: string;
  landList: LandListResponse | null;
  farmerDetails: FarmerDetailsResponse | null;
  landDetails: {};
  viewProfileData: ViewProfileResponse | null;
  familyMembers: FamilyMembersResponse | null; // New state for family members
}

const initialState: AuthState = {
  loading: false,
  otpResponse: null,
  accessToken: null,
  refreshToken: null,
  error: null,
  registerUserNameResponce: null,
  isAuthenticated: false,
  loginWithCredentialsResponse: null,
  sendOtpLoginResponse: null,
  tempToken: '',
  landDetails: {},
};

// Send OTP Signup
export const sendOtpSignup = createAsyncThunk(
  endpoints.auth.sendOtpSignup,
  async (payload: SendOtpPayload, { rejectWithValue }) => {
    try {
      const response = await authService.sendOtpSignup(payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const verifyOtp = createAsyncThunk(
  endpoints.auth.verifyOtp,
  async (
    {
      payload,
      headers,
    }: { payload: VerifyOtpPayload; headers?: Record<string, string> },
    { rejectWithValue },
  ) => {
    try {
      const response = await authService.OtpVerify(payload, headers);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

//UserName Register
export const registerUserName = createAsyncThunk(
  endpoints.auth.signup,
  async (
    {
      payload,
      headers,
    }: { payload: RegisterUsernamePayload; headers?: Record<string, string> },
    { rejectWithValue },
  ) => {
    try {
      const response = await authService.RegisterUserName(payload, headers);
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  },
);

//UserName and Password Login
export const loginWithCredentialsUser = createAsyncThunk(
  endpoints.auth.loginWithCredentials,
  async (
    {
      payload,
      headers,
    }: {
      payload: LoginWithCredentialsPayload;
      headers?: Record<string, string>;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await authService.loginWithCredentials(payload, headers);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// Send OTP Login
export const sendOtpLogin = createAsyncThunk(
  endpoints.auth.sendOtpLogin,
  async (payload: SendOtpLoginPayload, { rejectWithValue }) => {
    try {
      const response = await authService.sendOtpLogin(payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// Refresh token
export const refreshAccessToken = createAsyncThunk(
  endpoints.auth.refreshToken,
  async (refreshToken: string, { rejectWithValue }) => {
    try {
      return await authService.refreshToken(refreshToken);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// //UserName Exist or Not
// export const checkUserExist = createAsyncThunk(
//   endpoints.auth.userExistCheck,
//   async (payload: userNameExist, { rejectWithValue }) => {
//     try {
//       const response = await authService.checkuserNameExist(payload);
//       return response;
//     } catch (error: any) {
//       //console.log("error------->", error);
//       return rejectWithValue(error.response?.data?.message || error.message);
//     }
//   }
// );

// Get Langauge

export const getLanguage = createAsyncThunk(
  endpoints.auth.languages,
  async (
    { payload, headers }: { payload: {}; headers?: Record<string, string> },
    { rejectWithValue },
  ) => {
    const tokenBasic = Buffer.from(
      `${'mysecret'}:${'password'}`,
      'utf8',
    ).toString('base64');

    try {
      const response = await authService.getSupportedLanguages(payload, {
        Authorization: `Basic ${tokenBasic}`,
      });
      return response;
    } catch (error: any) {
      //console.log('error.response?--------', error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const checkUserExist = createAsyncThunk(
  endpoints.auth.userExistCheck,
  async (
    {
      payload,
      headers,
    }: { payload: userNameExist; headers?: Record<string, string> },
    { rejectWithValue },
  ) => {
    try {
      const response = await authService.checkuserNameExist(payload, headers);
      return response;
    } catch (error: any) {
      //console.log(error);

      return rejectWithValue(error || error);
    }
  },
);

//UserName Register
export const forgotResetPassword = createAsyncThunk(
  endpoints.auth.resetPassword,
  async (
    {
      payload,
      headers,
    }: { payload: ResetPassword; headers?: Record<string, string> },
    { rejectWithValue },
  ) => {
    try {
      const response = await authService.resetPasswordUser(payload, headers);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);
//Kisani DIDI List

export const getKisaniDidiList = createAsyncThunk(
  endpoints.user.kisaniDidiList,
  async (
    { payload, headers }: { payload: {}; headers?: Record<string, string> },
    { rejectWithValue },
  ) => {
    // const tokenBasic = Buffer.from(`${'mysecret'}:${'password'}`, 'utf8').toString('base64');

    try {
      const response = await authService.getKisaniDidi(payload, headers);
      return response;
    } catch (error: any) {
      //console.log('error.response?--------', error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

//Location List

export const getLocationList = createAsyncThunk(
  endpoints.user.locations,
  async (
    { payload, headers }: { payload: {}; headers?: Record<string, string> },
    { rejectWithValue },
  ) => {
    //console.log('payload.response?--------', payload);

    try {
      const response = await authService.getLocationList(payload, headers);
      return response;
    } catch (error: any) {
      //console.log('error.response?--------', error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

//Profile Step 1 Submit

// export const submitProfileStep1 = createAsyncThunk(
//   endpoints.user.kisanProfileSetupStep1,
//   async (
//     { payload, headers }: { payload: {}; headers?: Record<string, string> },
//     { rejectWithValue }
//   ) => {
//     const tokenBasic = Buffer.from(`${'mysecret'}:${'password'}`, 'utf8').toString('base64');

//     try {
//       const response = await authService.step1FarmerProfile(payload, {
//         Authorization: `Basic ${tokenBasic}`,
//       });
//       return response;
//     } catch (error: any) {
//       //console.log("error.response?--------", error);
//       return rejectWithValue(error.response?.data?.message || error.message);
//     }
//   }

//Steps 1/2/3 for profile setup
export const submitProfileStep1 = createAsyncThunk(
  endpoints.user.kisanProfileSetupStep1,
  async (
    { payload, headers }: { payload: {}; headers?: Record<string, string> },
    { rejectWithValue },
  ) => {
    try {
      const response = await authService.step1FarmerProfile(payload, headers);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// Fetch Farmer Details
export const fetchFarmerDetails = createAsyncThunk(
  endpoints.user.farmerDetails,
  async (
    { headers }: { headers?: Record<string, string> },
    { rejectWithValue },
  ) => {
    try {
      const response = await authService.getFarmerDetails(headers);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// Fetch Land List
export const fetchLandList = createAsyncThunk(
  endpoints.user.landList,
  async (
    {
      payload,
      headers,
    }: {
      payload: { page: number; limit: number };
      headers?: Record<string, string>;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await authService.getLandList(payload, headers);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

//Steps 1/2/3 for Add land
export const submitAddLand = createAsyncThunk(
  endpoints.user.addLand,
  async (
    { payload, headers }: { payload: {}; headers?: Record<string, string> },
    { rejectWithValue },
  ) => {
    try {
      const response = await authService.addLand(payload, headers);
      return response;
    } catch (error: any) {
      //console.log('err----c----------  ', error);

      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// Add machinary Details
export const addmachinaryDetails = createAsyncThunk(
  endpoints.user.machinaryAdd,
  async (
    { payload, headers }: { payload: {}; headers?: Record<string, string> },
    { rejectWithValue },
  ) => {
    try {
      const response = await authService.addMachinary(payload, headers);
      return response;
    } catch (error: any) {
      //console.log('err----c----------  ', error);

      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

//CROP TYPE GET
export const getCropType = createAsyncThunk(
  endpoints.user.cropType,
  async (
    { payload, headers }: { payload: {}; headers?: Record<string, string> },
    { rejectWithValue },
  ) => {
    try {
      const response = await authService.getCropTypeList(payload, headers);
      return response;
    } catch (error: any) {
      //console.log('error.response?--------', error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

//CROP TYPE VARIIETY GET
export const getCropTypeVariety = createAsyncThunk(
  endpoints.user.cropTypeVariety,
  async (
    { payload, headers }: { payload: {}; headers?: Record<string, string> },
    { rejectWithValue },
  ) => {
    try {
      const response = await authService.getCropTypeVarietyList(
        payload,
        headers,
      );
      return response;
    } catch (error: any) {
      //console.log('error.response?--------', error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);
//GetLand Crops
export const getFarmerLandCrop = createAsyncThunk(
  endpoints.user.cropList,
  async (
    { payload, headers }: { payload: {}; headers?: Record<string, string> },
    { rejectWithValue },
  ) => {
    try {
      const response = await authService.getLandCropList(payload, headers);
      return response;
    } catch (error: any) {
      //console.log('error.response?--------', error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

//CROP TYPE VARIIETY GET
export const getCropTypeVarietySeeds = createAsyncThunk(
  endpoints.user.cropTypeVarietySeed,
  async (
    { payload, headers }: { payload: {}; headers?: Record<string, string> },
    { rejectWithValue },
  ) => {
    try {
      const response = await authService.getCropTypeVarietySeedList(
        payload,
        headers,
      );
      return response;
    } catch (error: any) {
      //console.log('error.response?--------', error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

//Steps 3 for Add land
export const submitAddLandStep3 = createAsyncThunk(
  endpoints.user.addCropStep3,
  async (
    { payload, headers }: { payload: {}; headers?: Record<string, string> },
    { rejectWithValue },
  ) => {
    //console.log('payload-----------------------', payload);

    try {
      const response = await authService.addCropStep3(payload, headers);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// Fetch View Profile
export const fetchViewProfile = createAsyncThunk(
  endpoints.user.viewProfile,
  async (
    { headers }: { headers?: Record<string, string> },
    { rejectWithValue },
  ) => {
    try {
      const response = await authService.viewProfile(headers);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// Fetch Family Members
export const fetchFamilyMembers = createAsyncThunk(
  endpoints.user.familyMembers,
  async (
    { headers }: { headers?: Record<string, string> },
    { rejectWithValue },
  ) => {
    try {
      const response = await authService.getFamilyMembers(headers);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// Update Family Members
export const updateFamilyMembers = createAsyncThunk(
  `${endpoints.user.familyMembers}/update`, // A unique action type for update
  async (
    {
      payload,
      headers,
    }: {
      payload: UpdateFamilyMembersPayload;
      headers?: Record<string, string>;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await authService.updateFamilyMembers(payload, headers);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// Update Family Members
export const updateLiveStockNew = createAsyncThunk(
  `${endpoints.user.livestock}`, // A unique action type for update
  async (
    {
      payload,
      headers,
    }: {
      payload: {};
      headers?: Record<string, string>;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await authService.updateLiveStockData(payload, headers);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// Update Farmer Profile
export const updateFarmerProfile = createAsyncThunk(
  endpoints.user.updateProfile, // PATCH /user/api/v1/farmers/profile
  async (
    {
      payload,
      headers,
    }: { payload: FormData; headers?: Record<string, string> },
    { rejectWithValue },
  ) => {
    try {
      const response = await authService.updateFarmerProfile(payload, headers);
      return response;
    } catch (error: any) {
      //console.log('eroorr-------------  ', error);

      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// Fetch Land Details by id
export const getLandDetails = createAsyncThunk(
  endpoints.user.landDetails,
  async (
    {
      payload,
      headers,
    }: {
      payload: { id: string };
      headers?: Record<string, string>;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await authService.getLandDetails(payload, headers);
      //console.log('getLandDetails-------------->', response);

      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// export const updateLandDetails = createAsyncThunk(
//   endpoints.user.landDetails, // PATCH /user/api/v1/farmers/profile
//   async (
//     {
//       payload,
//       headers,
//     }: { payload: FormData; headers?: Record<string, string> },
//     { rejectWithValue },
//   ) => {
//     try {
//       const response = await authService.updateLandAddress(payload, headers);
//       return response;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || error.message);
//     }
//   },
// );

export const updateLandDetails = createAsyncThunk(
  `${endpoints.user.landDetails}`, // A unique action type for update
  async (
    {
      payload,
      headers,
    }: {
      payload: any;
      headers?: Record<string, string>;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await authService.updateLandAddress(payload, headers);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const updateLandDetailsNormal = createAsyncThunk(
  endpoints.user.landDetails, // PATCH /user/api/v1/farmers/profile
  async (
    {
      payload,
      headers,
    }: { payload: FormData; headers?: Record<string, string> },
    { rejectWithValue },
  ) => {
    try {
      const response = await authService.updateLandAddress(payload, headers);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// Update Family Members
export const updateCrops = createAsyncThunk(
  `${endpoints.user.landList}/update`, // A unique action type for update
  async (
    {
      payload,
      headers,
    }: {
      payload: any;
      headers?: Record<string, string>;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await authService.updateCropDetails(payload, headers);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

//CROP DELETE
export const deleteLandCrop = createAsyncThunk(
  endpoints.user.cropListUpdate,
  async (
    { payload, headers }: { payload: {}; headers?: Record<string, string> },
    { rejectWithValue },
  ) => {
    try {
      const response = await authService.deleteCropDetails(payload, headers);
      return response;
    } catch (error: any) {
      //console.log('error.response?--------', error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokens: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>,
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.error = null;
    },
    logout: state => {
      state.accessToken = null;
      state.refreshToken = null;
      state.tempToken = '';
      state.otpResponse = null;
      state.error = null;
      state.isAuthenticated = false;
      state.loginWithCredentialsResponse = null;
      state.sendOtpLoginResponse = null;
      state.registerUserNameResponce = null;
    },
    setTempToken: (state, action: PayloadAction<{ tempToken: string }>) => {
      state.tempToken = action.payload.tempToken;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(sendOtpSignup.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtpSignup.fulfilled, (state, action) => {
        state.loading = false;
        state.otpResponse = action.payload;
        if (action.payload.data?.token) {
          state.tempToken = action.payload.data.token;
        }
      })
      .addCase(sendOtpSignup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyOtp.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otpResponse = action.payload;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUserName.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUserName.fulfilled, (state, action) => {
        state.loading = false;
        state.registerUserNameResponce = action.payload;
        if (action.payload.data?.tokens?.accessToken) {
          state.accessToken = action.payload.data.tokens.accessToken;
          state.refreshToken = action.payload.data.tokens.refreshToken || null;
        }
      })
      .addCase(registerUserName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginWithCredentialsUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithCredentialsUser.fulfilled, (state, action) => {
        state.loading = false;
        state.loginWithCredentialsResponse = action.payload;
        if (action.payload.data?.tokens?.accessToken) {
          state.accessToken = action.payload.data.tokens.accessToken;
          state.refreshToken = action.payload.data.tokens.refreshToken || null;
          state.isAuthenticated = true;
        }
      })
      .addCase(loginWithCredentialsUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(sendOtpLogin.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtpLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.sendOtpLoginResponse = action.payload;
        if (action.payload.data?.accessToken) {
          state.accessToken = action.payload.data.accessToken;
          state.refreshToken = action.payload.data.refreshToken || null;
        }
      })
      .addCase(sendOtpLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(refreshAccessToken.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.accessToken = null;
        state.refreshToken = null;
      })
      .addCase(checkUserExist.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkUserExist.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(checkUserExist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchLandList.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLandList.fulfilled, (state, action) => {
        state.loading = false;
        state.landList = action.payload;
      })
      .addCase(fetchLandList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchFarmerDetails.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFarmerDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.farmerDetails = action.payload;
      })
      .addCase(fetchFarmerDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getLandDetails.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLandDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.landDetails = {
          ...state.landDetails,
          ...action.payload.data, // merge new data with old
        };
      })
      .addCase(getLandDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchViewProfile.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchViewProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.viewProfileData = action.payload;
        //console.log('all', action.payload);
      })
      .addCase(fetchViewProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchFamilyMembers.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFamilyMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.familyMembers = action.payload;
      })
      .addCase(fetchFamilyMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateFamilyMembers.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFamilyMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.familyMembers = action.payload;
      })
      .addCase(updateFamilyMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateFarmerProfile.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFarmerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.viewProfileData = action.payload; // Assuming it returns updated profile
      })
      .addCase(updateFarmerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setTokens, logout } = authSlice.actions;
export default authSlice.reducer;
