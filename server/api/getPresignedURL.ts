import axios from "axios";

export type getPresignedURLRequest = {
  storeName: string;
  apiKey: string;
};

export default {
  async getPresignedURL(request: getPresignedURLRequest) {
    try {
      const response = await axios.post(
        "https://3ivwi0ph73.execute-api.us-west-2.amazonaws.com/demo-stage/presigned-url",
        {
          store_name: request.storeName,
        },
        {
          headers: {
            "Content-type": "application/json",
            "x-api-key": request.apiKey,
          },
        }
      );
      console.log("response");
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error; // Re-throw the error for further handling in the component
    }
  },
};
