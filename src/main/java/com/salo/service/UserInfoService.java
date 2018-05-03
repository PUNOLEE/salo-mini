package com.salo.service;

import com.salo.dao.UserInfoMapper;
import com.salo.model.UserInfo;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;;

@Service
public class UserInfoService {

    private static final Logger LOGGER = LoggerFactory.getLogger(UserInfoService.class);

    @Resource
    private UserInfoMapper userInfoDao;

    @Transactional
    public Integer insertUser(UserInfo userInfo) {
        Integer userId = null;
        if (StringUtils.isNotBlank(userInfo.getUsername()) && StringUtils.isNotBlank(userInfo.getPhonenum()) && StringUtils.isNotBlank(userInfo.getPwd())) {
            userInfoDao.insertSelective(userInfo);
        }
        return userInfo.getUserid();
    }

}
