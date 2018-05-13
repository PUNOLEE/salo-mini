package com.salo.controller;

import com.salo.constant.WebConst;
import com.salo.model.UserInfo;
import com.salo.model.Vo.UserVo;
import com.salo.utils.TaleUtils;
import com.salo.utils.MapCache;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/**
 * Created by 13 on 2017/2/21.
 */
public abstract class BaseController {

    public static String THEME = "themes/default";

    /**
     * 获取请求绑定的登录对象
     *
     * @param request
     * @return
     */
    public UserInfo getUserInfo(HttpServletRequest request) {
        HttpSession session = request.getSession();
        if (null == session) {
            return null;
        }
        return (UserInfo) session.getAttribute(WebConst.LOGIN_SESSION_KEY);
    }

    public int getUserId(HttpServletRequest request) {
        return this.getUserInfo(request).getUserid();
    }

    public String render_404() {
        return "comm/error_404";
    }


}
