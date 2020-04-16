import { preFetchFromNode } from "../fetch/node";
import { ethers } from "ethers";

const ipfsGateway = "https://ipfs.infura.io";
const web3Provider = "https://web3.dappnode.net";
const provider = new ethers.providers.JsonRpcProvider(web3Provider);
const registryList = ["dnp.dappnode.eth", "public.dappnode.eth"];

preFetchFromNode(provider, ipfsGateway, registryList);
