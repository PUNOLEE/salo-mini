package com.salo.controller;

import com.alibaba.fastjson.JSON;
import com.github.qcloudsms.SmsSingleSender;
import com.github.qcloudsms.SmsSingleSenderResult;
import com.github.qcloudsms.httpclient.HTTPException;
import com.salo.constant.QcloudSmsConst;
import com.salo.model.Vo.UserVo;
import com.salo.utils.TaleUtils;
import com.salo.utils.MapCache;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

/**
 * Created by 13 on 2017/2/21.
 */
public abstract class BaseController {

    public static String THEME = "themes/default";

    protected MapCache cache = MapCache.single();

    /**
     * 主页的页面主题
     *
     * @param viewName
     * @return
     */
    public String render(String viewName) {
        return THEME + "/" + viewName;
    }

    public BaseController title(HttpServletRequest request, String title) {
        request.setAttribute("title", title);
        return this;
    }

    public BaseController keywords(HttpServletRequest request, String keywords) {
        request.setAttribute("keywords", keywords);
        return this;
    }

    /**
     * 获取请求绑定的登录对象
     *
     * @param request
     * @return
     */
    public UserVo user(HttpServletRequest request) {
        return TaleUtils.getLoginUser(request);
    }

    public Integer getUid(HttpServletRequest request) {
        return this.user(request).getUid();
    }

    public String render_404() {
        return "comm/error_404";
    }

    public boolean sendMsg(String phoneNumber, String validCode, String validPeriod) throws HTTPException, IOException {
        String[] params = {validCode, validPeriod};
        SmsSingleSender ssender = new SmsSingleSender(QcloudSmsConst.appid, QcloudSmsConst.appkey);
        SmsSingleSenderResult result = ssender.sendWithParam("86", phoneNumber,
                QcloudSmsConst.templateId, params, QcloudSmsConst.smsSign, "", "");
        return result.result == 0;
    }

}
