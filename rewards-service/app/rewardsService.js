const { REWARDS, ELIGIBILITY_STATUS } = require("./constants");

function rewardsService({ customerAccountNumber, portfolio, eligibilityService }) {
    try {
        const eligibilityStatus = eligibilityService(customerAccountNumber);

        switch (eligibilityStatus) {
            case ELIGIBILITY_STATUS.CUSTOMER_ELIGIBLE:
                return {
                    data: portfolio
                        .map(channel => REWARDS[channel])
                        .filter(reward => reward !== null),
                };

            case ELIGIBILITY_STATUS.INVALID_ACCOUNT_NUMBER:
                throw new Error("Invalid account number");

            case ELIGIBILITY_STATUS.CUSTOMER_INELIGIBLE:
                return { data: [] };

            default:
                throw new Error("Unexpected eligibility status");
        }
    } catch (err) {
        console.error(`Error in rewardsService: ${err.message}`);

        if (err.message === "Invalid account number" || err.message === "Unexpected eligibility status") {
            throw err;
        }

        throw new Error("Unexpected error while processing rewards!");
    }
}

module.exports = rewardsService;