import axios from 'axios';

/**
 * Lấy ID người dùng từ token.
 * @returns {Promise<string | null>} - ID người dùng nếu thành công, ngược lại là null.
 */
export const getUserDataFromToken = async () => {
    const token = JSON.parse(localStorage.getItem("tokenuser"));
    const role = JSON.parse(localStorage.getItem("role"));

    if (token && role) {
        try {
            // Gửi token và role tới API để lấy thông tin người dùng
            const response = await axios.post(`/api/${role}/get-user-data`, { token });

            // Kiểm tra nếu có ID người dùng trong phản hồi
            if (response.data) {
                return response.data;
            } else {
                console.warn("User not found");
                return null;
            }
        } catch (error) {
            console.error("Error fetching user ID:", error.response?.data || error.message);
            return null;
        }
    } else {
        console.warn("No token found in localStorage");
        return null;
    }
};
