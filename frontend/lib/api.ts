const API_BASE_URL = "http://localhost:5000";

export async function uploadFile(formData: FormData) {
  console.log("form data: ", formData);
  const response = await fetch(`${API_BASE_URL}/api/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Upload failed");
  }

  return response.json();
}

export const getQueueStatus = async () => {
  const res = await fetch(`${API_BASE_URL}/api/status`);
  return res.json();
};

export const getFileStatus = async (fileId: string) => {
  const res = await fetch(`${API_BASE_URL}/api/status/${fileId}`);
  return res.json();
};

export const cancelFile = async (fileId: string) => {
  const res = await fetch(`${API_BASE_URL}/api/cancel/${fileId}`, {
    method: "DELETE",
  });
  return res.json();
};
