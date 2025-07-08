import fetch from 'node-fetch';

async function monitorTokenPrices() {
  let previousPrice = null;
  let previousTimestamp = null;

  setInterval(async () => {
    try {
      const response = await fetch('https://api.crocodile.finance/token-prices');
      const data = await response.json();

      const GCROC = data.GCROC;
      if (!GCROC) {
        console.log('gCROC price data not found');
        return;
      }

      const price = GCROC.priceUSD;
      const lastUpdated = GCROC.lastUpdated;

      if (price !== previousPrice || lastUpdated !== previousTimestamp) {
        console.log(new Date().toISOString(), `Price: $${price}`, `Last updated: ${lastUpdated}`);
        previousPrice = price;
        previousTimestamp = lastUpdated;
      } else {
        console.log(new Date().toISOString(), 'No change in price or timestamp');
      }
    } catch (error) {
      console.error('Error fetching token prices:', error);
    }
  }, 1000); // 1000 ms = 1 second
}

monitorTokenPrices();
