package com.salo.constant;

public class QcloudSmsConst {

    // 短信应用SDK AppID
    public static final int appid = 1400068298; // 1400开头

    // 短信应用SDK AppKey
    public static final String appkey = "e0d06d78b83e23c8ab2b728e2e0f43c7";

    // 短信模板ID，需要在短信应用中申请
    public static final int templateId = 86933; // NOTE: 这里的模板ID`7839`只是一个示例，真实的模板ID需要在短信控制台中申请

    // 签名
    public static final String smsSign = "punolee"; // NOTE: 这里的签名"腾讯云"只是一个示例，真实的签名需要在短信控制台中申请，另外签名参数使用的是`签名内容`，而不是`签名ID`
}
