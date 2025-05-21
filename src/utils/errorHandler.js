export const getErrorMessage = (error) => {
    if (error.response?.data?.message) {
        return String(error.response.data.message);
    }
    if (typeof error === "string") return error;
    if (error.message) return String(error.message);
    return "Có lỗi xảy ra";
};