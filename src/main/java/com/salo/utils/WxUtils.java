package com.salo.utils;

import com.alibaba.fastjson.JSON;
import com.salo.model.Bo.SessionInfo;

import java.util.Date;

public class WxUtils {

    private static final String AppID = "wxbbe54ec756027185";

    private static final String AppSecret = "03f406360f0fc7c8e5b410aed3b45149";

    private static final String GET_SESSION_KEY_URL = "https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code";

    public static SessionInfo getSessionInfo(String code) throws Exception {
        String url = String.format(GET_SESSION_KEY_URL, AppID, AppSecret, code);
        String responseStr = HttpUtils.sendGet(url);
        SessionInfo sessionInfo = JSON.parseObject(responseStr, SessionInfo.class);
        if (sessionInfo.openid != null && sessionInfo.session_key != null) {
            Date now = new Date();
            sessionInfo.encrypt_session = TaleUtils.MD5encode(sessionInfo.openid + sessionInfo.session_key + now.getTime());
            return sessionInfo;
        } else {
            sessionInfo.openid = null;
            return sessionInfo;
        }
    }

}
