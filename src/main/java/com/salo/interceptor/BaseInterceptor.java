package com.salo.interceptor;

import com.salo.dto.Types;
import com.salo.constant.WebConst;
import com.salo.model.UserInfo;
import com.salo.model.Vo.UserVo;
import com.salo.service.RedisService;
import com.salo.service.UserInfoService;
import com.salo.utils.*;
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

        if (uri.startsWith("/register") || uri.startsWith("/code") || uri.startsWith("/login") || uri.startsWith("/expire")) {
            return true;
        }

        String session = request.getParameter("session");
        String openId = redisService.getSession(session);

        UserInfo userInfo = openId == null ? null : userInfoService.findUserByOpenId(openId);

        if (openId != null && userInfo != null) {
            request.getSession().setAttribute(WebConst.LOGIN_SESSION_KEY, userInfo);
        } else {
            response.sendRedirect(request.getContextPath() + "/expire");
            return false;
        }

//        //请求拦截处理
//        UserVo user = TaleUtils.getLoginUser(request);
//        if (null == user) {
//            Integer uid = TaleUtils.getCookieUid(request);
//            if (null != uid) {
//                //这里还是有安全隐患,cookie是可以伪造的
//                user = userService.queryUserById(uid);
//                request.getSession().setAttribute(WebConst.LOGIN_SESSION_KEY, user);
//            }
//        }
//        if (uri.startsWith("/admin") && !uri.startsWith("/admin/login") && null == user) {
//            response.sendRedirect(request.getContextPath() + "/admin/login");
//            return false;
//        }
//        //设置get请求的token
//        if (request.getMethod().equals("GET")) {
//            String csrf_token = UUID.UU64();
//            // 默认存储30分钟
//            cache.hset(Types.CSRF_TOKEN.getType(), csrf_token, uri, 30 * 60);
//            request.setAttribute("_csrf_token", csrf_token);
//        }
        return true;
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
