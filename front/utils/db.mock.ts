import { fn } from '@storybook/test';

// Create a mock Pool instance
const mockPool = {
    connect: fn().mockName('connect'),
    query: fn().mockName('query'),
    end: fn().mockName('end'),
};

export const getQueryFromPool = fn().mockName('getQueryFromPool');
export default mockPool;
