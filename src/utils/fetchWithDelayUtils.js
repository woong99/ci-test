export const fetchWithDelay = async (apiCall, minimumLoadingTime = 500) => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const startTime = Date.now();
    const res = await apiCall();
    const endTime = Date.now();
    const elapsed = endTime - startTime;
    if (elapsed < minimumLoadingTime) {
        await delay(minimumLoadingTime - elapsed);
    }
    return res;
};
