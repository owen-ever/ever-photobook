import { API } from '@/api/config/api';
import { request } from '@/api/modules/request';

export const getWorkspaceMe = async () => {
  return request(API.WORKSPACE);
};
