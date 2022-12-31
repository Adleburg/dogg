import BotClient from "noblox.js";
import db from "quick.db";
import axios from "axios";
import config from "../config.json" assert { type: "json" };
import { Request, Response } from "express";
const cookie = config.cookie;

async function isAuthenticatedViaKey(req: Request, res: Response) {
  let gameKey = req.query.gameKey;
  if (!gameKey || !(typeof gameKey === "string"))
    return res.json({
      status: 403,
      body: "Request not authorised, Please send the gameKey object",
    });
  if (db.has(gameKey)) {
    return true;
  } else {
    res.json({ status: 403, body: "Unauthorized, please join .gg/ranking if you believe this is a mistake. (DB was wiped recently)" });
    return false;
  }
}
async function getGroupIDFromKey(gameKey: string) {
  if (db.has(gameKey)) {
    let group = await db.get(gameKey).groupID;
    return group;
  }
}
/*async function isRequestFromRoblox(req, res) {
  let RequestMadeFrom = req.headers["origin"] || [];
  if (!RequestMadeFrom || !RequestMadeFrom.includes("roblox-id")) {
    res.json({
      status: 403,
      body: "Nice try, Request not made from a Valid Roblox game.",
    });
    return false;
  }
  if (RequestMadeFrom.includes("chrome-extension")) {
    res.json({
      status: 403,
      body: "hahah loser nice try, maybe try again later? no doxxing today via IP Forging.",
    });
    return false;
  }
}*/
const robloxUserPfp = async (req: Request, res: Response) => {
  const userid = req.query.id;
  if (!userid)
    return res.status(400).json({ status: 400, body: "No userid provided" });
  axios
    .get(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userid}&size=48x48&format=Png&isCircular=true`
    )
    .then((response) => {
      if (!response.data.data[0]) {
        return res.status(400).json({
          message: "Invalid Userid",
        });
      }
      return res.status(200).send(response.data.data[0].imageUrl);
    });
};
const setRank = async (req: Request, res: Response) => {
  let authed = (await isAuthenticatedViaKey(req, res)) == true;
  if (!authed) return;
  //let fromRoblox = (await isRequestFromRoblox(req, res)) == true;
  //if (!fromRoblox) return;
  let gameKey = req.query.gameKey;
  let userId = Number(req.query.id);
  let rank = Number(req.query.rank);
  if (!gameKey || !userId || !rank) {
    res.status(400).json({
      message: "Please specify a gameKey, userId, and rank",
    });
    return;
  }
  if (isNaN(rank)) res.status(400).json({ message: "Rank must be a number" });

  await BotClient.setCookie(cookie);
  let BotClientUser = await BotClient.getCurrentUser();
  if (BotClientUser) {
    console.log(BotClientUser);
    let GroupID = await getGroupIDFromKey(<string>gameKey);
    if (!userId)
      return res.json({
        status: 403,
        body: "Request invalid, Please send the UserID to proceed",
      });
    let UserInfo = await BotClient.getPlayerInfo(userId).catch((err) => {
      return res.json({ status: 400, body: "UserID invalid" });
    });
    if (UserInfo) {
      let success = true;
      let result: any;
      await BotClient.setRank(GroupID, userId, rank).catch((err) => {
        success = false;
        result = err;
      });
      if (!success) {
        console.log(result);
        return res.json({
          status: 400,
          body: "Failed to set rank, probably because the bot doesn't have permission.",
        });
      }
      return res.json({ status: 200, body: "Rank set" });
    }
  }
};
export default { setRank, robloxUserPfp };
