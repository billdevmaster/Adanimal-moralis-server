const ethers = require('ethers');

export function parseEventData(req: any) {
  try {
    for (const log of req.body.logs) {
      const abi = req.body.abis[log.streamId];
      if (abi) {
        const { filter, update, eventName } = realtimeUpsertParams(abi, log, req.body.confirmed, req.body.block);
        // eslint-disable-next-line no-console
        console.log(filter)
        return { data: update, tagName: log.tag, eventName };
      }
    }
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.log(e);
  } 
  return {data: {}, tagName: "", eventName: ""}
}

function realtimeUpsertParams(abi: any, trxData: any, confirmed: any, block: any) {
  const block_number = block.number;
  const address = trxData.address.toLowerCase();
  const transaction_hash = (trxData.transactionHash).toLowerCase();
  const log_index = trxData.logIndex;
  const topics = [trxData.topic0, trxData.topic1, trxData.topic2, trxData.topic3];
  const data = trxData.data;

  const filter = {
      transaction_hash,
      log_index,
  };

  const rest = {
      address,
      block_number,
      confirmed: false
  };

  rest.confirmed = confirmed;

  if (abi) {
      const update = {
          ...filter,
          ...decodeWithEthers(abi, data, topics.filter(t => t !== null)),
          ...rest,
      };
      return { filter, update };
  }

  const update = {
      ...filter,
      ...rest,
      data,
      topic0: topics[0],
      topic1: topics[1],
      topic2: topics[2],
      topic3: topics[3],
  };

  return { filter, update };
}

function decodeWithEthers(abi: any, data: any, topics: any) {
  try {
      const iface = new ethers.utils.Interface(abi);
      const { args } = iface.parseLog({ data, topics});
      const event = iface.getEvent(topics[0]);
      const decoded = {};
      event.inputs.forEach((input, index) => {   
          if (input.type === "uint256") {
          /*decoded[`${input.name}_decimal`] = {
              __type: "NumberDecimal",
              value: parseInt(ethers.BigNumber.from(args[index]._hex).toString())
          };*/
          decoded[input.name] = ethers.BigNumber.from(args[index]._hex).toString();
          return;
          }
          if(input.type === "bytes") {
          decoded[input.name] = args[index].hash                        
          return;
          }
          if(input.type === "address") {
          decoded[input.name] = args[index].toLowerCase()
          return;
          }
          decoded[input.name] = args[index];
      });
      return decoded;
  } catch (error) {
      return {};
  }
}