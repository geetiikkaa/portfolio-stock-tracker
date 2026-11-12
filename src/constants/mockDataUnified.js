export const INITIAL_PROFILE = {
    name: "Geetika Pandey",
    email: "geetika@example.com",
    phone: "+91 98765 43210",
    location: "India",
    memberSince: "May 2024",
    avatar: null,
};
export const emptyForm = {
    name: "",
    ticker: "",
    assetClass: "Equity",
    type: "Buy",
    qty: "",
    amount: "",
};

export const RANGE_DATA = {
    Today: {
        data: [
            { label: "9AM", value: 24.12 },
            { label: "11AM", value: 24.28 },
            { label: "1PM", value: 24.05 },
            { label: "3PM", value: 24.41 },
            { label: "5PM", value: 24.75 },
        ],
        changeLabel: "+0.42% (Today)",
    },
    "This Week": {
        data: [
            { label: "Mon", value: 23.85 },
            { label: "Tue", value: 24.05 },
            { label: "Wed", value: 23.78 },
            { label: "Thu", value: 24.3 },
            { label: "Fri", value: 24.55 },
            { label: "Sat", value: 24.68 },
            { label: "Sun", value: 24.75 },
        ],
        changeLabel: "+1.83% (This Week)",
    },
    "This Month": {
        data: [
            { label: "W1", value: 21.4 },
            { label: "W2", value: 22.1 },
            { label: "W3", value: 23.6 },
            { label: "W4", value: 24.75 },
        ],
        changeLabel: "+5.92% (This Month)",
    },
    "This Year": {
        data: [
            { label: "Jan", value: 14.1 },
            { label: "Feb", value: 15.6 },
            { label: "Mar", value: 14.6 },
            { label: "Apr", value: 17.8 },
            { label: "May", value: 24.75 },
            { label: "Jun", value: 22.9 },
        ],
        changeLabel: "+12.56% (This Year)",
    },
};
export const RANGE_OPTIONS = ["1M", "3M", "1Y"];
export const RANGE_DAYS = {
    "1M": 30,
    "3M": 90,
    "1Y": 365,
};



export const MONTHLY_RETURNS = [
    { month: "Jul", value: 5.6 },
    { month: "Aug", value: 1.4 },
    { month: "Sep", value: -2.8 },
    { month: "Oct", value: 6.9 },
    { month: "Nov", value: -1.6 },
    { month: "Dec", value: 2.2 },
    { month: "Jan", value: -4.35 },
    { month: "Feb", value: 3.1 },
    { month: "Mar", value: 8.25 },
    { month: "Apr", value: 2.4 },
    { month: "May", value: -1.1 },
    { month: "Jun", value: 1.8 },
];