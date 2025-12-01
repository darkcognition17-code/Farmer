import apiClient from './apiClient';
import { endpoints } from '../utils/endpoints';

export interface StaticContentResponse {
  statusCode: number;
  message: string;
  data: {
    id: string;
    createdAt: string;
    updatedAt: string;
    title: string;
    slug: string;
    isActive: boolean;
    description: string;
  };
}

const contentService = {
  getStaticContent: (
    slug: string,
    customHeaders?: Record<string, string>,
  ): Promise<StaticContentResponse> => {
    //console.log('Inside contentService.getStaticContent:', `${endpoints.content.getStaticContent}/${slug}` );
    return apiClient.get2<StaticContentResponse>(
      `${endpoints.content.getStaticContent}/${slug}`,
      {
        headers: {
          ...customHeaders,
        },
      },
    );
  },
  getLiveStock: (params: {
    page: number;
    limit: number;
  }): Promise<LiveStockResponse> => {
    return apiClient.get2<LiveStockResponse>(endpoints.user.livestock, {
      params,
    });
  },

  getLivestockTypes: (
    customHeaders?: Record<string, string>,
  ): Promise<LivestockTypesResponse> => {
    return apiClient.get2<LivestockTypesResponse>(
      endpoints.user.livestockTypes,
      { headers: customHeaders },
    );
  },

  addLiveStock: (
    data: any,
    customHeaders?: Record<string, string>,
  ): Promise<any> => {
    return apiClient.post2(endpoints.user.livestock, data, {
      headers: customHeaders,
    });
  },

  updateLiveStock: (
    data: any,
    customHeaders?: Record<string, string>,
  ): Promise<any> => {
    return apiClient.patch2(endpoints.user.livestock, data, {
      headers: customHeaders,
    });
  },

  getMachinery: (params: {
    page: number;
    limit: number;
  }): Promise<LivestockTypesResponse> => {
    return apiClient.get2<LivestockTypesResponse>(endpoints.user.machinery, {
      params,
    });
  },
  getMachineryTypes: (
    customHeaders?: Record<string, string>,
  ): Promise<LivestockTypesResponse> => {
    return apiClient.get2<LivestockTypesResponse>(
      endpoints.user.machineryTypes,
      { headers: customHeaders },
    );
  },
};

export default contentService;

export interface LivestockTypesResponse {
  statusCode: number;
  message: string;
  data: {
    id: string;
    name: string;
    isActive: boolean;
  }[];
}
