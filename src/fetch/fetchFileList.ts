import fetch from "node-fetch";
import xml2js from "xml2js";

const ipfsGateway = "https://ipfs.io";

export async function fetchAvatarUrl(releaseHash: string) {
  const res = await fetch(`${ipfsGateway}/${releaseHash}`).then((res) =>
    res.text()
  );
  try {
    const manifest = JSON.parse(res);
    if (!manifest.avatar) throw Error(`No avatar in manifest`);
    return manifest.avatar;
  } catch (e) {
    try {
      const filelist = await parseFileListFromIpfsGatewayPage(res);
      const avatarFile = filelist.find((file) => /avatar.png/.test(file.name));
      if (!avatarFile) throw Error(`Ǹo avatar found in release`);
      return avatarFile.url;
    } catch (e) {
      throw Error(`Unknown response type: ${res}`);
    }
  }
}

async function parseFileListFromIpfsGatewayPage(
  htmlPlainData: string
): Promise<{ name: string; url: string }[]> {
  const xml = await xml2js.parseStringPromise(htmlPlainData);
  const table = findElements(xml, "table");

  // "_": "about",
  // "$": {
  //   "href": "/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/about"
  // }
  interface aEl {
    _: string;
    $: { href: string };
  }
  const links: aEl[] = findElements(table, "a");
  const files = links.map((a) => ({
    name: a._,
    url: a.$.href,
  }));

  return files;
}

/**
 * Traverse an XML parsed document to find element of "name"
 * @param nodes
 * @param name "table", "a"
 * @param els
 */
function findElements(nodes: any, name: string, els: any[] = []): any {
  if (Array.isArray(nodes)) {
    for (const node of nodes) {
      findElements(node, name, els);
    }
  } else if (typeof nodes === "object") {
    if (nodes[name] && nodes[name][0]) els.push(nodes[name][0]);
    else if (nodes[name]) els.push(nodes[name]);
    else return findElements(Object.values(nodes), name, els);
  }
  return els;
}
