const makeDate = (date) => {
    let dateObj = new Date(date);

    let day = dateObj.getDate();
    if (day < 10) {
        day = "0"+day;
    }

    let month = 1+dateObj.getMonth();
    if (month < 10) {
        month = "0"+month;
    }

    let year = dateObj.getFullYear();

    return day+"-"+month+"-"+year;
}

export default makeDate;