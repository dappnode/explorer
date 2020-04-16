import { preFetchFromNode } from "../src/fetch/node";
import { ethers } from "ethers";

const ipfsGateway = "https://ipfs.infura.io";
const web3Provider =
  "https://mainnet.infura.io/v3/bb15bacfcdbe45819caede241dcf8b0d";
const provider = new ethers.providers.JsonRpcProvider(web3Provider);
const registryList = ["dnp.dappnode.eth", "public.dappnode.eth"];

preFetchFromNode(provider, ipfsGateway, registryList);
