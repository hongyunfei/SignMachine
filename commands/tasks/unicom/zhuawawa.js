let crypto = require("crypto");
let moment = require("moment");
let { encryptPhone, sign, encrypt } = require("./handlers/PAES.js");
const { useragent, randomNumber } = require("./handlers/myPhone");
const gameEvents = require("./handlers/dailyEvent");
let { transParams } = require("./handlers/gameUtils");
let zhuawawa = {
  doTask: async (axios, options) => {
    console.log("😒 抓娃娃机开始...");
    let cookies = await zhuawawa.getOpenPlatLine(axios, options);
    let info = await zhuawawa.postIndexInfo(axios, options, cookies);
    await zhuawawa.postGame(axios, options, cookies, info);
  },
  postIndexInfo: async (axios, options, { ecs_token, searchParams, jar1 }) => {
    let phone = encryptPhone(options.user, "gb6YCccUvth75Tm2");
    let result = await axios.request({
      headers: {
        "user-agent": useragent(options),
        referer: `https://wxapp.msmds.cn/h5/react_web/unicom/grabdollPage?source=unicom&type=02&ticket=${searchParams.ticket}&version=android@8.0102&timestamp=${timestamp}&desmobile=${options.user}&num=2&postage=${searchParams.postage}&duanlianjieabc=tbKHR&userNumber=${options.user}`,
        origin: "https://wxapp.msmds.cn",
      },
      url: `https://wxapp.msmds.cn/jplus/api/channelGrabDoll/index`,
      method: "POST",
      data: transParams({
        channelId: "LT_channel",
        phone: phone,
        token: ecs_token,
        sourceCode: "lt_zhuawawa",
      }),
    });
    if (result.data.code !== 200) {
      throw new Error("❌ something errors: ", result.data.msg);
    }
    return next(result.data.data);
    function next(data) {
      return { freeTimes: data["leftTimes"], advertTimes: 4 };
    }
  },

  postGame: async (
    axios,
    options,
    { ecs_token, searchParams, jar1 },
  ) => {
    let phone = encryptPhone(options.user, "gb6YCccUvth75Tm2");
    let data;
    let UA = useragent(options);
    do {
      if (data.data.grabDollAgain === "ture") {
        console.log("视频补充");
        let params = {
          arguments1: "", // acid
          arguments2: "GGPD", // yhChannel
          arguments3: "", // yhTaskId menuId
          arguments4: new Date().getTime(), // time
          arguments6: "",
          arguments7: "",
          arguments8: "",
          arguments9: "",
          netWay: "Wifi",
          version: `android@8.0102`,
        };
        params["sign"] = sign([
          params.arguments1,
          params.arguments2,
          params.arguments3,
          params.arguments4,
        ]);
        params["orderId"] = crypto
          .createHash("md5")
          .update(new Date().getTime() + "")
          .digest("hex");
        params["arguments4"] = new Date().getTime();

        let result = await require("./taskcallback").reward(axios, {
          ...options,
          params,
          jar: jar1,
        });
        console.log(result); 
        let a = {
          channelId: "LT_channel",
          phone: phone,
          token: ecs_token,
          videoOrderNo: params["orderId"],
          sourceCode: "lt_zhuawawa",
        };
        console.log("等待35秒再继续");
        await new Promise((resolve, reject) => setTimeout(resolve, 35 * 1000));
        let timestamp = moment().format("YYYYMMDDHHmmss");
        result = await axios.request({
          headers: {
            "user-agent": UA,
            referer: `https://wxapp.msmds.cn/h5/react_web/unicom/grabdollPage?source=unicom&type=02&ticket=${searchParams.ticket}&version=android@8.0102&timestamp=${timestamp}&desmobile=${options.user}&num=2&postage=${searchParams.postage}&duanlianjieabc=tbKHR&userNumber=${options.user}`,
            origin: "https://wxapp.msmds.cn",
            "Content-Type": "application/x-www-form-urlencoded",
            "X-Requested-With": "com.sinovatech.unicom.ui",
          },
          jar: jar1,
          url: `https://wxapp.msmds.cn/jplus/api/channelGrabDoll/playAgainByLookingVideos`,
          method: "POST",
          data: transParams(a),
        });
        console.log(result.data);
        if (result.data.code !== 200) {
          console.log("提交任务失败", result.data.msg);
          break;
        } else {
          console.log("提交任务成功", `${result.data.data}`);
        }
      } 
      console.log("等待35秒再继续");
      await new Promise((resolve, reject) => setTimeout(resolve, 35 * 1000));
      let score = encrypt(randomNumber(12, 17) * 10, "gb6YCccUvth75Tm2");
      let timestamp = moment().format("YYYYMMDDHHmmss");
      let result = await axios.request({
        headers: {
          "user-agent": UA,
          referer: `https://wxapp.msmds.cn/h5/react_web/unicom/grabdollPage?source=unicom&type=02&ticket=${searchParams.ticket}&version=android@8.0102&timestamp=${timestamp}&desmobile=${options.user}&num=2&postage=${searchParams.postage}&duanlianjieabc=tbKHR&userNumber=${options.user}`,
          origin: "https://wxapp.msmds.cn",
          "Content-Type": "application/x-www-form-urlencoded",
          jar: jar1,
          "X-Requested-With": "com.sinovatech.unicom.ui",
        },
        url: `https://wxapp.msmds.cn/jplus/api/channelGrabDoll/startGame`,
        method: "POST",
        data: transParams({
          channelId: "LT_channel",
          phone: phone,
          token: ecs_token,
          sourceCode: "lt_zhuawawa",
        }),
      });
      console.log(result.data);
      if (result.data.code !== 200) {
        throw new Error("❌ something errors: ", result.data.msg);
      }

      if (result.data.data.length > 0) {
        for (let i of result.data.data) {
          console.log("😒 抓娃娃机获得: ", i["goodsName"]);
          if (i["goodsImg"] != null && i["doubleNum"] != null) {
            await zhuawawa.postGameDouble(axios, options);
            console.log("等待35秒再继续");
            await new Promise((resolve, reject) =>
              setTimeout(resolve, 35 * 1000)
            );
            let grabDetailedId = i["grabDetailedId"];
            let timestamp = moment().format("YYYYMMDDHHmmss");
            let result = await axios.request({
              headers: {
                "user-agent": UA,
                referer: `https://wxapp.msmds.cn/h5/react_web/unicom/grabdollPage?source=unicom&type=02&ticket=${searchParams.ticket}&version=android@8.0102&timestamp=${timestamp}&desmobile=${options.user}&num=2&postage=${searchParams.postage}&duanlianjieabc=tbKHR&userNumber=${options.user}`,
                origin: "https://wxapp.msmds.cn",
                "Content-Type": "application/x-www-form-urlencoded",
                "X-Requested-With":"com.sinovatech.unicom.ui",
                jar: jar1,
              },
              url: `https://wxapp.msmds.cn/jplus/api/channelGrabDoll/creditsDoubleByLookingVideos`,
              method: "POST",
              data: transParams({
                channelId: "LT_channel",
                phone: phone,
                token: ecs_token,
                grabDetailedId: grabDetailedId,
                prizeNum: i["prizeNum"],
                sourceCode: "lt_zhuawawa",
              }),
            });
            console.log(result.data);
            data = { double: false };
          } else {
            console.log("❌ 暂无翻倍");
            data = { double: false };
          }
        }
      }
    } while (data.data.grabDollAgain);
    return data;
  },
  postGameDouble: gameEvents.lookVideoDouble(
    {
      arguments1: "",
      arguments2: "GGPD",
      arguments3: "",
      arguments4: new Date().getTime(),
      arguments6: "",
      arguments7: "",
      arguments8: "",
      arguments9: "",
      netWay: "",
      version: `android@8.0102`,

    },
    {
      arguments1: "", // acid
      arguments2: "GGPD", // yhChannel
      arguments3: "", // yhTaskId menuId
      arguments4: new Date().getTime(), // time
      arguments6: "",
      arguments7: "",
      arguments8: "",
      arguments9: "",
      orderId: crypto
        .createHash("md5")
        .update(new Date().getTime() + "")
        .digest("hex"),
      netWay: "Wifi",
      remark: "",
      version: `android@8.0102`,

    },

  ),
  lookVideoDouble: gameEvents.lookVideoDouble(
    {
      arguments1: "AC20200716103629",
      arguments2: "GGPD",
      arguments3: "bb58791c861b4c3da80fbdd0f6695f59",
      arguments4: new Date().getTime(),
      arguments6: "517050707",
      netWay: "Wifi",
      version: `android@8.0102`,
    },
    {
      arguments1: "AC20200716103629", // acid
      arguments2: "GGPD", // yhChannel
      arguments3: "bb58791c861b4c3da80fbdd0f6695f59", // yhTaskId menuId
      arguments4: new Date().getTime(), // time
      arguments6: "517050707",
      arguments7: "517050707",
      arguments8: "123456",
      arguments9: "4640b530b3f7481bb5821c6871854ce5",
      orderId: crypto
        .createHash("md5")
        .update(new Date().getTime() + "")
        .digest("hex"),
      netWay: "Wifi",
      remark: "签到页小游戏抓娃娃积分翻倍",
      version: `android@8.0102`,
    },

  ),
  getOpenPlatLine: gameEvents.getOpenPlatLine(
    `https://m.client.10010.com/mobileService/openPlatform/openPlatLine.htm?to_url=https://wxapp.msmds.cn/h5/react_web/unicom/grabdollPage?source=unicom&duanlianjieabc=tbKHR`,
    {
      base: "msmds",
    }
  ),
};

module.exports = zhuawawa;
