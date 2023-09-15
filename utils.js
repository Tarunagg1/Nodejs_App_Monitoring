function getRandomValues(array) { 
    const length = array.length;
    return array[Math.floor(Math.random() * length)];
}


function doSomeHavyTask() {
    const ms = getRandomValues([100, 150, 200, 250, 300, 600, 500, 1000, 1400, 2500]);
    const shouldThrowError = getRandomValues([1, 8, 2]) === 8;
    if (shouldThrowError) {
        const randomErr = getRandomValues([
            "DB Payment Failure",
            "DB Server is Down",
            "Access Denied",
            "No found error"
        ]);
        throw new Error(randomErr);
    }
    return new Promise((resolve, reject) => setTimeout(() => resolve(ms), ms));
}



module.exports = { doSomeHavyTask }
