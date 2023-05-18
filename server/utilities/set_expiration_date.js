
function setExpirationDate(milliseconds, date = new Date()){
    return new Date(date.getTime() + milliseconds);
}
// one day (24 * 60 * 60 * 1000)
export { setExpirationDate };