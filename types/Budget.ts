// A budget sets a spending limit for a specific category.
// Example: "Don't spend more than ETB 500 on Groceries this month"

export interface Budget {
    id: string;
    categoryId: string;           // Which category is this budget for? Links to Category.id
    limitAmount: number;          // The maximum you want to spend, e.g. 500.00
    period: 'monthly' | 'weekly'; // How often does this budget reset?
    startDate: string;            // When did you start tracking this budget?
    alertThreshold?: number;      // Optional: alert at what %? e.g. 0.8 = warn at 80% spent
}
