package com.salo.interceptor;

import com.salo.dto.Types;
import com.salo.constant.WebConst;
import com.salo.model.UserInfo;
import com.salo.model.Vo.UserVo;
import com.salo.service.RedisService;
import com.salo.service.UserInfoService;
import com.salo.utils.*;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;

/**
 * 自定义拦截器
 * Created by BlueT on 2017/3/9.
 */
@Component
public class BaseInterceptor implements HandlerInterceptor {

    private static final Logger LOGGE = LoggerFactory.getLogger(BaseInterceptor.class);
    private static final String USER_AGENT = "user-agent";

    @Resource
    private UserInfoService userInfoService;

    @Resource
    private RedisService redisService;


    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object o) throws Exception {
        String uri = request.getRequestURI();

        LOGGE.info("UserAgent: {}", request.getHeader(USER_AGENT));
        LOGGE.info("用户访问地址: {}, 来路地址: {}", uri, IPKit.getIpAddrByRequest(request));

        if (uri.startsWith("/login") || uri.startsWith("/expire")) {
            return true;
        }

        String session = request.getParameter("session");
        String openId = redisService.getSession(session);

        if (StringUtils.isEmpty(openId)) { //未登录
            response.sendRedirect(request.getContextPath() + "/expire");
            return false;
        } else { //已登录
            UserInfo userInfo = userInfoService.findUserByOpenId(openId);
            if (userInfo == null) { //用户未注册只允许访问注册接口
                if (uri.startsWith("/register")) {
                    return true;
                } else {
                    response.sendRedirect(request.getContextPath() + "/unregister");
                    return false;
                }
            } else { //已注册用户在session中存储信息
                request.getSession().setAttribute(WebConst.LOGIN_SESSION_KEY, userInfo);
                return true;
            }
        }

//        //测试
//        UserInfo userInfo = userInfoService.findUserById(502);
//        request.getSession().setAttribute(WebConst.LOGIN_SESSION_KEY, userInfo);
//        return true;
    }

    @Override
    public void postHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, ModelAndView modelAndView) throws Exception {
//        OptionVo ov = optionService.getOptionByName("site_record");
//        httpServletRequest.setAttribute("commons", commons);//一些工具类和公共方法
//        httpServletRequest.setAttribute("option", ov);
//        httpServletRequest.setAttribute("adminCommons", adminCommons);
    }

    @Override
    public void afterCompletion(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, Exception e) throws Exception {

    }
}
