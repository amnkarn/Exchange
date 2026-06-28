export const getWSMarket = (market: string) => {
  return market.replace(/_/g, "").toLowerCase();
};

export const getHTTPMarket = (market: string) => {
    return market.replace(/_/g, "").toUpperCase();
};