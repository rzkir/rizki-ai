export function formatDate(date: Date | string | number | { toDate: () => Date, seconds: number, nanoseconds?: number }, format: string): string {
    let d: Date

    // Handle Firestore Timestamp objects
    if (date && typeof date === 'object' && 'toDate' in date && typeof date.toDate === 'function') {
        d = date.toDate()
    } else if (date && typeof date === 'object' && 'seconds' in date) {
        // Handle Firestore Timestamp with seconds property
        d = new Date(date.seconds * 1000 + (date.nanoseconds || 0) / 1000000)
    } else {
        d = new Date(date)
    }

    if (isNaN(d.getTime())) {
        return ""
    }

    const day = d.getDate()
    const month = d.getMonth()
    const year = d.getFullYear()
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const monthNamesFull = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const dayNamesFull = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

    let formatted = format

    // Year formats
    formatted = formatted.replace(/yyyy/g, year.toString())
    formatted = formatted.replace(/yy/g, year.toString().slice(-2))

    // Month formats
    formatted = formatted.replace(/MMMM/g, monthNamesFull[month])
    formatted = formatted.replace(/MMM/g, monthNames[month])
    formatted = formatted.replace(/MM/g, (month + 1).toString().padStart(2, "0"))
    formatted = formatted.replace(/M/g, (month + 1).toString())

    // Day formats
    formatted = formatted.replace(/dddd/g, dayNamesFull[d.getDay()])
    formatted = formatted.replace(/ddd/g, dayNames[d.getDay()])
    formatted = formatted.replace(/dd/g, day.toString().padStart(2, "0"))
    formatted = formatted.replace(/d/g, day.toString())

    // Hour formats (24-hour)
    const hours24 = d.getHours()
    formatted = formatted.replace(/HH/g, hours24.toString().padStart(2, "0"))
    formatted = formatted.replace(/H/g, hours24.toString())

    // Hour formats (12-hour)
    const hours12 = hours24 % 12 || 12
    formatted = formatted.replace(/hh/g, hours12.toString().padStart(2, "0"))
    formatted = formatted.replace(/h/g, hours12.toString())

    // Minute formats
    const minutes = d.getMinutes()
    formatted = formatted.replace(/mm/g, minutes.toString().padStart(2, "0"))
    formatted = formatted.replace(/m/g, minutes.toString())

    // Second formats
    const seconds = d.getSeconds()
    formatted = formatted.replace(/ss/g, seconds.toString().padStart(2, "0"))
    formatted = formatted.replace(/s/g, seconds.toString())

    // AM/PM
    formatted = formatted.replace(/tt/g, hours24 >= 12 ? "PM" : "AM")
    formatted = formatted.replace(/t/g, hours24 >= 12 ? "P" : "A")

    return formatted
}
