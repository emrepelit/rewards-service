const rewardsService = require("./rewardsService");
const { ELIGIBILITY_STATUS, REWARDS } = require("./constants");

describe("Rewards Service", () => {
    test("should return rewards when customer is eligible", () => {
        const mockEligibilityService = jest.fn().mockReturnValue(ELIGIBILITY_STATUS.CUSTOMER_ELIGIBLE);
        
        const portfolio = ["SPORTS", "MUSIC", "MOVIES"];
        const expectedRewards = portfolio.map(channel => REWARDS[channel]).filter(reward => reward !== null);

        const result = rewardsService({
            customerAccountNumber: "12345",
            portfolio,
            eligibilityService: mockEligibilityService
        });

        expect(result).toEqual({ data: expectedRewards });
    });

    test("should return no rewards when customer is ineligible", () => {
        const mockEligibilityService = jest.fn().mockReturnValue(ELIGIBILITY_STATUS.CUSTOMER_INELIGIBLE);
        
        const result = rewardsService({
            customerAccountNumber: "12345",
            portfolio: ["SPORTS", "MUSIC", "MOVIES"],
            eligibilityService: mockEligibilityService
        });

        expect(result).toEqual({ data: [] });
    });

    test("should throw an error when account number is invalid", () => {
        const mockEligibilityService = jest.fn().mockReturnValue(ELIGIBILITY_STATUS.INVALID_ACCOUNT_NUMBER);
        
        expect(() => rewardsService({
            customerAccountNumber: "invalid",
            portfolio: ["SPORTS", "MUSIC", "MOVIES"],
            eligibilityService: mockEligibilityService
        })).toThrowError(new Error("Invalid account number"));
    });

    test("should handle unexpected eligibility status by throwing an error", () => {
        const mockEligibilityService = jest.fn().mockReturnValue("UNKNOWN_STATUS");

        expect(() => rewardsService({
            customerAccountNumber: "12345",
            portfolio: ["SPORTS", "MUSIC", "MOVIES"],
            eligibilityService: mockEligibilityService
        })).toThrowError(new Error("Unexpected eligibility status"));
    });

    test("should log an error and throw a generic error when eligibilityService throws an error", () => {
        const mockEligibilityService = jest.fn(() => { throw new Error("Service unavailable"); });

        console.error = jest.fn();

        expect(() => rewardsService({
            customerAccountNumber: "12345",
            portfolio: ["SPORTS", "MUSIC", "MOVIES"],
            eligibilityService: mockEligibilityService
        })).toThrowError(new Error("Unexpected error while processing rewards!"));

        expect(console.error).toHaveBeenCalledWith(expect.stringMatching(/Error in rewardsService:/));
    });
});
