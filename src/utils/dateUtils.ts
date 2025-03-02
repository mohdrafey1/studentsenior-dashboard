export const getDateRange = (filter: string) => {
    const today = new Date();
    let startDate = new Date();
    let endDate = today;

    switch (filter) {
        case 'last7Days':
            startDate.setDate(today.getDate() - 7);
            break;
        case 'last30Days':
            startDate.setDate(today.getDate() - 30);
            break;
        case 'lastMonth':
            startDate.setMonth(today.getMonth() - 1);
            startDate.setDate(1);
            endDate = new Date(startDate);
            endDate.setMonth(startDate.getMonth() + 1);
            endDate.setDate(0);
            break;
        case 'last365Days':
            startDate.setDate(today.getDate() - 365);
            break;
        case 'lastYear':
            startDate.setFullYear(today.getFullYear() - 1);
            startDate.setMonth(0);
            startDate.setDate(1);
            endDate.setFullYear(today.getFullYear() - 1);
            endDate.setMonth(11);
            endDate.setDate(31);
            break;
        case 'thisYear':
            startDate.setMonth(0);
            startDate.setDate(1);
            break;
        case 'thisMonth':
            startDate.setDate(1);
            break;
        default:
            return null;
    }

    return { startDate, endDate };
};
