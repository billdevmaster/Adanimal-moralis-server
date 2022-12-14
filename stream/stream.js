const Moralis = require("moralis");
const { EvmChain } = require("@moralisweb3/common-evm-utils");


async function main() {
  await Moralis.start({
    apiKey: process.env.MORALIS_API_KEY,
  });
  
  const stream = {
    // list of blockchains to monitor
    chains: [EvmChain.ETHEREUM, EvmChain.BSC_TESTNET, EvmChain.GOERLI], 
    description: "monitor adanimal app contracts", // your description
    tag: "Adanimal", // give it a tag
    // webhook url to receive events,
    webhookUrl: process.env.WEB_HOOK_URL, 
    includeNativeTxs: true
  }
  
  const newStream = await Moralis.Streams.add(stream);
  const { id } = newStream.toJSON(); // { id: 'YOUR_STREAM_ID', ...newStream }
  
  // Now we attach bobs address to the stream
  const address = "0x68b3f12d6e8d85a8d3dbbc15bba9dc5103b888a4";
  
  await Moralis.Streams.addAddress({ address, id });  
  console.log("kay")
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});