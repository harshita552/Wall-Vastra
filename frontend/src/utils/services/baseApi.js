class BaseApi {
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  async getCategories(endpoint) {
    const response = await this.apiClient.get(endpoint);
    return response.data;
  }
}

export default BaseApi;