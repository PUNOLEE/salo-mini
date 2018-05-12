package com.salo.controller;

import com.github.qcloudsms.httpclient.HTTPException;
import com.salo.model.Bo.RestResponseBo;
import com.salo.model.Bo.SessionInfo;
import com.salo.model.UserInfo;
import com.salo.service.InvitationKeyService;
import com.salo.service.RedisService;
import com.salo.service.UserInfoService;
import com.salo.utils.SmsUtils;
import com.salo.utils.WxUtils;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
    private UserInfoService userInfoService;

    @Resource
    private InvitationKeyService invitationKeyService;

    @Resource
    private RedisService redisService;

    @PostMapping(value = "/register")
    @ResponseBody
    public RestResponseBo register(@RequestParam(value = "accountName", defaultValue = "") String accountName,
                                   @RequestParam(value = "IDKEY", defaultValue = "") String idKey,
                                   @RequestParam(value = "phoneNum", defaultValue = "") String phoneNum,
                                   @RequestParam(value = "phoneCode", defaultValue = "") String phoneCode,
                                   @RequestParam(value = "userType", defaultValue = "") int userType,
                                   @RequestParam(value = "session", defaultValue = "") String session) {

        String openId = redisService.getSession(session);
        if (openId == null) return RestResponseBo.fail("session不合法");

        int invitationId = invitationKeyService.findKeyId(idKey);
        if (invitationId == 0) return RestResponseBo.fail("邀请码不存在或已被使用");

        String validCode = redisService.getValidCode(phoneNum);

        if (StringUtils.isNotBlank(validCode) && validCode.equals(phoneCode)) {
            UserInfo userInfo = new UserInfo();
            userInfo.setOpenid(openId);
            userInfo.setUsername(accountName);
            userInfo.setInvitationkeyid(invitationId);
            userInfo.setPhonenum(phoneNum);
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
            int timeCount = redisService.getSendTime(phoneNum);
            if (timeCount >= 3) {
                return RestResponseBo.fail("短信发送次数过多，请10分钟后再尝试发送");
            } else {
                redisService.putSendTime(phoneNum, timeCount + 1);
                if (SmsUtils.sendMsg(phoneNum, validCode, "2")) {
                    redisService.putValidCode(phoneNum, validCode);
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
            redisService.putSession(sessionInfo.encrypt_session, sessionInfo.openid);
            if (userInfo != null) {
                //用户已注册
                return RestResponseBo.ok(sessionInfo.encrypt_session, 1);
            } else {
                //用户未注册
                return RestResponseBo.ok(sessionInfo.encrypt_session, 2);
            }
        }
        return RestResponseBo.fail("调用微信登录凭证校验接口失败");
    }


    @GetMapping(value = "/expire")
    @ResponseBody
    public RestResponseBo sessionExpire() {
        return RestResponseBo.fail("未登录或session过期");
    }

}
