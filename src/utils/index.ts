import ethers from 'ethers';

export const realtimeUpsertParams = (abi: any, trxData: any, confirmed: any, block: any) => {
  const block_number = block.number;
  const address = trxData.address.toLowerCase();
  const transaction_hash = (trxData.transactionHash).toLowerCase();
  const log_index = trxData.logIndex;
  const topics = [trxData.topic0, trxData.topic1, trxData.topic2, trxData.topic3];
  const data = trxData.data;
	console.log(data)
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
  console.log(abi)
  if (abi) {
      const update = {
          ...filter,
          ...decodeWithEthers(abi, data, topics.filter((t: any) => t !== null)),
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

export const decodeWithEthers = (abi: any, data: any, topics: any) => {
  try {
      const iface = new ethers.utils.Interface(abi);
      const { args } = iface.parseLog({ data, topics});
      const event = iface.getEvent(topics[0]);
      const decoded: any = {};
      event.inputs.forEach((input, index) => {
          if (input.type === "uint256") {
            const name = `${input.name}_decimal`;
            decoded[name] = {
                __type: "NumberDecimal",
                value: ethers.BigNumber.from(args[index]._hex).toString()
            };
            decoded[input.name] = ethers.BigNumber.from(args[index]._hex).toString();
            return;
          }
          decoded[input.name] = args[index];
      });
      
      return decoded;
  } catch (error) {
      return {};
  }
}