The root cause is the following:

function allocateSeigniorage() external onlyOneBlock checkCondition checkEpoch checkOperator {
       _updateCrocPrice();
        previousEpochCrocPrice = getCrocPrice();
        uint256 crocSupply = **getCrocCirculatingSupply()**.**sub(seigniorageSaved)**;
        if (epoch < bootstrapEpochs) {
            // 14 first epochs with 6% expansion
            _sendToMasonry(crocSupply.mul(bootstrapSupplyExpansionPercent).div(BASIS_DIVISOR));
        } else {

this is contract logic and it's correct. But the reason why real APR is x2 less than UI's is here:

async getMasonryAPR() {
                    const e = this.currentMasonry()
                      , {Treasury: t} = this.contracts
                      , n = await this.externalTokens.CROC.**totalSupply()**
                      , r = await Promise.all(Array.from({
                        length: 7
                    }

The thing is that you haven't emitted all the supply during the genesis phase and you should use something like this to report correctly:

**const crocCirculating = await this.contracts.Treasury.getCrocCirculatingSupply();
const seigniorageSaved = await this.contracts.Treasury.seigniorageSaved();
const n = crocCirculating.sub(seigniorageSaved); **

If going deep into the math, the UI's APR calculation formula:

APR = ((Croc_Supply × 0.001_expansion × 4_epochs/day × price × 0.86458) / (gCROC staked * price)) × 365 × 100 

gives wrong ~3400% at 50,342 of CROC total supply and correct **~1700% **at 24,496 of CROC circulating supply