import axios from "axios";

const getDataUri = async (url: any) => {
  const response = await axios.get(url, {
    responseType: "arraybuffer",
  });
  const buffer = Buffer.from(response.data, "binary").toString("base64");
  return `data:image/png;base64,${buffer}`;
};
export default getDataUri;
