package com.salo.utils;

public class WxUtils {

    private static final String AppID = "wxbbe54ec756027185";

    private static final String AppSecret = "03f406360f0fc7c8e5b410aed3b45149";

    private static final String GET_SESSION_KEY_URL = "https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code";

    public static String login(String code) throws Exception {
        String url = String.format(GET_SESSION_KEY_URL, AppID, AppSecret, code);
        String responseStr = HttpUtils.sendGet(url);
//        Map responseMap = JsonUtil.parseJSON2Map(responseStr);
//        String openId = responseMap.get("openid").toString();
        return "";
    }

}
