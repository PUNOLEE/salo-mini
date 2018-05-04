package com.salo.controller;

import com.github.qcloudsms.httpclient.HTTPException;
import com.salo.model.Bo.RestResponseBo;
import com.salo.model.Bo.SessionInfo;
import com.salo.model.UserInfo;
import com.salo.service.InvitationKeyService;
import com.salo.service.UserInfoService;
import com.salo.utils.SmsUtils;
import com.salo.utils.WxUtils;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.io.IOException;
import java.util.Date;

@Controller
public class UserController extends BaseController {

    private static final Logger LOGGER = LoggerFactory.getLogger(IndexController.class);

    @Resource
    private CacheManager cacheManager;

    @Resource
    private UserInfoService userInfoService;

    @Resource
    private InvitationKeyService invitationKeyService;

    @PostMapping(value = "/register")
    @ResponseBody
    public RestResponseBo register(@RequestParam(value = "accountName", defaultValue = "") String accountName,
                                   @RequestParam(value = "IDKEY", defaultValue = "") String idKey,
                                   @RequestParam(value = "phoneNum", defaultValue = "") String phoneNum,
                                   @RequestParam(value = "phoneCode", defaultValue = "") String phoneCode,
                                   @RequestParam(value = "password", defaultValue = "") String password,
                                   @RequestParam(value = "userType", defaultValue = "") int userType) {
        //TODO 验证邀请码的正确性
        int invitationId = invitationKeyService.findKeyId(idKey);
        if (invitationId == 0) return RestResponseBo.fail("邀请码不存在或已被使用");

        Cache cache = cacheManager.getCache("validCode");
        String validCode = cache.get(phoneNum, String.class);

        if (StringUtils.isNotBlank(validCode) && validCode.equals(phoneCode)) {
            UserInfo userInfo = new UserInfo();
            userInfo.setUsername(accountName);
            userInfo.setInvitationkeyid(invitationId);
            userInfo.setPhonenum(phoneNum);
            userInfo.setPwd(password);
            userInfo.setUsertype(userType);
            userInfo.setRegistertime(new Date());
            userInfoService.insertUser(userInfo);
            return RestResponseBo.ok();
        } else {
            return RestResponseBo.fail("验证码失效或错误");
        }
    }

    @GetMapping(value = "/code")
    @ResponseBody
    public RestResponseBo code(@RequestParam(value = "phoneNum", defaultValue = "") String phoneNum) {
        String validCode = RandomStringUtils.random(4, "0123456789");
        try {
            Cache sendTimeCache = cacheManager.getCache("sendTime");
            Integer timeCount = sendTimeCache.get(phoneNum, Integer.class);
            if (timeCount != null && timeCount >= 3) {
                return RestResponseBo.fail("短信发送次数过多，请10分钟后再尝试发送");
            } else {
                sendTimeCache.put(phoneNum, timeCount == null ? 0 : timeCount + 1);
                if (SmsUtils.sendMsg(phoneNum, validCode, "2")) {
                    Cache validCodeCache = cacheManager.getCache("validCode");
                    validCodeCache.put(phoneNum, validCode);
                    return RestResponseBo.ok(validCode);
                } else {
                    return RestResponseBo.fail("发送短信失败");
                }
            }
        } catch (HTTPException e) {
            LOGGER.error("发送短信HTTP请求失败", e);
            return RestResponseBo.fail("发送短信HTTP请求失败");
        } catch (IOException e) {
            LOGGER.error("发送短信IO请求失败", e);
            return RestResponseBo.fail("发送短信IO请求失败");
        }
    }

    @GetMapping(value = "/login")
    @ResponseBody
    public RestResponseBo login(@RequestParam(value = "code", defaultValue = "") String code) {
        SessionInfo sessionInfo = null;
        try {
            sessionInfo = WxUtils.getSessionInfo(code);
        } catch (Exception e) {
            LOGGER.error("获取SessionInfo失败", e);
            return RestResponseBo.fail("调用微信登录凭证校验接口失败");
        }
        if (sessionInfo != null && sessionInfo.openid != null) {
            UserInfo userInfo = userInfoService.findUserByOpenId(sessionInfo.openid);
            if (userInfo != null) {
                Cache sessionCache = cacheManager.getCache("session");
                sessionCache.putIfAbsent(sessionInfo.encrypt_session, sessionInfo);
                return RestResponseBo.ok("登录成功");
            } else {
                return RestResponseBo.fail("用户未注册");
            }
        }
        return RestResponseBo.fail("调用微信登录凭证校验接口失败");
    }

}
