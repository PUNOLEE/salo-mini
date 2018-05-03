package com.salo.utils;

import com.github.qcloudsms.SmsSingleSender;
import com.github.qcloudsms.SmsSingleSenderResult;
import com.github.qcloudsms.httpclient.HTTPException;

import java.io.IOException;

public class SmsUtils {

    // 短信应用SDK AppID
    private static final int appid = 1400068298; // 1400开头

    // 短信应用SDK AppKey
    private static final String appkey = "e0d06d78b83e23c8ab2b728e2e0f43c7";

    // 短信模板ID，需要在短信应用中申请
    private static final int templateId = 86933; // NOTE: 这里的模板ID`7839`只是一个示例，真实的模板ID需要在短信控制台中申请

    // 签名
    private static final String smsSign = "punolee"; // NOTE: 这里的签名"腾讯云"只是一个示例，真实的签名需要在短信控制台中申请，另外签名参数使用的是`签名内容`，而不是`签名ID`

    public static boolean sendMsg(String phoneNumber, String validCode, String validPeriod) throws HTTPException, IOException {
        String[] params = {validCode, validPeriod};
        SmsSingleSender ssender = new SmsSingleSender(appid, appkey);
        SmsSingleSenderResult result = ssender.sendWithParam("86", phoneNumber,
                templateId, params, smsSign, "", "");
        return result.result == 0;
    }
}
